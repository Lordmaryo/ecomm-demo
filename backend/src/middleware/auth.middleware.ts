import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

//@ts-ignore
export const protectedRoute: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "User not authenticated: Access token not found" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findById(
        (decoded as jwt.JwtPayload).userId
      ).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid access token" });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Access token expired" });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error: protectedRoute middleware" });
  }
};

//@ts-ignore
export const adminRoute: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied - Admin only route" });
  }
};
