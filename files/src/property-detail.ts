import { AuthService } from "./services/auth.service";
import { PropertiesService } from "./services/properties.service";
import { PropertyResponse } from "./interfaces/property";

const propertiesService = new PropertiesService();
const authService = new AuthService();

const logoutBtn = document.getElementById("logout-link") as HTMLButtonElement | null;
const loginLink = document.getElementById("login-link");
const newPropertyLink = document.getElementById("new-property-link");
const profileLink = document.getElementById("profile-link");

if (!authService.checkToken()) {
  logoutBtn?.classList.add("hidden");
  loginLink?.classList.remove("hidden");
  newPropertyLink?.classList.add("hidden");
  profileLink?.classList.add("hidden");
} else {
  logoutBtn?.classList.remove("hidden");
  loginLink?.classList.add("hidden");
  newPropertyLink?.classList.remove("hidden");
  profileLink?.classList.remove("hidden");
}

const params = new URLSearchParams(location.search);
const id = params.get("id");
if (!id) {
  location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {
  propertiesService.getPropertyById(Number(id)).then((property: PropertyResponse) => {
    console.log(property);
    const propertyTitle = document.getElementById("property-title") as HTMLElement;
    const propertyAddress = document.getElementById("property-address") as HTMLElement;
    const propertyImage = document.getElementById("property-image") as HTMLImageElement;
    const propertyDescription = document.getElementById("property-description") as HTMLElement;

    const propertyPrice = document.getElementById("property-price") as HTMLElement;
    const propertySqmeters = document.getElementById("property-sqmeters") as HTMLElement;
    const propertyRooms = document.getElementById("property-rooms") as HTMLElement;
    const propertyBaths = document.getElementById("property-baths") as HTMLElement;

    propertyTitle.textContent = property.property.title;
    propertyAddress.textContent = `${property.property.town?.name ?? "Unknown town"}, ${property.property.town?.province?.name ?? "Unknown province"}`;
    propertyImage.src = property.property.mainPhoto;
    propertyDescription.textContent = property.property.description;

    propertyPrice.textContent = String(property.property.price);
    propertySqmeters.textContent = String(property.property.sqmeters);
    propertyRooms.textContent = String(property.property.numRooms);
    propertyBaths.textContent = String(property.property.numBaths);
  }).catch((error) => console.error(error));
});


