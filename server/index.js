import express from "express";
import cors from "cors";
import Database from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = "your-secret-key-change-this-in-production";

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, "betting.db");
const db = new Database.Database(dbPath);

// Initialize database tables
db.serialize(() => {
	// Users table
	db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      credits INTEGER DEFAULT 1000,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Bets table
	db.run(`
    CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      amount INTEGER NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      deadline DATETIME NOT NULL,
      status TEXT DEFAULT 'open',
      winning_option TEXT NULL,
      created_by TEXT NOT NULL,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_date DATETIME NULL,
      FOREIGN KEY (created_by) REFERENCES users(email)
    )
  `);

	// Bet participations table
	db.run(`
    CREATE TABLE IF NOT EXISTS bet_participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bet_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      choice TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bet_id) REFERENCES bets(id),
      FOREIGN KEY (user_email) REFERENCES users(email),
      UNIQUE(bet_id, user_email)
    )
  `);

	// Create default admin user
	const adminEmail = "admin@betting.com";
	const adminPassword = bcrypt.hashSync("admin123", 10);

	db.run(
		`
    INSERT OR IGNORE INTO users (email, password, name, role, credits)
    VALUES (?, ?, ?, ?, ?)
  `,
		[adminEmail, adminPassword, "Admin User", "admin", 10000]
	);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Access token required" });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}
		req.user = user;
		next();
	});
};

// Auth routes
app.post("/api/auth/login", (req, res) => {
	const { email, password } = req.body;

	db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
		if (err) {
			return res.status(500).json({ error: "Database error" });
		}

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		if (user.status === "inactive") {
			return res.status(401).json({ error: "Account is inactive" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				credits: user.credits,
				status: user.status,
			},
		});
	});
});

app.post("/api/auth/register", (req, res) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const hashedPassword = bcrypt.hashSync(password, 10);

	db.run(
		"INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
		[email, hashedPassword, name],
		function (err) {
			if (err) {
				if (err.message.includes("UNIQUE constraint failed")) {
					return res
						.status(400)
						.json({ error: "Email already exists" });
				}
				return res.status(500).json({ error: "Database error" });
			}

			const token = jwt.sign(
				{ id: this.lastID, email, role: "user" },
				JWT_SECRET,
				{ expiresIn: "24h" }
			);

			res.status(201).json({
				token,
				user: {
					id: this.lastID,
					email,
					name,
					role: "user",
					credits: 1000,
					status: "active",
				},
			});
		}
	);
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
	db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
		if (err) {
			return res.status(500).json({ error: "Database error" });
		}

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			credits: user.credits,
			status: user.status,
		});
	});
});

// Users routes
app.get("/api/users", authenticateToken, (req, res) => {
	db.all(
		"SELECT id, email, name, role, status, credits, created_at FROM users ORDER BY created_at DESC",
		(err, users) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}
			res.json(users);
		}
	);
});

app.put("/api/users/:id", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;
	const { role, status, credits } = req.body;

	db.run(
		"UPDATE users SET role = ?, status = ?, credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		[role, status, credits, id],
		function (err) {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: "User not found" });
			}

			res.json({ message: "User updated successfully" });
		}
	);
});

// Bets routes
app.get("/api/bets", (req, res) => {
	const { order = "-created_date" } = req.query;
	const orderBy = order.startsWith("-")
		? `${order.slice(1)} DESC`
		: `${order} ASC`;

	db.all(`SELECT * FROM bets ORDER BY ${orderBy}`, (err, bets) => {
		if (err) {
			return res.status(500).json({ error: "Database error" });
		}
		res.json(bets);
	});
});

app.get("/api/bets/:id", (req, res) => {
	const { id } = req.params;

	db.get("SELECT * FROM bets WHERE id = ?", [id], (err, bet) => {
		if (err) {
			return res.status(500).json({ error: "Database error" });
		}

		if (!bet) {
			return res.status(404).json({ error: "Bet not found" });
		}

		res.json(bet);
	});
});

app.post("/api/bets", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { title, description, amount, option_a, option_b, deadline } =
		req.body;

	db.run(
		"INSERT INTO bets (title, description, amount, option_a, option_b, deadline, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
		[
			title,
			description,
			amount,
			option_a,
			option_b,
			deadline,
			req.user.email,
		],
		function (err) {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			res.status(201).json({
				id: this.lastID,
				title,
				description,
				amount,
				option_a,
				option_b,
				deadline,
				status: "open",
				created_by: req.user.email,
			});
		}
	);
});

app.put("/api/bets/:id/resolve", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;
	const { winning_option } = req.body;

	db.run(
		"UPDATE bets SET status = ?, winning_option = ?, resolved_date = CURRENT_TIMESTAMP WHERE id = ?",
		["resolved", winning_option, id],
		function (err) {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: "Bet not found" });
			}

			// Update participations based on winning option
			db.run(
				'UPDATE bet_participations SET status = CASE WHEN choice = ? THEN "won" ELSE "lost" END WHERE bet_id = ?',
				[winning_option, id],
				(err) => {
					if (err) {
						console.error(
							"Error updating participations:",
							err
						);
					}
				}
			);

			res.json({ message: "Bet resolved successfully" });
		}
	);
});

// Bet participations routes
app.get("/api/participations", (req, res) => {
	const { order = "-created_date" } = req.query;
	const orderBy = order.startsWith("-")
		? `${order.slice(1)} DESC`
		: `${order} ASC`;

	db.all(
		`SELECT * FROM bet_participations ORDER BY ${orderBy}`,
		(err, participations) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}
			res.json(participations);
		}
	);
});

app.post("/api/participations", authenticateToken, (req, res) => {
	const { bet_id, choice, amount } = req.body;

	// Check if user has enough credits
	db.get(
		"SELECT credits FROM users WHERE id = ?",
		[req.user.id],
		(err, user) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (!user || user.credits < amount) {
				return res
					.status(400)
					.json({ error: "Insufficient credits" });
			}

			// Check if bet exists and is open
			db.get(
				'SELECT * FROM bets WHERE id = ? AND status = "open"',
				[bet_id],
				(err, bet) => {
					if (err) {
						return res
							.status(500)
							.json({ error: "Database error" });
					}

					if (!bet) {
						return res
							.status(400)
							.json({ error: "Bet not found or not open" });
					}

					// Check if deadline has passed
					if (new Date(bet.deadline) < new Date()) {
						return res
							.status(400)
							.json({ error: "Bet deadline has passed" });
					}

					// Create participation
					db.run(
						"INSERT INTO bet_participations (bet_id, user_email, choice, amount) VALUES (?, ?, ?, ?)",
						[bet_id, req.user.email, choice, amount],
						function (err) {
							if (err) {
								if (
									err.message.includes(
										"UNIQUE constraint failed"
									)
								) {
									return res
										.status(400)
										.json({
											error: "You have already participated in this bet",
										});
								}
								return res
									.status(500)
									.json({ error: "Database error" });
							}

							// Deduct credits from user
							db.run(
								"UPDATE users SET credits = credits - ? WHERE id = ?",
								[amount, req.user.id],
								(err) => {
									if (err) {
										console.error(
											"Error updating user credits:",
											err
										);
									}
								}
							);

							res.status(201).json({
								id: this.lastID,
								bet_id,
								user_email: req.user.email,
								choice,
								amount,
								status: "pending",
							});
						}
					);
				}
			);
		}
	);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
