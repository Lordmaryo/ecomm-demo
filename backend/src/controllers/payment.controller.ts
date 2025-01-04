import { Request, Response } from "express";
import { IProduct } from "../models/product.model";
import Coupon from "../models/coupon.model";
import { stripe } from "../lib/stripe";
import { ObjectId } from "mongoose";

type ProductCouponDetails = {
  products: IProduct[];
  couponCode: string;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { products, couponCode }: ProductCouponDetails = req.body;

    if (!Array.isArray(products) || !products.length) {
      res.status(400).json({ message: "Invalid or empty products" });
      return;
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(Number(product.price) * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user?._id,
        isActive: true,
      });

      if (coupon) {
        const discount = Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
        totalAmount -= discount;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/payment-failed`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user?._id.toString() || "",
        couponCode: couponCode || "",
      },
    });

    if (totalAmount >= 20000) {
      await createCoupon(req.user!._id);
    }

    res
      .status(200)
      .json({ sessionId: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({
      message: "Internal server error: createCheckoutSession controller",
    });
  }
};

const createCoupon = async (userId: ObjectId) => {
  return await new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    userId,
  }).save();
};

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}