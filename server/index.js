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

// Serve static files from the 'dist' directory
app.use(express.static("dist"));

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
      credits INTEGER DEFAULT 0,
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
      options TEXT NOT NULL, -- Storing options as a JSON string
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

	// Migration: Add options column if it doesn't exist (for backward compatibility)
	db.all("PRAGMA table_info(bets)", (err, columns) => {
		if (err) {
			console.error("Error checking table schema:", err);
			return;
		}

		const hasOptionsColumn = columns.some((col) => col.name === "options");

		if (!hasOptionsColumn) {
			console.log("Adding options column to bets table...");
			db.run("ALTER TABLE bets ADD COLUMN options TEXT", (err) => {
				if (err) {
					console.error("Error adding options column:", err);
				} else {
					console.log("Options column added successfully");

					// Migrate existing data from option_a and option_b to options
					db.all(
						"SELECT id, option_a, option_b FROM bets WHERE options IS NULL",
						(err, rows) => {
							if (err) {
								console.error(
									"Error fetching existing bets:",
									err
								);
								return;
							}

							rows.forEach((row) => {
								const options = [
									row.option_a,
									row.option_b,
								].filter(Boolean);
								if (options.length > 0) {
									db.run(
										"UPDATE bets SET options = ? WHERE id = ?",
										[
											JSON.stringify(options),
											row.id,
										],
										(err) => {
											if (err) {
												console.error(
													`Error migrating bet ${row.id}:`,
													err
												);
											}
										}
									);
								}
							});

							if (rows.length > 0) {
								console.log(
									`Migrated ${rows.length} existing bets to new options format`
								);
							}
						}
					);
				}
			});
		}
	});

	// Create default admin user
	const adminEmail = "admin@betting.com";
	const adminPassword = bcrypt.hashSync("admin123", 10);

	db.run(
		`
    INSERT OR IGNORE INTO users (email, password, name, role, credits)
    VALUES (?, ?, ?, ?, ?)
  `,
		[adminEmail, adminPassword, "Admin User", "admin", 0]
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
					credits: 0,
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

		// Process bets to ensure options are in the correct format
		const processedBets = bets.map((bet) => {
			// If options column exists and has data, parse it
			if (bet.options) {
				try {
					bet.options = JSON.parse(bet.options);
				} catch (e) {
					// If parsing fails, keep as string
					console.error(
						"Error parsing options for bet",
						bet.id,
						e
					);
				}
			} else if (bet.option_a || bet.option_b) {
				// Fallback to old format if options column is empty
				bet.options = [bet.option_a, bet.option_b].filter(Boolean);
			}
			return bet;
		});

		res.json(processedBets);
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

		// Process bet to ensure options are in the correct format
		if (bet.options) {
			try {
				bet.options = JSON.parse(bet.options);
			} catch (e) {
				console.error("Error parsing options for bet", bet.id, e);
			}
		} else if (bet.option_a || bet.option_b) {
			// Fallback to old format if options column is empty
			bet.options = [bet.option_a, bet.option_b].filter(Boolean);
		}

		res.json(bet);
	});
});

// Allow admins to edit bet details before it becomes active
app.put("/api/bets/:id", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;
	const { title, description, amount, options, deadline } = req.body;

	if (!title || !amount || !options || !deadline) {
		return res.status(400).json({ error: "All fields are required" });
	}

	if (!Array.isArray(options) || options.length < 2 || options.length > 5) {
		return res
			.status(400)
			.json({ error: "Options must be an array of 2 to 5 items" });
	}

	// Can only edit if bet is still open (not active or resolved)
	db.get(
		"SELECT * FROM bets WHERE id = ? AND status = 'open'",
		[id],
		(err, bet) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (!bet) {
				return res.status(404).json({
					error: "Bet not found or cannot be edited (already active or resolved)",
				});
			}

			// For backward compatibility, also update option_a and option_b
			const option_a = options[0] || "";
			const option_b = options[1] || "";

			db.run(
				"UPDATE bets SET title = ?, description = ?, amount = ?, options = ?, option_a = ?, option_b = ?, deadline = ? WHERE id = ?",
				[
					title,
					description,
					amount,
					JSON.stringify(options),
					option_a,
					option_b,
					deadline,
					id,
				],
				function (err) {
					if (err) {
						return res
							.status(500)
							.json({ error: "Database error" });
					}

					res.json({
						id: parseInt(id),
						title,
						description,
						amount,
						options,
						deadline,
						status: "open",
						message: "Bet updated successfully",
					});
				}
			);
		}
	);
});

