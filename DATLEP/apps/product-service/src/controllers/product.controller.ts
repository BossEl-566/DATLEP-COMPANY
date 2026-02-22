import { Discount,  Product,  SiteConfigModel } from "@datlep/database";
import { Request, Response, NextFunction } from "express";
import { SellerRequest } from '../types/express';
import { createImage } from "../services/image.service";
import { Types } from 'mongoose';
import mongoose from 'mongoose';



// get all categories
export const getCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await SiteConfigModel.findOne();  
      if(!config){
        return res.status(404).json({ message: "SiteConfig not found" });
      }
      return res.status(200).json(config);
    } catch (error) {
        return next(error);
    }
} 

// Create discount codes

export const createDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?._id;
    console.log('sellerId for the seller:', sellerId);

    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized seller' });
    }

    const {
      public_name,
      discountType,
      discountValue,
      discountCode
    } = req.body;

    const isDiscountCodeExists = await Discount.findOne({ discountCode });
    if (isDiscountCodeExists) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }

    const discount = new Discount({
      public_name,
      discountType,
      discountValue,
      discountCode,
      sellerId,
      expiresAt: new Date(req.body.expiresAt),
    });

    await discount.save();
    return res.status(201).json(discount);
  } catch (error) {
    return next(error);
  }
};

// get discount codes
export const getDiscountCodes = async (
  req: SellerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?._id;
    console.log('sellerId for the seller:', sellerId);
    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized seller' });
    }

    const discountCodes = await Discount.find({ sellerId });


    return res.status(200).json(discountCodes);
  } catch (error) {
    return next(error);
  }
};


export const deleteDiscountCode = async (
  req: SellerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?._id;

    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized seller' });
    }

    const discountCode = await Discount.findOne({
      _id: id,
      sellerId
    });

    if (!discountCode) {
      return res.status(404).json({ message: 'Discount code not found' });
    }

    await Discount.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ message: 'Discount code deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: SellerRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sellerId = req.user?._id;
    const shopId = req.user?.shop;

    if (!sellerId || !shopId) {
     res.status(401).json({ message: 'Unauthorized seller' });
    }

    const {
      title,
      slug,
      category,
      subcategory,
      shortDescription,
      detailedDescription,
      image,
      gallery,
      tags,
      brand,
      colors,
      sizes,
      regularPrice,
      salePrice,
      stock,
      warranty,
      customSpecification,
      customProperties,
      cashOnDelivery,
      discountCodes,
      sku,
      barcode,
      weight,
      dimensions,
      shipping,
      seo
    } = req.body;

    if (
      !title ||
      !slug ||
      !category ||
      !shortDescription ||
      !detailedDescription ||
      !image ||
      regularPrice == null
    ) {
      res.status(400).json({ message: 'Missing required fields' });
    }

    const exists = await Product.findOne({ slug });
    if (exists) {
    res.status(400).json({ message: 'Product already exists' });
    }

    const sellerObjectId = new Types.ObjectId(String(sellerId));
    const shopObjectId = new Types.ObjectId(String(shopId));

    // 1️⃣ Create main image
    const newImage = await createImage(
      { url: image.url, fileId: image.fileId },
      sellerObjectId,
      { shopId: shopObjectId }
    );

    // 2️⃣ Create gallery images ONLY if more than 1 and not duplicate of main image
    let galleryImages: Types.ObjectId[] = [];
if (gallery && gallery.length > 1) {
  galleryImages = await Promise.all(
    (gallery as { url: string; fileId: string }[])
      .filter((img) => img.url !== image.url) // skip main image if same
      .map(async (img) => {
        const imgDoc = await createImage(
          { url: img.url, fileId: img.fileId },
          sellerObjectId,
          { shopId: shopObjectId }
        );
        return imgDoc._id;
      })
  );
}

    console.log('newImage:', newImage);
    console.log('galleryImages:', galleryImages);

    // 3️⃣ Create product with main image and gallery images
    const product = await Product.create({
      title,
      slug,
      category,
      subcategory,
      shortDescription,
      detailedDescription,
      image: newImage._id,
      gallery: galleryImages,
      tags,
      brand,
      colors,
      sizes,
      regularPrice,
      salePrice,
      stock,
      warranty,
      customSpecification,
      customProperties,
      cashOnDelivery,
      discountCodes,
      sku,
      barcode,
      weight,
      dimensions,
      shipping,
      seo,
      sellerId: sellerObjectId,
      shopId: shopObjectId,
      status: 'active',
      isDeleted: false,
      views: 0,
      favoritesCount: 0,
      orderCount: 0
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getShopProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ shopId: req.user?.shop, status: 'active', isDeleted: false });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

