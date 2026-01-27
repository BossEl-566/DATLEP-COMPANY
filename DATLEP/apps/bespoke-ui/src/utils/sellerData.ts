import { ShoppingCart, Store, Palette, Scissors, Gem } from 'lucide-react';

// utils/sellerData.ts
export const sellerTypes = [
  { 
    id: 'fashion-retailer', 
    label: 'Fashion Retailer', 
    description: 'Sell ready-made fashion items',
    icon: ShoppingCart
  },
  { 
    id: 'boutique-owner', 
    label: 'Boutique Owner', 
    description: 'Own a fashion boutique',
    icon: Store
  },
  { 
    id: 'independent-designer', 
    label: 'Independent Designer', 
    description: 'Design and sell your own collections',
    icon: Palette
  },
  { 
    id: 'fabric-seller', 
    label: 'Fabric Seller', 
    description: 'Sell fabrics and materials',
    icon: Scissors
  },
  { 
    id: 'accessories-seller', 
    label: 'Accessories Seller', 
    description: 'Sell fashion accessories',
    icon: Gem
  },
  { 
    id: 'footwear-seller', 
    label: 'Footwear Seller', 
    description: 'Sell shoes and footwear',
    icon: ShoppingCart
  }
];

export const productCategories = [
  // Clothing
  { id: 'ready-to-wear', label: 'Ready-to-Wear', group: 'Clothing' },
  { id: 'traditional-wear', label: 'Traditional Wear', group: 'Clothing' },
  { id: 'wedding-attire', label: 'Wedding Attire', group: 'Clothing' },
  { id: 'children-fashion', label: "Children's Fashion", group: 'Clothing' },
  { id: 'mens-fashion', label: "Men's Fashion", group: 'Clothing' },
  { id: 'womens-fashion', label: "Women's Fashion", group: 'Clothing' },
  { id: 'casual-wear', label: 'Casual Wear', group: 'Clothing' },
  { id: 'formal-wear', label: 'Formal Wear', group: 'Clothing' },
  { id: 'sportswear', label: 'Sportswear', group: 'Clothing' },
  { id: 'lingerie', label: 'Lingerie', group: 'Clothing' },
  { id: 'maternity-wear', label: 'Maternity Wear', group: 'Clothing' },
  
  // Footwear
  { id: 'footwear', label: 'Footwear', group: 'Footwear' },
  { id: 'sandals', label: 'Sandals', group: 'Footwear' },
  { id: 'boots', label: 'Boots', group: 'Footwear' },
  { id: 'sneakers', label: 'Sneakers', group: 'Footwear' },
  
  // Accessories
  { id: 'jewelry', label: 'Jewelry', group: 'Accessories' },
  { id: 'bags-purses', label: 'Bags & Purses', group: 'Accessories' },
  { id: 'belts', label: 'Belts', group: 'Accessories' },
  { id: 'hats', label: 'Hats', group: 'Accessories' },
  { id: 'scarves', label: 'Scarves', group: 'Accessories' },
  { id: 'gloves', label: 'Gloves', group: 'Accessories' },
  { id: 'ties', label: 'Ties', group: 'Accessories' },
  { id: 'socks', label: 'Socks', group: 'Accessories' },
  
  // Fabrics & Materials
  { id: 'fabrics', label: 'Fabrics', group: 'Fabrics & Materials' },
  { id: 'cotton', label: 'Cotton Fabrics', group: 'Fabrics & Materials' },
  { id: 'ankara', label: 'Ankara/Ancestral Fabrics', group: 'Fabrics & Materials' },
  { id: 'lace', label: 'Lace Fabrics', group: 'Fabrics & Materials' },
  { id: 'silk', label: 'Silk Fabrics', group: 'Fabrics & Materials' },
  { id: 'leather', label: 'Leather Materials', group: 'Fabrics & Materials' },
  { id: 'denim', label: 'Denim Fabrics', group: 'Fabrics & Materials' },
  { id: 'knits', label: 'Knit Fabrics', group: 'Fabrics & Materials' },
  
  // Materials & Supplies
  { id: 'buttons', label: 'Buttons', group: 'Materials & Supplies' },
  { id: 'zippers', label: 'Zippers', group: 'Materials & Supplies' },
  { id: 'threads', label: 'Threads', group: 'Materials & Supplies' },
  { id: 'beads', label: 'Beads', group: 'Materials & Supplies' },
  { id: 'embroidery', label: 'Embroidery Materials', group: 'Materials & Supplies' },
  { id: 'ribbons', label: 'Ribbons & Trims', group: 'Materials & Supplies' },
  { id: 'patches', label: 'Patches', group: 'Materials & Supplies' },
  { id: 'labels', label: 'Labels & Tags', group: 'Materials & Supplies' }
];

export const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

export type SellerType = 
  | 'fashion-retailer'
  | 'boutique-owner'
  | 'independent-designer'
  | 'fabric-seller'
  | 'accessories-seller'
  | 'footwear-seller';
