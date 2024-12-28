import mongoose, { CallbackError, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cartItems: {
    quantity: number;
    product: Schema.Types.ObjectId;
  }[];
  role: "CUSTOMER" | "ADMIN";
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      minLength: [8, "Password must be 8 or more characters"],
      required: [true, "Password is required"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
  },
  {
    timestamps: true,
  }
);

// pre-save hook to hash password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);

export default User;
