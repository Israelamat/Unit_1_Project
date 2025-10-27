import { PropertiesService, GetPropertiesResponse } from "./properties.service";


// Interfaz que coincide con lo que devuelve el servicio
interface Property {
  id?: number;
  mainPhoto: string;
  title: string;
  description: string;
  price: number;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  townId: number;
  // town puede estar presente si el backend lo devuelve, opcional
  town?: {
    name: string;
    province: { name: string };
  };
}

const serviceProperties = new PropertiesService();

const templateOfCard = document.getElementById("property-card-template") as HTMLTemplateElement;
const propertiesList = document.getElementById("property-listings") as HTMLElement;

const render = () => {
  serviceProperties.getProperties()
    .then((response: GetPropertiesResponse) => {
      propertiesList.innerHTML = "";

      response.properties.forEach((property: Property) => {
        const clone = templateOfCard.content.cloneNode(true) as DocumentFragment;

        const img = clone.querySelector(".property-image") as HTMLImageElement;
        const title = clone.querySelector(".property-title") as HTMLElement;
        const location = clone.querySelector(".property-location") as HTMLElement;
        //const desc = clone.querySelector(".property-description") as HTMLElement;
        const price = clone.querySelector(".property-price") as HTMLElement;
        const sq = clone.querySelector(".property-sqmeters") as HTMLElement;
        const rooms = clone.querySelector(".property-rooms") as HTMLElement;
        const baths = clone.querySelector(".property-baths") as HTMLElement;
        const deleteBtn = clone.querySelector(".btn-delete") as HTMLElement;

        img.src = property.mainPhoto;
        title.textContent = property.title;
        if (property.town) {
          location.textContent = `${property.town.name} (${property.town.province.name})`;
        } else {
          location.textContent = "";
        }
        //desc.textContent = property.description;
        price.textContent = String(property.price);
        sq.textContent = String(property.sqmeters);
        rooms.textContent = String(property.numRooms);
        baths.textContent = String(property.numBaths);

        deleteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (!confirm("Are you sure you want to delete this property?")) return;

          serviceProperties.deleteProperty(property.id!)
            .then(() => render())
            .catch(err => console.log(err));
        });

        propertiesList.append(clone);
      });
    })
    .catch(err => console.log(err));
};

render();
