"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  lessonsCount?: number;
  isAIGenerated?: boolean;
  isPublished?: boolean;
  createdBy?: string;
}

export default function ModuleCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [showForm, setShowForm] = useState(false);
  const [genError, setGenError] = useState("");
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/courses?t=" + Date.now());
      setCourses(res.data);
    } catch {
      setError("Failed to load courses. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError("");
    try {
      await apiClient.post("/courses/generate", { topic: topic.trim(), level });
      setTopic("");
      setShowForm(false);
      await fetchCourses(); // refresh list
    } catch (err: any) {
      setGenError(err.response?.data?.message || "Course generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/courses/${deletingCourse._id}`);
      setCourses(prev => prev.filter(c => c._id !== deletingCourse._id));
      setDeletingCourse(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const levelColors: Record<string, string> = {
    Beginner:     "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-accent/20 text-accent border-accent/30",
    Advanced:     "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Module Catalog</h2>
            <p className="text-slate-500 mt-1">AI-tailored courses — browse or generate your own.</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(255,179,0,0.25)] text-sm"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate with AI
          </button>
        </div>

        {/* AI Generate Form */}
        {showForm && (
          <div className="glass-card rounded-2xl p-6 border border-primary/20 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Generate a New Course
            </h3>
            <p className="text-sm text-slate-400">
              The AI will plan a full course outline, then generate lessons and quizzes for every topic.
              <span className="text-primary font-medium"> This takes ~30–60 seconds.</span>
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder='e.g. "Python for Data Science"'
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-primary/50 outline-none"
              />
              <select
                value={level}
                onChange={e => setLevel(e.target.value as typeof level)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="submit"
                disabled={generating}
                className="px-5 py-2.5 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating
                  ? <><div className="w-4 h-4 border-2 border-background-dark/40 border-t-background-dark rounded-full animate-spin" /> Generating...</>
                  : <><span className="material-symbols-outlined text-sm">bolt</span> Generate</>
                }
              </button>
            </form>
            {genError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> {genError}
              </p>
            )}
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 py-12 justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading courses...</span>
          </div>
        )}

        {error && (
          <div className="glass-card rounded-2xl p-6 border border-red-500/20 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-red-400 block">cloud_off</span>
            <p className="text-red-400">{error}</p>
            <button onClick={fetchCourses} className="text-sm text-primary hover:underline">Retry</button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <span className="material-symbols-outlined text-6xl text-slate-700 block">menu_book</span>
                <p className="text-slate-500">No courses yet. Generate your first one with AI!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course._id} className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:border-white/15 transition-all">
                    {/* Thumbnail */}
                    <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-5xl text-primary/30">auto_stories</span>
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        {course.isAIGenerated && (
                          <span className="px-2 py-0.5 bg-primary/90 rounded text-[10px] font-bold text-background-dark uppercase tracking-wider">
                            AI Generated
                          </span>
                        )}
                        {course.isPublished && (
                          <span className="px-2 py-0.5 bg-green-500/80 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                            Published
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingCourse(course); }}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/80 text-red-500 hover:text-white rounded-lg transition-colors backdrop-blur-md"
                          title="Delete Course"
                        >
                          <span className="material-symbols-outlined text-sm block">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      {/* Level badge */}
                      {course.level && (
                        <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border mb-2 ${levelColors[course.level] ?? "bg-white/5 text-slate-400 border-white/10"}`}>
                          {course.level}
                        </span>
                      )}

                      <h4 className="font-bold text-base mb-1 line-clamp-2">{course.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-3">
                        {course.description || "A specialized module created by the AI personalization engine."}
                      </p>

                      {course.lessonsCount != null && course.lessonsCount > 0 && (
                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">layers</span>
                          {course.lessonsCount} units
                          {course.category && <> · {course.category}</>}
                        </p>
                      )}

                      <Link
                        href={`/module/${course._id}`}
                        className="w-full py-2 bg-white/5 border border-white/10 text-white text-center text-sm font-semibold rounded-lg hover:bg-primary/20 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-6 rounded-2xl border border-red-500/20 shadow-2xl animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-xl font-bold">Delete Course?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">"{deletingCourse.title}"</span>? This will permanently remove all associated modules, lessons, and quizzes. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingCourse(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold rounded-xl transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
