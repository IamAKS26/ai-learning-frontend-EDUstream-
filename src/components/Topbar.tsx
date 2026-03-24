import React from "react";

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 bg-background-dark/80 backdrop-blur-md z-30 flex-shrink-0">
      <div className="flex items-center w-full max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all outline-none"
            placeholder="Search lessons, topics, or AI shortcuts..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6 flex-shrink-0">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background-dark" />
        </button>

        <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5">
          <span className="material-symbols-outlined">help_outline</span>
        </button>

        <div className="h-6 w-px bg-white/10 mx-1" />

        <button className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-sm">bolt</span>
          AI Quick Chat
        </button>
      </div>
    </header>
  );
}
