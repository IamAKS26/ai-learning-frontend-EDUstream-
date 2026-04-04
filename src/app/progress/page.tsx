"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SkeletonBar, SkeletonBlock, SkeletonProgressRow } from "@/components/Skeleton";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch delay
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="space-y-2">
            <SkeletonBar className="h-8 w-48" />
            <SkeletonBar className="h-4 w-80" />
          </div>
          {/* Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-black/5 shadow-sm flex items-center gap-6">
              <SkeletonBlock className="w-32 h-32 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <SkeletonBar className="h-6 w-48" />
                <SkeletonBar className="h-4 w-full" />
                <SkeletonBar className="h-4 w-3/4" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm space-y-4 flex flex-col items-center justify-center">
              <SkeletonBlock className="w-16 h-16 rounded-full" />
              <SkeletonBar className="h-5 w-20" />
              <SkeletonBar className="h-3 w-32" />
            </div>
          </div>
          {/* Module rows */}
          <div className="space-y-4">
            <SkeletonBar className="h-6 w-36" />
            <SkeletonProgressRow />
            <SkeletonProgressRow />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">My Progress</h2>
          <p className="text-slate-500">Track your learning journey and view active module status.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-card p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-6">Overall Completion</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    strokeWidth="3"
                    strokeDasharray="68, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold font-display">68%</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">You are on a 12-day streak!</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Consistent learning yields the best results. You've completed 4 modules this month and are currently active in 2 others.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-bold mb-4">Certificates</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-3xl text-primary">workspace_premium</span>
              </div>
              <div>
                <p className="font-bold">2 Earned</p>
                <p className="text-xs text-slate-500">View your credential portfolio</p>
              </div>
              <button className="mt-2 text-primary text-sm font-bold hover:underline">View All</button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4">Active Modules</h3>
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex flex-shrink-0 items-center justify-center">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">Introduction to AI Mechanics</h4>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[45%] rounded-full shadow-[0_0_8px_#FFB300]"></div>
                  </div>
                  <span className="text-xs font-bold text-primary w-8 text-right">45%</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex flex-shrink-0 items-center justify-center">
                <span className="material-symbols-outlined text-accent">security</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">Cybersecurity Fundamentals</h4>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[12%] rounded-full shadow-[0_0_8px_#FFD700]"></div>
                  </div>
                  <span className="text-xs font-bold text-accent w-8 text-right">12%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
