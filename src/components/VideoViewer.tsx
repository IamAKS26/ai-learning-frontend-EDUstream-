"use client";

import React, { useState, useEffect } from "react";
import { NotesPanel } from "./NotesPanel";

interface Props {
  unit: any;
  moduleId: string;
  onComplete: (payload: { timeSpent: number }) => void;
}

/** Convert any YouTube URL or raw videoId into a proper embed URL */
function buildEmbedUrl(content: any): string | null {
  // Direct videoId stored by backend
  if (content.videoId) {
    return `https://www.youtube.com/embed/${content.videoId}?rel=0&modestbranding=1`;
  }
  // Fallback: parse from watch URL
  if (content.url) {
    const match = content.url.match(/[?&]v=([^&]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  // Legacy field name
  if (content.videoUrl) {
    const match = content.videoUrl.match(/[?&]v=([^&]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    // Already an embed URL
    if (content.videoUrl.includes("/embed/")) return content.videoUrl;
  }
  return null;
}

export function VideoViewer({ unit, moduleId, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const content = unit.content || {};
  const embedUrl = buildEmbedUrl(content);
  const displayTitle = content.title || unit.title || "Video Lesson";

  return (
    <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full mb-6 flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold font-display">{displayTitle}</h2>
          {content.channelTitle && (
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">smart_display</span>
              {content.channelTitle}
            </p>
          )}
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
      </div>

      {/* Video Player */}
      <div className="w-full aspect-video bg-slate-900 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-xl"
            title={displayTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {content.thumbnail ? (
              <img src={content.thumbnail} alt={displayTitle} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
            ) : (
              <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1200')" }} />
            )}
            <button className="z-10 w-20 h-20 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-full flex items-center justify-center transition-all backdrop-blur-md group-hover:scale-110">
              <span className="material-symbols-outlined text-5xl ml-1">play_arrow</span>
            </button>
            <p className="z-10 mt-4 text-slate-300 font-medium tracking-wide">Video not available — check API key</p>
          </>
        )}
      </div>

      {/* Description */}
      {content.description && (
        <div className="w-full mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{content.description}</p>
        </div>
      )}

      {/* Timer + Complete */}
      <div className="w-full mt-6 flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">timer</span>
          {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, "0")} watched
        </span>
        <button
          onClick={() => onComplete({ timeSpent })}
          className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)]"
        >
          Complete Video <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
      </div>

      <NotesPanel moduleId={moduleId} unitId={unit._id} />
    </div>
  );
}
