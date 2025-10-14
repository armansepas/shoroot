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
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        asChild
        className="hidden sm:inline-flex hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button
        asChild
        className="bg-primary hover:bg-primary/90 transition-colors"
      >
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
