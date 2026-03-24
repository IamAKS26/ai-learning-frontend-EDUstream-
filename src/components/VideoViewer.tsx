"use client";

import React, { useState, useEffect } from "react";

interface Props {
  unit: any;
  onComplete: (payload: { timeSpent: number }) => void;
}

export function VideoViewer({ unit, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const content = unit.content || {};

  return (
    <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full mb-6 flex justify-between items-center pb-4 border-b border-white/10">
        <h2 className="text-3xl font-bold font-display">{content.title || "Video Lesson"}</h2>
        <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
      </div>
      
      {/* Mock Video Player Since Actual Embed URL might not be provided */}
      <div className="w-full aspect-video bg-slate-900 rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
        {content.videoUrl ? (
          <iframe 
            src={content.videoUrl} 
            className="w-full h-full"
            title="Video player"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <>
            <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1200')" }}></div>
            <button className="z-10 w-20 h-20 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-full flex items-center justify-center transition-all backdrop-blur-md group-hover:scale-110">
              <span className="material-symbols-outlined text-5xl ml-1">play_arrow</span>
            </button>
            <p className="z-10 mt-4 text-slate-300 font-medium tracking-wide">AI-Generated Video Explanation</p>
          </>
        )}
      </div>

      <div className="w-full mt-10 flex justify-end">
        <button 
           onClick={() => onComplete({ timeSpent })}
           className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)]"
        >
          Complete Video <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
      </div>
    </div>
  );
}
