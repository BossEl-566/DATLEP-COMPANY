import { ShoppingBag, Layers, Tag, Shirt, Recycle, Box, Award, Heart, User, Briefcase, Bolt, Shield, TrendingUp, Star } from 'lucide-react';

// Types
export type SellerType = 'fashion-retailer' | 'fabric-supplier' | 'accessory-seller' | 'footwear-seller' | 'thrift-store' | 'materials-supplier';

export interface SellerTypeOption {
  id: SellerType;
  label: string;
  icon: any;
  description: string;
}

export interface ProductCategory {
  id: string;
  label: string;
  icon?: any;
}

export interface DayOfWeek {
  id: string;
  label: string;
}

// Seller types for PRODUCT SELLERS only
export const sellerTypes: SellerTypeOption[] = [
  { 
    id: 'fashion-retailer', 
    label: 'Fashion Retailer', 
    icon: ShoppingBag, 
    description: 'Sell ready-to-wear clothing, dresses, shirts, pants, etc.'
  },
  { 
    id: 'fabric-supplier', 
    label: 'Fabric Supplier', 
    icon: Layers, 
    description: 'Sell fabrics, textiles, and sewing materials'
  },
  { 
    id: 'accessory-seller', 
    label: 'Accessory Seller', 
    icon: Tag, 
    description: 'Sell jewelry, bags, belts, hats, and fashion accessories'
  },
  { 
    id: 'footwear-seller', 
    label: 'Footwear Seller', 
    icon: Shirt, 
    description: 'Sell shoes, sandals, boots, and other footwear'
  },
  { 
    id: 'thrift-store', 
    label: 'Thrift / Vintage Store', 
    icon: Recycle, 
    description: 'Sell pre-owned, vintage, or second-hand fashion items'
  },
  { 
    id: 'materials-supplier', 
    label: 'Materials Supplier', 
    icon: Box, 
    description: 'Sell buttons, zippers, threads, beads, and other fashion materials'
  },
];

// Product categories for SELLERS (products only, no services)
export const productCategories: ProductCategory[] = [
  // Clothing
  { id: 'ready-to-wear', label: 'Ready-to-Wear Clothing', icon: ShoppingBag },
  { id: 'traditional-wear', label: 'Traditional & Cultural Wear', icon: Award },
  { id: 'wedding-attire', label: 'Wedding & Formal Attire', icon: Star },
  { id: 'children-fashion', label: "Children's Clothing", icon: Heart },
  { id: 'mens-fashion', label: "Men's Fashion", icon: User },
  { id: 'womens-fashion', label: "Women's Fashion", icon: Heart },
  { id: 'casual-wear', label: 'Casual & Everyday Wear', icon: ShoppingBag },
  { id: 'formal-wear', label: 'Formal & Business Wear', icon: Briefcase },
  { id: 'sportswear', label: 'Sportswear & Activewear', icon: Bolt },
  { id: 'lingerie', label: 'Lingerie & Underwear', icon: Heart },
  { id: 'maternity-wear', label: 'Maternity Wear', icon: Heart },
  
  // Footwear
  { id: 'footwear', label: 'Footwear & Shoes', icon: Shirt },
  { id: 'sandals', label: 'Sandals & Slippers', icon: Shirt },
  { id: 'boots', label: 'Boots', icon: Shirt },
  { id: 'sneakers', label: 'Sneakers & Athletic Shoes', icon: Bolt },
  
  // Accessories
  { id: 'jewelry', label: 'Jewelry', icon: Award },
  { id: 'bags-purses', label: 'Bags & Purses', icon: ShoppingBag },
  { id: 'belts', label: 'Belts', icon: Tag },
  { id: 'hats', label: 'Hats & Caps', icon: Tag },
  { id: 'scarves', label: 'Scarves & Shawls', icon: Tag },
  { id: 'gloves', label: 'Gloves', icon: Tag },
  { id: 'ties', label: 'Ties & Bowties', icon: Tag },
  { id: 'socks', label: 'Socks & Hosiery', icon: Tag },
  
  // Fabrics & Materials
  { id: 'fabrics', label: 'Fabrics & Textiles', icon: Layers },
  { id: 'cotton', label: 'Cotton Fabrics', icon: Layers },
  { id: 'ankara', label: 'Ankara & African Prints', icon: Award },
  { id: 'lace', label: 'Lace & Net Fabrics', icon: Layers },
  { id: 'silk', label: 'Silk & Satin Fabrics', icon: Layers },
  { id: 'leather', label: 'Leather & Suede', icon: Award },
  { id: 'denim', label: 'Denim & Jeans Material', icon: Layers },
  { id: 'knits', label: 'Knit & Jersey Fabrics', icon: Layers },
  
  // Materials & Supplies
  { id: 'buttons', label: 'Buttons & Fasteners', icon: Box },
  { id: 'zippers', label: 'Zippers', icon: Box },
  { id: 'threads', label: 'Threads & Yarns', icon: Box },
  { id: 'beads', label: 'Beads & Sequins', icon: Box },
  { id: 'embroidery', label: 'Embroidery Supplies', icon: Award },
  { id: 'ribbons', label: 'Ribbons & Tapes', icon: Box },
  { id: 'patches', label: 'Patches & Appliques', icon: Box },
  { id: 'labels', label: 'Clothing Labels & Tags', icon: Tag },
  
  // Special Categories
  { id: 'vintage', label: 'Vintage & Retro Fashion', icon: Recycle },
  { id: 'eco-fashion', label: 'Eco-Friendly Fashion', icon: Recycle },
  { id: 'streetwear', label: 'Streetwear & Urban Fashion', icon: TrendingUp },
  { id: 'designer', label: 'Designer Brands', icon: Award },
  { id: 'affordable-fashion', label: 'Affordable Fashion', icon: ShoppingBag },
  { id: 'luxury', label: 'Luxury Fashion', icon: Star },
  
  // Other
  { id: 'costumes', label: 'Costumes & Cosplay', icon: Star },
  { id: 'uniforms', label: 'Uniforms', icon: Briefcase },
  { id: 'workwear', label: 'Workwear & Protective Clothing', icon: Shield },
];

// Days of week for opening hours
export const daysOfWeek: DayOfWeek[] = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

// Helper functions
export const getSellerTypeById = (id: SellerType): SellerTypeOption | undefined => {
  return sellerTypes.find(type => type.id === id);
};

export const getCategoryById = (id: string): ProductCategory | undefined => {
  return productCategories.find(category => category.id === id);
};

export const getDayById = (id: string): DayOfWeek | undefined => {
  return daysOfWeek.find(day => day.id === id);
};