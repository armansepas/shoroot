POST /api/bets/[id]/participate

Auth: User only

Input:

- id: number (path param)
- selected_option: string (required)

Logic: Add user participation to active bet.

Output:

- 201: { participation: object }
- 403: { error: string }
- 400: { error: string }
