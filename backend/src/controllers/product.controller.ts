import { Request, RequestHandler, Response } from "express";
import Product from "../models/product.model";
import { redis } from "../lib/redis";
import cloudinary from "../lib/cloudinary";

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

export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, image, category, price, isFeatured } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = Product.create({
      name,
      description,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      price,
      isFeatured,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

//@ts-ignore
export const deleteProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop()?.split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        return res
          .status(500)
          .json({ message: `Error uploading image`, error: error });
      }
    }

    await Product.findByIdAndDelete(id);
    return res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecommendedProducts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ]);

    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductsByCategory: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFeauturedProduct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedproduct = await product.save();
      await updateFeaturedProductCache();
      res.json(updatedproduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal server error: toggleFeauturedProduct" });
  }
};

const updateFeaturedProductCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Internal server error: updateFeaturedProductCache error");
    }
  }
};