app.post("/api/bets", authenticateToken, (req, res) => {
	console.log("Create bet request received:", req.body);
	console.log("User:", req.user);

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { title, description, amount, options, deadline } = req.body;

	console.log("Extracted fields:", {
		title,
		description,
		amount,
		options,
		deadline,
	});

	if (!title || !amount || !options || !deadline) {
		return res.status(400).json({ error: "All fields are required" });
	}

	if (!Array.isArray(options) || options.length < 2 || options.length > 5) {
		return res
			.status(400)
			.json({ error: "Options must be an array of 2 to 5 items" });
	}

	// For backward compatibility, also populate option_a and option_b if they exist in the schema
	const option_a = options[0] || "";
	const option_b = options[1] || "";

	db.run(
		"INSERT INTO bets (title, description, amount, options, option_a, option_b, deadline, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		[
			title,
			description,
			amount,
			JSON.stringify(options),
			option_a,
			option_b,
			deadline,
			req.user.email,
		],
		function (err) {
			if (err) {
				console.error("Database error creating bet:", err);
				return res.status(500).json({
					error: "Database error",
					details: err.message,
				});
			}

			res.status(201).json({
				id: this.lastID,
				title,
				description,
				amount,
				options,
				deadline,
				status: "open",
				created_by: req.user.email,
			});
		}
	);
});

// Change bet status endpoint (admin only)
app.put("/api/bets/:id/status", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;
	const { status } = req.body;

	// Valid statuses: open, active, in_progress, resolved
	const validStatuses = ["open", "active", "in_progress", "resolved"];

	if (!status || !validStatuses.includes(status)) {
		return res.status(400).json({
			error:
				"Invalid status. Valid statuses: " +
				validStatuses.join(", "),
		});
	}

	db.run(
		"UPDATE bets SET status = ? WHERE id = ?",
		[status, id],
		function (err) {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: "Bet not found" });
			}

			res.json({
				message: `Bet status updated to ${status} successfully`,
				status: status,
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

	db.get(
		'SELECT * FROM bets WHERE id = ? AND status IN ("open", "active", "in_progress")',
		[id],
		(err, bet) => {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}
			if (!bet) {
				return res
					.status(404)
					.json({ error: "Bet not found or already resolved" });
			}

			// Parse options
			let options = [];
			if (bet.options) {
				try {
					options = JSON.parse(bet.options);
				} catch (e) {
					options = [bet.option_a, bet.option_b].filter(Boolean);
				}
			} else {
				options = [bet.option_a, bet.option_b].filter(Boolean);
			}

			// Convert winning_option from index string to actual option text
			const match = winning_option.match(/^option_(\d+)$/);
			if (!match) {
				return res
					.status(400)
					.json({ error: "Invalid winning_option format" });
			}
			const index = parseInt(match[1], 10);
			if (index >= options.length) {
				return res
					.status(400)
					.json({ error: "Winning option index out of range" });
			}
			const actualWinningOption = options[index];

			db.serialize(() => {
				db.run("BEGIN TRANSACTION");

				const resolveBetStmt = db.prepare(
					"UPDATE bets SET status = 'resolved', winning_option = ?, resolved_date = CURRENT_TIMESTAMP WHERE id = ?"
				);
				resolveBetStmt.run(actualWinningOption, id, function (err) {
					if (err) {
						db.run("ROLLBACK");
						return res
							.status(500)
							.json({ error: "Failed to resolve bet" });
					}
				});
				resolveBetStmt.finalize();

				const updateParticipationsStmt = db.prepare(
					'UPDATE bet_participations SET status = CASE WHEN choice = ? THEN "won" ELSE "lost" END WHERE bet_id = ?'
				);
				updateParticipationsStmt.run(
					actualWinningOption,
					id,
					(err) => {
						if (err) {
							db.run("ROLLBACK");
							console.error(
								"Error updating participations:",
								err
							);
						}
					}
				);
				updateParticipationsStmt.finalize();

				db.all(
					"SELECT * FROM bet_participations WHERE bet_id = ?",
					[id],
					(err, participations) => {
						if (err) {
							db.run("ROLLBACK");
							return res.status(500).json({
								error: "Database error fetching participations",
							});
						}

						const winners = participations.filter(
							(p) => p.choice === actualWinningOption
						);
						const losers = participations.filter(
							(p) => p.choice !== actualWinningOption
						);

						const totalLoserAmount = losers.reduce(
							(sum, p) => sum + p.amount,
							0
						);

						if (winners.length > 0) {
							const winAmountPerWinner =
								totalLoserAmount / winners.length;
							winners.forEach((winner) => {
								const updateUserStmt = db.prepare(
									"UPDATE users SET credits = credits + ? WHERE email = ?"
								);
								updateUserStmt.run(
									winAmountPerWinner,
									winner.user_email,
									(err) => {
										if (err) {
											db.run("ROLLBACK");
											console.error(
												"Error updating winner credits:",
												err
											);
										}
									}
								);
								updateUserStmt.finalize();
							});
						}

						db.run("COMMIT", (err) => {
							if (err) {
								return res.status(500).json({
									error: "Failed to commit transaction",
								});
							}
							res.json({
								message: "Bet resolved successfully",
							});
						});
					}
				);
			});
		}
	);
});

