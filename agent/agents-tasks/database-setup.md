## Database Setup

**Description:** Set up the database schema, connection, and migration system.

**MD files to read before changes:** `agent/database.md`, `agent/db-schema.md`

- [ ] Check if drizzle is installed in package.json
- [ ] Create drizzle schema file with users, bets, bet_options, bet_participations tables
- [ ] Set up database connection using Turso sqlite
- [ ] Create drizzle config file for migrations
- [ ] Generate initial migration file
- [ ] Run migration to apply schema to database
