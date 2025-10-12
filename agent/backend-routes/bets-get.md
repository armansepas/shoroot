GET /api/bets/[id]

Input:

- id: number (path param)

Logic: Return single bet with all options and participants.

Output:

- 200: { bet: object }
- 404: { error: string }
