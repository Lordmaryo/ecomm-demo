import { Request, RequestHandler, Response } from "express";
import Coupon from "../models/coupon.model";

type codeType = {
  code: string;
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const coupoun = await Coupon.findOne({
      userId: req.user?._id,
      isActive: true,
    });

    res.json(coupoun || null);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error: getCoupon controller" });
  }
};

export const validateCoupon: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code }: codeType = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user?._id,
      isActive: true,
    });

    if (!coupon) {
      res.status(400).json({ message: "Invalid Coupon" });
      return;
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      res.status(400).json({ message: "Coupon Expired" });
      return;
    }

    res.json({
      message: "Coupon Valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal Server Error: validateCoupon controller" });
  }
};
