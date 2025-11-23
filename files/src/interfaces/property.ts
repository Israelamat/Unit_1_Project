import { MyUser } from "./auth"; 
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
  rated?: boolean;
  totalRating?: number;
  mainPhoto: string;
  mine?: boolean;
  createdAt: string;
  status: string;
  town?: Town;
  seller: number;
}

export interface PropertyWithSeller {
  id: number;
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  rated?: boolean;
  totalRating?: number;
  mainPhoto: string;
  mine?: boolean;
  createdAt: string;
  status: string;
  town?: Town;
  seller: MyUser;
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

export interface PropertyResponse {
  property: Property;
}

export interface ProvincesResponse {
  provinces: Province[];
}

export interface TownsResponse {
  towns: Town[];
}

export interface PropertyResponseWithSeller {
  property: PropertyWithSeller;
}

export interface GetFilteredPropertiesParams {
  page?: number;
  province?: number;
  search?: string;
  seller?: number;
}

