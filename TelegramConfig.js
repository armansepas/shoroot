// JavaScript Example: Reading Entities
// Filterable fields: bot_token, chat_id, is_enabled
async function fetchTelegramConfigEntities() {
	const response = await fetch(
		`https://app.base44.com/api/apps/68a9594a69f1933952c4a3a0/entities/TelegramConfig`,
		{
			headers: {
				api_key: "dfd2cc0b8b09451fb3b6eabefbf6c7da", // or use await User.me() to get the API key
				"Content-Type": "application/json",
			},
		}
	);
	const data = await response.json();
	console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: bot_token, chat_id, is_enabled
async function updateTelegramConfigEntity(entityId, updateData) {
	const response = await fetch(
		`https://app.base44.com/api/apps/68a9594a69f1933952c4a3a0/entities/TelegramConfig/${entityId}`,
		{
			method: "PUT",
			headers: {
				api_key: "dfd2cc0b8b09451fb3b6eabefbf6c7da", // or use await User.me() to get the API key
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updateData),
		}
	);
	const data = await response.json();
	console.log(data);
}
