import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  ChevronDown,
  Bell,
  LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: { email: string; fullName: string | null } | null;
  isAdmin: boolean;
  logout: () => void;
}

export function UserMenu({ user, isAdmin, logout }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Dashboards Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span className="text-sm hidden sm:inline font-medium">
              Dashboards
            </span>
            <LayoutDashboardIcon className="h-4 w-4" />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
            <Link href="/dashboard" className="flex items-center">
              <span>My Bets</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
            <Link href="/" className="flex items-center">
              <span>Public Bets</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer hover:bg-accent"
              >
                <Link href="/admin" className="flex items-center">
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span className="text-sm hidden sm:inline font-medium truncate max-w-32">
              {user.fullName || user.email.split("@")[0]}
            </span>
            <User className="h-4 w-4 sm:hidden" />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
            <Link href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent">
            <Link href="/notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:bg-accent text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
