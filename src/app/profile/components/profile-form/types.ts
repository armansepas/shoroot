export interface ProfileFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  fullName: string;
}

export interface ProfileFormProps {} // Empty for now, can be extended later

export interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}
