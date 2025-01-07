import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useUseStore } from "../stores/useUserStore";
import { useUseStoreProps } from "../types/types";

export interface ToggleEventProps {
  setToggleEvent: (toggleEvent: boolean) => void;
}

const SignUpContainer = ({ setToggleEvent }: ToggleEventProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signUp, loading } = useUseStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(formData);
  };

  return (
    <div className="max-w-[800px] mx-auto mt-5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="md:text-3xl text-2xl font-semibold text-center ">
          Create your account
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-[600px] bg-zinc-100 px-4 py-2 mt-10 mx-auto space-y-4"
        >
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="firstName">First name</label>
              <div className="relative">
                <User size={20} className="absolute left-1 top-2" />
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="John"
                  className="bg-zinc-200 w-full outline-none py-2 pl-8 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="lastName">Last name</label>
              <div className="relative">
                <User size={20} className="absolute left-1 top-2" />
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                  className="bg-zinc-200 w-full outline-none py-2 pl-8 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-1 top-2" />
              <input
                id="email"
                type="email"
                value={formData.email}
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="bg-zinc-200 w-full outline-none py-2 pl-8 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-1 top-2" />
              <input
                id="password"
                type="password"
                value={formData.password}
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="********"
                className="bg-zinc-200 w-full outline-none py-2 pl-8 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-1 top-2" />
              <input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                required
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="********"
                className="bg-zinc-200 w-full outline-none py-2 pl-8 rounded-md"
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="disabled:opacity-75 cursor-pointer bg-black text-white w-full py-2 rounded-md hover:opacity-85 transition-opacity"
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center gap-2">
                <Loader size={20} className="animate-spin" aria-hidden={true} />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center gap-2">
                <UserPlus size={20} />
                <span>Sign up</span>
              </div>
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <span>Already have an account? </span>
          <button
            onClick={() => setToggleEvent(true)}
            className="text-black font-bold"
          >
            Login here{" "}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpContainer;
