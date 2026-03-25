"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";

interface Unit {
  _id: string;
  title: string;
  type: "read" | "quiz" | "video" | "task";
  duration?: string;
}

interface Module {
  _id: string;
  title: string;
  units: Unit[];
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  duration?: string;
  lessonsCount?: number;
  isAIGenerated?: boolean;
  isPublished?: boolean;
}

const typeIcon: Record<string, string> = {
  read:  "auto_stories",
  quiz:  "quiz",
  video: "play_circle",
  task:  "code_blocks",
};

const typeLabel: Record<string, string> = {
  read:  "Lesson",
  quiz:  "Quiz",
  video: "Video",
  task:  "Task",
};

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.moduleId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Fetch course info
        const courseRes = await apiClient.get(`/courses/${courseId}`);
        const courseData: Course = courseRes.data;
        setCourse(courseData);

        // 2. Fetch modules for this course
        const modulesRes = await apiClient.get(`/modules/${courseId}`);
        const rawModules: Array<{ _id: string; title: string }> = modulesRes.data;

        // 3. Fetch units for each module in parallel
        const modulesWithUnits: Module[] = await Promise.all(
          rawModules.map(async (mod) => {
            try {
              const unitsRes = await apiClient.get(`/units/${mod._id}`);
              return { ...mod, units: unitsRes.data as Unit[] };
            } catch {
              return { ...mod, units: [] };
            }
          })
        );

        setModules(modulesWithUnits);
        // Expand the first module by default
        if (modulesWithUnits.length > 0) {
          setExpandedModules(new Set([modulesWithUnits[0]._id]));
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("This course is not published yet.");
        } else if (err.response?.status === 404) {
          setError("Course not found.");
        } else {
          setError(err.response?.data?.message || "Failed to load course.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishMsg("");
    try {
      await apiClient.put(`/courses/${courseId}/publish`);
      setPublishMsg("Course published successfully! 🎉");
      setCourse(prev => prev ? { ...prev, isPublished: true } : prev);
    } catch (err: any) {
      setPublishMsg(err.response?.data?.message || "Failed to publish.");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    setPublishMsg("");
    try {
      await apiClient.put(`/courses/${courseId}/unpublish`);
      setPublishMsg("Course unpublished.");
      setCourse(prev => prev ? { ...prev, isPublished: false } : prev);
    } catch (err: any) {
      setPublishMsg(err.response?.data?.message || "Failed to unpublish.");
    } finally {
      setPublishing(false);
    }
  };

  const totalUnits = modules.reduce((sum, m) => sum + m.units.length, 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Link href="/module" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Back to Catalog
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading course...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card rounded-2xl p-10 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-red-400 block">error</span>
            <p className="text-red-400">{error}</p>
            <button onClick={() => router.push("/module")} className="text-primary hover:underline text-sm">
              Back to Catalog
            </button>
          </div>
        )}

        {/* Course detail */}
        {!loading && !error && course && (
          <>
            {/* Hero */}
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-7xl text-primary/25">school</span>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent" />
                <div className="absolute bottom-4 left-6 flex gap-2">
                  {course.isAIGenerated && (
                    <span className="px-2 py-0.5 bg-primary/90 rounded text-[10px] font-bold text-background-dark uppercase">AI Generated</span>
                  )}
                  {course.isPublished && (
                    <span className="px-2 py-0.5 bg-green-500/80 rounded text-[10px] font-bold text-white uppercase">Published</span>
                  )}
                  {course.level && (
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-slate-300 uppercase">{course.level}</span>
                  )}
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                {course.category && <p className="text-xs text-primary uppercase tracking-wider font-bold mb-3">{course.category}</p>}
                <p className="text-slate-400 leading-relaxed max-w-2xl mb-6">
                  {course.description || "This course is generated dynamically by the AI Engine to adapt to your learning pace and prior knowledge."}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-8">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span> {course.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">account_tree</span>
                    {modules.length} module{modules.length !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">layers</span>
                    {totalUnits} unit{totalUnits !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Publish controls */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link
                    href={`/learn/${course._id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(255,179,0,0.2)]"
                  >
                    Launch AI Learning Engine
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  </Link>

                  {!course.isPublished ? (
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-xl hover:bg-green-500/20 transition-all text-sm disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">publish</span>
                      {publishing ? "Publishing..." : "Publish Course"}
                    </button>
                  ) : (
                    <button
                      onClick={handleUnpublish}
                      disabled={publishing}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-slate-400 font-semibold rounded-xl hover:bg-white/10 transition-all text-sm disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">unpublished</span>
                      {publishing ? "Unpublishing..." : "Unpublish"}
                    </button>
                  )}
                </div>

                {publishMsg && (
                  <p className={`text-sm mt-2 ${publishMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>
                    {publishMsg}
                  </p>
                )}
              </div>
            </div>

            {/* Module → Unit Hierarchy */}
            {modules.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_tree</span>
                  Course Content
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    ({modules.length} modules · {totalUnits} units)
                  </span>
                </h2>

                {modules.map((mod, modIndex) => (
                  <div key={mod._id} className="glass-card rounded-2xl overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(mod._id)}
                      className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-bold">{modIndex + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">{mod.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{mod.units.length} unit{mod.units.length !== 1 ? "s" : ""}</p>
                      </div>
                      <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${expandedModules.has(mod._id) ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </button>

                    {/* Unit List */}
                    {expandedModules.has(mod._id) && (
                      <div className="border-t border-white/5 divide-y divide-white/5">
                        {mod.units.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-slate-500 italic">No units in this module yet.</p>
                        ) : (
                          mod.units.map((unit, unitIndex) => (
                            <Link
                              href={`/unit/${unit._id}`}
                              key={unit._id}
                              className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-base">
                                  {typeIcon[unit.type] ?? "article"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-primary transition-colors">
                                  {unit.title || `Unit ${unitIndex + 1}`}
                                </p>
                                <p className="text-xs text-slate-500">{typeLabel[unit.type] ?? unit.type}</p>
                              </div>
                              {unit.duration && unit.duration !== "00:00" && (
                                <span className="text-xs text-slate-500 flex-shrink-0">{unit.duration}</span>
                              )}
                              <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors text-sm opacity-0 group-hover:opacity-100">
                                arrow_forward_ios
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state — no modules yet */}
            {!loading && modules.length === 0 && (
              <div className="glass-card rounded-2xl p-10 text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-slate-600 block">account_tree</span>
                <p className="text-slate-400">No modules found for this course.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
