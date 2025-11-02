import { PropertiesService } from "./services/properties.service";
import { ProvincesService } from "./services/provinces.service";
import "ol/ol.css";
import { MapService } from "./services/map.service";
import { MyGeolocation } from "./my-geolocation";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import AuthService from "./services/auth.service";

import { PropertyInsertTownId, Town, ProvincesResponse, TownsResponse } from "./interfaces/property";


const propertiesServices = new PropertiesService();
const provincesServices = new ProvincesService();

const form = document.getElementById("property-form") as HTMLFormElement;
const imageInput = document.getElementById("mainPhoto") as HTMLInputElement;
const imagePreview = document.getElementById("image-preview") as HTMLImageElement;

const provinceSelect = document.getElementById("province") as HTMLSelectElement;
const townSelect = document.getElementById("town") as HTMLSelectElement;



let base64Image: string = "";

// ----------------- Cargar Provincias -----------------
provincesServices.getProvinces()
  .then((provinces: ProvincesResponse) => {
    provinces.provinces.forEach((prov) => {
      const option = document.createElement("option");
      option.value = String(prov.id);
      option.textContent = prov.name;
      provinceSelect.appendChild(option);
    });
  })
  .catch((error) => console.log(error));

let allTowns: Town[] = [];

// ----------------- Selección de Provincia -> Cargar Pueblos -----------------
provinceSelect.addEventListener("change", (e: Event) => {
  const provinceId = (e.target as HTMLSelectElement).value;
  provincesServices.getTowns(Number(provinceId))
    .then((towns: TownsResponse) => {
      allTowns = towns.towns;
      townSelect.innerHTML = '<option value="">Select a town</option>';

      towns.towns.forEach((town) => {
        const option = document.createElement("option");
        option.value = String(town.id);
        option.textContent = town.name;
        townSelect.appendChild(option);
      });
    })
    .catch((error) => console.log(error));
});

// ----------------- MAPA -----------------
let mapService: MapService;
let marker: Feature<Point>; 

document.addEventListener("DOMContentLoaded", async () => {
  const authService = new AuthService();

  try {
    authService.checkToken(); 
  } catch (err) {
    window.location.href = "login.html";
    console.log(err);
    return; 
  }

  const coords = await MyGeolocation.getLocation();

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
});

// Mover marker al seleccionar pueblo
townSelect.addEventListener("change", (e: Event) => {
  const townId = Number((e.target as HTMLSelectElement).value);
  const selectedTown = allTowns.find((t) => t.id === townId);
  if (!selectedTown) return;

  // Centrar mapa
  mapService.view.setCenter([selectedTown.longitude, selectedTown.latitude]);

  // Mover marker
  const geometry = marker.getGeometry();
  if (geometry) {
    geometry.setCoordinates([selectedTown.longitude, selectedTown.latitude]);
  }
});

// ----------------- Imagen -> Base64 -----------------
imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  base64Image = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");

  if (!file) return;

  if (!file.type.startsWith("image")) {
    imageInput.setCustomValidity("Please select an image file.");
    return;
  }

  if (file.size > 200 * 1024) {
    imageInput.setCustomValidity("Image size should be less than 200kb.");
    return;
  }

  imageInput.setCustomValidity("");
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("hidden");

  const reader = new FileReader();
  reader.onload = (e) => {
    base64Image = e.target?.result as string;
  };
  reader.readAsDataURL(file);
});

// ----------------- Enviar Formulario -----------------
form.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const propertyData: PropertyInsertTownId = {
    title: (formData.get("title") as string || "").trim(),
    description: (formData.get("description") as string || "").trim(),
    price: Number(formData.get("price")),
    address: (formData.get("address") as string || "").trim(),
    sqmeters: Number(formData.get("sqmeters")),
    numRooms: Number(formData.get("numRooms")),
    numBaths: Number(formData.get("numBaths")),
    townId: Number(formData.get("town")),
    mainPhoto: base64Image
  };

  propertiesServices.insertProperty(propertyData)
    .then(() => {
      form.reset();
      base64Image = "";
      imagePreview.src = "";
      imagePreview.classList.add("hidden");
      location.assign("index.html");
    })
    .catch((err) => console.log(err));
});

