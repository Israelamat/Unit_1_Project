export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;       
  email: string;      
  password: string;   
  avatar?: string;
}

export interface RegisterResponse {
  statusCode?: number;
  message?: string[] | string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
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

export interface RegisterStringReponse {
  email: string;
}
