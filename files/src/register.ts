import { RegisterData } from "./interfaces/auth";
import AuthService from "./services/auth.service";

const authService = new AuthService();

const form = document.getElementById("register-form") as HTMLFormElement | null;
const nameInput = document.getElementById("name") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const passwordInput = document.getElementById("password") as HTMLInputElement | null;
const passwordConfirmInput = document.getElementById("password-confirm") as HTMLInputElement | null;
const avatarInput = document.getElementById("avatar") as HTMLInputElement | null;
const avatarPreview = document.getElementById("avatar-preview") as HTMLImageElement | null;

if (!form || !nameInput || !emailInput || !passwordInput || !passwordConfirmInput || !avatarInput || !avatarPreview) {
  console.error("No se encontraron todos los elementos del formulario.");
  throw new Error("Formulario incompleto en el HTML.");
}

let base64Avatar = "";

// ---------- Validación de contraseñas ----------
function validatePasswords() {
  if (passwordInput!.value !== passwordConfirmInput!.value) {
    passwordConfirmInput!.setCustomValidity("Las contraseñas no coinciden.");
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
    avatarInput.setCustomValidity("Selecciona un archivo de imagen válido.");
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
    alert(`Usuario registrado correctamente: ${res.email}`);
    window.location.href = "login.html";
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Error desconocido al registrar usuario.");
    }
  }
});
