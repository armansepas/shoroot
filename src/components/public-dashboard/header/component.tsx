import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const handleParticipateClick = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to ShorOOt
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Discover and participate in exciting bets. Join the fun and test your
        predictions!
      </p>
      <Button onClick={handleParticipateClick} size="lg" className="mb-8">
        {isAuthenticated ? "View My Bets" : "Participate Now"}
      </Button>
    </div>
  );
}
