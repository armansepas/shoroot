import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    <div className="text-center mb-12 content-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Image
            src="/logo.jpg"
            alt="ShorOOt Logo"
            width={120}
            height={120}
            className="rounded-full ring-4 ring-primary/20 shadow-lg"
          />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Welcome to ShorOOt
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        Discover and participate in exciting betting challenges. Join the
        community, test your predictions, and compete with others!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <Button
          onClick={handleParticipateClick}
          size="lg"
          className="bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
        >
          {isAuthenticated ? "Start Betting Now" : "Join the Action"}
        </Button>
        {!isAuthenticated && (
          <Button
            variant="outline"
            size="lg"
            asChild
            className="px-8 py-3 text-lg font-semibold hover:bg-accent"
          >
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
