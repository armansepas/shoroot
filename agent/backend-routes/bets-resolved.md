GET /api/bets/resolved

Input:

- page: number (optional)
- limit: number (optional)

Logic: Return resolved bets with pagination and winning options.

Output:

- 200: { bets: array, total_pages: number }
