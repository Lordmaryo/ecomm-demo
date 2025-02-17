import axios from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import {
  LogInProps,
  Roles,
  SignUpProps,
  UserResponse,
  useUserStoreProps,
} from "../types/types";
import { AxiosError } from "axios";

export const useUserStore = create<useUserStoreProps>((set, get) => ({
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
      set({ loading: false });
      return toast.error("Passwords do not match");
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
      if (get().user?.role === Roles.ADMIN) {
        return toast.success(res.data.message || "");
      }
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

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/verify-email", { code });
      set({ user: res.data, loading: false });
      toast.success("Email verification success!");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "An unknown error occured, try again later"
      );
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/forgot-password", { email });
      set({ loading: false });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error sending reset email", error);
    }
  },

  resetPassword: async (token, password, confirmPassword) => {
    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match", { id: "error" });
      return;
    }

    set({ loading: true });
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message);
      set({ loading: false });
      window.location.href = "/signIn";
    } catch (error: any) {
      set({ loading: false });
      console.error("Error resetting password", error.response.data.message);
      toast.error(
        error.response.data.message || "something went wrong, try again later"
      );
    }
  },
}));

let refreshPromise: Promise<void> | null = null;

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
