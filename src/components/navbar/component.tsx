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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {isAuthenticated && user && <NotificationBell />}
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
