"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Calendar, Shield } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { ProfileFormData, UserProfile } from "./types";
import { validatePasswordChange, formatDate } from "./utils";

export function ProfileForm() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData?.fullName) {
      setFormData((prev) => ({
        ...prev,
        fullName: profileData.fullName || "",
      }));
    }
  }, [profileData]);

  const fetchProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfileData(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fullName length
    if (formData.fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters long");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update full name");
      }

      setSuccess("Full name updated successfully!");
      // Refresh profile data
      fetchProfile();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update full name"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Card */}
      <Card className="shadow-lg border-2 border-border/50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="text-4xl">👤</div>
            Profile Information
          </CardTitle>
          <CardDescription className="text-base">
            Manage your account details and view your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl">🏷️</div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Full Name
                </span>
                <p className="text-lg font-medium text-foreground">
                  {profileData?.fullName || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl">📧</div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Email
                </span>
                <p className="text-lg font-medium text-foreground">
                  {profileData?.email || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Role
                </span>
                <p className="text-lg font-medium text-foreground capitalize">
                  {profileData?.role || user?.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg md:col-span-2">
              <div className="text-2xl">📅</div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Member Since
                </span>
                <p className="text-lg font-medium text-foreground">
                  {profileData?.createdAt
                    ? formatDate(profileData.createdAt)
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Name Change Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="text-2xl">✏️</div>
            Update Full Name
          </CardTitle>
          <CardDescription className="text-base">
            Set or update your display name (minimum 3 characters)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                minLength={3}
                required
                className="text-base py-3 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 transition-colors py-3 text-base font-semibold"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              Update Full Name
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="text-2xl">🔐</div>
            Change Password
          </CardTitle>
          <CardDescription className="text-base">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-semibold"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="Enter your current password"
                required
                className="text-base py-3 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Enter your new password"
                required
                className="text-base py-3 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm your new password"
                required
                className="text-base py-3 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertDescription className="text-base">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-900/20">
                <AlertDescription className="text-green-700 dark:text-green-300 text-base font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 transition-colors py-3 text-base font-semibold"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
