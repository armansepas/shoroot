## Navbar Component

**Description:** Create navigation bar with logo, auth buttons, and user menu.

**MD files to read before changes:** `agent/navbar.md`, `agent/tech-stack.md`

- [x] Check if lucide-react icons are installed
- [x] Create navbar component structure
- [x] Add logo and branding
- [x] Add conditional auth buttons (login/signup vs profile/logout)
- [x] Add dashboard dropdown menu for logged-in users
- [x] Add admin dashboard link for admin users only

**Implementation Details:**

- Created navbar component in `src/components/navbar/` following file structure
- Added DropdownMenu component from shadcn/ui
- Integrated with auth store for conditional rendering
- Added navigation links for dashboard, public bets, admin dashboard (admin only)
- Added logout functionality with router navigation
- Integrated navbar into root layout for global visibility
