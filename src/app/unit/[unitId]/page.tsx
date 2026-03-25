"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LessonViewer } from "@/components/LessonViewer";
import { QuizViewer } from "@/components/QuizViewer";
import { VideoViewer } from "@/components/VideoViewer";
import { TaskViewer } from "@/components/TaskViewer";

export default function UnitPage() {
  const params = useParams();
  const unitId = params.unitId as string;
  const router = useRouter();

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnit = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/units/single/${unitId}`);
        setUnit(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load unit");
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  const handleComplete = async (payload: { timeSpent: number; quizScore?: number }) => {
    if (!unit) return;
    try {
      const resp = await apiClient.post("/units/track-interaction", {
        unitId: unit._id || unitId,
        moduleId: unit.moduleId,
        type: unit.type,
        timeSpent: payload.timeSpent,
        quizScore: payload.quizScore || 0,
        completed: true
      });
      
      const nextUnitId = resp.data?.nextUnitId;
      if (nextUnitId) {
        router.push(`/unit/${nextUnitId}`);
      } else if (unit.moduleId) {
        router.push(`/module/${unit.moduleId}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Failed to track interaction", err);
      if (unit.moduleId) {
        router.push(`/module/${unit.moduleId}`);
      }
    }
  };

  const renderUnit = () => {
    if (!unit) return null;

    switch (unit.type) {
      case "read":
        return <LessonViewer unit={unit} onComplete={handleComplete} />;
      case "quiz":
        return <QuizViewer unit={unit} onComplete={handleComplete} />;
      case "video":
        return <VideoViewer unit={unit} onComplete={handleComplete} />;
      case "task":
        return <TaskViewer unit={unit} onComplete={handleComplete} />;
      default:
        return <div className="text-red-500">Unknown unit type: {unit.type}</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto min-h-[calc(100vh-64px)] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Module
          </button>
          <div className="flex gap-2 items-center text-xs font-bold text-slate-300 px-3 py-1 bg-white/5 rounded-full uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">book</span> Static View
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {error && (
            <div className="glass-card p-6 rounded-2xl border-red-500/30 text-center space-y-4 m-auto w-full max-w-lg">
              <span className="material-symbols-outlined text-4xl text-red-500 block">error</span>
              <p className="text-red-400">{error}</p>
              <button onClick={() => router.back()} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors">
                Go Back
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="flex flex-col items-center justify-center m-auto space-y-6">
              <div className="w-16 h-16 rounded-full border-t-2 border-primary border-r-2 animate-spin shadow-[0_0_15px_rgba(255,179,0,0.4)]"></div>
              <p className="text-primary font-medium">Loading unit content...</p>
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
