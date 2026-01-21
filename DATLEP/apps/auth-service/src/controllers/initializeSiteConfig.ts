// example-data/site-config-example.ts
import { SiteConfigModel } from "@datlep/database"

/**
 * Example data for SiteConfig with comprehensive fashion categories
 * This can be used to seed/initialize your database
 */

const exampleSiteConfig = {
  categories: [
    "Clothing",
    "Footwear",
    "Accessories",
    "Jewelry",
    "Bags & Purses",
    "Fabrics & Materials",
    "Traditional Wear",
    "Beauty & Cosmetics",
    "Home & Living",
    "Kids & Babies"
  ],
  subCategories: new Map([
    ["Clothing", [
      "Dresses",
      "Tops & Blouses",
      "Bottoms",
      "Outerwear",
      "Activewear",
      "Lingerie & Sleepwear",
      "Suits & Blazers",
      "Swimwear",
      "Maternity Wear",
      "Plus Size"
    ]],
    ["Footwear", [
      "Sneakers",
      "Sandals",
      "Boots",
      "Heels",
      "Flats",
      "Loafers",
      "Athletic Shoes",
      "Traditional Footwear",
      "Slippers",
      "Children's Shoes"
    ]],
    ["Accessories", [
      "Hats & Caps",
      "Scarves & Wraps",
      "Belts",
      "Socks & Hosiery",
      "Gloves",
      "Sunglasses",
      "Watches",
      "Hair Accessories",
      "Ties & Bowties",
      "Tech Accessories"
    ]],
    ["Jewelry", [
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Rings",
      "Anklets",
      "Body Jewelry",
      "Brooches & Pins",
      "Men's Jewelry",
      "Traditional Jewelry",
      "Bridal Jewelry"
    ]],
    ["Bags & Purses", [
      "Handbags",
      "Backpacks",
      "Clutches",
      "Tote Bags",
      "Crossbody Bags",
      "Wallet & Cardholders",
      "Luggage & Travel",
      "Beach Bags",
      "Evening Bags",
      "Laptop Bags"
    ]],
    ["Fabrics & Materials", [
      "Ankara & African Prints",
      "Cotton",
      "Silk",
      "Lace",
      "Denim",
      "Leather",
      "Wool & Knits",
      "Brocade & Embroidered",
      "Linen",
      "Velvet"
    ]],
    ["Traditional Wear", [
      "Agbada & Boubou",
      "Dashiki",
      "Kaftan",
      "Kente",
      "Shweshwe",
      "Gele & Headwraps",
      "Iro & Buba",
      "Traditional Gowns",
      "Aso Ebi",
      "Bridal Traditional"
    ]],
    ["Beauty & Cosmetics", [
      "Skincare",
      "Makeup",
      "Haircare",
      "Fragrances",
      "Bodycare",
      "Nail Products",
      "Beauty Tools",
      "Men's Grooming",
      "Natural & Organic",
      "Bath & Shower"
    ]],
    ["Home & Living", [
      "Home Decor",
      "Kitchen & Dining",
      "Bedding & Linens",
      "Furniture",
      "Lighting",
      "Wall Art",
      "Rugs & Carpets",
      "Candles & Diffusers",
      "Tableware",
      "African Home Decor"
    ]],
    ["Kids & Babies", [
      "Kids Clothing",
      "Baby Clothing",
      "Kids Footwear",
      "Toys & Games",
      "Nursery Items",
      "School Uniforms",
      "Kids Accessories",
      "Baby Gear",
      "Educational Toys",
      "Party Wear"
    ]]
  ])
};

/**
 * Function to seed/initialize the SiteConfig in the database
 * This can be run once to set up your categories and subcategories
 */
export async function seedSiteConfig() {
  try {
    console.log("🔄 Seeding SiteConfig data...");
    
    // Check if SiteConfig already exists
    const existingConfig = await SiteConfigModel.findOne();
    
    if (existingConfig) {
      console.log("⚠️ SiteConfig already exists. Updating...");
      
      // Update existing config
      const updatedConfig = await SiteConfigModel.findOneAndUpdate(
        {},
        {
          categories: exampleSiteConfig.categories,
          subCategories: exampleSiteConfig.subCategories
        },
        { new: true }
      );
      
      console.log("✅ SiteConfig updated successfully!");
      console.log(`📊 Categories: ${updatedConfig?.categories.length} categories added`);
      console.log(`📊 SubCategories: ${updatedConfig?.subCategories.size} parent categories with subcategories`);
      
      return updatedConfig;
    } else {
      // Create new config
      const newConfig = new SiteConfigModel(exampleSiteConfig);
      await newConfig.save();
      
      console.log("✅ SiteConfig created successfully!");
      console.log(`📊 Categories: ${newConfig.categories.length} categories added`);
      console.log(`📊 SubCategories: ${newConfig.subCategories.size} parent categories with subcategories`);
      
      return newConfig;
    }
  } catch (error) {
    console.error("❌ Error seeding SiteConfig:", error);
    throw error;
  }
}



/**
 * Example usage and data export
 */
export const siteConfigExampleData = {
  categories: exampleSiteConfig.categories,
  subCategories: Object.fromEntries(exampleSiteConfig.subCategories)
};

// Run seed function if this file is executed directly
if (require.main === module) {
  seedSiteConfig()
    .then(() => {
      console.log("🎉 SiteConfig seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export default exampleSiteConfig;