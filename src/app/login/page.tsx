"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        router.push("/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError(err.response?.data?.message || "Invalid email or password.");
      } else {
        setError(err.response?.data?.message || "An error occurred during login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 font-display text-slate-100">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,179,0,0.4)] mb-4">
            <span className="material-symbols-outlined text-slate-900 text-2xl">school</span>
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to your Nexus AI account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-100/5 border border-black/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-100/5 border border-black/5 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(255,179,0,0.2)] disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            {!isLoading && <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
