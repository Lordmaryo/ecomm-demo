import axios from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { SignUpProps, useUseStoreProps } from "../types/types";

export const useUseStore = create<useUseStoreProps>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  signUp: async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }: SignUpProps) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      return toast.error("Passowrds do not match");
    }

    try {
      const res = await axios.post("auth/signUp", {
        firstName,
        lastName,
        email,
        password,
      });
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error instanceof Error) {
        toast.error(
          error.message || "An unknown error occured, try again later"
        );
      }
    }
  },
}));

// TODO: solve cors error
