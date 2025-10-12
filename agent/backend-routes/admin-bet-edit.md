POST /api/bets/[id]/edit

Auth: Admin only

Input:

- id: number (path param)
- title?: string
- description?: string
- amount?: number
- options?: string[]

Logic: Update bet fields and options where provided.

Output:

- 200: { bet: object }
- 403: { error: string }
- 404: { error: string }
