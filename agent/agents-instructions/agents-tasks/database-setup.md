## Database Setup

**Description:** Set up the database schema, connection, and migration system.

**MD files to read before changes:** `agent/database.md`, `agent/db-schema.md`

- [x] Check if drizzle is installed in package.json
- [x] Create drizzle schema file with users, bets, bet_options, bet_participations tables
- [x] Set up database connection using Neon PostgreSQL
- [x] Create drizzle config file for migrations
- [x] Generate initial migration file
- [x] Run migration to apply schema to database
