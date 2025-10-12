# Betting App

A simple betting application where users can participate in bets and admins can manage them.

## Features

### Core Features

- **User Authentication**: Login/signup with email and password
- **Public Dashboard**: Browse all active bets (view only)
- **Bet Participation**: Join active bets with multiple options
- **Bet Details**: View detailed bet information and participants
- **User Dashboard**: Manage personal bets with tabs (all, active, in-progress, completed)
- **Admin Dashboard**: Full CRUD operations for users and bets

### Betting Rules

- Only admins can create bets with title, description, amount, and multiple options (minimum 2)
- Users can only participate in active bets
- Admins can change bet status (active → in-progress → resolved)
- Winners are determined when bets are resolved
- Users cannot change their bet option after participating

### User Roles

- **Users**: Browse bets, participate in active bets, view history
- **Admins**: Full CRUD on bets and users, manage bet statuses

## Tech Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- Drizzle ORM with PostgreSQL (Neon)
- Zustand for state management
- JWT for authentication

## Development

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Setup

1. Install dependencies: `npm install`
2. Set up environment variables (copy `.env.example` to `.env`)
3. Generate database migration: `npm run db:generate`
4. Push migration: `npm run db:push`
5. Start development server: `npm run dev`

### Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/lib/` - Database, auth, API utilities
- `src/stores/` - Zustand global state stores
- `agent/` - Feature specifications and task documentation

### Development Workflow

1. Check `agent/agents-tasks/` for feature-specific task lists
2. Read relevant MD files in `agent/` folder for detailed requirements
3. Implement features following the specified file structure
4. Test thoroughly before marking tasks complete

## Deployment

Deploy on Vercel or any platform supporting Next.js applications.
