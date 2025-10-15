## Football Dashboard Implementation

**Description:** Create a football dashboard showing live match details with tabs for different dates, integrating with external API and allowing admins to create bets from match data.

**MD files to read before changes:** `agent/dashboards/football-dashboard.md`, `agent/backend-routes/football-matches.md`, `agent/bet-card.md` (for create bet modal reference)

### External API Details (to be provided by user):

- API URL: [USER WILL PROVIDE]
- Request method: GET
- Query params: date (YYYY-MM-DD)
- Response structure: [USER WILL PROVIDE - include example JSON]
- Authentication: [USER WILL PROVIDE if needed]

### Tasks:

- [x] Define TypeScript types for the external API response in a types file
- [x] Create the `/api/football/matches` route that calls the external API and returns typed data
- [x] Create football dashboard page component (e.g., `/football` route)
- [x] Implement tabs: Today, Yesterday, Tomorrow, Day After Tomorrow (default: Today)
- [x] Add table component to display matches (columns: time, teams, league, status, score if available)
- [x] Add API integration for each tab (call backend route with date)
- [x] Add admin-only "Create Bet" button on each match row
- [x] Integrate existing create bet modal, pre-fill with match data (title: "Home vs Away", options: [homeTeam, awayTeam])
- [x] Add user role check for showing create bet buttons
- [x] Ensure dashboard is accessible without login on Navbar
- [x] Style the dashboard responsively using Tailwind CSS
- [x] Add loading states and error handling
- [x] Test the external API integration with sample data
