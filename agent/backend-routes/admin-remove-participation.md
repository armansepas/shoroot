POST /api/bets/[id]/remove-participation

Auth: Admin only

Input:

- id: number (path param)
- user_id: number (required)

Logic: Remove specific user's participation from bet.

Output:

- 200: { message: string }
- 403: { error: string }
