import { Coordinates, Town, User } from "./auth";

export interface PropertyInsert {
  title: string;
  description: string;
  price: number;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  coordinates?: Coordinates;
  townId: number; // sólo necesario para insertar
  images?: File[] | string[]; // si se suben archivos o urls
}

export interface Property
  extends Omit<PropertyInsert, "townId"> {
  id: number;
  town: Town;
  images?: string[]; // una vez guardadas serán URLs
  createdAt: string;
  updatedAt: string;
  owner: User | number; // dependiendo de cómo responda el servidor
  isAvailable?: boolean; // opcional si no siempre aparece
}

export interface PropertiesResponse {
  success: boolean;
  total: number;
  properties: Property[];
}

export interface SinglePropertyResponse {
  success: boolean;
  property: Property;
}
