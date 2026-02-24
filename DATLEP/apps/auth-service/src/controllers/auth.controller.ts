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
import { Seller, Shop, User, BespokeCreator } from "@datlep/database";
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
    setCookie(req, res, 'user_refreshToken', refreshToken);
    setCookie(req, res, 'user_accessToken', accessToken);

    
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

// refresh Token
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

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: "user" | "seller" };

    if (!decoded?.id || !decoded?.role) {
      throw new AuthenticationError("Invalid refresh token");
    }

    let account;

    if (decoded.role === "seller") {
      account = await Seller.findById(decoded.id).lean();
      if (!account) {
        throw new AuthenticationError("Seller not found");
      }
    } else if (decoded.role === "user") {
      account = await User.findById(decoded.id).lean();
      if (!account) {
        throw new AuthenticationError("User not found");
      }
    } else {
      throw new AuthenticationError("Invalid role");
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    setCookie(req, res, "accessToken", newAccessToken);

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    return next(error);
  }
};

// Logout User
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("user_refreshToken");
    res.clearCookie("user_accessToken");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
}


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

export const skipPaymentSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId, shopId } = req.body 
    
    // Validate required fields
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required'
      });
    }

    const seller = await Seller.findById(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Check if payment is already set up
    if (seller.isPaymentSetup) {
      return res.status(400).json({
        success: false,
        message: 'Payment is already set up. Please disconnect first if you want to skip.'
      });
    }

    // Update seller payment status
    const updateData: any = {
      isPaymentSetup: false,
      bankType: 'skipped',
      updatedAt: new Date()
    };

    // Optionally clear existing payment details if they exist
    if (seller.paymentDetails || seller.flutterwaveMerchantId || 
        seller.paystackCustomerCode || seller.stripeAccountId) {
      updateData.paymentDetails = null;
      updateData.flutterwaveMerchantId = null;
      updateData.paystackCustomerCode = null;
      updateData.stripeAccountId = null;
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      updateData,
      { new: true }
    ).select('-password'); // Exclude password from response

    // If shopId is provided, also update shop status
    let updatedShop = null;
    if (shopId) {
      try {
        updatedShop = await Shop.findByIdAndUpdate(
          shopId,
          {
            isPaymentSetup: false,
            paymentStatus: 'skipped',
            updatedAt: new Date()
          },
          { new: true }
        );
      } catch (shopError) {
        console.warn('Could not update shop payment status:', shopError);
        // Continue even if shop update fails
      }
    }

    // Log the action (optional)
    console.log(`Payment setup skipped for seller: ${sellerId}, shop: ${shopId || 'N/A'}`);

    return res.status(200).json({
      success: true,
      message: 'Payment setup skipped successfully. You can set it up later in your dashboard.',
      data: {
        seller: updatedSeller,
        shop: updatedShop,
        isPaymentSetup: false,
        skippedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
  console.error('Error skipping payment setup:', {
    error: error.message,
    stack: error.stack,
    body: req.body
  });

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid seller ID format'
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map((err: any) => err.message)
    });
  }

  return next(error); // ✅ FIX
}
}

// paystack setup
export const paystackSetup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sellerId } = req.body;

    // 1. Validate input
    if (!sellerId) {
      res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
      return;
    }

    // 2. Find seller
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      res.status(404).json({
        success: false,
        message: "Seller not found"
      });
      return;
    }

    // 3. Prevent duplicate setup
    if (seller.isPaymentSetup) {
      res.status(400).json({
        success: false,
        message: "Payment method already set up"
      });
      return;
    }

    // 4. Generate Paystack Connect OAuth URL
    const redirectUrl =
      "https://connect.paystack.com/oauth/authorize?" +
      `response_type=code` +
      `&client_id=${process.env.PAYSTACK_PUBLIC_KEY}` +
      `&redirect_uri=${process.env.PAYSTACK_CALLBACK_URL}` +
      `&scope=integration` +
      `&state=${seller._id}`;

    // 5. Respond to frontend
    res.status(200).json({
      success: true,
      provider: "paystack",
      redirectUrl
    });
    return;

  } catch (error) {
    return next(error);
  }
};

