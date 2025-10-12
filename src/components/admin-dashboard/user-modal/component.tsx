"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { User, CreateUserData, UpdateUserData } from "../types";
import { validateEmail, validatePassword } from "../utils";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
  mode: "create" | "edit";
}

export function UserModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  mode,
}: UserModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    if (mode === "edit" && user) {
      setEmail(user.email);
      setRole(user.role);
      setPassword(""); // Don't show existing password
    } else {
      setEmail("");
      setPassword("");
      setRole("user");
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (mode === "create" || (mode === "edit" && password.trim())) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data =
        mode === "create"
          ? { email, password, role }
          : {
              ...(email !== user?.email && { email }),
              ...(password.trim() && { password }),
              ...(role !== user?.role && { role }),
            };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("User modal submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail("");
    setPassword("");
    setRole("user");
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new user account."
              : "Update user information. Leave password empty to keep current password."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "edit" ? "Leave empty to keep current" : ""
                }
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <div className="col-span-3">
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "admin" | "user")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
