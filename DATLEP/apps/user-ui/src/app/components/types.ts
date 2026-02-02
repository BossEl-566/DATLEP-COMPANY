export interface ProductImage {
  url: string;
  alt?: string;
  _id?: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductSize {
  size: string;
  quantity: number;
  _id?: string;
}

export interface Seller {
  _id: string;
  name: string;
  averageRating?: number;
  isVerified?: boolean;
  avatar?: string;
}

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  rating?: number;
  totalReviews?: number;
  isVerifiedShop?: boolean;
  isFeatured?: boolean;
  logo?: string;
  seller?: Seller;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  image?: ProductImage;
  gallery?: ProductImage[];
  regularPrice: number;
  salePrice?: number;
  ratings?: ProductRating;
  stock: number;
  sizes?: ProductSize[];
  featured?: boolean;
  orderCount?: number;
  views?: number;
  tags?: string[];
  wishlistCount?: number;
  shopId?: Shop;
  createdAt?: string;
  updatedAt?: string;
}