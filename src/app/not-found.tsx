import React from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background-dark text-slate-900 flex flex-col font-display">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 flex flex-col items-center justify-center relative">
        
        {/* Playful placeholder for the 404 Falling Character image */}
        <div className="relative w-full max-w-lg aspect-video flex flex-col items-center justify-center mb-8">
           <div className="absolute top-10 flex flex-col items-center animate-bounce duration-[2000px]">
              <div className="bg-primary px-8 py-3 rounded-md shadow-lg rotate-12 mb-4">
                 <span className="text-4xl font-black text-slate-900 tracking-widest">404</span>
              </div>
              <div className="w-1 bg-slate-400 h-12 -mt-4"></div>
           </div>
           
           <h1 className="text-8xl font-black text-primary/10 tracking-tighter absolute z-0 select-none top-40">
              ERROR
           </h1>

           <div className="w-full max-w-[280px] h-12 bg-slate-900 rounded-full mt-auto shadow-2xl relative z-20 overflow-hidden">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[80px]">🤸</div>
           </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-8 mb-2 z-10">Oops! Page not found</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center z-10">
          The learning path you're looking for seems to have moved or doesn't exist.
        </p>
        
        <Link 
          href="/dashboard"
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm z-10"
        >
          Back to Dashboard
        </Link>
      </main>
    </div>
  );
}
