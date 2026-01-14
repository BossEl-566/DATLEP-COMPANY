import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import {
  checkOtpRestriction,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp
} from "../utils/auth.helper";
import { User } from "@datlep/database";
import bcrypt from "bcryptjs";

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

// Verify User OTP
export const verifyUserOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body; 
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required"));
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return next(new ValidationError("Email already in use"));
    }

    await verifyOtp(email, otp, next);
    //hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
      
    
  } catch (error) {
    return next(error);
  }
}