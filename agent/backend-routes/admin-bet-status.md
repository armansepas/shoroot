POST /api/bets/[id]/status

Auth: Admin only

Input:

- id: number (path param)
- status: string (required)
- winning_option?: string (if resolving)

Logic: Update bet status, determine winners if resolved.

Output:

- 200: { bet: object }
- 403: { error: string }
- 400: { error: string }
