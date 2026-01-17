import { Scissors, Shirt, Footprints, RollerCoaster, Store, Wrench, Ruler, TrendingUp, ShoppingBag, Tag, Building } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Subcategory {
  id: string;
  name: string;
  href: string;
  type: 'shop' | 'product' | 'offer';
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
  color: string;
  trending?: boolean;
  featured?: boolean;
  sustainable?: boolean;
  bespoke?: boolean;
  hot?: boolean;
  mainHref: string;
  totalShops: number;
  totalProducts: number;
  totalOffers: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    subcategories: [
      { id: 'clothing', name: 'Clothing', href: '/category/fashion/clothing', type: 'product', count: 1250 },
      { id: 'accessories', name: 'Accessories', href: '/category/fashion/accessories', type: 'product', count: 540 },
      { id: 'jewelry', name: 'Jewelry', href: '/category/fashion/jewelry', type: 'product', count: 320 },
      { id: 'bags', name: 'Bags & Purses', href: '/category/fashion/bags', type: 'product', count: 210 },
    ],
    color: 'from-blue-500 to-cyan-400',
    trending: true,
    mainHref: '/category/fashion',
    totalShops: 85,
    totalProducts: 2320,
    totalOffers: 156
  },
  {
    id: 'tailors',
    name: 'Tailors',
    icon: Scissors,
    subcategories: [
      { id: 'bespoke-tailors', name: 'Bespoke Tailors', href: '/shops/tailors/bespoke', type: 'shop', count: 45 },
      { id: 'alterations', name: 'Alterations', href: '/shops/tailors/alterations', type: 'shop', count: 120 },
      { id: 'traditional', name: 'Traditional', href: '/shops/tailors/traditional', type: 'shop', count: 65 },
      { id: 'modern', name: 'Modern Tailors', href: '/shops/tailors/modern', type: 'shop', count: 80 },
    ],
    color: 'from-amber-500 to-orange-400',
    featured: true,
    mainHref: '/category/tailors',
    totalShops: 310,
    totalProducts: 890,
    totalOffers: 67
  },
  {
    id: 'shoemakers',
    name: 'Shoemakers',
    icon: Footprints,
    subcategories: [
      { id: 'leather-shoes', name: 'Leather Shoes', href: '/category/shoes/leather', type: 'product', count: 430 },
      { id: 'sneakers', name: 'Sneakers', href: '/category/shoes/sneakers', type: 'product', count: 290 },
      { id: 'sandals', name: 'Sandals', href: '/category/shoes/sandals', type: 'product', count: 180 },
      { id: 'repairs', name: 'Repair Services', href: '/shops/shoe-repair', type: 'shop', count: 75 },
    ],
    color: 'from-emerald-500 to-green-400',
    mainHref: '/category/shoemakers',
    totalShops: 165,
    totalProducts: 900,
    totalOffers: 89
  },
  {
    id: 'fabrics',
    name: 'Fabrics',
    icon: RollerCoaster,
    subcategories: [
      { id: 'african-prints', name: 'African Prints', href: '/category/fabrics/african-prints', type: 'product', count: 670 },
      { id: 'silk-satin', name: 'Silk & Satin', href: '/category/fabrics/silk-satin', type: 'product', count: 320 },
      { id: 'cotton', name: 'Cotton', href: '/category/fabrics/cotton', type: 'product', count: 540 },
      { id: 'designer', name: 'Designer Fabrics', href: '/shops/designer-fabrics', type: 'shop', count: 45 },
    ],
    color: 'from-purple-500 to-pink-400',
    trending: true,
    mainHref: '/category/fabrics',
    totalShops: 95,
    totalProducts: 1570,
    totalOffers: 234
  },
  {
    id: 'thrift',
    name: 'Thrift Stores',
    icon: Store,
    subcategories: [
      { id: 'vintage', name: 'Vintage', href: '/shops/thrift/vintage', type: 'shop', count: 85 },
      { id: 'designer', name: 'Designer Thrift', href: '/shops/thrift/designer', type: 'shop', count: 45 },
      { id: 'budget', name: 'Budget Friendly', href: '/shops/thrift/budget', type: 'shop', count: 120 },
      { id: 'luxury', name: 'Luxury Thrift', href: '/shops/thrift/luxury', type: 'shop', count: 30 },
    ],
    color: 'from-gray-600 to-gray-400',
    sustainable: true,
    mainHref: '/category/thrift-stores',
    totalShops: 280,
    totalProducts: 0,
    totalOffers: 189
  },
  {
    id: 'repair',
    name: 'Repair Services',
    icon: Wrench,
    subcategories: [
      { id: 'clothing-repair', name: 'Clothing Repair', href: '/shops/repair/clothing', type: 'shop', count: 95 },
      { id: 'shoe-repair', name: 'Shoe Repair', href: '/shops/repair/shoes', type: 'shop', count: 65 },
      { id: 'zipper-fix', name: 'Zipper Fix', href: '/services/zipper-fix', type: 'offer', count: 120 },
      { id: 'button-replacement', name: 'Button Replacement', href: '/services/button-replacement', type: 'offer', count: 85 },
    ],
    color: 'from-red-500 to-rose-400',
    mainHref: '/category/repair-services',
    totalShops: 180,
    totalProducts: 0,
    totalOffers: 370
  },
  {
    id: 'measurements',
    name: 'Measurements',
    icon: Ruler,
    subcategories: [
      { id: 'virtual-fitting', name: 'Virtual Fitting', href: '/services/virtual-fitting', type: 'offer', count: 45 },
      { id: 'size-guide', name: 'Size Guide', href: '/tools/size-guide', type: 'offer', count: 0 },
      { id: 'custom-forms', name: 'Custom Forms', href: '/bespoke/forms', type: 'offer', count: 0 },
      { id: 'history', name: 'Measurement History', href: '/profile/measurements', type: 'offer', count: 0 },
    ],
    color: 'from-indigo-500 to-blue-400',
    bespoke: true,
    mainHref: '/services/measurements',
    totalShops: 25,
    totalProducts: 0,
    totalOffers: 45
  },
  {
    id: 'trending',
    name: 'Trending Now',
    icon: TrendingUp,
    subcategories: [
      { id: 'seasonal', name: 'Seasonal', href: '/offers/seasonal', type: 'offer', count: 156 },
      { id: 'popular', name: 'Popular Items', href: '/products/popular', type: 'product', count: 890 },
      { id: 'limited', name: 'Limited Edition', href: '/offers/limited-edition', type: 'offer', count: 67 },
      { id: 'sale', name: 'Sale', href: '/offers/sale', type: 'offer', count: 324 },
    ],
    color: 'from-rose-500 to-red-400',
    hot: true,
    mainHref: '/trending',
    totalShops: 0,
    totalProducts: 890,
    totalOffers: 547
  }
];

// Helper function to get icon for type
export const getTypeIcon = (type: 'shop' | 'product' | 'offer'): LucideIcon => {
  switch (type) {
    case 'shop': return Building;
    case 'product': return ShoppingBag;
    case 'offer': return Tag;
    default: return ShoppingBag;
  }
};

// Helper function to get type color
export const getTypeColor = (type: 'shop' | 'product' | 'offer'): string => {
  switch (type) {
    case 'shop': return 'bg-purple-100 text-purple-800';
    case 'product': return 'bg-blue-100 text-blue-800';
    case 'offer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get type label
export const getTypeLabel = (type: 'shop' | 'product' | 'offer'): string => {
  switch (type) {
    case 'shop': return 'Shop';
    case 'product': return 'Product';
    case 'offer': return 'Offer';
    default: return 'Item';
  }
};