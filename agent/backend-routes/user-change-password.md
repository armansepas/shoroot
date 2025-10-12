POST /api/users/change-password

Auth: Any logged in user

Input:

- current_password: string (required)
- new_password: string (required)
- confirm_password: string (required)

Logic: Update user password after validation.

Output:

- 200: { message: string }
- 400: { error: string }
