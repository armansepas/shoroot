## Bets Backend - Create (Admin)

**Description:** Implement POST /api/bets/create endpoint for admins.

**MD files to read before changes:** `agent/backend-routes/admin-bet-create.md`, `agent/betting-rules.md`

- [x] Create /api/bets/create/route.ts file
- [x] Add admin-only auth check
- [x] Add validation for title, description, amount, options (min 2)
- [x] Add bet creation transaction with options
- [x] Add active status default
- [x] Add response with created bet
