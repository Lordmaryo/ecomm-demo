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
        toast.success("Product uploaded!");
      } catch (error: any) {
        toast.error(
          error.response.data.error || "something went wrong, try again later"
        );
        set({ loading: false });
      }
    },

    getAllProduct: async () => {
      set({ loading: true });
      try {
        const res = await axios.get("/product");
        set({ products: res.data, loading: false });
      } catch (error: any) {
        toast.error(
          error.response.data.error || "something went wrong, try again later"
        );
        console.error("Error fetching products", error);
      }
    },

    toggleFeauturedProduct: async (productId) => {
      set({ loading: true });
      try {
        const res = await axios.patch<Product>(
          `/product/update_feature/${productId}`
        );
        set((prevProduct) => ({
          products: prevProduct.products.map((product) =>
            product._id === productId
              ? { ...product, isFeatured: res.data.isFeatured }
              : product
          ),
          loading: false,
        }));
      } catch (error: any) {
        set({ loading: false });
        toast.error(
          error.response.data.error || "something went wrong, try again later"
        );
        console.error("Error updating product:", error.response.data);
      }
    },
    deleteProduct: async (productId) => {
      set({ loading: true });
      try {
        await axios.delete(`product/delete/${productId}`);
        set((prevState) => ({
          products: prevState.products.filter(
            (product) => product._id !== productId
          ),
          loading: false,
        }));
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(
          error.response.data.error || "something went wrong, try again later"
        );
        console.error("Error updating product:", error.response.data);
      }
    },
  })
);
