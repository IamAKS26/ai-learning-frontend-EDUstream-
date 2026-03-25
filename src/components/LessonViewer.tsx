"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NotesPanel } from "./NotesPanel";

interface Props {
  unit: any;
  moduleId: string;
  onComplete: (payload: { timeSpent: number }) => void;
}

export function LessonViewer({ unit, moduleId, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // AI returns markdown — we want to render it nicely
  const rawContent: string = typeof unit.content === "string"
    ? unit.content
    : unit.content?.body ?? unit.content?.text ?? unit.content?.markdown ?? "";

  const words = rawContent.split(/\s+/).length;
  const estimatedMin = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold font-display">{unit.title || "Lesson Material"}</h2>
          {/* Meta: reading time */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> ~{estimatedMin} min read</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, "0")} elapsed</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,179,0,0.2)] flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-2xl">auto_stories</span>
        </div>
      </div>

      {/* Content Area - Chatbot Style via raw element mapping */}
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-10 overflow-hidden shadow-inner">
        {rawContent ? (
          <article className="max-w-none text-slate-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-display font-bold text-white mb-6 mt-8" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-display font-bold text-white mb-4 mt-8 pb-2 border-b border-white/10" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-primary/90 mb-3 mt-6" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-lg font-bold text-slate-200 mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-slate-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2 text-slate-300 marker:text-primary" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-slate-300 marker:text-primary font-mono marker:font-bold" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                a: ({node, ...props}) => <a className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic text-slate-400" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary bg-primary/5 py-3 px-6 rounded-r-xl text-slate-400 italic mb-6 shadow-inner my-6" {...props} />
                ),
                table: ({node, ...props}) => (
                  <div className="w-full overflow-x-auto mb-8 rounded-xl border border-white/10 shadow-lg">
                    <table className="w-full text-left border-collapse" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => <thead className="bg-white/5 border-b border-white/10" {...props} />,
                th: ({node, ...props}) => <th className="px-4 py-3 font-semibold text-white/90" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3 border-t border-white/5" {...props} />,
                img: ({node, ...props}) => <img className="rounded-xl shadow-lg border border-white/10 max-w-full h-auto my-6" {...props} />,
                code(props) {
                  const {children, className, node, ...rest} = props
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <div className="my-6 relative group">
                      <div className="absolute top-0 right-0 bg-white/10 text-[10px] text-white/50 px-2 py-1 rounded-bl-lg rounded-tr-xl tracking-widest uppercase font-mono z-10">{match[1]}</div>
                      <pre className="bg-[#1a1a1a] border border-black p-4 rounded-xl overflow-x-auto shadow-2xl relative">
                        <code className={`font-mono text-sm text-[#d4d4d4] ${className}`} {...rest}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-md font-mono text-sm border border-secondary/20" {...rest}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {rawContent}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-4">
            <span className="material-symbols-outlined text-5xl">hourglass_empty</span>
            <p className="text-lg italic">No content available for this lesson yet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end pt-6 border-t border-white/10">
        <button
          onClick={() => onComplete({ timeSpent })}
          className="px-8 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,179,0,0.4)] hover:-translate-y-0.5"
        >
          Mark as Read & Continue
          <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
      </div>

      <NotesPanel moduleId={moduleId} unitId={unit._id} />
    </div>
  );
}
