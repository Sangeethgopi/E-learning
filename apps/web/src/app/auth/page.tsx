"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const authSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { setToken } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const endpoint = isLogin ? "v1/auth/login" : "v1/auth/register";
      const response = await api.post(endpoint, data);
      const { access_token, user } = response.data;
      setToken(access_token);
      useAuthStore.getState().setUser(user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            {isLogin ? "Welcome Back" : "Start Your Journey"}
          </h1>
          <p className="text-slate-400 mt-2">
            {isLogin ? "Continue your AI learning adventure" : "Join thousands of AI-powered learners"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-gap-6 flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input
                {...register("username")}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="johndoe"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message as string}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            {isLogin ? "Login Now" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