// delete product
export const deleteProduct = async (
  req: SellerRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?._id;

    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized seller' });
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    }

    if (String(product?.sellerId ) !== String(sellerId)) {
      res.status(403).json({ message: 'You are not allowed to delete this product' });
    }

    // Soft delete: mark inactive & schedule deletion after 24 hours
    await Product.updateOne(
      { _id: id },
      {
        status: 'inactive',
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    );

    res.status(200).json({
      message: 'Product marked for deletion and will be removed after 24 hours'
    });
  } catch (error) {
    next(error);
  }
};

// restore product
export const restoreProduct = async (
  req: SellerRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?._id;

    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized seller' });
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    }

    if (String(product?.sellerId ) !== String(sellerId)) {
      res.status(403).json({ message: 'You are not allowed to restore this product' });
    }
    //restore product
    await Product.updateOne(
      { _id: id },
      {
        status: 'active',
        isDeleted: false,
        deletedAt: null
      }
    );

    res.status(200).json({
      message: 'Product restored successfully'
    });
  } catch (error) {
    next(error);
  }
  }

  //get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    const type = req.query.type as string;

    const now = new Date();

    const filter = {
      status: 'active',
      isDeleted: false,
      $or: [
        { startingDate: { $exists: false } },
        {
          startingDate: { $lte: now },
          endingDate: { $gte: now }
        }
      ]
    };

    let sort: any = { createdAt: -1 };

    switch (type) {
      case 'popular':
        sort = { views: -1 };
        break;

      case 'top-rated':
        sort = { 'ratings.average': -1 };
        break;

      case 'featured':
        sort = { featured: -1, createdAt: -1 };
        break;

      case 'top10':
        sort = { orderCount: -1, views: -1 };
        limit = 10;
        page = 1;
        break;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(`
          title slug image gallery
          regularPrice salePrice
          ratings stock sizes
          featured orderCount views
          shopId
        `)
        .populate('image', 'url')

        // 🏪 Shop + Seller
        .populate({
          path: 'shopId',
          select: `
            name slug category
            rating totalReviews
            isVerifiedShop isFeatured
            logo
          `,
          populate: {
            path: 'seller',
            select: `
              name
              averageRating
              isVerified
              avatar
            `
          }
        })

        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter)
    ]);

    res.json({
      data: products,
      ...(type !== 'top10' && {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    });
  } catch (err) {
    next(err);
  }
};

// get product details by slug
export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const now = new Date();

    const product = await Product.findOne({
      slug,
      status: 'active',
      isDeleted: false,
      $or: [
        { startingDate: { $exists: false } },
        {
          startingDate: { $lte: now },
          endingDate: { $gte: now }
        }
      ]
    })
      .populate('image') // product main image
      .populate('gallery') // product gallery images

      // Full shop + nested seller (sanitized)
      .populate({
        path: 'shopId',
        populate: [
          // Shop media refs
          { path: 'avatar' },
          { path: 'coverBanner' },
          { path: 'logo' },
          { path: 'gallery' },

          // Shop seller (exclude sensitive/private fields)
          {
            path: 'seller',
            select: `
              -password
              -verificationDocuments
              -paymentDetails
              -stripeAccountId
              -paystackCustomerCode
              -flutterwaveMerchantId
              -deactivationReason
            `,
            populate: [{ path: 'avatar' }]
          }
        ]
      })

      // Optional: top-level sellerId on Product (also sanitized)
      .populate({
        path: 'sellerId',
        select: `
          -password
          -verificationDocuments
          -paymentDetails
          -stripeAccountId
          -paystackCustomerCode
          -flutterwaveMerchantId
          -deactivationReason
        `,
        populate: [{ path: 'avatar' }]
      })

      .lean();

    if (!product) {
      res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

// get filtered products
const MAX_LIMIT = 100;

const toArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((v) => String(v).split(','))
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

const toBool = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const v = String(value).toLowerCase();
  if (['true', '1', 'yes'].includes(v)) return true;
  if (['false', '0', 'no'].includes(v)) return false;
  return undefined;
};

