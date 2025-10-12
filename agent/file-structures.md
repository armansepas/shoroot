- Complete file structure for the betting application

## Frontend Structure (src/)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with navbar
│   ├── page.tsx                      # Public dashboard (home page)
│   ├── auth/
│   │   ├── login/
│   │   │   ├── page.tsx             # Login page
│   │   │   └── components/
│   │   │       ├── login-form/
│   │   │       │   ├── component.tsx
│   │   │       │   ├── types.ts       # LoginFormProps, etc.
│   │   │       │   ├── utils.ts       # Form validation utils
│   │   │       │   └── index.ts       # Export component
│   │   └── signup/
│   │       ├── page.tsx              # Signup page
│   │       └── components/
│   │           ├── signup-form/
│   │           │   ├── component.tsx
│   │           │   ├── types.ts
│   │           │   ├── utils.ts
│   │           │   └── index.ts
│   ├── dashboard/
│   │   ├── page.tsx                  # User bets dashboard
│   │   └── components/
│   │       ├── bets-tabs/
│   │       │   ├── component.tsx     # All/Active/In-Progress/Completed tabs
│   │       │   ├── types.ts
│   │       │   ├── utils.ts
│   │       │   └── index.ts
│   │       ├── bet-card/
│   │       │   ├── component.tsx     # Reusable bet card
│   │       │   ├── types.ts          # BetCardProps
│   │       │   ├── utils.ts          # Status color utils
│   │       │   └── index.ts
│   │       └── participate-modal/
│   │           ├── component.tsx     # Participation modal
│   │           ├── types.ts
│   │           ├── utils.ts
│   │           └── index.ts
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   └── components/
│   │       ├── users-management/
│   │       │   ├── component.tsx     # Users list and actions
│   │       │   ├── types.ts
│   │       │   ├── utils.ts
│   │       │   └── index.ts
│   │       ├── bets-management/
│   │       │   ├── component.tsx     # Bets list and actions
│   │       │   ├── types.ts
│   │       │   ├── utils.ts
│   │       │   └── index.ts
│   │       └── create-bet-modal/
│   │           ├── component.tsx     # Create bet form modal
│   │           ├── types.ts
│   │           ├── utils.ts
│   │           └── index.ts
│   ├── bet/
│   │   └── [id]/
│   │       ├── page.tsx              # Bet details page
│   │       └── components/
│   │           ├── bet-details/
│   │           │   ├── component.tsx # Bet info and participants
│   │           │   ├── types.ts
│   │           │   ├── utils.ts
│   │           │   └── index.ts
│   │           └── admin-controls/
│   │               ├── component.tsx # Edit/delete/status controls
│   │               ├── types.ts
│   │               ├── utils.ts
│   │               └── index.ts
│   └── profile/
│       ├── page.tsx                  # User profile page
│       └── components/
│           ├── profile-form/
│           │   ├── component.tsx     # Password change form
│           │   ├── types.ts
│           │   ├── utils.ts
│           │   └── index.ts
├── components/
│   ├── navbar/
│   │   ├── component.tsx             # Main navigation
│   │   ├── types.ts                  # Navbar props
│   │   ├── utils.ts                  # Auth state utils
│   │   └── index.ts
│   ├── public-dashboard/
│   │   ├── component.tsx             # Public bets display
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── ui/                           # Shadcn components
│   │   ├── button/
│   │   ├── input/
│   │   ├── modal/
│   │   ├── tabs/
│   │   └── ...
├── lib/
│   ├── db/
│   │   ├── schema.ts                 # Drizzle schema
│   │   ├── index.ts                  # DB connection
│   │   └── migrations/               # Migration files
│   ├── auth/
│   │   ├── jwt.ts                    # JWT utilities
│   │   ├── middleware.ts             # Route protection
│   │   └── utils.ts                  # Auth helpers
│   ├── api/
│   │   ├── client.ts                 # API client
│   │   └── endpoints.ts              # API endpoints
│   └── utils/
│       ├── validation.ts             # Zod schemas
│       ├── constants.ts              # App constants
│       └── helpers.ts                # General utilities
├── stores/
│   ├── auth-store.ts                 # Global auth state (user, login/logout)
│   ├── bets-store.ts                 # Global bets state (all bets, active bets, etc.)
│   ├── users-store.ts                # Global users state (current user, all users for admin)
│   └── ui-store.ts                   # Global UI state (modals, loading states)
├── hooks/
│   ├── use-auth.ts                   # Authentication hook (uses auth-store)
│   ├── use-bets.ts                   # Bets data hook (uses bets-store)
│   └── use-users.ts                  # Users data hook (uses users-store)
├── types/
│   ├── index.ts                      # Global types
│   └── api.ts                        # API response types
└── middleware.ts                     # Next.js middleware
```

## Backend Structure (API Routes under src/app/api/)

```
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts                  # POST /api/auth/login
│   └── signup/
│       └── route.ts                  # POST /api/auth/signup
├── bets/
│   ├── all/
│   │   └── route.ts                  # GET /api/bets/all
│   ├── active/
│   │   └── route.ts                  # GET /api/bets/active
│   ├── in-progress/
│   │   └── route.ts                  # GET /api/bets/in-progress
│   ├── resolved/
│   │   └── route.ts                  # GET /api/bets/resolved
│   ├── [id]/
│   │   ├── route.ts                  # GET /api/bets/[id]
│   │   ├── edit/
│   │   │   └── route.ts              # POST /api/bets/[id]/edit
│   │   ├── status/
│   │   │   └── route.ts              # POST /api/bets/[id]/status
│   │   ├── delete/
│   │   │   └── route.ts              # POST /api/bets/[id]/delete
│   │   ├── participate/
│   │   │   └── route.ts              # POST /api/bets/[id]/participate
│   │   └── remove-participation/
│       │   └── route.ts              # POST /api/bets/[id]/remove-participation
│   └── create/
│       └── route.ts                  # POST /api/bets/create
└── users/
    ├── profile/
    │   └── route.ts                  # GET /api/users/profile
    ├── change-password/
    │   └── route.ts                  # POST /api/users/change-password
    ├── all/
    │   └── route.ts                  # GET /api/users/all
    ├── create/
    │   └── route.ts                  # POST /api/users/create
    └── [id]/
        ├── edit/
        │   └── route.ts              # POST /api/users/[id]/edit
        └── delete/
            └── route.ts              # POST /api/users/[id]/delete

## Database Files

```

drizzle/
├── schema.ts # Database schema definitions
├── config.ts # Drizzle config
└── migrations/ # Generated migrations

```

## Configuration Files (Root)

```

.env # Environment variables
.env.example # Environment template
drizzle.config.ts # Drizzle configuration
next.config.ts # Next.js configuration
tailwind.config.ts # Tailwind configuration
tsconfig.json # TypeScript configuration
package.json # Dependencies and scripts

```

## Key Structure Notes

- **Components**: Each component has its own folder with `component.tsx`, `types.ts`, `utils.ts`, and `index.ts`
- **Pages**: Next.js app router pages in `src/app/`
- **API Routes**: Nested folders under `src/app/api/` matching URL structure
- **State Management**: Zustand stores in `src/stores/` - all states are global by default unless specified
- **Shared Logic**: `lib/` contains database, auth, API clients, and utilities
- **Types**: Centralized in `src/types/` and component-specific types in component folders
- **UI Components**: Shadcn components in `src/components/ui/`
- **Hooks**: Custom React hooks in `src/hooks/` that interface with Zustand stores

This structure ensures scalability, maintainability, and follows the component organization specified in big-picture.md.
```
