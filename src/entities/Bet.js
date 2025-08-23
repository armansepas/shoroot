import { apiClient } from "../lib/api";

export class Bet {
	constructor(data) {
		Object.assign(this, data);
	}

	static async list(order = "-created_date") {
		const bets = await apiClient.get("/bets", { order });
		return bets.map((bet) => new Bet(bet));
	}

	static async get(id) {
		const bet = await apiClient.get(`/bets/${id}`);
		return new Bet(bet);
	}

	static async create(data) {
		const bet = await apiClient.post("/bets", data);
		return new Bet(bet);
	}

	static async resolve(id, winning_option) {
		await apiClient.put(`/bets/${id}/resolve`, { winning_option });
	}

	async update(data) {
		await apiClient.put(`/bets/${this.id}`, data);
		Object.assign(this, data);
	}
}
