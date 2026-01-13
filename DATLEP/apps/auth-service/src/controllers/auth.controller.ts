import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import {
  checkOtpRestriction,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData
} from "../utils/auth.helper";
import { User } from "@datlep/database";

// Register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate incoming data
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return next(new ValidationError("Email already in use"));
    }

    // OTP handling
    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to email for verification"
    });
  } catch (error) {
    return next(error);
  }
};