// Delete bet endpoint
app.delete("/api/bets/:id", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;

	// Start transaction to handle credit reversals
	db.serialize(() => {
		db.run("BEGIN TRANSACTION");

		// First, get the bet details and all participations
		db.get("SELECT * FROM bets WHERE id = ?", [id], (err, bet) => {
			if (err) {
				db.run("ROLLBACK");
				return res.status(500).json({ error: "Database error" });
			}

			if (!bet) {
				db.run("ROLLBACK");
				return res.status(404).json({ error: "Bet not found" });
			}

			// Get all participations for this bet
			db.all(
				"SELECT * FROM bet_participations WHERE bet_id = ?",
				[id],
				(err, participations) => {
					if (err) {
						db.run("ROLLBACK");
						return res
							.status(500)
							.json({ error: "Database error" });
					}

					// If bet was resolved, reverse credit changes
					if (bet.status === "resolved") {
						const creditUpdates = [];

						participations.forEach((participation) => {
							if (participation.status === "won") {
								// Remove winnings from user credits
								creditUpdates.push({
									email: participation.user_email,
									amount: -bet.amount,
								});
							} else if (participation.status === "lost") {
								// Return lost amount to user credits
								creditUpdates.push({
									email: participation.user_email,
									amount: bet.amount,
								});
							}
						});

						// Apply credit reversals
						const updatePromises = creditUpdates.map(
							(update) => {
								return new Promise((resolve, reject) => {
									db.run(
										"UPDATE users SET credits = credits + ? WHERE email = ?",
										[update.amount, update.email],
										function (err) {
											if (err) reject(err);
											else resolve();
										}
									);
								});
							}
						);

						Promise.all(updatePromises)
							.then(() => {
								// Delete participations and bet
								deleteBetAndParticipations();
							})
							.catch((err) => {
								db.run("ROLLBACK");
								return res.status(500).json({
									error: "Error reversing credits",
								});
							});
					} else {
						// Bet not resolved, just delete
						deleteBetAndParticipations();
					}

					function deleteBetAndParticipations() {
						// Delete participations first
						db.run(
							"DELETE FROM bet_participations WHERE bet_id = ?",
							[id],
							(err) => {
								if (err) {
									db.run("ROLLBACK");
									return res.status(500).json({
										error: "Error deleting participations",
									});
								}

								// Delete the bet
								db.run(
									"DELETE FROM bets WHERE id = ?",
									[id],
									(err) => {
										if (err) {
											db.run("ROLLBACK");
											return res
												.status(500)
												.json({
													error: "Error deleting bet",
												});
										}

										db.run("COMMIT", (err) => {
											if (err) {
												return res
													.status(500)
													.json({
														error: "Failed to commit transaction",
													});
											}
											res.json({
												message: "Bet deleted successfully",
											});
										});
									}
								);
							}
						);
					}
				}
			);
		});
	});
});

