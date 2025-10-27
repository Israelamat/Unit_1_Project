import {Http} from "./http.class";
import {API_BASE} from "./constants";

export interface Province {
  id: number;
  name: string;
}

export interface Town {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface GetProvincesResponse {
  provinces: Province[];
}

export interface GetTownsResponse {
  towns: Town[];
}

export class ProvincesService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async getProvinces(): Promise<GetProvincesResponse> {
    return await this.http.get(`${API_BASE}/provinces`);
  }

  async getTowns(provinceId: number | string): Promise<GetTownsResponse> {
    if (!provinceId) {
      return { towns: [] };
    }
    return await this.http.get(`${API_BASE}/provinces/${provinceId}/towns`);
  }
}

export default ProvincesService;
