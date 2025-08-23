import { apiClient } from "../lib/api";

export class User {
	constructor(data) {
		Object.assign(this, data);
	}

	static async login(email, password) {
		const response = await apiClient.post("/auth/login", {
			email,
			password,
		});
		localStorage.setItem("auth_token", response.token);
		return new User(response.user);
	}

	static async register(email, password, name) {
		const response = await apiClient.post("/auth/register", {
			email,
			password,
			name,
		});
		localStorage.setItem("auth_token", response.token);
		return new User(response.user);
	}

	static async me() {
		const userData = await apiClient.get("/auth/me");
		return new User(userData);
	}

	static async list() {
		const users = await apiClient.get("/users");
		return users.map((user) => new User(user));
	}

	static async update(id, data) {
		await apiClient.put(`/users/${id}`, data);
	}

	static logout() {
		localStorage.removeItem("auth_token");
		window.location.href = "/login";
	}
}
