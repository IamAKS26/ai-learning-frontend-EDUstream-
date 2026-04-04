"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import apiClient from "@/lib/apiClient";
import { SkeletonBar, SkeletonBlock } from "@/components/Skeleton";

export default function AITutorPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 900);
    return () => clearTimeout(t);
  }, []);

  const suggestions = [
    { title: "Explain today's lesson", icon: "menu_book" },
    { title: "Give example problems", icon: "calculate" },
    { title: "Summarize key concepts", icon: "summarize" },
    { title: "Quiz me on this topic", icon: "quiz" }
  ];

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await apiClient.post("/ai/chat", { prompt });
      setResponse(res.data.reply);
      setPrompt("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setResponse(err?.response?.data?.message || "Failed to connect to AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 h-full min-h-[70vh]">

        {/* Central Orb */}
        <div className="relative mb-8">
          <div className="absolute inset-0 scale-150 bg-gradient-to-tr from-pink-300/40 via-purple-300/40 to-yellow-300/40 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 via-purple-200 to-yellow-200 shadow-[0_0_40px_rgba(236,192,255,0.6)] relative z-10 flex items-center justify-center text-white/80">
            {loading && <span className="material-symbols-outlined animate-spin">sync</span>}
          </div>
          <div className="absolute top-2 right-4 w-8 h-8 rounded-full bg-white/40 blur-sm z-20" />
        </div>

        {/* Skeleton initializing state */}
        {initializing ? (
          <>
            <SkeletonBar className="h-8 w-64 mx-auto mb-4" />
            <SkeletonBar className="h-4 w-48 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 h-32 flex flex-col items-center justify-center gap-3">
                  <SkeletonBlock className="w-10 h-10 rounded-full" />
                  <SkeletonBar className="h-4 w-28" />
                </div>
              ))}
            </div>
            <div className="w-full bg-white rounded-3xl border border-black/5 p-4 shadow-sm space-y-3 min-h-[120px]">
              <SkeletonBar className="h-4 w-3/4" />
              <SkeletonBar className="h-4 w-1/2" />
            </div>
          </>
        ) : (
          <>
            {/* Welcome Text */}
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Welcome to AI Tutor
            </h2>
            <p className="text-slate-500 mb-12">
              Get personalized help with your learning
            </p>

            {/* Suggestion Cards or Response */}
            {response ? (
              <div className="w-full bg-white rounded-3xl p-8 border border-black/5 shadow-sm text-slate-700 leading-relaxed max-h-96 overflow-y-auto mb-8">
                {response}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(item.title)}
                    className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center justify-center gap-3 h-32"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="w-full relative mt-auto">
              <div className="absolute inset-0 bg-white shadow-[0_0_40px_rgba(0,0,0,0.04)] rounded-3xl border border-black/5 pointer-events-none" />
              <div className="relative z-10 bg-white rounded-3xl p-2 flex flex-col pt-4 px-4 min-h-[120px]">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Write here..."
                  className="w-full bg-transparent resize-none outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium flex-1 h-12"
                />
                <div className="flex items-center justify-between mt-auto py-2 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-lg rotate-45">attach_file</span>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={loading || !prompt.trim()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${prompt.trim() && !loading ? "bg-primary text-white shadow-sm hover:bg-primary/90" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
