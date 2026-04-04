"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

interface StudentUser {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatarColor?: string;
  website?: string;
  xp: number;
  badges: number;
  certificates: number;
  learningHours: number;
  createdAt: string;
}

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
  createdAt?: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-sm">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}>★</span>
      ))}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-pink-100 text-pink-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600", "bg-teal-100 text-teal-600"
];

export default function StudentProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [profileData, setProfileData] = useState<{
    user: StudentUser;
    courses: Course[];
    totalViews: number;
    totalEnrolled: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/community/profile/${userId}`);
      setProfileData(res.data);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="bg-white rounded-3xl border border-black/5 p-8 flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-56 bg-slate-200 rounded-lg" />
              <div className="h-4 w-80 bg-slate-200 rounded-lg" />
              <div className="flex gap-4 mt-4">
                {[1,2,3,4].map(i => <div key={i} className="h-16 w-24 bg-slate-200 rounded-xl" />)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2].map(i => <div key={i} className="bg-slate-200 rounded-2xl h-52" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profileData) {
    return (
      <DashboardLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Profile Not Found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link href="/community" className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-full text-sm">
            Back to Community
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { user, courses, totalViews, totalEnrolled } = profileData;
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colorClass = user.avatarColor || AVATAR_COLORS[user._id.charCodeAt(user._id.length - 1) % AVATAR_COLORS.length];
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Back link */}
        <Link href="/community" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors w-fit">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Community
        </Link>

        {/* Profile Hero */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />

          <div className="px-8 pb-8 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black flex-shrink-0 ${colorClass}`}>
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{user.email} · Member since {memberSince}</p>
                {user.bio && <p className="text-slate-600 text-sm mt-2 max-w-lg">{user.bio}</p>}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-sm mt-2 hover:underline w-fit">
                    <span className="material-symbols-outlined text-base">link</span>{user.website}
                  </a>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-8">
              {[
                { label: "Courses Published", value: courses.length, icon: "library_books" },
                { label: "Total Views", value: totalViews.toLocaleString(), icon: "visibility" },
                { label: "Total Enrolled", value: totalEnrolled.toLocaleString(), icon: "school" },
                { label: "Total XP", value: user.xp.toLocaleString(), icon: "bolt" },
                { label: "Badges", value: user.badges, icon: "military_tech" },
                { label: "Certificates", value: user.certificates, icon: "workspace_premium" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-black/5">
                  <span className="material-symbols-outlined text-primary text-xl block mb-1">{stat.icon}</span>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Published Courses */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Published Courses
            <span className="ml-2 text-sm font-medium text-slate-400">({courses.length})</span>
          </h2>

          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">library_add</span>
              <p className="text-slate-500 font-medium">No published courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Link
                  href={`/module/${course._id}`}
                  key={course._id}
                  onClick={async () => { try { await apiClient.post(`/community/view/${course._id}`); } catch {} }}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {course.level && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        course.level === "Beginner" ? "bg-emerald-50 text-emerald-600" :
                        course.level === "Intermediate" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>{course.level}</span>
                    )}
                    {course.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{course.category}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-black/5">
                    <StarDisplay rating={course.rating} />
                    <span className="text-xs font-bold text-slate-700">{course.rating > 0 ? course.rating.toFixed(1) : "–"}</span>
                    <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">visibility</span>{course.views}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">school</span>{course.enrolledCount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
