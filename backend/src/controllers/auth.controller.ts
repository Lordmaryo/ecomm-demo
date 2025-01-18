import { NextFunction, Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";
import {
  sendResetPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
} from "../mailtrap/emails";

//@ts-ignore
export const signUp: RequestHandler = async (
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
      // user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      // },
      message: "User created succesfully!",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

//@ts-ignore
export const signIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === "ADMIN") {
      const verificationToken = generateVerificationToken();
      const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.updateOne({
        verificationToken,
        verificationTokenExpiresAt: otpExpiresAt,
      });

      await sendVerificationEmail(email, verificationToken);

      return res.status(200).json({
        message: "OTP sent for admin verification",
        userId: user._id,
        firstName: user.firstName,
        role: user.role,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user?._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

//@ts-ignore
export const logout: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshToken", refreshToken);
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );
      if (typeof decoded !== "string" && "userId" in decoded) {
        await redis.del(`refresh_token:${decoded.userId}`);
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

//@ts-ignore
export const refreshToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const storedRefreshToken = await redis.get(
      //@ts-ignore
      `refresh_token:${decoded.userId}`
    );

    if (refreshToken !== storedRefreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      // @ts-ignore
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const getProfiles = async (req: Request, res: Response) => {
  try {
    res.json(req.user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error: getProfile controller" });
  }
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

export const verifyEmail = async (req: Request, res: Response) => {
  const { code }: { code: string } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user?._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    console.error("Error verifying otp", error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "This email does not exist" });
      return;
    }

    const forgotPasswordToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1hr
    await user.updateOne(
      { email },
      {
        resetPasswordToken: forgotPasswordToken,
        resetPasswordExpiresAt: tokenExpiresAt,
      }
    );
    await sendResetPasswordEmail(forgotPasswordToken, email);
    res.status(201).json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error });
    console.error("Error sending reset password token", error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password }: { password: string } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;

    sendResetSuccessEmail(user.email);

    res
      .status(201)
      .json({ success: true, message: "password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: error });
    console.error("Error reseting password", error);
  }
};

const generateVerificationToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
