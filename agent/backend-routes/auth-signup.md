POST /api/auth/signup

Input:

- email: string (required)
- password: string (required)
- confirmPassword: string (required)

Logic: Normalize email to lowercase, create new user account, return JWT token.

Output:

- 201: { token: string, user: object }
- 400: { error: string }
