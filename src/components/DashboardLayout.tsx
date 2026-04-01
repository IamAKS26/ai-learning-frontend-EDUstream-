"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login"); // or another logic if guest access is allowed
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark text-slate-900 flex-col gap-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary border-r-2 animate-spin shadow-sm" />
      </div>
    );
  }

  // Allow rendering if we don't strictly require authentication everywhere, 
  // or return null while redirect happens
  if (!isAuthenticated && isLoading !== undefined) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background-dark text-slate-900 flex flex-col font-display">
      <TopNav />
      <main className="flex-1 w-full p-6 md:p-8 lg:p-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}
