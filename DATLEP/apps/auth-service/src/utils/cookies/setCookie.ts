import { Request, Response } from "express";

export const setCookie = (
  req: Request,
  res: Response,
  name: string,
  value: string
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax works in dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log(`Cookie ${name} set with secure=${process.env.NODE_ENV === "production"} and sameSite=${process.env.NODE_ENV === "production" ? "none" : "lax"}`);
};
