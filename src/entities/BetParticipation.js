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

	static async filter(filters = {}, order = "-created_date") {
		const participations = await this.list(order);

		// Apply filters
		return participations.filter((participation) => {
			for (const [key, value] of Object.entries(filters)) {
				if (participation[key] !== value) {
					return false;
				}
			}
			return true;
		});
	}

	static async create(data) {
		const participation = await apiClient.post("/participations", data);
		return new BetParticipation(participation);
	}

	static async update(id, data) {
		const participation = await apiClient.put(
			`/participations/${id}`,
			data
		);
		return new BetParticipation(participation);
	}
}
