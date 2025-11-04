import { UserResponse } from "./interfaces/auth";
import { AuthService } from "./services/auth.service";

const authService = new AuthService();

const logoutBtn = document.getElementById("logout-link") as HTMLButtonElement | null;
const loginLink = document.getElementById("login-link");
const newPropertyLink = document.getElementById("new-property-link");
const profileLink = document.getElementById("profile-link") as HTMLAnchorElement | null;

if (!authService.checkToken()) {
  logoutBtn?.classList.add("hidden");
  loginLink?.classList.remove("hidden");
  newPropertyLink?.classList.add("hidden");
  profileLink?.classList.add("hidden");
} else {
  logoutBtn?.classList.remove("hidden");
  loginLink?.classList.add("hidden");
  newPropertyLink?.classList.remove("hidden");

  authService.getMyUser()
    .then((user: UserResponse) => {
      if (profileLink) {
        profileLink.classList.remove("hidden");
        profileLink.href = `profile.html?id=${user.user.id}`;
      }

      logoutBtn?.addEventListener("click", () => {
        authService.logout();
        window.location.href = "login.html";
      });
    })
    .catch(err => {
      console.error("Error obteniendo usuario:", err);
      profileLink?.classList.add("hidden");
    });
}
const params = new URLSearchParams(location.search);
const id = params.get("id");
const editButtons = document.getElementById("edit-buttons") as HTMLDivElement | null;

const avatarUpload = document.getElementById("avatar-upload") as HTMLInputElement | null;
const avatarImage = document.getElementById("avatar-image") as HTMLImageElement | null;
const avatarOverlay = document.getElementById("avatar-image-overlay") as HTMLDivElement | null;

const userName = document.getElementById("user-name") as HTMLHeadingElement | null;
const userEmail = document.getElementById("user-email") as HTMLParagraphElement | null;

// const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
// const changePasswordBtn = document.getElementById("change-password-btn") as HTMLButtonElement | null;

const editProfileForm = document.getElementById("edit-profile-form") as HTMLFormElement | null;
// const changePasswordForm = document.getElementById("change-password-form") as HTMLFormElement | null;

const nameInput = document.getElementById("name") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
//const newPasswordInput = document.getElementById("new-password") as HTMLInputElement | null;
//const confirmNewPasswordInput = document.getElementById("confirm-new-password") as HTMLInputElement | null;

// const cancelEditProfileBtn = document.getElementById("cancel-edit-profile") as HTMLButtonElement | null;
// const cancelChangePasswordBtn = document.getElementById("cancel-change-password") as HTMLButtonElement | null;

const fillUserData = (user: UserResponse["user"]) => {

  if (userName && userEmail && avatarImage) {
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    avatarImage.src = user.avatar;
  }

  if (user.me) {
    editProfileForm?.classList.remove("hidden");
    if (avatarUpload) avatarUpload.disabled = false;
  } else {
    editProfileForm?.classList.add("hidden");
    if (avatarUpload) avatarUpload.disabled = true;
  }
}

if (!id) {
  authService.getMyUser()
    .then((user: UserResponse) => {
      fillUserData(user.user);
      if (nameInput && emailInput) {
        nameInput.value = user.user.name;
        emailInput.value = user.user.email;
      }
      editProfileForm?.classList.remove("hidden");
    })
    .catch(err => {
      console.error(err);
    });
} else {
  authService.getUserById(Number(id))
    .then((user: UserResponse) => {
      fillUserData(user.user);
      editButtons?.classList.add("hidden");
      avatarOverlay?.classList.add("hidden");
    })
    .catch(err => {
      console.error(err);
    });
}

if(avatarUpload){
  avatarUpload.addEventListener("change", (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try{
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try{
          const response = await authService.updateAvatar(base64);
          console.log(response);
          // if(avatarImage) avatarImage.src = response.user.avatar;
          alert("Avatar actualizado correctamente");
        }
        catch(err){
          console.error(err);
          alert("No se puedo actualizar el avatar")
        }
      };
      reader.readAsDataURL(file);
    }
    catch(err){
      console.error(err);
      alert("No se puedo procesar la imagen")
    }
  })
}