import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
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
  user: { email: string } | null;
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
    <div className="flex items-center gap-2">
      {/* Dashboard Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-sm hidden sm:inline">{user.email}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">My Bets</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">Public Bets</Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin Dashboard</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Button */}
      <Button variant="outline" asChild className="hidden sm:inline-flex">
        <Link href="/profile">
          <User className="h-4 w-4" />
        </Link>
      </Button>

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="hidden sm:inline-flex"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
