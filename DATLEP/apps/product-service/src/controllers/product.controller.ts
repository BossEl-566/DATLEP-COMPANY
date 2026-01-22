import { Discount, SiteConfigModel } from "@datlep/database";
import { Request, Response, NextFunction } from "express";
import { SellerRequest } from '../types/express';


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

    if (discountCode.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Discount.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ message: 'Discount code deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

