// app/shops/types/index.ts
export interface ShopImage {
  url: string;
  alt?: string;
  _id?: string;
}

export interface ShopAddress {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Seller {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: ShopImage;
  isVerified?: boolean;
  averageRating?: number;
  totalSales?: number;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  bio?: string;
  category?: string;
  shopType?: 'retail' | 'wholesale' | 'both';
  
  // Media
  logo?: ShopImage;
  coverImage?: ShopImage;
  avatar?: ShopImage;
  gallery?: ShopImage[];
  
  // Location
  address?: ShopAddress;
  
  // Business Info
  yearsInBusiness?: '<1' | '1-3' | '3-5' | '5-10' | '10+';
  specialties?: string[];
  website?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  openingHours?: OpeningHour[];
  
  // Seller
  seller?: Seller;
  
  // Stats
  rating: number;
  totalReviews: number;
  totalOrders?: number;
  completedOrders?: number;
  followers?: number;
  products?: string[];
  
  // Flags
  isVerifiedShop: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isOpen: boolean;
  
  // Policies
  returnPolicy?: string;
  shippingPolicy?: string;
  customOrderPolicy?: string;
  
  // Metadata
  responseTime?: number; // in hours
  cancellationRate?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopFilter {
  page?: number;
  limit?: number;
  q?: string;
  categories?: string[];
  shopType?: string[];
  specialties?: string[];
  yearsInBusiness?: string[];
  country?: string;
  city?: string;
  isVerifiedShop?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isOpen?: boolean;
  minRating?: number;
  minReviews?: number;
  sortBy?: 'top-rated' | 'most-reviewed' | 'featured' | 'most-orders' | 'newest' | 'verified' | 'open-now' | 'name-asc' | 'name-desc';
}

export type SortOption = 'top-rated' | 'most-reviewed' | 'featured' | 'most-orders' | 'newest' | 'verified' | 'open-now' | 'name-asc' | 'name-desc';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Facets {
  categories: Array<{ value: string; count: number }>;
  shopTypes: Array<{ value: string; count: number }>;
  countries: Array<{ value: string; count: number }>;
  cities: Array<{ value: string; count: number }>;
}