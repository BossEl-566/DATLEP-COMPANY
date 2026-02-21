// app/product/[slug]/types/index.ts

export interface ProductImage {
  url: string;
  alt?: string;
  _id?: string;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution?: Record<string, number>;
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
  _id?: string;
  stock?: number; 
}

export interface Seller {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  isVerified?: boolean;
  averageRating?: number;
  totalSales?: number;
}

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  category?: string;
  rating?: number;
  totalReviews?: number;
  isVerifiedShop?: boolean;
  isFeatured?: boolean;
  seller?: Seller;
  address?: {
    city: string;
    country: string;
  };
  responseTime?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  detailedDescription?: string;
  category?: string;
  brand?: string;
  
  // Media
  image?: ProductImage;
  gallery?: ProductImage[];
  
  // Pricing
  regularPrice: number;
  salePrice?: number;
  
  // Inventory
  stock: number;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  
  // Shop & Seller
  shopId?: Shop;
  sellerId?: string;
  
  // Stats
  ratings?: ProductRating;
  views?: number;
  orderCount?: number;
  featured?: boolean;
  
  // Options
  tags?: string[];
  cashOnDelivery?: boolean;
  freeShipping?: boolean;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'draft' | 'archived';
  
  // UI State (optional, for cart/wishlist)
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
  customProperties?: Record<string, any>;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  _id: string;
  title: string;
  image?: string;
  price: number;
  shopId?: string;
  slug?: string;
  addedAt?: string;
}

export interface Review {
  _id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
  helpful?: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

