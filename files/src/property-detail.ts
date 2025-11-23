import { AuthService } from "./services/auth.service";
import { PropertiesService } from "./services/properties.service";
import { PropertyWithSeller, PropertyResponseWithSeller } from "./interfaces/property";
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
let propertyLogged: PropertyWithSeller;


document.addEventListener("DOMContentLoaded", () => {
  propertiesService.getPropertyById(Number(id))
    .then(async (property: PropertyResponseWithSeller) => {
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

      console.log(property);
      const propertyTitle = document.getElementById("property-title") as HTMLElement;
      const propertyAddress = document.getElementById("property-address") as HTMLElement;
      const propertyImage = document.getElementById("property-image") as HTMLImageElement;
      const propertyDescription = document.getElementById("property-description") as HTMLElement;
      const propertyPriceDisplay = document.querySelector<HTMLParagraphElement>("p#property-price");
      const propertySqmeters = document.getElementById("property-sqmeters") as HTMLElement;
      const propertyRooms = document.getElementById("property-rooms") as HTMLElement;
      const propertyBaths = document.getElementById("property-baths") as HTMLElement;

      const sellerAvatar = document.getElementById("seller-photo") as HTMLImageElement | null;
      const sellerName = document.getElementById("seller-name") as HTMLAnchorElement | null;
      const sellerEmail = document.getElementById("seller-email") as HTMLElement;

      const mortgageForm = document.getElementById("mortgage-calculator") as HTMLFormElement;
      const propertyPriceInput = document.querySelector<HTMLInputElement>("#mortgage-calculator input[name='propertyPrice']");
      const downPaymentInput = document.getElementById("down-payment") as HTMLInputElement;
      const loanTermInput = document.getElementById("loan-term") as HTMLInputElement;
      const interestRateInput = document.getElementById("interest-rate") as HTMLInputElement;
      const mortgageResult = document.getElementById("mortgage-result") as HTMLDivElement;
      const monthlyPaymentEl = document.getElementById("monthly-payment") as HTMLElement;


      if (propertyLogged.seller) {
        if (sellerAvatar) {
          sellerAvatar.src = propertyLogged.seller.avatar ?? "default-avatar.png";
          sellerAvatar.parentElement?.setAttribute("href", `profile.html?id=${propertyLogged.seller.id}`);
        }

        if (sellerName) {
          sellerName.textContent = propertyLogged.seller.name;
          sellerName.href = `profile.html?id=${propertyLogged.seller.id}`;
        }

        if (sellerEmail) {
          sellerEmail.textContent = propertyLogged.seller.email;
        }
      }
      if (propertyPriceInput) {
        propertyPriceInput.value = String(propertyLogged.price);
      }
      mortgageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const principal = propertyLogged.price - Number(downPaymentInput.value);
        const years = Number(loanTermInput.value);
        const annualRate = Number(interestRateInput.value) / 100;
        const monthlyRate = annualRate / 12;
        const totalPayments = years * 12;

        if (principal <= 0 || years <= 0 || annualRate < 0) {
          monthlyPaymentEl.textContent = "Please enter valid values.";
          mortgageResult.classList.remove("hidden");
          return;
        }

        // Fórmula de la hipoteca
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);

        monthlyPaymentEl.textContent = `${monthlyPayment.toFixed(2)} €`;
        mortgageResult.classList.remove("hidden");
      });


      propertyTitle.textContent = propertyLogged.title;
      propertyAddress.textContent = `${propertyLogged.town?.name ?? "Unknown town"}, ${propertyLogged.town?.province?.name ?? "Unknown province"}`;
      propertyImage.src = propertyLogged.mainPhoto;
      propertyDescription.textContent = propertyLogged.description;
      console.log(property.property.price);
      if (propertyPriceDisplay) {
        propertyPriceDisplay.textContent = String(propertyLogged.price);
      }
      propertySqmeters.textContent = String(propertyLogged.sqmeters);
      propertyRooms.textContent = String(propertyLogged.numRooms);
      propertyBaths.textContent = String(propertyLogged.numBaths);

      if (!propertyLogged.rated) {
        const ratingForm = document.getElementById("rating-form-container") as HTMLDivElement;
        ratingForm.classList.remove("hidden");
      }
    })
    .catch((error) => console.error(error));

});


