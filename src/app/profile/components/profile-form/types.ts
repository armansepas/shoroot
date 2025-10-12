export interface ProfileFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormProps {} // Empty for now, can be extended later

export interface UserProfile {
  id: number;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}
