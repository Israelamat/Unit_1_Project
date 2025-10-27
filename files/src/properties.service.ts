import { API_BASE } from "./constants";
import {Http} from "./http.class";

// Interfaces para tipado seguro
export interface Property {
  id?: number;
  title: string;
  description: string;
  price: number;
  address: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  townId: number;
  mainPhoto: string;
}

export interface GetPropertiesResponse {
  properties: Property[];
}

export interface InsertPropertyResponse {
  property: Property;
}

export class PropertiesService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async getProperties(): Promise<GetPropertiesResponse> {
    return await this.http.get(`${API_BASE}/properties`);
  }

  async insertProperty(body: Property): Promise<Property> {
  const res = await this.http.post<InsertPropertyResponse, Property>(`${API_BASE}/properties`, body);
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
