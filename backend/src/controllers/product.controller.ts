import { Request, RequestHandler, Response } from "express";
import Product from "../models/product.model";
import { redis } from "../lib/redis";

export const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.find({}); // get all products
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ mesage: error.message });
      return;
    }
    res.status(500).json({ mesage: "Internal Server Error" });
  }
};

export const getFeaturedProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    let featuredProducts: string | null = await redis.get("featured_products");
    if (featuredProducts) {
      res.json(JSON.parse(featuredProducts));
      return;
    }

    const featuredProductsArray = await Product.find({
      isFeatured: true,
    }).lean();

    if (!featuredProducts) {
      res.status(404).json({ message: "Featured products not found" });
      return;
    }

    await redis.set("featured_products", JSON.stringify(featuredProductsArray));
    res.json(featuredProductsArray);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ mesage: error.message });
      return;
    }
    res.status(500).json({ mesage: "Internal server error" });
  }
};
