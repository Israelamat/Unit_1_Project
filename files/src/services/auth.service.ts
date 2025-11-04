import { Http } from "../http.class";
import { API_BASE } from "../constants";
import type { LoginData, TokenResponse  } from "../interfaces/auth";
import type { RegisterData, RegisterStringReponse, UserResponse, AavatarResponse} from "../interfaces/auth";

export class AuthService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async login(data: LoginData): Promise<TokenResponse> {
    return await this.http.post(`${API_BASE}/auth/login`, data);
  }

  checkToken(): boolean {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token.trim().length > 0); //controla que el token no este vacio o undefined
  }

  async getMyUser(): Promise<UserResponse> {
    return await this.http.get(`${API_BASE}/users/me`);
  }

  async getUserById(id: number): Promise<UserResponse> {
    return await this.http.get(`${API_BASE}/users/${id}`);
  }

  async updateAvatar(avatar: string): Promise<AavatarResponse> {
    return await this.http.put(`${API_BASE}/users/me/avatar`, avatar);
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  async register(data: RegisterData): Promise<RegisterStringReponse> {
    return await this.http.post(`${API_BASE}/auth/register`, data);
  }
}

export default AuthService;
