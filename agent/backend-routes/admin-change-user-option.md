POST /api/bets/[id]/change-option

Auth: Admin only

Input:

- id: number (path param)
- user_id: number (required)
- new_option_id: number (required)

Logic: Change the selected option for a specific user in a bet. Only allowed if bet is not resolved, user is participating, and option exists for the bet.

Output:

- 200: { message: string, participation: object }
- 403: { error: string } (not admin)
- 404: { error: string } (bet not found)
- 400: { error: string } (invalid request, user not participating, option not available, bet resolved)
