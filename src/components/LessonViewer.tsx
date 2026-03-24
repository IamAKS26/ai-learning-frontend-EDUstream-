"use client";

import React, { useState, useEffect } from "react";

interface Props {
  unit: any;
  onComplete: (payload: { timeSpent: number }) => void;
}

export function LessonViewer({ unit, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // AI returns plain text — render as formatted paragraphs, not raw HTML
  const rawContent: string = typeof unit.content === "string"
    ? unit.content
    : unit.content?.body ?? "";

  const paragraphs = rawContent
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-3xl font-bold">{unit.title || "Lesson Material"}</h2>
        <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
      </div>

      {/* Meta: reading time */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <span className="material-symbols-outlined text-sm">schedule</span>
        <span>~{Math.max(1, Math.ceil(rawContent.split(" ").length / 200))} min read</span>
        <span className="mx-2">·</span>
        <span className="material-symbols-outlined text-sm">timer</span>
        <span>{Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, "0")} elapsed</span>
      </div>

      {/* Content */}
      {paragraphs.length > 0 ? (
        <div className="space-y-4 text-slate-300 leading-relaxed text-base">
          {paragraphs.map((p, i) => {
            // Treat lines starting with a number or bullet as list items
            if (/^(\d+\.|[-*•])/.test(p)) {
              return (
                <div key={i} className="flex gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">▸</span>
                  <p>{p.replace(/^(\d+\.|[-*•])\s*/, "")}</p>
                </div>
              );
            }
            // Treat ALL-CAPS short lines as headings
            if (p.length < 80 && p === p.toUpperCase() && p.length > 3) {
              return <h3 key={i} className="text-lg font-bold text-white mt-6">{p}</h3>;
            }
            return <p key={i}>{p}</p>;
          })}
        </div>
      ) : (
        <p className="text-slate-400 leading-relaxed text-lg italic">
          No content available for this lesson yet.
        </p>
      )}

      {/* Footer */}
      <div className="mt-12 flex justify-end pt-6 border-t border-white/10">
        <button
          onClick={() => onComplete({ timeSpent })}
          className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)]"
        >
          Mark as Read & Continue
          <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
      </div>
    </div>
  );
}
