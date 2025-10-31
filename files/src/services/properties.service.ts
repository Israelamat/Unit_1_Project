import { API_BASE } from "../constants";
import { Http } from "../http.class";
import { Property, PropertyInsert, InsertPropertyResponse, GetPropertiesResponse, GetFilteredPropertiesParams } from "../interfaces/property";

export class PropertiesService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async getProperties(): Promise<GetPropertiesResponse> {
    return await this.http.get(`${API_BASE}/properties`);
  }

  async getPropertiesPage(page: number = 1): Promise<GetPropertiesResponse> {
    return this.http.get(`${API_BASE}/properties?page=${page}&limit=12`);
  }


  async insertProperty(body: PropertyInsert): Promise<Property> {
    const res = await this.http.post<InsertPropertyResponse, PropertyInsert>(`${API_BASE}/properties`, body);
    return res.property;
  }

  async getFilteredProperties(
    params: GetFilteredPropertiesParams = {}
  ): Promise<GetPropertiesResponse> {
    const query = new URLSearchParams({
      page: (params.page ?? 1).toString(),
      province: (params.province ?? 0).toString(),
      search: params.search ?? "",
      ...(params.seller ? { seller: params.seller.toString() } : {}),
    });
    return this.http.get<GetPropertiesResponse>(`${API_BASE}/properties?${query.toString()}`);
  }



  async deleteProperty(id: number): Promise<void> {
    return await this.http.delete(`${API_BASE}/properties/${id}`);
  }

  //   async getPropertyById(id: number): Promise<Property> {
  //     return await this.http.get(`/properties/${id}`);
  //   }
}

export default PropertiesService;
