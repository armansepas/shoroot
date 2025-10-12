import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthSectionProps {
  isAuthenticated: boolean;
}

export function AuthSection({ isAuthenticated }: AuthSectionProps) {
  if (isAuthenticated) {
    return null; // Authenticated users see the user menu instead
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild className="hidden sm:inline-flex">
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
