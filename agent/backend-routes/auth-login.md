POST /api/auth/login

Input:

- email: string (required)
- password: string (required)

Logic: Normalize email to lowercase, validate credentials, return JWT token for authenticated users.

Output:

- 200: { token: string, user: object }
- 401: { error: string }
