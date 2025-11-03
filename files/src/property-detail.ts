import { AuthService } from "./services/auth.service";
import { PropertiesService } from "./services/properties.service";
import { Property, PropertyResponse } from "./interfaces/property";
import { MapService } from "./services/map.service";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { MyGeolocation } from "./my-geolocation";
import { UserResponse } from "./interfaces/auth";

const propertiesService = new PropertiesService();
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
if (!id) {
  location.href = "index.html";
}
let mapService: MapService;
let marker: Feature<Point>;
let propertyLogged: Property;


document.addEventListener("DOMContentLoaded", () => {
  propertiesService.getPropertyById(Number(id))
    .then(async (property: PropertyResponse) => {
      propertyLogged = property.property;

      const defaultCoords = {
        latitude: property.property.town?.latitude ?? 40.4168,
        longitude: property.property.town?.longitude ?? -3.7038
      };

      let coords;

      try {
        coords = await MyGeolocation.getLocation();
      } catch (err) {
        console.warn(err);
        coords = defaultCoords;
      }

      mapService = new MapService(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: 0,
          accuracy: 0,
          altitudeAccuracy: 0,
          heading: 0,
          speed: 0,
        },
        "map"
      );

      marker = mapService.createMarker({
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: 0,
        accuracy: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      });

      const propertyLat = property.property.town?.latitude ?? coords.latitude;
      const propertyLon = property.property.town?.longitude ?? coords.longitude;

      mapService.view.setCenter([propertyLon, propertyLat]);

      const geometry = marker.getGeometry();
      if (geometry) {
        geometry.setCoordinates([propertyLon, propertyLat]);
      }

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

      if (!propertyLogged.rated) {
        const ratingForm = document.getElementById("rating-form-container") as HTMLDivElement;
        ratingForm.classList.remove("hidden");
      }
    })
    .catch((error) => console.error(error));

});


