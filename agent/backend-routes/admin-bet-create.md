POST /api/bets/create

Auth: Admin only

Input:

- title: string (required)
- description: string (required)
- amount: number (required)
- options: string[] (required, min 2)

Logic: Create new bet with active status and options.

Output:

- 201: { bet: object }
- 403: { error: string }
- 400: { error: string }
