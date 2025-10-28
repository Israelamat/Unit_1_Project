import { AuthService } from "./services/auth.service";
import type { LoginData } from "./interfaces/auth";

const authService = new AuthService();

window.addEventListener("DOMContentLoaded", () => {
  if (authService.checkToken()) {
    console.log("token");
    window.location.href = "index.html";
  }
});

document
  .getElementById("login-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await login();
  });

async function login(): Promise<void> {
  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value.trim();

  const loginData: LoginData = { email, password };

  try {
    const data = await authService.login(loginData);
    console.log(data);
    //localStorage.setItem("token", data.accessToken);
    window.location.href = "index.html";
  } catch (err) {
    alert((err as Error).message);
  }
}
