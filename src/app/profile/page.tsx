"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  rating: number;
  ratingsCount: number;
  views: number;
  enrolledCount: number;
  lessonsCount?: number;
  isPublished: boolean;
  createdAt?: string;
}

interface Stats {
  xp: number;
  badges: number;
  certificates: number;
  streak: number;
  learningHours: number;
}

const AVATAR_COLORS = [
  "from-amber-400 to-orange-500",
  "from-violet-500 to-purple-600",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-pink-500",
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-xs">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}>★</span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({ xp: 0, badges: 0, certificates: 0, streak: 0, learningHours: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "published">("courses");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("Passionate learner on a mission to master AI & Full Stack dev. 🚀");
  const [website, setWebsite] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "U";
  const gradientClass = user?._id
    ? AVATAR_COLORS[user._id.charCodeAt(user._id.length - 1) % AVATAR_COLORS.length]
    : AVATAR_COLORS[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, coursesRes] = await Promise.all([
        apiClient.get("/stats/overview"),
        apiClient.get("/courses"),
      ]);
      setStats({
        xp: statsRes.data.xp || 0,
        badges: statsRes.data.badges || 0,
        certificates: statsRes.data.certificates || 0,
        streak: statsRes.data.streak || 0,
        learningHours: statsRes.data.learningHours || 0,
      });
      setCourses(statsRes.data.courses || coursesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

  const publishedCourses = courses.filter((c) => c.isPublished);
  const allCourses = courses;

  const handleSaveBio = async () => {
    setSavingBio(true);
    // Optimistic — save locally since no profile update endpoint yet
    await new Promise((r) => setTimeout(r, 600));
    setSavingBio(false);
    setIsEditingBio(false);
  };

  const memberSince = user ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-0">

          {/* ── Cover + Avatar ─────────────────────────────────────── */}
          <div className="relative">
            {/* Cover Banner */}
            <div className="h-44 md:h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative">
              {/* animated mesh */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,179,0,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,100,0,0.3) 0%, transparent 40%), radial-gradient(circle at 60% 80%, rgba(100,200,255,0.2) 0%, transparent 40%)"
              }} />
              <div className="absolute bottom-4 right-4">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white/70 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[14px]">edit</span> Edit Cover
                </button>
              </div>
            </div>

            {/* Avatar — overlaps cover */}
            <div className="absolute -bottom-12 left-6 md:left-10">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br ${gradientClass}`}>
                {initials}
              </div>
            </div>

            {/* Edit Profile + View Public buttons */}
            <div className="absolute -bottom-12 right-0 flex items-center gap-2">
              <Link
                href={user ? `/community/profile/${user._id}` : "#"}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-black/5 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span className="hidden md:inline">Public View</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-900 bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                <span className="hidden md:inline">Settings</span>
              </Link>
            </div>
          </div>

          {/* ── Identity ───────────────────────────────────────────── */}
          <div className="pt-16 pb-6 px-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || "Student User"}</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full border border-primary/20">
                  Student
                </span>
                {stats.streak > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-500 rounded-full border border-orange-200">
                    🔥 {stats.streak}-day streak
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{user?.email} · Member since {memberSince}</p>

              {/* Bio */}
              {isEditingBio ? (
                <div className="space-y-2 mt-1">
                  <textarea
                    autoFocus
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    maxLength={150}
                    className="w-full max-w-lg text-sm text-slate-700 bg-slate-50 border border-black/10 rounded-xl px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Write a short bio..."
                  />
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full max-w-lg text-sm text-slate-700 bg-slate-50 border border-black/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveBio} disabled={savingBio} className="px-4 py-1.5 text-xs font-bold bg-primary text-slate-900 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50">
                      {savingBio ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => setIsEditingBio(false)} className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 mt-1 group/bio">
                  <div>
                    <p className="text-sm text-slate-600 max-w-lg">{bio || "No bio yet."}</p>
                    {website && (
                      <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-xs mt-1 hover:underline">
                        <span className="material-symbols-outlined text-[12px]">link</span>{website}
                      </a>
                    )}
                  </div>
                  <button onClick={() => setIsEditingBio(true)} className="opacity-0 group-hover/bio:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats Strip ───────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 animate-pulse">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 bg-slate-200 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: "Total XP", value: stats.xp.toLocaleString(), icon: "bolt", color: "text-amber-500" },
                { label: "Courses", value: allCourses.length, icon: "library_books", color: "text-blue-500" },
                { label: "Published", value: publishedCourses.length, icon: "public", color: "text-emerald-500" },
                { label: "Badges", value: stats.badges, icon: "military_tech", color: "text-purple-500" },
                { label: "Certs", value: stats.certificates, icon: "workspace_premium", color: "text-rose-500" },
                { label: "Hours", value: stats.learningHours, icon: "schedule", color: "text-teal-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-3 md:p-4 text-center border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <span className={`material-symbols-outlined text-xl md:text-2xl block mb-1 ${s.color}`}>{s.icon}</span>
                  <p className="text-xl md:text-2xl font-black text-slate-900">{s.value}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── XP Progress Bar ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Level Progress</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {stats.xp} / {Math.ceil(stats.xp / 1000) * 1000} XP to next level
                </p>
              </div>
              <span className="text-xs font-black px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full border border-primary/20">
                Lv. {Math.floor(stats.xp / 1000) + 1}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.xp % 1000) / 10)}%` }}
              />
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 border-b border-black/5 pt-6 mt-2">
            {[
              { key: "courses", label: "All Courses", icon: "grid_view", count: allCourses.length },
              { key: "published", label: "Published", icon: "public", count: publishedCourses.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "courses" | "published")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* ── Course Grid ───────────────────────────────────────── */}
          <div className="pt-4 pb-16">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (activeTab === "courses" ? allCourses : publishedCourses).length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
                <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">
                  {activeTab === "published" ? "public_off" : "folder_off"}
                </span>
                <h3 className="text-lg font-bold text-slate-500 mb-2">
                  {activeTab === "published" ? "No published courses yet" : "No courses yet"}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {activeTab === "published"
                    ? "Publish one of your courses to share with the community."
                    : "Generate your first AI-powered course to get started."}
                </p>
                <Link
                  href="/module"
                  className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-full text-sm inline-block hover:bg-primary/90 transition-all"
                >
                  {activeTab === "published" ? "My Courses" : "Generate a Course"}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(activeTab === "courses" ? allCourses : publishedCourses).map((course) => (
                  <Link
                    key={course._id}
                    href={`/module/${course._id}`}
                    className="group relative bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                  >
                    {/* Color top bar */}
                    <div className={`h-1.5 ${
                      course.level === "Beginner" ? "bg-emerald-400" :
                      course.level === "Intermediate" ? "bg-blue-400" : "bg-purple-400"
                    }`} />

                    <div className="p-4 flex flex-col gap-2 flex-1">
                      {/* Published badge */}
                      {course.isPublished && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Live
                        </span>
                      )}

                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h4>

                      {course.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 hidden md:block">{course.description}</p>
                      )}

                      <div className="mt-auto pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <StarDisplay rating={course.rating} />
                          {course.ratingsCount > 0 && (
                            <span className="text-[10px] text-slate-400">({course.ratingsCount})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">visibility</span>
                            {course.views || 0}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">school</span>
                            {course.enrolledCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay arrow */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
