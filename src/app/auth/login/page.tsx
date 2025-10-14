import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to your ShorOOt account
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
