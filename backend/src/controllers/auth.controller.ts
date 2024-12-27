import { NextFunction, Request, Response } from "express";

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
  res.send("signin route");
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("logout route");
};