const toNumber = (value: unknown, fallback?: number): number | undefined => {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const getFilteredProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      // filtering
      q,
      categories,
      brands,
      colors,
      sizes,
      tags,
      shopId,
      sellerId,
      featured,
      cashOnDelivery,
      inStock,
      minRating,
      minDiscountPercent,

      // pricing
      minPrice,
      maxPrice,
      priceRange, // supports "100,1000"

      // pagination & sorting
      sortBy = 'newest',
      page = '1',
      limit = '20'
    } = req.query;

    // -----------------------------
    // Parse & sanitize query params
    // -----------------------------
    const parsedPage = Math.max(1, toNumber(page, 1) || 1);
    const parsedLimit = Math.min(
      MAX_LIMIT,
      Math.max(1, toNumber(limit, 20) || 20)
    );
    const skip = (parsedPage - 1) * parsedLimit;

    const parsedCategories = toArray(categories);
    const parsedBrands = toArray(brands);
    const parsedColors = toArray(colors);
    const parsedSizes = toArray(sizes);
    const parsedTags = toArray(tags);

    // price parsing (supports minPrice/maxPrice OR priceRange=10,500)
    let parsedMinPrice = toNumber(minPrice, 0) ?? 0;
    let parsedMaxPrice = toNumber(maxPrice, 10_000_000) ?? 10_000_000;

    if (priceRange) {
      const [min, max] = String(priceRange)
        .split(',')
        .map((n) => Number(n.trim()));

      if (Number.isFinite(min)) parsedMinPrice = min;
      if (Number.isFinite(max)) parsedMaxPrice = max;
    }

    if (parsedMinPrice > parsedMaxPrice) {
      [parsedMinPrice, parsedMaxPrice] = [parsedMaxPrice, parsedMinPrice];
    }

    const parsedFeatured = toBool(featured);
    const parsedCOD = toBool(cashOnDelivery);
    const parsedInStock = toBool(inStock);
    const parsedMinRating = Math.max(0, Math.min(5, toNumber(minRating, 0) || 0));
    const parsedMinDiscountPercent = Math.max(
      0,
      Math.min(100, toNumber(minDiscountPercent, 0) || 0)
    );

    // -----------------------------
    // Base filter
    // -----------------------------
    const now = new Date();

    const filter: Record<string, any> = {
      status: 'active',
      isDeleted: false,
      $or: [
        { startingDate: { $exists: false } },
        {
          startingDate: { $lte: now },
          endingDate: { $gte: now }
        }
      ]
    };

    // Search (title, brand, tags, descriptions)
    if (q && String(q).trim()) {
      const term = String(q).trim();
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { slug: { $regex: term, $options: 'i' } },
          { brand: { $regex: term, $options: 'i' } },
          { category: { $regex: term, $options: 'i' } },
          { tags: { $in: [new RegExp(term, 'i')] } },
          { shortDescription: { $regex: term, $options: 'i' } },
          { detailedDescription: { $regex: term, $options: 'i' } }
        ]
      });
    }

    // Category / Brand / Tags
    if (parsedCategories.length) {
      filter.category = { $in: parsedCategories };
    }

    if (parsedBrands.length) {
      filter.brand = { $in: parsedBrands };
    }

    if (parsedTags.length) {
      filter.tags = { $in: parsedTags };
    }

    // Colors - your schema has colors[].name and colors[].hexCode and available
    if (parsedColors.length) {
      filter.colors = {
        $elemMatch: {
          available: true,
          $or: [
            { name: { $in: parsedColors } },
            { hexCode: { $in: parsedColors } }
          ]
        }
      };
    }

    // Sizes - your schema has sizes[].size, sizes[].available, sizes[].stock
    if (parsedSizes.length) {
      filter.sizes = {
        $elemMatch: {
          size: { $in: parsedSizes },
          available: true
        }
      };
    }

    // Stock
    if (parsedInStock === true) {
      filter.stock = { $gt: 0 };
    } else if (parsedInStock === false) {
      filter.stock = { $lte: 0 };
    }

    // Flags
    if (parsedFeatured !== undefined) {
      filter.featured = parsedFeatured;
    }

    if (parsedCOD !== undefined) {
      filter.cashOnDelivery = parsedCOD;
    }

    // Ratings
    if (parsedMinRating > 0) {
      filter['ratings.average'] = { $gte: parsedMinRating };
    }

    // Shop/Seller IDs
    if (shopId && mongoose.Types.ObjectId.isValid(String(shopId))) {
      filter.shopId = new mongoose.Types.ObjectId(String(shopId));
    }

    if (sellerId && mongoose.Types.ObjectId.isValid(String(sellerId))) {
      filter.sellerId = new mongoose.Types.ObjectId(String(sellerId));
    }

    // Price filtering (modern approach using effective price)
    // If salePrice exists and > 0 use it; else regularPrice
    filter.$and = filter.$and || [];
    filter.$and.push({
      $expr: {
        $and: [
          {
            $gte: [
              {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$salePrice', null] },
                      { $gt: ['$salePrice', 0] }
                    ]
                  },
                  '$salePrice',
                  '$regularPrice'
                ]
              },
              parsedMinPrice
            ]
          },
          {
            $lte: [
              {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$salePrice', null] },
                      { $gt: ['$salePrice', 0] }
                    ]
                  },
                  '$salePrice',
                  '$regularPrice'
                ]
              },
              parsedMaxPrice
            ]
          }
        ]
      }
    });

    // Optional discount filter (requires both prices)
    if (parsedMinDiscountPercent > 0) {
      filter.$and.push({
        $expr: {
          $and: [
            { $gt: ['$regularPrice', 0] },
            { $gt: ['$regularPrice', '$salePrice'] },
            {
              $gte: [
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ['$regularPrice', '$salePrice'] },
                        '$regularPrice'
                      ]
                    },
                    100
                  ]
                },
                parsedMinDiscountPercent
              ]
            }
          ]
        }
      });
    }

    // Clean up if no AND conditions
    if (!filter.$and.length) delete filter.$and;

    // -----------------------------
    // Sorting
    // -----------------------------
    let sort: Record<string, 1 | -1> = { createdAt: -1 };

    switch (String(sortBy)) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price-asc':
        // fallback sort; exact effective-price sorting is better done via aggregation
        sort = { salePrice: 1, regularPrice: 1, createdAt: -1 };
        break;
      case 'price-desc':
        sort = { salePrice: -1, regularPrice: -1, createdAt: -1 };
        break;
      case 'popular':
        sort = { views: -1, orderCount: -1, createdAt: -1 };
        break;
      case 'best-selling':
        sort = { orderCount: -1, totalSold: -1, createdAt: -1 };
        break;
      case 'top-rated':
        sort = { 'ratings.average': -1, 'ratings.count': -1, createdAt: -1 };
        break;
      case 'featured':
        sort = { featured: -1, createdAt: -1 };
        break;
      case 'discount':
        // approximation with salePrice/regularPrice
        sort = { regularPrice: -1, salePrice: 1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // -----------------------------
    // Query execution
    // -----------------------------
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('image')
        .populate('gallery')
        .populate({
          path: 'shopId',
          populate: [
            { path: 'avatar' },
            { path: 'coverBanner' },
            { path: 'logo' },
            { path: 'gallery' },
            {
              path: 'seller',
              select: `
                -password
                -verificationDocuments
                -paymentDetails
                -stripeAccountId
                -paystackCustomerCode
                -flutterwaveMerchantId
                -deactivationReason
              `,
              populate: [{ path: 'avatar' }]
            }
          ]
        })
        .populate({
          path: 'sellerId',
          select: `
            -password
            -verificationDocuments
            -paymentDetails
            -stripeAccountId
            -paystackCustomerCode
            -flutterwaveMerchantId
            -deactivationReason
          `,
          populate: [{ path: 'avatar' }, { path: 'shop' }]
        })
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      Product.countDocuments(filter)
    ]);

    // -----------------------------
    // Facets (for modern frontend filters)
    // Lightweight counts from current result page + full query stats summary
    // -----------------------------
    const categoryCounts = new Map<string, number>();
    const brandCounts = new Map<string, number>();

    for (const p of products) {
      if (p.category) {
        categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
      }
      if (p.brand) {
        brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
      }
    }

    const facets = {
      categories: Array.from(categoryCounts.entries()).map(([value, count]) => ({
        value,
        count
      })),
      brands: Array.from(brandCounts.entries()).map(([value, count]) => ({
        value,
        count
      }))
    };

     res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: parsedPage * parsedLimit < total,
        hasPrevPage: parsedPage > 1
      },
      sort: String(sortBy),
      appliedFilters: {
        q: q ? String(q) : undefined,
        price: { min: parsedMinPrice, max: parsedMaxPrice },
        categories: parsedCategories,
        brands: parsedBrands,
        colors: parsedColors,
        sizes: parsedSizes,
        tags: parsedTags,
        shopId: shopId ? String(shopId) : undefined,
        sellerId: sellerId ? String(sellerId) : undefined,
        featured: parsedFeatured,
        cashOnDelivery: parsedCOD,
        inStock: parsedInStock,
        minRating: parsedMinRating,
        minDiscountPercent: parsedMinDiscountPercent
      },
      facets
    });
  } catch (error) {
    next(error);
  }
};


