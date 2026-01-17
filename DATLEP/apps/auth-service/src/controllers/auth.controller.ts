import { Request, Response, NextFunction } from "express";
import { AuthenticationError, ValidationError } from "../../../../packages/error-handler";
import {
  checkOtpRestriction,
  handleForgotPassword,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp
} from "../utils/auth.helper";
import { User } from "@datlep/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
import { sendPasswordResetConfirmation } from "../utils/sendMail";

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

    // OTP handling - these will throw errors if restrictions exist
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
    
    // Hash password and create user
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

// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const { email, password } = req.body;
   if (!email || !password) {
    return next(new ValidationError("Email and password are required"));
   } 
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AuthenticationError("User not found"));
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new AuthenticationError("Invalid credentials"));
    }

    // Generate access and refresh tokens 
    const accessToken = jwt.sign({
      id: user.id, 
      role: 'user'
    }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

    const refreshToken = jwt.sign({
      id: user.id, 
      role: 'user'
    }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

    // Send tokens in response
    setCookie(res, 'refreshToken', refreshToken);
    setCookie(res, 'accessToken', accessToken);
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
   return next(error); 
  }
}; 

// Forgot Password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgotPassword(req, res, next, 'user');
  } catch (error) {
    return next(error);
  }
}

// Verify for Reset OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await verifyForgotPasswordOtp(req, res, next);
  } catch (error) {
    return next(error);
  }
}

// Reset Password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("Email and new password are required"));
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ValidationError("User with this email does not exist"));
    }
    
    // Compare new password with old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(new ValidationError("New password cannot be the same as the old password"));
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    
    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(email, user.name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the whole request if email fails
    }
    
    res.status(200).json({
      message: "Password reset successfully"
    });
  } catch (error) {
    return next(error);
  }
};