POST /api/users/[id]/edit

Auth: Admin only

Input:

- id: number (path param)
- email?: string
- password?: string
- role?: string

Logic: Update user fields.

Output:

- 200: { user: object }
- 403: { error: string }
- 404: { error: string }
