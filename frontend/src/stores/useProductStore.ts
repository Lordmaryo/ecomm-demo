import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { Product, useProductStoreProps } from "../types/types";

export const useProductStore = create<useProductStoreProps>(
  (set): useProductStoreProps => ({
    loading: false,
    products: [],

    setProduct: (products: Product[]) => set({ products }),
    createProduct: async (newProduct: Product) => {
      try {
        set({ loading: true });
        const res = await axios.post("/product", newProduct);
        set((prevState: { products: Product[] }) => ({
          products: [...prevState.products, res.data],
          loading: false,
        }));
      } catch (error: any) {
        toast.error(
          error.response.data.error || "something went wrong, try again later"
        );
        set({ loading: false });
      }
    },
  })
);
