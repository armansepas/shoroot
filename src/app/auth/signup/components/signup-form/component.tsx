"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./utils";

export interface SignupFormProps {
  onToggleToLogin?: () => void;
}

export function SignupForm({ onToggleToLogin }: SignupFormProps) {
  const router = useRouter();
  const { login, setLoading, setError, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters long");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!confirmPassword.trim()) {
      setError("Confirm password is required");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName: fullName.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-address" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="transition-colors focus:ring-2 focus:ring-primary/20"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 transition-colors"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
}
