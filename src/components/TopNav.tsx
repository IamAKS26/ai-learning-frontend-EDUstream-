"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Courses", href: "/module" },
  { name: "AI Tutor", href: "/learn" }, // Map AI Tutor to learn or a new route
  { name: "Notes", href: "/notes" },
  { name: "Progress", href: "/progress" },
  { name: "Community", href: "/community" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-transparent sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center p-1">
          {/* Swirl logo icon approximation */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" opacity="0.3"/>
            <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          LearnAI
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-1 md:gap-2 bg-white px-2 py-1.5 rounded-full border border-black/5 shadow-sm overflow-x-auto no-scrollbar max-w-[50vw]">
        {navigation.map((item) => {
          // Use basic startsWith for active state, or exact match depending on route
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item flex-shrink-0 text-xs md:text-sm px-3 md:px-4 py-1.5 ${isActive ? "nav-item-active" : ""}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-lg">search</span>
        </button>
        <button className="relative w-10 h-10 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2 pr-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 border border-black/5 overflow-hidden flex items-center justify-center text-slate-600 font-bold">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-semibold text-slate-900 leading-tight block">{user?.name || "Masud A."}</span>
            <span className="text-xs text-slate-500 leading-tight block">Student</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-sm hidden lg:block">expand_more</span>
        </div>
      </div>
    </header>
  );
}
