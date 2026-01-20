import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Seller } from "@datlep/database";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isSellerAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken || req.cookies.seller_accessToken || req.headers.authorization?.split(' ')[1];

    console.log('Token in the seller middleware:',token);


    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Seller token missing",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string; role: "seller" };

    if (decoded.role !== "seller") {
      res.status(403).json({
        success: false,
        message: "Forbidden: Seller access only",
      });
      return;
    }

    const seller = await Seller.findById(decoded.id)
      .select("-password")
      .lean();

    if (!seller) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Seller not found",
      });
      return;
    }

    if (!seller.emailVerified) {
      res.status(403).json({
        success: false,
        message: "Please verify your email",
      });
      return;
    }

    req.user = {
      ...seller,
      role: "seller",
      isSeller: true,
    };

    next();
    return;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Access token expired",
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
};

export default isSellerAuthenticated;