// login seller
export const sellerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    } 
    
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return next(new AuthenticationError("Invalid email or password"));
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, seller.password!);
    if (!isMatch) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    // Check if seller is verified/active
    if (!seller.emailVerified) {
      return next(new AuthenticationError("Please verify your email first"));
    }

    // Generate access and refresh tokens 
    const accessToken = jwt.sign({
      id: seller._id, 
      email: seller.email,
      role: 'seller'
    }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

    const refreshToken = jwt.sign({
      id: seller._id, 
      email: seller.email,
      role: 'seller'
    }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

    // Send tokens in response
    
    setCookie(req, res, 'seller_refreshToken', refreshToken);
    setCookie(req, res, 'seller_accessToken', accessToken);


console.log("SETTING SELLER COOKIES");

    
    res.status(200).json({
      success: true,
      message: "Login successful",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        sellerType: seller.sellerType,
        shopId: seller.shop,
        isVerified: seller.isVerified,
        emailVerified: seller.emailVerified,
        verificationStatus: seller.verificationStatus
      },
      token: accessToken // Also send in response for frontend storage
    });

  } catch (error) {
    return next(error); 
  }
};

// get logged in seller
export const getLoggedInSeller = async (
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
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// seller refresh token 
export const refreshSellerToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.seller_refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No seller refresh token provided" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; role: "seller" };

    if (decoded.role !== "seller") {
      res.status(403).json({ message: "Invalid seller refresh token" });
      return;
    }

    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      res.status(401).json({ message: "Seller not found" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    setCookie(req, res, "seller_accessToken", newAccessToken);


    res.status(200).json({ success: true });
    return;
  } catch (error) {
    next(error);
  }
};


// Register a new bespoke creator
export const sendBespokeCreatorOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return next(
        new ValidationError("Name, email, password, and phone number are required")
      );
    }

    // Check if creator already exists
    const existingCreator = await BespokeCreator.findOne({ email }).lean();
    if (existingCreator) {
      return next(new ValidationError("Email already in use as a creator"));
    }

    // OTP handling
    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "bespoke-activation-mail");

    res.status(200).json({
      success: true,
      message: "OTP sent to email for verification",
      email
    });
  } catch (error) {
    next(error);
  }
};


// Verify bespoke creator OTP
export const verifyBespokeCreatorOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      otp,
      password,
      phoneNumber,
      country,
      city,
      creatorType
    } = req.body;

    // ✅ REQUIRED FIELDS (explicit)
    if (
      !name ||
      !email ||
      !otp ||
      !password ||
      !country ||
      !creatorType
    ) {
      return next(
        new ValidationError(
          "Name, email, OTP, password, country and creator type are required"
        )
      );
    }

    // ✅ Verify OTP
    await verifyOtp(email, otp, next);

    // ✅ Prevent duplicate accounts
    const existingCreator = await BespokeCreator.findOne({ email });
    if (existingCreator) {
      return next(
        new ValidationError("Email already in use as a creator")
      );
    }

    // ✅ Hash PASSWORD (never OTP)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create creator (WHITELISTED fields only)
    const creator = await BespokeCreator.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      country,
      city,
      creatorType,

      // defaults
      emailVerified: true,
      phoneVerified: false,
      isVerified: false,
      verificationStatus: "pending",
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        phoneNumber: creator.phoneNumber,
        country: creator.country,
        city: creator.city,
        creatorType: creator.creatorType,
        emailVerified: creator.emailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};



const ALLOWED_CREATOR_UPDATES = [
  "businessName",
  "tagline",
  "bio",
  "specialization",
  "experience",
  "yearsOfExperience",
  "skills",
  "techniques",
  "materialsExpertise",
  "portfolio",
  "services",
  "customizationOptions",
  "pricingModel",
  "minimumOrderValue",
  "depositPercentage",
  "responseTime",
  "consultationHours",
  "languages",
  "workshopLocation",
  "shippingOptions",
  "measurementGuide",
  "fittingOptions",
  "paymentMethods",
  "preferredCurrency",
  "vacationMode"
];
const sanitizeUpdate = (body: any, allowed: string[]) => {
  return Object.keys(body)
    .filter((key) => allowed.includes(key))
    .reduce((obj: any, key) => {
      obj[key] = body[key];
      return obj;
    }, {});
};


