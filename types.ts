export interface Rental {
  id: string;
  images: string[];
  price: number;
  currency: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  sqft: number;
  description: string;
  amenities: string[];
  isFavorite?: boolean; // Local state helper
  owner?: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  beds: number;
  baths: number;
  parkingOnly: boolean;
  location: string;
  radius: number; // in km
}

export enum SwipeDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  onboardingCompleted: boolean;
  preferences?: {
    minPrice: number;
    maxPrice: number;
    location: string;
    radius: number;
    beds: number;
    baths: number;
    parkingOnly: boolean;
  };
}

export type TabView = 'discover' | 'favorites' | 'profile';
