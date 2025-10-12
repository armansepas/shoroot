POST /api/users/[id]/delete

Auth: Admin only

Input:

- id: number (path param)

Logic: Delete user and their participations.

Output:

- 200: { message: string }
- 403: { error: string }
