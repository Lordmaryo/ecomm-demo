import mongoose from "mongoose";
import { ObjectId } from "mongoose";

interface Icoupon {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: ObjectId;
}

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: [0, "Discount percentage must be greater than 0"],
      max: [100, "Discount percentage must be less than 100"],
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<Icoupon>("Coupon", couponSchema);

export default Coupon;