// Revert resolved bet back to unknown state
app.put("/api/bets/:id/revert", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;

	// Start transaction to handle credit reversals
	db.serialize(() => {
		db.run("BEGIN TRANSACTION");

		// Get the bet details
		db.get("SELECT * FROM bets WHERE id = ?", [id], (err, bet) => {
			if (err) {
				db.run("ROLLBACK");
				return res.status(500).json({ error: "Database error" });
			}

			if (!bet) {
				db.run("ROLLBACK");
				return res.status(404).json({ error: "Bet not found" });
			}

			if (bet.status !== "resolved") {
				db.run("ROLLBACK");
				return res.status(400).json({
					error: "Only resolved bets can be reverted",
				});
			}

			// Get all participations for this bet
			db.all(
				"SELECT * FROM bet_participations WHERE bet_id = ?",
				[id],
				(err, participations) => {
					if (err) {
						db.run("ROLLBACK");
						return res
							.status(500)
							.json({ error: "Database error" });
					}

					// Reverse credit changes
					const creditUpdates = [];

					participations.forEach((participation) => {
						if (participation.status === "won") {
							// Remove winnings from user credits
							creditUpdates.push({
								email: participation.user_email,
								amount: -bet.amount,
							});
						} else if (participation.status === "lost") {
							// Return lost amount to user credits
							creditUpdates.push({
								email: participation.user_email,
								amount: bet.amount,
							});
						}
					});

					// Apply credit reversals
					const updatePromises = creditUpdates.map((update) => {
						return new Promise((resolve, reject) => {
							db.run(
								"UPDATE users SET credits = credits + ? WHERE email = ?",
								[update.amount, update.email],
								function (err) {
									if (err) reject(err);
									else resolve();
								}
							);
						});
					});

					Promise.all(updatePromises)
						.then(() => {
							// Reset bet status and participations
							db.run(
								"UPDATE bets SET status = 'active', winning_option = NULL, resolved_date = NULL WHERE id = ?",
								[id],
								(err) => {
									if (err) {
										db.run("ROLLBACK");
										return res.status(500).json({
											error: "Error updating bet status",
										});
									}

									// Reset all participations to accepted status
									db.run(
										"UPDATE bet_participations SET status = 'accepted' WHERE bet_id = ?",
										[id],
										(err) => {
											if (err) {
												db.run("ROLLBACK");
												return res
													.status(500)
													.json({
														error: "Error updating participations",
													});
											}

											db.run(
												"COMMIT",
												(err) => {
													if (err) {
														return res
															.status(
																500
															)
															.json(
																{
																	error: "Failed to commit transaction",
																}
															);
													}
													res.json({
														message: "Bet reverted successfully",
													});
												}
											);
										}
									);
								}
							);
						})
						.catch((err) => {
							db.run("ROLLBACK");
							return res.status(500).json({
								error: "Error reversing credits",
							});
						});
				}
			);
		});
	});
});

// Simple bet title update endpoint (for basic details only)
app.put("/api/bets/:id/title", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	const { id } = req.params;
	const { title } = req.body;

	if (!title || !title.trim()) {
		return res.status(400).json({ error: "Title is required" });
	}

	db.run(
		"UPDATE bets SET title = ? WHERE id = ?",
		[title, id],
		function (err) {
			if (err) {
				return res.status(500).json({ error: "Database error" });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: "Bet not found" });
			}

			res.json({ message: "Bet title updated successfully" });
		}
	);
});

app.put("/api/users/reset-credits", authenticateToken, (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}

	db.run("UPDATE users SET credits = 0 WHERE role = 'user'", function (err) {
		if (err) {
			return res.status(500).json({ error: "Database error" });
		}
		res.json({
			message: `Successfully reset credits for ${this.changes} users.`,
		});
	});
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

			// Check if bet exists and allows participation (open or active)
			db.get(
				'SELECT * FROM bets WHERE id = ? AND status IN ("open", "active")',
				[bet_id],
				(err, bet) => {
					if (err) {
						return res
							.status(500)
							.json({ error: "Database error" });
					}

					if (!bet) {
						return res.status(400).json({
							error: "Bet not found or no longer accepting participants",
						});
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
									return res.status(400).json({
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

							// Check if this bet now has 2 or more participations and update status to active if needed
							db.get(
								"SELECT COUNT(*) as count FROM bet_participations WHERE bet_id = ?",
								[bet_id],
								(err, result) => {
									if (err) {
										console.error(
											"Error counting participations:",
											err
										);
										return;
									}

									if (result.count >= 2) {
										db.run(
											"UPDATE bets SET status = 'active' WHERE id = ? AND status = 'open'",
											[bet_id],
											(err) => {
												if (err) {
													console.error(
														"Error updating bet status:",
														err
													);
												}
											}
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

// Catch-all handler: send back React's index.html file for client-side routing
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
