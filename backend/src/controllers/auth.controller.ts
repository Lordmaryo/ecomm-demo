import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("signup route");
};

export const signIn = async (
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

    res.status(201).json({ newUser, message: "User created succesfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("logout route");
};
