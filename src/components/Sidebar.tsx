"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Modules",   href: "/module",    icon: "book_4" },
  { name: "My Notes",  href: "/notes",     icon: "edit_note" },
  { name: "Progress",  href: "/progress",  icon: "analytics" },
  { name: "Analytics", href: "/analytics", icon: "query_stats" },
  { name: "Settings",  href: "/settings",  icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/5 bg-surface-dark transition-all duration-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,179,0,0.4)]">
          <span className="material-symbols-outlined text-white text-xl">school</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          EDUstream
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                isActive
                  ? "sidebar-item-active flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer group"
                  : "flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
              }
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pro Upgrade Banner */}
      <div className="p-4 m-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Pro Access</p>
        <p className="text-xs text-slate-400 mb-3">Unlock advanced AI tutoring and path optimization.</p>
        <button className="w-full py-2 bg-primary text-background-dark text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(255,179,0,0.2)]">
          Upgrade Plan
        </button>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{user?.name || "Student User"}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email || "Beta Explorer"}</p>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  );
}
