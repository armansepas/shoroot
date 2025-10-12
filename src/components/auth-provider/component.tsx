"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token without verification (we'll verify on API calls)
        const decoded = JSON.parse(atob(token.split(".")[1])) as {
          exp: number;
          userId: number;
          email: string;
          role: string;
        };

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          // Token is valid, restore user session
          login({
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role as "admin" | "user",
            createdAt: "", // We don't have this from token
            updatedAt: "",
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem("token");
        }
      } catch (error) {
        // Invalid token, remove it
        localStorage.removeItem("token");
      }
    }
  }, [login]);

  return <>{children}</>;
}
