import mongoose, { Double, ObjectId } from "mongoose";

export interface IProduct {
  id?: ObjectId | string;
  _id: ObjectId;
  name: string;
  description: string;
  price: Double;
  image: string;
  category: string;
  isFeatured: boolean;
  quantity: number; // check this
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: [true, "Image is required"],
    },
    category: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: [true, "Price is required"],
      min: 0.0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
