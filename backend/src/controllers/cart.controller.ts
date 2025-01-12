import { Request, RequestHandler, Response } from "express";
import Product from "../models/product.model";

export const getCartProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ _id: { $in: req.user?.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user?.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item?.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "internal server error: getCartProducts controller" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user?.cartItems.find((item) => item.id === productId); // check this

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user?.cartItems.push(productId);
    }

    await user?.save();
    res.json(user?.cartItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.json({ message: "Internal server error: addToCart controller" });
  }
};

export const removeAllFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user!.cartItems = [];
    } else {
      user!.cartItems =
        user?.cartItems.filter((item) => item.id !== productId) || [];
    }
    await user?.save();
    res.json(user?.cartItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error: removeAllFromCart controller" });
  }
};

export const updateQuantity: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user?.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user!.cartItems =
          user?.cartItems.filter((item) => item.id !== productId) || [];
        await user?.save();
        res.json(user?.cartItems);
        return;
      }
      existingItem.quantity = quantity;
      await user?.save();
      res.json(user?.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Internal server error: updateQuantity controller" });
  }
};
