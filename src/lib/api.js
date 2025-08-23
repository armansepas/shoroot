import axios from "axios";

// const API_BASE_URL = "http://localhost:3001/api";
const API_BASE_URL = "http://172.16.50.250:3001/api";

class APIClient {
	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
		});

		// Add auth token to requests
		this.client.interceptors.request.use((config) => {
			const token = localStorage.getItem("auth_token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// Handle auth errors
		this.client.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					localStorage.removeItem("auth_token");
					window.location.href = "/login";
				}
				return Promise.reject(error);
			}
		);
	}

	async get(url, params = {}) {
		const response = await this.client.get(url, { params });
		return response.data;
	}

	async post(url, data) {
		const response = await this.client.post(url, data);
		return response.data;
	}

	async put(url, data) {
		const response = await this.client.put(url, data);
		return response.data;
	}

	async delete(url) {
		const response = await this.client.delete(url);
		return response.data;
	}
}

export const apiClient = new APIClient();
