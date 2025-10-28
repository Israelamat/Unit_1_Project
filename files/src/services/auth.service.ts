import { Http } from "../http.class";
import { API_BASE } from "../constants";
import type { LoginData, TokenResponse } from "../interfaces/auth";

export class AuthService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async login(data: LoginData): Promise<TokenResponse> {
    return await this.http.post(`${API_BASE}/auth/login`, data);
  }

  checkToken(): boolean {
    return Boolean(localStorage.getItem("token"));
  }

  logout(): void {
    localStorage.removeItem("token");
  }
}

export default AuthService;
