
export interface User {
  id: string;
  email: string;
  username: string;
  profession?: string;
}

export enum PropertyType {
  APARTMENT = 'Apartment',
  HOUSE = 'House',
  STUDIO = 'Studio',
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
  source: 'Daft.ie' | 'Rent.ie' | 'MyHome.ie';
  description: string;
}

export interface SearchPreference {
  id: string;
  name: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  type: PropertyType | 'Any';
  minBedrooms: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'ID' | 'Reference' | 'Payslip' | 'Other';
  fileType: 'PDF' | 'JPG' | 'PNG';
  uploadedAt: Date;
}
