"use client";

import React, { useState } from "react";
import apiClient from "@/lib/apiClient";

interface Props {
  language: string;
  starterCode: string;
  taskDescription: string;
  onSubmit: () => void;
}

interface ReviewResult {
  rating: number;
  summary: string;
  positives: string[];
  suggestions: Array<{
    title: string;
    description: string;
    improved_snippet?: string;
  }>;
  bestPractice: string;
}

export function CodeEditor({ language, starterCode, taskDescription, onSubmit }: Props) {
  const [code, setCode] = useState(starterCode || "");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (code.trim() === "") return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post("/code/review", {
        code,
        language,
        taskDescription
      });
      setReview(res.data);
      onSubmit(); // Mark task as complete unit-wise
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get AI review");
    } finally {
      setLoading(false);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      {/* Code Editor Area */}
      <div className="rounded-xl overflow-hidden border border-black/5 bg-[#1e1e1e] shadow-2xl relative">
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black/40">
          <div className="flex gap-2 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">{language}</span>
        </div>
        
        <div className="flex relative">
          {/* Line Numbers */}
          <div className="p-4 pr-3 text-right text-[#5a5a5a] font-mono text-sm leading-relaxed border-r border-[#333] select-none bg-[#1e1e1e]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent p-4 font-mono text-sm leading-relaxed text-[#d4d4d4] outline-none resize-none min-h-[300px]"
            style={{ whiteSpace: "pre" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {error ? <p className="text-red-400 text-sm">{error}</p> : <div></div>}
        <button
          onClick={handleSubmit}
          disabled={loading || code.trim() === ""}
          className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)] disabled:opacity-50"
        >
          {loading ? (
            <>Analyzing Code... <span className="material-symbols-outlined animate-spin text-lg">sync</span></>
          ) : (
            <>Submit for Review <span className="material-symbols-outlined text-lg">insights</span></>
          )}
        </button>
      </div>

      {/* AI Review Result Panel (Senior Dev Style) */}
      {review && (
        <div className="mt-12 glass-card rounded-2xl p-6 border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(255,179,0,0.1)] slide-up fade-in transition-all">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-black/5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-inner border border-black/5 ${
              review.rating >= 8 ? "bg-green-500/20 text-green-400" :
              review.rating >= 5 ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {review.rating}<span className="text-xs opacity-50 block mt-1">/10</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">AI Senior Developer Review</h3>
              <p className="text-slate-700 mt-1">{review.summary}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Positives */}
            {review.positives && review.positives.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span> What works well
                </h4>
                <ul className="space-y-2">
                  {review.positives.map((pos, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-green-500 border border-green-500/30 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px]">✓</span> 
                      {pos}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {review.suggestions && review.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">lightbulb</span> Suggestions for improvement
                </h4>
                <div className="space-y-3">
                  {review.suggestions.map((sug, i) => (
                    <div key={i} className="bg-slate-50 border border-black/5 p-4 rounded-xl">
                      <p className="font-bold text-slate-200 text-sm mb-1">{sug.title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed mb-3">{sug.description}</p>
                      {sug.improved_snippet && (
                        <div className="bg-[#1e1e1e] border border-black p-3 rounded-lg overflow-x-auto">
                          <pre className="text-xs font-mono text-[#d4d4d4]">{sug.improved_snippet}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Practice */}
            {review.bestPractice && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">school</span>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Senior Dev Tip</p>
                  <p className="text-sm text-slate-700 italic">"{review.bestPractice}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
