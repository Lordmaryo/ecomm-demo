import axios from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import {
  LogInProps,
  SignUpProps,
  UserResponse,
  useUseStoreProps,
} from "../types/types";

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
      const res = await axios.post<UserResponse>("auth/signUp", {
        firstName,
        lastName,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false });
      if (
        error.response.data.message.startsWith(
          "User validation failed: password:"
        )
      ) {
        toast.error("Password must be 8 or more characters");
      } else
        toast.error(
          error.response.data.message ||
            "An unknown error occured, try again later"
        );
    }
  },
  login: async ({ email, password }: LogInProps) => {
    set({ loading: true });

    try {
      const res = await axios.post<UserResponse>("auth/signin", {
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false });

      toast.error(
        error.response.data.message ||
          "An unknown error occured, try again later"
      );
    }
  },
  checkAuth: async () => {
    try {
      const res = await axios.get<UserResponse>("/auth/profiles");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error: any) {
      toast.error(
        error.response.data.message || "An error occured, try again later"
      );
    }
  },
}));
