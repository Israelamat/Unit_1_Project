import { API_BASE } from "../constants";
import {Http} from "../http.class";
import {Property, PropertyInsert, InsertPropertyResponse, GetPropertiesResponse} from "../interfaces/property";

export class PropertiesService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async getProperties(): Promise<GetPropertiesResponse> {
    return await this.http.get(`${API_BASE}/properties`);
  }

  async insertProperty(body: PropertyInsert): Promise<Property> {
  const res = await this.http.post<InsertPropertyResponse, PropertyInsert>(`${API_BASE}/properties`, body);
  return res.property;
}


  async deleteProperty(id: number): Promise<void> {
    return await this.http.delete(`${API_BASE}/properties/${id}`);
  }

//   async getPropertyById(id: number): Promise<Property> {
//     return await this.http.get(`/properties/${id}`);
//   }
}

export default PropertiesService;
