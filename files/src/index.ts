import { PropertiesService } from "./services/properties.service";
import { ProvincesService } from "./services/provinces.service";
import { Property, GetPropertiesResponse, ProvincesResponse } from "./interfaces/property";
import { AuthService } from "./services/auth.service";
import { UserResponse } from "./interfaces/auth";

const authService = new AuthService();
const serviceProperties = new PropertiesService();
const provincesService = new ProvincesService();

const templateOfCard = document.getElementById("property-card-template") as HTMLTemplateElement;
const propertiesList = document.getElementById("property-listings") as HTMLElement;

let currentPage = 1;
let hasMore = true;
let searchText = "";
let selectedProvince = 0;

const render = (reset = false) => {
  if (reset) {
    currentPage = 1;
    propertiesList.innerHTML = "";
  }

  // Llamada al servicio con filtros
  serviceProperties.getFilteredProperties({
    page: currentPage,
    search: searchText || undefined,
    province: selectedProvince || undefined
  })
    .then((response: GetPropertiesResponse) => {
      response.properties.forEach((property: Property) => {
        const clone = templateOfCard.content.cloneNode(true) as DocumentFragment;

        const img = clone.querySelector(".property-image") as HTMLImageElement;
        const imgLink = img?.closest("a") as HTMLAnchorElement;
        const title = clone.querySelector(".property-title") as HTMLElement;
        const location = clone.querySelector(".property-location") as HTMLElement;
        const price = clone.querySelector(".property-price") as HTMLElement;
        const sq = clone.querySelector(".property-sqmeters") as HTMLElement;
        const rooms = clone.querySelector(".property-rooms") as HTMLElement;
        const baths = clone.querySelector(".property-baths") as HTMLElement;
        const deleteBtn = clone.querySelector(".btn-delete") as HTMLElement;

        img.src = property.mainPhoto;
        title.textContent = property.title;
        location.textContent = property.town
          ? `${property.town.name} (${property.town.province.name})`
          : "";
        price.textContent = String(property.price);
        sq.textContent = String(property.sqmeters);
        rooms.textContent = String(property.numRooms);
        baths.textContent = String(property.numBaths);

        const detailUrl = `property-detail.html?id=${property.id}`;
        imgLink.href = detailUrl;

        if (!authService.checkToken()) deleteBtn?.classList.add("hidden");

        deleteBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Are you sure you want to delete this property?")) {
            serviceProperties
              .deleteProperty(property.id)
              .then(() => render(true))
              .catch((err) => console.log(err));
          }
        });

        propertiesList.append(clone);
      });

      hasMore = response.more;

      const loadMoreBtn = document.getElementById("load-more-btn") as HTMLButtonElement;
      if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMore ? "block" : "none";
      }
    })
    .catch((err) => console.error(err));
};



window.addEventListener("DOMContentLoaded", () => {
  
  
  render(true);
  const logoutBtn = document.getElementById("logout-link") as HTMLButtonElement | null;
  const loginLink = document.getElementById("login-link");
  const newPropertyLink = document.getElementById("new-property-link");
  const profileLink = document.getElementById("profile-link");

  const searchForm = document.getElementById("search-form") as HTMLFormElement;
  const searchInput = document.getElementById("search-text") as HTMLInputElement;
  const provinceSelect = document.getElementById("province-filter") as HTMLSelectElement;

  const selectProvincesFilter = document.getElementById("province-filter") as HTMLSelectElement;
  const filterInfo = document.getElementById("filter-Info") as HTMLDivElement;
  const defaultFilterText = filterInfo?.textContent || "Showing all properties";



  if (authService.checkToken()) {
    logoutBtn?.classList.remove("hidden");
    newPropertyLink?.classList.remove("hidden");
    profileLink?.classList.remove("hidden");
    loginLink?.classList.add("hidden");

    authService.getMyUser()
      .then((user: UserResponse) => {
        if (user.user.me) {
          logoutBtn?.addEventListener("click", () => {
            authService.logout();
            window.location.href = "login.html";
          });
        }
      }).catch(err => console.log(err));
  } else {
    logoutBtn?.classList.add("hidden");
    newPropertyLink?.classList.add("hidden");
    profileLink?.classList.add("hidden");
    loginLink?.classList.remove("hidden");
  }

  searchForm?.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    searchText = searchInput.value.trim();
    selectedProvince = Number(provinceSelect.value) || 0;

    currentPage = 1;
    propertiesList.innerHTML = "";
    if (filterInfo && provinceSelect) {
      if (!searchText && selectedProvince === 0) {
        filterInfo.textContent = defaultFilterText;
      } else {
        filterInfo.textContent = `Showing properties for ${searchText || "No text "} in ${provinceSelect.options[provinceSelect.selectedIndex].text}`;
      }
    }
    render(true);
  });

  provincesService.getProvinces()
    .then((provinces: ProvincesResponse) => {
      provinces.provinces.forEach((prov) => {
        const option = document.createElement("option");
        option.value = String(prov.id);
        option.textContent = prov.name;
        selectProvincesFilter.appendChild(option);
      });
    })
    .catch(err => console.log(err));

  const loadMoreBtn = document.getElementById("load-more-btn") as HTMLButtonElement;
  loadMoreBtn?.addEventListener("click", () => {
    if (hasMore) {
      currentPage++;
      render();
    }
  });
});



