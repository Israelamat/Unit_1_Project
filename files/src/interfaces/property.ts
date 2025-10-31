export interface PropertyInsert {
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  totalRating?: number;
  mainPhoto?: string;
  createdAt?: string;
  status?: string;
  town?: Town;
  seller?: number;
}

export interface PropertyInsertTownId {
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  totalRating?: number;
  mainPhoto?: string;
  createdAt?: string;
  status?: string;
  townId: number;
  seller?: number;
}

export interface Town {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  province: Province;
}


export interface Property {
  id: number;
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  totalRating?: number;
  mainPhoto: string;
  createdAt: string;
  status: string;
  town?: Town;
  seller: number;
}

export interface GetPropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  more: boolean;
}

export interface Province {
  id: number;
  name: string;
}

export interface ProvincesResponse {
  provinces: Province[];
}

export interface TownsResponse {
  towns: Town[];
}

export interface InsertPropertyResponse {
  property: Property;
}

export interface GetFilteredPropertiesParams {
  page?: number;
  province?: number;
  search?: string;
  seller?: number;
}

