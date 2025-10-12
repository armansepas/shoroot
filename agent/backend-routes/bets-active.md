GET /api/bets/active

Input:

- page: number (optional)
- limit: number (optional)

Logic: Return active bets with pagination and first 2 options.

Output:

- 200: { bets: array, total_pages: number }
