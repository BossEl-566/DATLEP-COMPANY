import { Request, Response } from "express";

export const testOrderController = (req: Request, res: Response) => {
  res.status(200).json({
    service: "order-service",
    message: "order service is working correctly 🚀",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}