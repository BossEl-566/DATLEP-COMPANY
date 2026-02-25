import { Request, Response } from "express";

export const testUserController = (req: Request, res: Response) => {
  res.status(200).json({
    service: "user-service",
    message: "User service is working correctly 🚀",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};