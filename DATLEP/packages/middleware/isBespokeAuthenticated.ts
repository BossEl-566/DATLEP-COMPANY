import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BespokeCreator } from "@datlep/database"; // adjust path if needed

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isBespokeCreatorAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1️⃣ Read token (cookie first, then Authorization header)
    const token =
      req.cookies.bespoke_accessToken ||
      req.cookies.accessToken ||
      req.headers.authorization?.split(" ")[1];

    console.log("Token in bespoke middleware:", token);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Bespoke creator token missing",
      });
      return;
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string; role: "bespoke-creator" };

    if (decoded.role !== "bespoke-creator") {
      res.status(403).json({
        success: false,
        message: "Forbidden: Bespoke creator access only",
      });
      return;
    }

    // 3️⃣ Fetch creator
    const creator = await BespokeCreator.findById(decoded.id)
      .select("-password")
      .lean();

    if (!creator) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Creator not found",
      });
      return;
    }

    // 4️⃣ Optional checks (keep what matches your flow)
    if (!creator.emailVerified) {
      res.status(403).json({
        success: false,
        message: "Please verify your email",
      });
      return;
    }

    if (!creator.isActive) {
      res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
      return;
    }

    // 5️⃣ Attach creator to request
    req.user = {
      ...creator,
      role: "bespoke-creator",
      isBespokeCreator: true,
    };

    next();
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
  }
};

export default isBespokeCreatorAuthenticated;
