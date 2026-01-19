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
import { Seller, Shop, User } from "@datlep/database";
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

// refresh User Token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AuthenticationError("No refresh token provided");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string, role: string };
    if (!decoded || !decoded.id || !decoded.role) {
  return next(new AuthenticationError("Invalid refresh token"));
}

    // let account;
    // if (decoded.role === 'user') 
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return next(new AuthenticationError("User not found"));
    }
    // Generate new access token
    const newAccessToken = jwt.sign({
      id: decoded.id, 
      role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET!, 
      { expiresIn: "15m" }
    ); 

    setCookie(res, 'accessToken', newAccessToken);
    return res.status(200).json({
      success: true });
    
  } catch (error) {
    return next(error);
    
  }
}; 

// get logged in user details
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user; // Assume user is attached to req in isAuthenticated middleware
    if (!user) {
      return next(new AuthenticationError("User not found"));
    }
    res.status(201).json({
      success: true,
      user, });
    
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

// register a new seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      country
    } = req.body;

    if (!name || !email || !password || !phone || !city || !country) {
      return next(
        new ValidationError(
          'Name, email, password, phone, city, and country are required'
        )
      );
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return next(new ValidationError('Seller with this email already exists'));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);

    // 🔐 Send real OTP (email / SMS)
    await sendOtp(name, email, 'seller-activation-mail');

    res.status(200).json({
      success: true,
      message: 'OTP sent to email for verification',
      email
    });
  } catch (error) {
    next(error);
  }
};

// verify seller OTP
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, ...sellerData } = req.body;

    if (!email || !otp || !password) {
      return next(
        new ValidationError('Email, OTP and password are required')
      );
    }

    // ✅ Verify OTP using production system
    await verifyOtp(email, otp, next);
    

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return next(new ValidationError('Seller with this email already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      ...sellerData,
      email,
      password: hashedPassword,
      phoneNumber: sellerData.phone,
      emailVerified: true,
      isVerified: false,
      verificationStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully',
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        sellerType: seller.sellerType
      },
      
    });
  } catch (error) {
    next(error);
  }
};

// Create a new shop for seller
// export const createShop = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {
//       name,
//       bio,
//       category,
//       seller,
//       address,
//       openingHours,
//       shopType,
//       timezone,
//       website,
//       socialLinks
//     } = req.body;

//     if (!name || !bio || !category || !seller || !address?.city || !address?.country || !openingHours || openingHours.length === 0) {
//       return next(new ValidationError("All fields are required to create a shop"));
//     }

//     const shop = await Shop.create({
//       name,
//       bio,
//       category,
//       seller,
//       address: {
//         city: address.city,
//         country: address.country,
//         street: address.street || '',
//         state: address.state || '',
//         postalCode: address.postalCode || '',
//         coordinates: address.coordinates || { type: 'Point', coordinates: [0, 0] }
//       },
//       openingHours,
//       shopType: shopType || 'both',
//       timezone: timezone || '',
//       website: website || '',
//       socialLinks: socialLinks || []
//     });

  

//     res.status(201).json(shop);
//   } catch (error) {
//     next(error);
//   }
// };







// Create a new shop for seller
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    


    const {
      name,
      bio,
      category,
      address,
      openingHours,
      shopType = 'both',
      timezone = 'Africa/Lagos',
      website,
      socialLinks = [],
      businessRegistration,
      yearsInBusiness,
      specialties = [],
      portfolioLink,
      returnPolicy,
      shippingPolicy,
      customOrderPolicy,
      privacyPolicy,
      sellerId
    } = req.body;

    // Required field validation
    if (!name || !bio || !category || !address?.city || !address?.country) {
      return next(new ValidationError("Name, bio, category, city and country are required"));
    }

    // Validate opening hours
    if (!openingHours || openingHours.length === 0) {
      return next(new ValidationError("Opening hours are required"));
    }

    // Check if seller already has a shop
    const existingShop = await Shop.findOne({ seller: sellerId });
    if (existingShop) {
      return next(new ValidationError("You already have a shop"));
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if slug is unique
    const slugExists = await Shop.findOne({ slug });
    if (slugExists) {
      return next(new ValidationError("A shop with similar name already exists. Please choose a different name."));
    }

    // Create shop
    const shop = await Shop.create({
      name,
      slug,
      bio,
      category,
      seller: sellerId,
      address: {
        city: address.city,
        country: address.country,
        street: address.street || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        coordinates: address.coordinates || { type: 'Point', coordinates: [0, 0] }
      },
      openingHours,
      shopType,
      timezone,
      website: website || '',
      socialLinks,
      businessRegistration,
      yearsInBusiness: yearsInBusiness || '<1',
      specialties,
      portfolioLink,
      returnPolicy,
      shippingPolicy,
      customOrderPolicy,
      privacyPolicy
    });

    // Update seller with shop reference
    await Seller.findByIdAndUpdate(sellerId, { shop: shop._id });

    res.status(201).json({
      message: "Shop created successfully",
      shop: {
        id: shop._id,
        name: shop.name,
        slug: shop.slug,
        category: shop.category,
        shopType: shop.shopType,
        address: shop.address
      }
    });
  } catch (error) {
    
    next(error);
  }
};










