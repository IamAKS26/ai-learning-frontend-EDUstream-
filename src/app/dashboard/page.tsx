"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  isAIGenerated?: boolean;
  isPublished?: boolean;
  lessonsCount?: number;
  createdAt?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/courses")
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myCourses = courses.slice(0, 2); // show first 2 as "suggested"
  const totalUnits = courses.reduce((a, c) => a + (c.lessonsCount ?? 0), 0);

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Welcome */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "Scholar"}.
              </h2>
              <p className="text-slate-500 mt-1">
                Your AI learning environment is ready.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                {courses.length} Course{courses.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">My Courses</p>
              <h3 className="text-2xl font-bold mt-1">
                {loading ? "—" : courses.length}
              </h3>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">Total Units</p>
              <h3 className="text-2xl font-bold mt-1">
                {loading ? "—" : totalUnits}
              </h3>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">Published</p>
              <h3 className="text-2xl font-bold mt-1">
                {loading ? "—" : courses.filter(c => c.isPublished).length}
              </h3>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">AI Insights</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">Live</h3>
            </div>
          </div>
        </section>

        {/* Recent / Suggested Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              {courses.length > 0 ? "Your Courses" : "Get Started"}
            </h3>
            <Link href="/module" className="text-sm font-medium text-primary hover:underline">
              View All Catalog
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4">
              {[1, 2].map(i => (
                <div key={i} className="flex-1 glass-card rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map(course => (
                <div key={course._id} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
                  <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-4xl text-primary/30">auto_stories</span>
                    {course.isAIGenerated && (
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 bg-primary rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        AI Generated
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-bold text-sm mb-1 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">
                      {course.description || "AI-powered learning module."}
                    </p>
                    <div className="flex justify-between items-center">
                      {course.lessonsCount != null && (
                        <span className="text-xs text-slate-500">{course.lessonsCount} units</span>
                      )}
                      <Link
                        href={`/module/${course._id}`}
                        className="text-primary font-bold text-sm hover:text-accent transition-colors flex items-center gap-1 ml-auto"
                      >
                        Start <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-10 text-center space-y-4">
              <span className="material-symbols-outlined text-5xl text-slate-600 block">menu_book</span>
              <p className="text-slate-400">No courses yet. Generate your first AI course!</p>
              <Link
                href="/module"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Generate Course with AI
              </Link>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