// update bespoke creator
export const updateBespokeCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateData = sanitizeUpdate(
      req.body,
      ALLOWED_CREATOR_UPDATES
    );

    if (!Object.keys(updateData).length) {
      return next(new ValidationError("No valid fields to update"));
    }

    const creator = await BespokeCreator.findOneAndUpdate(
      { user: req.user.id }, // 🔐 bound to authenticated user
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!creator) {
      return next(new ValidationError("Bespoke creator not found"));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      creator
    });
  } catch (err) {
    next(err);
  }
};


// Login bespoke creator
export const loginBespokeCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    }

    // 2️⃣ Find creator (explicitly select password)
    const creator = await BespokeCreator.findOne({ email })
      .select("+password");

    if (!creator) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    // 3️⃣ Check account status
    if (!creator.isActive) {
      return next(new AuthenticationError("Account is deactivated"));
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) {
      return next(new AuthenticationError("Invalid email or password"));
    }

    // 5️⃣ Update last login
    creator.lastLogin = new Date();
    await creator.save();

    // 6️⃣ Generate tokens
    const accessToken = jwt.sign(
      {
        id: creator._id,
        role: "bespoke-creator"
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: creator._id,
        role: "bespoke-creator"
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // 7️⃣ Set cookies (httpOnly recommended)
    setCookie(req, res, "bespoke_accessToken", accessToken);
    setCookie(req, res, "bespoke_refreshToken", refreshToken);

    // 8️⃣ Respond
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: accessToken,
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        phoneNumber: creator.phoneNumber,
        creatorType: creator.creatorType,
        country: creator.country,
        city: creator.city,
        isVerified: creator.isVerified,
        emailVerified: creator.emailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};


// Get logged in bespoke creator
export const getLoggedInCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user; // Assume user is attached to req in isAuthenticated middleware
    if (!user) {
      return next(new AuthenticationError("Creator not found"));
    }
    
    // Get bespoke creator details
    const creator = await BespokeCreator.findOne({ user: user.id })
      .populate('user', 'name email')
      .lean();
    
    if (!creator) {
      return next(new AuthenticationError("Creator profile not found"));
    }
    
    res.status(200).json({
      success: true,
      creator
    });
  } catch (error) {
    return next(error);
  }
};

// Bespoke creator refresh token 
export const refreshBespokeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.bespoke_refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No bespoke creator refresh token provided" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { id: string; userId: string; role: "bespoke-creator" };

    if (decoded.role !== "bespoke-creator") {
      res.status(403).json({ message: "Invalid bespoke creator refresh token" });
      return;
    }

    const creator = await BespokeCreator.findById(decoded.id);
    if (!creator) {
      res.status(401).json({ message: "Bespoke creator not found" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: creator._id, userId: decoded.userId, role: "bespoke-creator" },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    setCookie(req, res, "bespoke_accessToken", newAccessToken);

    res.status(200).json({ success: true });
    return;
  } catch (error) {
    next(error);
  }
};

// Forgot Password for bespoke creator
export const bespokeForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await handleForgotPassword(req, res, next, 'bespoke');
  } catch (error) {
    return next(error);
  }
}

// Verify for Reset OTP for bespoke creator
export const verifyBespokeForgotPassword = async (
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

// Reset Password for bespoke creator
export const resetBespokePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("Email and new password are required"));
    }
    
    // Find user with bespoke-creator role
    const user = await User.findOne({ email, role: 'bespoke-creator' });
    if (!user) {
      return next(new ValidationError("Bespoke creator with this email does not exist"));
    }
    
    // Compare new password with old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(new ValidationError("New password cannot be the same as the old password"));
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email, role: 'bespoke-creator' }, { password: hashedPassword });
    
    // Send confirmation email
    try {
      // const creator = await BespokeCreator.findOne({ email });
      await sendPasswordResetConfirmation(email, user.name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the whole request if email fails
    }
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    return next(error);
  }
};

// get logged in bespoke creator details
export const getBespokeCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user; // Assume user is attached to req in isAuthenticated middleware
    if (!user) {
      return next(new AuthenticationError("Bespoke creator not found"));
    }
    
    const creator = await BespokeCreator.findById(user._id);
    if (!creator) {
      return next(new AuthenticationError("Bespoke creator not found"));
    }
    
    res.status(200).json({
      success: true,
      creator
    });
  } catch (error) {
    return next(error);
  }
};


