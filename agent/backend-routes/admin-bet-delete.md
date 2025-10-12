POST /api/bets/[id]/delete

Auth: Admin only

Input:

- id: number (path param)

Logic: Delete bet and all related data.

Output:

- 200: { message: string }
- 403: { error: string }
