import { RegisterData } from "./interfaces/auth";
import { AuthService } from "./services/auth.service";
import { RegisterErrorResponse } from "./interfaces/auth";
import Swal from "sweetalert2";

const authService = new AuthService();

const form = document.getElementById("register-form") as HTMLFormElement | null;
const nameInput = document.getElementById("name") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const passwordInput = document.getElementById("password") as HTMLInputElement | null;
const passwordConfirmInput = document.getElementById("password-confirm") as HTMLInputElement | null;
const avatarInput = document.getElementById("avatar") as HTMLInputElement | null;
const avatarPreview = document.getElementById("avatar-preview") as HTMLImageElement | null;

if (!form || !nameInput || !emailInput || !passwordInput || !passwordConfirmInput || !avatarInput || !avatarPreview) {
  console.error("Do not found any elements of the login form");
  throw new Error("Uncomplete For  incompleto en el HTML.");
}

let base64Avatar = "";

// ---------- Validación de contraseñas ----------
function validatePasswords() {
  if (passwordInput!.value !== passwordConfirmInput!.value) {
    passwordConfirmInput!.setCustomValidity("Passwords do not match");
  } else {
    passwordConfirmInput!.setCustomValidity("");
  }
}

passwordInput.addEventListener("input", validatePasswords);
passwordConfirmInput.addEventListener("input", validatePasswords);

// ---------- Previsualización de avatar ----------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  base64Avatar = "";
  avatarPreview.src = "";
  avatarPreview.classList.add("hidden");

  if (!file) return;

  if (!file.type.startsWith("image")) {
    avatarInput.setCustomValidity("Select a valid file");
    return;
  }

  if (file.size > 200 * 1024) { // límite 200KB
    avatarInput.setCustomValidity("La imagen debe pesar menos de 200KB.");
    return;
  }

  avatarInput.setCustomValidity("");
  avatarPreview.src = URL.createObjectURL(file);
  avatarPreview.classList.remove("hidden");

  const reader = new FileReader();
  reader.onload = (e) => {
    base64Avatar = e.target?.result as string;
  };
  reader.readAsDataURL(file);
});

// ---------- Envío del formulario ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data: RegisterData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    avatar: base64Avatar || undefined,
  };

  try {
    const res = await authService.register(data);
    await Swal.fire({
      title: 'Profile registered',
      text: `Your profile has been registered successfully with this mail: ${res.email}`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6'
    });
    
    window.location.href = "login.html";
  } catch (err) {
    if (err instanceof Response) {
      const json = (await err.json()) as RegisterErrorResponse;
      const errorMessages = json.message.join("\n");
      await Swal.fire({
        title: 'Error',
        text: errorMessages,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    }
  }
});
