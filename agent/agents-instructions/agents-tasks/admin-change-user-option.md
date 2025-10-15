## Admin Change User Bet Option

**Description:** Allow admin to change the selected option for any user participating in a bet from the bet details page with a confirmation modal.

**MD files to read before changes:** `agent/dashboards/bet-details-dashboard.md`, `agent/authAndRoles/users-roles.md`, `agent/database/db-schema.md`, `agent/backend-routes/user-bet-participate.md`

- [x] Create backend route POST /api/bets/[id]/change-option for admin to update user's selected option
- [x] Add validation to ensure only admin can access, bet is not resolved, user is participating, option exists for bet
- [x] Update bet_participations table to change selected_option_id for specific user and bet
- [x] Return success response with updated participation details
- [x] Update bet-details-dashboard.md to document admin ability to change user options
- [x] Add change option button in participants list for each user (admin only)
- [x] Create confirmation modal to select new option from available bet options
- [x] Call the new backend route on option change with user_id and new_option_id
- [x] Refresh participants list after successful change
- [x] Add proper error handling and user feedback for option changes
