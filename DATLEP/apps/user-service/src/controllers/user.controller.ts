import { Address } from "@datlep/database";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";


export const createUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { userId } = req.params;

    const {
      label,
      recipientName,
      phone,
      country,
      state,
      city,
      area,
      addressLine1,
      addressLine2,
      postalCode,
      addressType,
      isDefault,
    } = req.body;

    // Validate required fields
    if (!recipientName || !phone || !country || !city || !addressLine1) {
    res.status(400).json({ error: "Missing required fields" });
    }

    session.startTransaction();

    // Check if user already has addresses
    const existingCount = await Address.countDocuments({
      user: userId,
      isActive: true,
    }).session(session);

    // Make first address default automatically (optional but recommended)
    const shouldBeDefault = existingCount === 0 ? true : Boolean(isDefault);

    // If new address is default, unset previous defaults for this user
    if (shouldBeDefault) {
      await Address.updateMany(
        { user: userId, isDefault: true },
        { $set: { isDefault: false } },
        { session }
      );
    }

    // Save address to database
    const newAddress = await Address.create(
      [
        {
          user: userId,
          label: label ?? "home",
          recipientName,
          phone,
          country,
          state,
          city,
          area,
          addressLine1,
          addressLine2,
          postalCode,
          addressType: addressType ?? "shipping",
          isDefault: shouldBeDefault,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Address created successfully",
      address: newAddress[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getUserAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({
      user: userId,
      isActive: true,
    }).sort({ isDefault: -1, createdAt: -1 }); // default first, newest next

     res.status(200).json({
      message: "Addresses fetched successfully",
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

// GET /users/:userId/addresses/:addressId
export const getSingleUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      res.status(400).json({ error: "Invalid address ID" });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      isActive: true,
    });

    if (!address) {
    res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({
      message: "Address fetched successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
};


// Soft delete: sets isActive = false
// If deleted address was default, promote another active address as default
export const deleteUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { userId, addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
     res.status(400).json({ error: "Invalid address ID" });
    }

    session.startTransaction();

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      isActive: true,
    }).session(session);

    if (!address) {
      await session.abortTransaction();
      res.status(404).json({ error: "Address not found" });
    }

    const wasDefault = address.isDefault;

    // Soft delete and remove default flag from deleted record
    address.isActive = false;
    address.isDefault = false;
    await address.save({ session });

    // If deleted address was default, promote another active address
    if (wasDefault) {
      const nextDefaultAddress = await Address.findOne({
        user: userId,
        isActive: true,
      })
        .sort({ createdAt: -1 }) // choose newest active address (you can change strategy)
        .session(session);

      if (nextDefaultAddress) {
        nextDefaultAddress.isDefault = true;
        await nextDefaultAddress.save({ session });
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { userId, addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      res.status(400).json({ error: "Invalid address ID" });
    }

    session.startTransaction();

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
      isActive: true,
    }).session(session);

    if (!address) {
      await session.abortTransaction();
       res.status(404).json({ error: "Address not found" });
    }

    // Allowed fields only (prevents accidental/unsafe updates)
    const allowedFields = [
      "label",
      "recipientName",
      "phone",
      "country",
      "state",
      "city",
      "area",
      "addressLine1",
      "addressLine2",
      "postalCode",
      "addressType",
      "isDefault",
    ] as const;

    type AllowedField = (typeof allowedFields)[number];
    const updates: Partial<Record<AllowedField, any>> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    // Optional minimal validation if fields are being updated to empty values
    if ("recipientName" in updates && !updates.recipientName) {
      await session.abortTransaction();
      res.status(400).json({ error: "recipientName is required" });
    }
    if ("phone" in updates && !updates.phone) {
      await session.abortTransaction();
      res.status(400).json({ error: "phone is required" });
    }
    if ("country" in updates && !updates.country) {
      await session.abortTransaction();
       res.status(400).json({ error: "country is required" });
    }
    if ("city" in updates && !updates.city) {
      await session.abortTransaction();
      res.status(400).json({ error: "city is required" });
    }
    if ("addressLine1" in updates && !updates.addressLine1) {
      await session.abortTransaction();
       res.status(400).json({ error: "addressLine1 is required" });
    }

    // Handle default switching logic
    // Case A: user sets this address as default
    if (updates.isDefault === true) {
      // unset all other defaults for this user
      await Address.updateMany(
        { user: userId, _id: { $ne: addressId }, isDefault: true },
        { $set: { isDefault: false } },
        { session }
      );
    }

    // Apply updates to current address
    Object.assign(address, updates);

    // Case B: user explicitly sets current default to false
    // Ensure user is not left without a default address (optional but recommended)
    if (updates.isDefault === false) {
      const anotherDefaultExists = await Address.exists({
        user: userId,
        isActive: true,
        _id: { $ne: addressId },
        isDefault: true,
      }).session(session);

      // If no other default exists, keep this one as default
      // (prevents "no default address" state)
      if (!anotherDefaultExists) {
        address.isDefault = true;
      }
    }

    await address.save({ session });

    // Extra safety: if after update there is still no default at all, assign one
    // (covers edge cases e.g., old inconsistent data)
    const hasDefault = await Address.exists({
      user: userId,
      isActive: true,
      isDefault: true,
    }).session(session);

    if (!hasDefault) {
      const fallback = await Address.findOne({
        user: userId,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .session(session);

      if (fallback) {
        fallback.isDefault = true;
        await fallback.save({ session });
      }
    }

    await session.commitTransaction();

     res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};