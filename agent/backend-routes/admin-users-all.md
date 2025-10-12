GET /api/users/all

Auth: Admin only

Input: None

Logic: Return all users list.

Output:

- 200: { users: array }
- 403: { error: string }
