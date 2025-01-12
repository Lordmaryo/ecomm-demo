import "dotenv/config";
import { Request, Response } from "express";
import { IProduct } from "../models/product.model";
import Coupon from "../models/coupon.model";
import { stripe } from "../lib/stripe";
import { Types } from "mongoose";
import Order from "../models/order.models";

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
      success_url: `${process.env.FRONTEND_DEV_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_DEV_URL}/order/payment-failed`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user?._id.toString() || "",
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
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

export const checkoutSucess = async (req: Request, res: Response) => {
  try {
    const sessionId: string = req.body.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata!.couponCode,
          userId: session.metadata!.userId,
        },
        { isActive: false }
      );

      const products = JSON.parse(session.metadata!.products);
      const newOrder = new Order({
        user: session.metadata!.userId,
        products: products.map((product: IProduct) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total ? session.amount_total / 100 : 0.0, // converts from cents to dollars
        stripeSessionId: sessionId,
      });

      await newOrder.save();
      res.status(200).json({
        success: true,
        message: "Payment successful and order created!",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error: CheckoutSuccess controller" });
  }
};

const createCoupon = async (userId: Types.ObjectId) => {
  return await new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
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
