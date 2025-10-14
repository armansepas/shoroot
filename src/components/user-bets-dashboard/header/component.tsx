export function Header() {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="text-5xl">🎯</div>
        <h1 className="text-4xl font-bold text-foreground">
          My Bets Dashboard
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        Track your betting journey, participate in exciting challenges, and
        compete with others
      </p>
    </div>
  );
}
