import { AuthService } from "./services/auth.service";
import type { LoginData } from "./interfaces/auth";
import Swal from "sweetalert2";

const authService = new AuthService();

window.addEventListener("DOMContentLoaded", async () => {
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
    await Swal.fire({
      title: 'Error',
      text: `There isnt't any elemenst in teh login form. Please try again.`,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33'
    });
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      await Swal.fire({
        title: 'Incomplete Fields',
        text: 'Please check that all required fields are filled out before continuing.',
        icon: 'warning',
        confirmButtonText: 'Got it',
        confirmButtonColor: '#f8bb86'
      });

      return;
    }

    const loginData: LoginData = { email, password };

    try {
      const data = await authService.login(loginData);
      console.log("Login exitoso:", data.accessToken);
      localStorage.setItem("token", data.accessToken);
      window.location.href = "index.html";
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "An error occurred";
      await Swal.fire({
        title: 'Error',
        text: `${errMessage}. Please try again.`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    }
  });
});

const homeButton = document.getElementById("home-link") as HTMLAnchorElement | null;
if (homeButton) {
  homeButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
