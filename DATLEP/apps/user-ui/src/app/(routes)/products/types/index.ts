// app/products/types/index.ts
export interface ProductImage {
  url: string;
  alt?: string;
  _id?: string;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProductColor {
  name: string;
  hexCode: string;
  available: boolean;
  _id?: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
  available?: boolean;
  stock?: number;
  _id?: string;
}

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  isVerifiedShop?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  brand?: string;
  image?: ProductImage;
  gallery?: ProductImage[];
  regularPrice: number;
  salePrice?: number;
  stock: number;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  ratings?: ProductRating;
  views?: number;
  orderCount?: number;
  featured?: boolean;
  tags?: string[];
  cashOnDelivery?: boolean;
  shopId?: string | Shop;
  createdAt?: string;
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  q?: string;
  categories?: string[];
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  cashOnDelivery?: boolean;
  minRating?: number;
  minDiscount?: number;
  sortBy?: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  shopId?: string;
  sellerId?: string;
}

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

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
  brands: Array<{ value: string; count: number }>;
}