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
  createdAt?: string;
  updatedAt?: string;
}