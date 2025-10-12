## Bets Backend - Create (Admin)

**Description:** Implement POST /api/bets/create endpoint for admins.

**MD files to read before changes:** `agent/backend-routes/admin-bet-create.md`, `agent/betting-rules.md`

- [ ] Create /api/bets/create/route.ts file
- [ ] Add admin-only auth check
- [ ] Add validation for title, description, amount, options (min 2)
- [ ] Add bet creation transaction with options
- [ ] Add active status default
- [ ] Add response with created bet
