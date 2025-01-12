import { create } from "zustand";
import toast from "react-hot-toast";
import { useCartStoreProps } from "../types/types";
import axios from "../lib/axios";

export const useCartStore = create<useCartStoreProps>(
  (set, get): useCartStoreProps => ({
    loading: false,
    cart: [],
    total: 0,
    subTotal: 0,
    coupon: null,
    isCouponApplied: false,

    getCartItems: async () => {
      set({ loading: true });
      try {
        const res = await axios.get("/cart");
        set({ cart: res.data, loading: false });
        get().calculateTotals();
      } catch (error: any) {
        set({ cart: [], loading: false });
        const err = error.response.data.message;
        toast.error(err || "Error fetching cart, try again later");
        console.error("Falied to fetch cart: ", err);
      }
    },

    addTocart: async (product) => {
      set({ loading: true });
      try {
        await axios.post("/cart", { productId: product._id });
        toast.success(`Added ${product.name} to cart`, { id: "Success" });
        set((prevState) => {
          const existingItem = prevState.cart.find(
            (item) => item._id === product._id
          );
          const newCartItems = existingItem
            ? prevState.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...prevState.cart, { ...product, quantity: 1 }];

          return { cart: newCartItems, loading: false };
        });
        get().calculateTotals();
      } catch (error: any) {
        const err = error.response.data.message;
        toast.error(err || "Error adding to cart, try again later");
        console.error("Falied to fetch cart: ", err);
      }
    },
    removeAllFromCart: async (productId) => {
      try {
        await axios.delete(`/cart/delete`, { data: { productId } });
        set((prevState) => {
          const newCart = prevState.cart.filter(
            (item) => item._id !== productId
          );
          return { cart: newCart };
        });
        get().calculateTotals();
        toast.success("successfully removed from cart");
      } catch (error: any) {
        const err = error.response.data.message;
        toast.error(err || "Error clearing cart, try again later");
        console.error("failed to delete from cart: ", err);
      }
    },
    updateQuantity: async (productId, quantity) => {
      try {
        if (quantity === 0) return get().removeAllFromCart(productId);

        await axios.put(`/cart/update/${productId}`, { quantity });
        set((prevState) => ({
          cart: prevState.cart.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }));
        get().calculateTotals();
      } catch (error: any) {
        const err = error.response.data.message;
        toast.error(err || "something went wrong, try again later");
        console.error("failed to update quantity: ", err);
      }
    },
    calculateTotals: async () => {
      const { cart, coupon } = get();
      const subTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      let total = subTotal;

      if (coupon) {
        const discount = subTotal * (coupon.discountPercentage / 100);
        total = subTotal - discount;
      }

      set({ total, subTotal });
    },
    clearCart: async () => {
      set({ cart: [], coupon: null, total: 0.0, subTotal: 0.0 });
    },
  })
);
