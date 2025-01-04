import mongoose, { Double, ObjectId } from "mongoose";

interface IOrder {
  user: ObjectId;
  products: {
    product: ObjectId;
    quantity: number;
    price: Double;
  }[];
  totalAmount: Double;
  stripeSessionId: string;
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0.0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0.0,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
