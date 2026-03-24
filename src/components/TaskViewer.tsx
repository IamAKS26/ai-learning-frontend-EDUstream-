"use client";

import React, { useState, useEffect } from "react";

interface Props {
  unit: any;
  onComplete: (payload: { timeSpent: number }) => void;
}

export function TaskViewer({ unit, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [submission, setSubmission] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const content = unit.content || {};

  return (
    <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold font-display">{content.title || "Interactive Task"}</h2>
          <p className="text-slate-400 mt-1">Complete the assignment below.</p>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">code_blocks</span>
      </div>
      
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm">
        {content.instructions || "Write a simple function that implements binary search. Paste the code below when finished."}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-200 uppercase tracking-wider">Your Solution</label>
        <textarea
          rows={6}
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Type or paste your answer here..."
          className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-y shadow-inner"
        ></textarea>
      </div>

      <div className="mt-10 flex justify-end pt-6 border-t border-white/10">
        <button 
          onClick={() => onComplete({ timeSpent })}
          disabled={submission.length < 5}
          className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Task <span className="material-symbols-outlined text-lg">publish</span>
        </button>
      </div>
    </div>
  );
}
