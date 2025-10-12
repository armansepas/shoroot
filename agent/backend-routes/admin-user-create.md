POST /api/users/create

Auth: Admin only

Input:

- email: string (required)
- password: string (required)
- role: string (required)

Logic: Create new user account.

Output:

- 201: { user: object }
- 403: { error: string }
- 400: { error: string }
