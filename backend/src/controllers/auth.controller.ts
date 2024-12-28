import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({ firstName, lastName, email, password });

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      message: "User created succesfully!",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("logout route");
};

function setCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

const generateTokens = (userId: Types.ObjectId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (
  userId: Types.ObjectId,
  refreshToken: string
) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 604800); // 7 days
};
