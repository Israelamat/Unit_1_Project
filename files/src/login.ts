import { AuthService } from "./services/auth.service";
import type { LoginData } from "./interfaces/auth";

const authService = new AuthService();

window.addEventListener("DOMContentLoaded", () => {
  // Comprobar si hay token y redirigir
  if (authService.checkToken()) {
    console.log("Token encontrado, redirigiendo...");
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("login-form") as HTMLFormElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;

  if (!form || !emailInput || !passwordInput) {
    console.error("No se encontró algún elemento del formulario de login.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const loginData: LoginData = { email, password };

    try {
      const data = await authService.login(loginData);
      console.log("Login exitoso:", data.accessToken);
      localStorage.setItem("token", data.accessToken);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error en login:", err);
      alert((err as Error).message || "Error al iniciar sesión.");
    }
  });
});

const homeButton = document.getElementById("home-link") as HTMLAnchorElement | null;
if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
