"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // We need auth context if they use Google Login from here

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/register", { name, email, password });
      if (response.status === 201 || response.status === 200) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.post("/auth/google", { token: credentialResponse.credential });
      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        router.push("/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 font-display text-slate-900 antialiased">
      <div className="w-full max-w-md glass-card p-10 rounded-3xl relative overflow-hidden bg-white border border-black/5 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_4px_20px_rgba(255,179,0,0.4)] mb-5">
            <span className="material-symbols-outlined text-slate-900 text-3xl font-bold">person_add</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Create Account</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Join the <span className="text-slate-900 font-bold">EduStream</span> experience</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-primary text-slate-900 font-black rounded-2xl hover:bg-primary/95 transition-all shadow-[0_8px_20px_rgba(255,179,0,0.3)] disabled:opacity-50 text-sm uppercase tracking-widest"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="h-px bg-black/10 flex-1"></div>
          <span className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">or sign in with</span>
          <div className="h-px bg-black/10 flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            shape="pill"
            theme="outline"
            size="large"
          />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-black uppercase tracking-tighter">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
