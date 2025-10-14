"use client";

import { useNavbarAuth } from "./utils";
import { Logo } from "./logo";
import { AuthSection } from "./auth-section";
import { UserMenu } from "./user-menu";
import { DarkModeToggle } from "./dark-mode-toggle";
import { NotificationBell } from "./notification-bell";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useNavbarAuth();

  return (
    <nav className="bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {isAuthenticated && user && (
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          )}
          {isAuthenticated && user ? (
            <UserMenu user={user} isAdmin={isAdmin} logout={logout} />
          ) : (
            <AuthSection isAuthenticated={isAuthenticated} />
          )}
        </div>
      </div>
    </nav>
  );
}
