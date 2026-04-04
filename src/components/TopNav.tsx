"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const { user, logout } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial theme state
    setIsDark(document.documentElement.classList.contains("dark"));
    
    // Outside click listener for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-transparent sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center p-1">
          {/* Swirl logo icon approximation */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" opacity="0.3" />
            <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor" />
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
        <button className="hidden md:flex w-10 h-10 rounded-full bg-white border border-black/5 shadow-sm items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-lg">search</span>
        </button>
        <button className="relative w-10 h-10 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 pr-2 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-black/5 overflow-hidden flex items-center justify-center text-slate-600 font-bold group-hover:border-primary/30 transition-colors">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-slate-900 leading-tight block">{user?.name || "Masud A."}</span>
              <span className="text-xs text-slate-500 leading-tight block">Student</span>
            </div>
            <span className={`material-symbols-outlined text-slate-400 text-sm hidden lg:block transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-black/5 shadow-xl overflow-hidden py-2 animate-in slide-in-from-top-2 fade-in">
              <div className="px-4 py-3 border-b border-black/5 lg:hidden">
                 <span className="text-sm font-semibold text-slate-900 block truncate">{user?.name || "Student User"}</span>
                 <span className="text-xs text-slate-500 block truncate">{user?.email || "user@edustream.com"}</span>
              </div>
              
              <div className="py-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                </Link>
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-[18px]">{isDark ? "light_mode" : "dark_mode"}</span> 
                     {isDark ? "Light Mode" : "Dark Mode"}
                  </div>
                  <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${isDark ? "bg-primary" : "bg-slate-200"}`}>
                     <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isDark ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                </button>
                <Link href="/support" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-[18px]">help</span> Help & Support
                </Link>
              </div>
              
              <div className="border-t border-black/5 pt-1 mt-1">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                    window.location.href = "/login";
                  }} 
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                >
                   <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
