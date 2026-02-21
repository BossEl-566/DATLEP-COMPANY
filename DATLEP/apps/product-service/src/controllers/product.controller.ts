import { Discount,  Product,  SiteConfigModel } from "@datlep/database";
import { Request, Response, NextFunction } from "express";
import { SellerRequest } from '../types/express';
import { createImage } from "../services/image.service";
import { Types } from 'mongoose';



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