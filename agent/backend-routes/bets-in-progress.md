GET /api/bets/in-progress

Input:

- page: number (optional)
- limit: number (optional)

Logic: Return in-progress bets with pagination.

Output:

- 200: { bets: array, total_pages: number }
