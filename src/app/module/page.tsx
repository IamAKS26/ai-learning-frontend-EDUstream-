"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { SkeletonCourseCard } from "@/components/Skeleton";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [showForm, setShowForm] = useState(false);
  const [genError, setGenError] = useState("");
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("My Courses"); // Ref Tabs

  const courses = [
    {
       _id: "demo1",
       title: "UI/UX Design with Figma",
       instructor: "Sarah Johnson",
       level: "Beginner",
       category: "Design",
       hours: 20,
       lessonsCount: 15,
       progress: 60
    },
    {
       _id: "demo2",
       title: "Advanced React Patterns",
       instructor: "Masud Hasan",
       level: "Advanced",
       category: "Development",
       hours: 24,
       lessonsCount: 18,
       progress: 15
    },
    {
       _id: "demo3",
       title: "Framer Development",
       instructor: "Sarah Johnson",
       level: "Intermediate",
       category: "Development",
       hours: 14,
       lessonsCount: 12,
       progress: 35
    },
    {
       _id: "demo4",
       title: "Python for Data Science",
       instructor: "AI Instructor",
       level: "Beginner",
       category: "Data Science",
       hours: 30,
       lessonsCount: 22,
       progress: 0
    }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError("");
    try {
      await apiClient.post("/courses/generate", { topic: topic.trim(), level });
      setTopic("");
      setShowForm(false);
      // await fetchCourses(); // refresh list
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
      // In a real app we'd refresh courses here. For dummy data, just clear the modal.
      setDeletingCourse(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Search Bar Placeholder (Centered) */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
               type="text" 
               placeholder="Search" 
               className="w-full bg-white border border-black/5 shadow-sm rounded-full pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/50" 
            />
          </div>
        </div>

        {/* Tabs & Generate Button */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4 px-2">
          <div className="flex items-center gap-2">
            {['My Courses', 'Enrolled', 'Available'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === tab ? 'bg-[#FEF3C7] text-slate-900' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate
          </button>
        </div>

        {/* AI Generate Form */}
        {showForm && (
          <div className="bg-white rounded-3xl p-6 border border-primary/20 shadow-lg space-y-4 slide-up">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
              <span className="material-symbols-outlined text-primary text-2xl">magic_button</span>
              Generate a New Course
            </h3>
            <p className="text-sm text-slate-500">
              The AI will plan a full course outline, then generate lessons and quizzes for every topic.
              <span className="text-primary font-semibold"> This takes ~30–60 seconds.</span>
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder='e.g. "Python for Data Science"'
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-primary outline-none"
              />
              <select
                value={level}
                onChange={e => setLevel(e.target.value as typeof level)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="submit"
                disabled={generating}
                className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              >
                {generating
                  ? <><div className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" /> ...</>
                  : <><span className="material-symbols-outlined text-sm">bolt</span> Generate</>
                }
              </button>
            </form>
            {genError && (
              <p className="text-red-500 text-sm font-semibold flex items-center gap-1 mt-2">
                 <span className="material-symbols-outlined text-sm">error</span> {genError}
              </p>
            )}
          </div>
        )}

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-3xl p-6 border border-red-100 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-red-500 block">cloud_off</span>
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={() => setError("")} className="px-4 py-2 bg-white text-sm text-red-600 font-bold border border-red-200 rounded-lg shadow-sm">Dismiss</button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-black/5 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 block">menu_book</span>
                <p className="text-slate-500 font-medium">No courses yet. Generate your first one with AI!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => (
                  <Link href={`/module/${course._id}`} key={course._id} className="bg-white rounded-[1.5rem] p-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4 relative overflow-hidden">
                    
                    {/* Fake Delete Button overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingCourse(course); }}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors border border-red-100 shadow-sm"
                        title="Delete Course"
                      >
                        <span className="material-symbols-outlined text-sm block">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-start mt-2">
                       {/* Icon box or AI tag */}
                       <div className="flex flex-col gap-2 w-full">
                         <div className="flex justify-between items-start w-full gap-2">
                           <h4 className="font-bold text-lg text-slate-900 leading-tight pr-6">{course.title}</h4>
                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                             <span className="material-symbols-outlined text-[16px] -rotate-45">arrow_forward</span>
                           </div>
                         </div>
                         <p className="text-xs text-slate-500 font-medium mb-1">
                           {course.title === "Python for Data Science" ? "AI Generated • Instructor" : `${course.instructor} • Instructor`}
                         </p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 mb-2">
                      <div>
                        <span className="text-xl font-bold text-slate-900">20</span>
                        <span className="text-xs text-slate-500 ml-1">Hours</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900">{course.lessonsCount || 15}</span>
                        <span className="text-xs text-slate-500 ml-1">Lessons</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">
                        {course.level || "Beginner"}
                      </span>
                      {course.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">
                          {course.category}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className="text-slate-500">On Progress</span>
                        <span className="text-slate-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-[#FCF8E8] rounded-full h-2 overflow-hidden flex">
                         {/* Stripe effect exactly like image */}
                         <div className="bg-[#FEF0C7] h-full border-r-2 border-white relative overflow-hidden" style={{width: `${course.progress}%`}}>
                           <div className="absolute inset-0 opacity-30" style={{backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #FFB300 2px, #FFB300 4px)"}}></div>
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-6 rounded-3xl border border-black/5 shadow-2xl animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-xl font-bold text-slate-900">Delete Course?</h3>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <span className="text-slate-900 font-semibold">"{deletingCourse.title}"</span>? This will permanently remove all associated modules, lessons, and quizzes. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setDeletingCourse(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-colors text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-red-500/20"
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
