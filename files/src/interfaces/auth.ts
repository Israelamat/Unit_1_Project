export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  surname: string;
  phone: string;
}

export interface User extends Omit<RegisterData, "password"> {
  id: number;
  avatar?: string; // opcional si no siempre viene
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  token: string;
}

export interface AvatarUpdate {
  avatar: File | string; // depende si se envía como multipart o url
}

export interface AvatarUpdateResponse {
  success: boolean;
  user: User;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}
