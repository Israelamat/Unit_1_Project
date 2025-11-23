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
  avatar?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface AvatarUpdate {
  avatar: File | string;
}

export interface AavatarResponse{
  avatar: string;
}

export interface AvatarUpdateResponse {
  success: boolean;
  user: User;
}

export interface PasswordUpdate {
  password: string;
}

export interface UserUpdate {
  name: string ;
  email: string;
}

export interface RegisterStringReponse {
  email: string;
}

export interface MyUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  lat: number;
  lng: number;
  me?: boolean;
}

export interface UserResponse {
  user: MyUser;
}

export interface RegisterErrorResponse {
  statusCode: number;
  message: string[]; 
  error: string;
}


