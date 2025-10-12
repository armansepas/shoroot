- Database Schema for Betting Application

Tables:

1. users

   - id: integer, primary key, auto increment
   - email: text, unique, not null
   - password: text, not null (hashed)
   - role: text, not null, enum: 'admin', 'user'
   - created_at: datetime, default current timestamp
   - updated_at: datetime, default current timestamp

2. bets

   - id: integer, primary key, auto increment
   - title: text, not null
   - description: text, not null
   - amount: integer, not null (in toman)
   - status: text, not null, enum: 'active', 'in-progress', 'resolved'
   - winning_option: text, nullable (only set when resolved)
   - created_at: datetime, default current timestamp
   - updated_at: datetime, default current timestamp

3. bet_options

   - id: integer, primary key, auto increment
   - bet_id: integer, foreign key to bets.id, not null
   - option_text: text, not null
   - created_at: datetime, default current timestamp

4. bet_participations
   - id: integer, primary key, auto increment
   - user_id: integer, foreign key to users.id, not null
   - bet_id: integer, foreign key to bets.id, not null
   - selected_option_id: integer, foreign key to bet_options.id, nullable (for resolved bets)
   - is_winner: boolean, nullable (only set when bet is resolved)
   - participated_at: datetime, default current timestamp
   - unique constraint on (user_id, bet_id) to prevent multiple participations

Relationships:

- bets can have many bet_options (one-to-many)
- bets can have many bet_participations (one-to-many)
- users can have many bet_participations (one-to-many)
- bet_options belong to one bet (many-to-one)
- bet_participations belong to one user and one bet (many-to-one each)

Notes:

- Status values: 'active' (users can participate), 'in-progress' (no new participation, winners not determined), 'resolved' (winners determined, bet closed)
- Winning_option in bets table stores the winning option text when resolved
- Selected_option_id in bet_participations allows tracking what option each user chose
- Is_winner in bet_participations is set to true for winners when bet is resolved