// get filtered offers
// get filtered offers (Discounts)
// NOTE: function name kept as getFilteredEvents to match your existing route usage.
// Recommended rename: getFilteredDiscounts or getFilteredOffers
export const getFilteredEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      q = '',
      discountType = [], // percentage,fixed
      sellerId,
      isActive,
      validity = 'all', // all | valid | expired | expiring-soon | no-expiry
      valueRange = '0,10000000', // e.g. "10,500"
      minValue,
      maxValue,
      expiresAfter,
      expiresBefore,
      page = 1,
      limit = 20,
      sortBy = 'newest'
    } = req.query;

    // -----------------------------
    // Helpers
    // -----------------------------
    const toArray = (value: unknown): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value
          .flatMap((v) => String(v).split(','))
          .map((v) => v.trim())
          .filter(Boolean);
      }
      return String(value)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    };

    const parseBool = (value: unknown): boolean | undefined => {
      if (value === undefined || value === null || value === '') return undefined;
      const v = String(value).toLowerCase();
      if (['true', '1', 'yes'].includes(v)) return true;
      if (['false', '0', 'no'].includes(v)) return false;
      return undefined;
    };

    // -----------------------------
    // Parse query params
    // -----------------------------
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (parsedPage - 1) * parsedLimit;

    const parsedDiscountTypes = toArray(discountType).map((v) => v.toLowerCase());

    // value range can come from valueRange OR minValue/maxValue
    let parsedMinValue = 0;
    let parsedMaxValue = 10_000_000;

    if (typeof valueRange === 'string') {
      const [min, max] = valueRange.split(',').map(Number);
      if (Number.isFinite(min)) parsedMinValue = min;
      if (Number.isFinite(max)) parsedMaxValue = max;
    }

    if (minValue !== undefined && minValue !== '') {
      const mv = Number(minValue);
      if (Number.isFinite(mv)) parsedMinValue = mv;
    }

    if (maxValue !== undefined && maxValue !== '') {
      const mv = Number(maxValue);
      if (Number.isFinite(mv)) parsedMaxValue = mv;
    }

    if (parsedMinValue > parsedMaxValue) {
      [parsedMinValue, parsedMaxValue] = [parsedMaxValue, parsedMinValue];
    }

    const parsedIsActive = parseBool(isActive);
    const parsedValidity = String(validity).toLowerCase();
    const now = new Date();

    // -----------------------------
    // Build filter
    // -----------------------------
    const filter: Record<string, any> = {
      discountValue: {
        $gte: parsedMinValue,
        $lte: parsedMaxValue
      }
    };

    // Search across public name / code
    if (String(q).trim()) {
      const term = String(q).trim();
      filter.$or = [
        { public_name: { $regex: term, $options: 'i' } },
        { discountCode: { $regex: term, $options: 'i' } },
        { discountType: { $regex: term, $options: 'i' } }
      ];
    }

    // discountType
    if (parsedDiscountTypes.length > 0) {
      filter.discountType = { $in: parsedDiscountTypes };
    }

    // sellerId
    if (sellerId && mongoose.Types.ObjectId.isValid(String(sellerId))) {
      filter.sellerId = new mongoose.Types.ObjectId(String(sellerId));
    }

    // explicit isActive filter
    if (parsedIsActive !== undefined) {
      filter.isActive = parsedIsActive;
    }

    // expiresAt range filters
    if (expiresAfter || expiresBefore) {
      filter.expiresAt = filter.expiresAt || {};

      if (expiresAfter) {
        const d = new Date(String(expiresAfter));
        if (!Number.isNaN(d.getTime())) {
          filter.expiresAt.$gte = d;
        }
      }

      if (expiresBefore) {
        const d = new Date(String(expiresBefore));
        if (!Number.isNaN(d.getTime())) {
          filter.expiresAt.$lte = d;
        }
      }
    }

    // validity presets
    // valid => active + (no expiry OR future expiry)
    // expired => expiry < now
    // expiring-soon => active + expiry within 7 days
    // no-expiry => no expiresAt
    if (parsedValidity === 'valid') {
      filter.$and = filter.$and || [];
      // If user didn't explicitly set isActive, require active for valid
      if (parsedIsActive === undefined) {
        filter.isActive = true;
      }
      filter.$and.push({
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gte: now } }
        ]
      });
    } else if (parsedValidity === 'expired') {
      // expired implies an expiry date in the past
      filter.expiresAt = {
        ...(filter.expiresAt || {}),
        $lt: now
      };
    } else if (parsedValidity === 'expiring-soon') {
      const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (parsedIsActive === undefined) {
        filter.isActive = true;
      }
      filter.expiresAt = {
        ...(filter.expiresAt || {}),
        $gte: now,
        $lte: next7Days
      };
    } else if (parsedValidity === 'no-expiry') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }]
      });
    }

    if (filter.$and && !filter.$and.length) {
      delete filter.$and;
    }

    // -----------------------------
    // Sorting
    // -----------------------------
    let sort: Record<string, 1 | -1> = { createdAt: -1 };

    switch (String(sortBy)) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'highest-value':
        sort = { discountValue: -1, createdAt: -1 };
        break;
      case 'lowest-value':
        sort = { discountValue: 1, createdAt: -1 };
        break;
      case 'code-asc':
        sort = { discountCode: 1 };
        break;
      case 'code-desc':
        sort = { discountCode: -1 };
        break;
      case 'name-asc':
        sort = { public_name: 1 };
        break;
      case 'name-desc':
        sort = { public_name: -1 };
        break;
      case 'expires-soon':
        // null expiresAt values may come first depending on Mongo collation/settings
        sort = { expiresAt: 1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // -----------------------------
    // Execute queries
    // -----------------------------
    const [offers, total] = await Promise.all([
      Discount.find(filter)
        .populate({
          path: 'sellerId',
          select: `
            -password
            -verificationDocuments
            -paymentDetails
            -stripeAccountId
            -paystackCustomerCode
            -flutterwaveMerchantId
            -deactivationReason
          `,
          populate: [{ path: 'avatar' }, { path: 'shop' }]
        })
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Discount.countDocuments(filter)
    ]);

    // -----------------------------
    // Summary / facets (page-level)
    // -----------------------------
    let activeCount = 0;
    let expiredCount = 0;
    let validCount = 0;
    let noExpiryCount = 0;

    const typeCounts = new Map<string, number>();

    for (const offer of offers as any[]) {
      if (offer.discountType) {
        typeCounts.set(
          offer.discountType,
          (typeCounts.get(offer.discountType) || 0) + 1
        );
      }

      const active = offer.isActive === true;
      const hasExpiry = !!offer.expiresAt;
      const expired = hasExpiry
        ? new Date(offer.expiresAt).getTime() < now.getTime()
        : false;

      if (active) activeCount++;
      if (!hasExpiry) noExpiryCount++;
      if (expired) expiredCount++;
      if (active && !expired) validCount++;
    }

   res.status(200).json({
      success: true,
      data: offers,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: parsedPage * parsedLimit < total,
        hasPrevPage: parsedPage > 1
      },
      sort: String(sortBy),
      appliedFilters: {
        q: String(q || ''),
        discountType: parsedDiscountTypes,
        sellerId: sellerId ? String(sellerId) : undefined,
        isActive: parsedIsActive,
        validity: parsedValidity,
        valueRange: {
          min: parsedMinValue,
          max: parsedMaxValue
        },
        expiresAfter: expiresAfter ? String(expiresAfter) : undefined,
        expiresBefore: expiresBefore ? String(expiresBefore) : undefined
      },
      facets: {
        discountTypes: Array.from(typeCounts.entries()).map(([value, count]) => ({
          value,
          count
        })),
        statusSummary: {
          activeOnPage: activeCount,
          validOnPage: validCount,
          expiredOnPage: expiredCount,
          noExpiryOnPage: noExpiryCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};