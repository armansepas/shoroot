"use client";

import { useState } from "react";
import { LoginForm } from "./login/components/login-form";
import { SignupForm } from "./signup/components/signup-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>
        {isLogin ? (
          <LoginForm onToggleToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
