"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LessonViewer } from "@/components/LessonViewer";
import { QuizViewer } from "@/components/QuizViewer";
import { VideoViewer } from "@/components/VideoViewer";
import { TaskViewer } from "@/components/TaskViewer";

export default function LearnPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const router = useRouter();

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleTopic, setModuleTopic] = useState<string>("");

  // Fetch the real module title once on mount
  useEffect(() => {
    apiClient.get(`/modules/single/${moduleId}`)
      .then(res => setModuleTopic(res.data.title))
      .catch((err) => {
        // If it's a network error, or a 404 (module deleted), report it instead of proceeding
        if (!err.response) {
          setError("Network error: Backend is restarting or unreachable. Please refresh.");
        } else if (err.response.status === 404) {
          setError("Module not found. It may have been deleted.");
        } else {
          setModuleTopic(moduleId); // fallback for other non-fatal errors
        }
        setLoading(false);
      });
  }, [moduleId]);

  const fetchNextUnit = async (topic = moduleTopic) => {
    if (!topic) return; // wait until title is loaded
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post("/units/next-unit", {
        moduleId,
        topic
      });
      if (response.data && response.data.type) {
        setUnit(response.data);
      } else {
        setError("AI Engine returned empty or invalid response.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch next unit.");
    } finally {
      setLoading(false);
    }
  };

  // Only start fetching units once we have the module title
  useEffect(() => {
    if (moduleTopic) fetchNextUnit(moduleTopic);
  }, [moduleTopic]);

  const handleComplete = async (payload: { timeSpent: number; quizScore?: number }) => {
    if (!unit) return;
    try {
      await apiClient.post("/units/track-interaction", {
        unitId: unit._id || "temp-id",
        moduleId,
        type: unit.type,
        timeSpent: payload.timeSpent,
        quizScore: payload.quizScore || 0,
        completed: true
      });
      // Fetch the next one
      fetchNextUnit(moduleTopic);
    } catch (err) {
      console.error("Failed to track interaction", err);
      // Still fetch the next one to not block user
      fetchNextUnit(moduleTopic);
    }
  };

  const renderUnit = () => {
    if (!unit) return null;

    switch (unit.type) {
      case "read":
        return <LessonViewer unit={unit} moduleId={moduleId} onComplete={handleComplete} />;
      case "quiz":
        return <QuizViewer unit={unit} moduleId={moduleId} onComplete={handleComplete} />;
      case "video":
        return <VideoViewer unit={unit} moduleId={moduleId} onComplete={handleComplete} />;
      case "task":
        return <TaskViewer unit={unit} moduleId={moduleId} onComplete={handleComplete} />;
      default:
        return <div className="text-red-500">Unknown unit type: {unit.type}</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto min-h-[calc(100vh-64px)] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push(`/module/${moduleId}`)} className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Exit Session
          </button>
          <div className="flex gap-2 items-center text-xs font-bold text-accent px-3 py-1 bg-accent/10 rounded-full uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">auto_awesome</span> AI Adaptive Mode
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {error && (
            <div className="glass-card p-6 rounded-2xl border-red-500/30 text-center space-y-4 m-auto w-full max-w-lg">
              <span className="material-symbols-outlined text-4xl text-red-500 block">error</span>
              <p className="text-red-400">{error}</p>
              <button onClick={fetchNextUnit} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors">
                Retry
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="flex flex-col items-center justify-center m-auto space-y-6">
              <div className="w-16 h-16 rounded-full border-t-2 border-primary border-r-2 animate-spin shadow-[0_0_15px_rgba(255,179,0,0.4)]"></div>
              <p className="text-primary font-medium animate-pulse">AI is generating your next optimal unit...</p>
            </div>
          )}

          {!loading && !error && unit && (
            <div className="flex-1 slide-up fade-in transition-all">
              {renderUnit()}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
