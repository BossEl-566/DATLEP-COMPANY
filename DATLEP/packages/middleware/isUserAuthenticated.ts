import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@datlep/database";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies.user_accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User token missing",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string; role: "user" };

    if (decoded.role !== "user") {
      res.status(403).json({
        success: false,
        message: "Forbidden: User access only",
      });
      return;
    }

    const user = await User.findById(decoded.id)
      .select("-password")
      .lean();

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
      return;
    }

    req.user = {
      ...user,
      role: "user",
      isUser: true,
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

export default isUserAuthenticated;
