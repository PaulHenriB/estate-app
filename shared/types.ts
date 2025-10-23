// This file can be used to share types between frontend and backend if needed.
// For now, frontend types will be derived from API responses.

export interface User {
  id: string;
  email: string;
  username: string;
  profession?: string;
  role: 'USER' | 'ADMIN';
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  STUDIO = 'STUDIO',
}

export interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  imageUrl: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchPreference {
  id: string;
  name: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  type: PropertyType;
  minBedrooms: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}
