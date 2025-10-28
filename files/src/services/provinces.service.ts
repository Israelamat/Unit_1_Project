import {Http} from "../http.class";
import {API_BASE} from "../constants";

import { TownsResponse, ProvincesResponse} from "../interfaces/property";

export class ProvincesService {
  private http: Http;

  constructor() {
    this.http = new Http();
  }

  async getProvinces(): Promise<ProvincesResponse> {
    return await this.http.get(`${API_BASE}/provinces`);
  }

  async getTowns(provinceId: number | string): Promise<TownsResponse> {
    if (!provinceId) {
      return { towns: [] };
    }
    return await this.http.get(`${API_BASE}/provinces/${provinceId}/towns`);
  }
}

export default ProvincesService;
