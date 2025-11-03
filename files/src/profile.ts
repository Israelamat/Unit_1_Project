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

if (!id) {
  authService.getMyUser()
    .then((user: UserResponse) => {
      if (userName && userEmail && user.user.me) {
        userName.textContent = user.user.name;
        userEmail.textContent = user.user.email;
        editProfileForm?.classList.remove("hidden");

        if (nameInput && emailInput && avatarImage) {
          nameInput.value = user.user.name
          emailInput.value = user.user.email;
          avatarImage.src = user.user.avatar;
        }
      }
    })
    .catch(err => {
      console.error(err);
    });
} else {
  authService.getUserById(Number(id))
    .then((user: UserResponse) => {
      if (userName && userEmail && avatarUpload && avatarImage) {
        userName.textContent = user.user.name;
        userEmail.textContent = user.user.email;
        editButtons?.classList.add("hidden");
        avatarOverlay?.classList.add("hidden");
        avatarUpload.disabled = true;
        avatarImage.src = user.user.avatar;

      }

    })
    .catch(err => {
      console.error(err);
    });
}