import { apiClient } from "../lib/api";

export class BetParticipation {
	constructor(data) {
		Object.assign(this, data);
	}

	static async list(order = "-created_date") {
		const participations = await apiClient.get("/participations", {
			order,
		});
		return participations.map(
			(participation) => new BetParticipation(participation)
		);
	}

	static async create(data) {
		const participation = await apiClient.post("/participations", data);
		return new BetParticipation(participation);
	}
}
