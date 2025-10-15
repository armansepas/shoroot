## Admin Change User Bet Option

**Description:** Allow admin to change the selected option for any user participating in a bet from the bet details page.

**MD files to read before changes:** `agent/dashboards/bet-details-dashboard.md`, `agent/authAndRoles/users-roles.md`, `agent/database/db-schema.md`, `agent/backend-routes/user-bet-participate.md`

- [ ] Create backend route POST /api/bets/[id]/change-option for admin to update user's selected option
- [ ] Add validation to ensure only admin can access, bet is not resolved, user is participating, option exists for bet
- [ ] Update bet_participations table to change selected_option_id for specific user and bet
- [ ] Return success response with updated participation details
- [ ] Update bet-details-dashboard.md to document admin ability to change user options
- [ ] Add change option button/dropdown in participants list for each user (admin only)
- [ ] Create modal or dropdown to select new option from available bet options
- [ ] Call the new backend route on option change with user_id and new_option_id
- [ ] Refresh participants list after successful change
- [ ] Add proper error handling and user feedback for option changes
