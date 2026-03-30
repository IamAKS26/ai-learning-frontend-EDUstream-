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
    apiClient.get("/courses?t=" + Date.now())
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myCourses = courses.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-[2.5rem] font-bold tracking-tight text-slate-900 flex items-center gap-3">
              Welcome back, {user?.name?.split(" ")[0] || "Nafis"}! <span className="text-4xl">👋</span>
            </h2>
            <p className="text-slate-500 mt-2 text-base">
              Keep learning and earn 50 XP today! You're on a <span className="font-semibold text-slate-700">5-day streak!</span>
            </p>
          </div>

          <div className="flex items-center gap-8 bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="text-center px-4 border-r border-slate-100 last:border-0">
              <h3 className="text-4xl font-semibold text-slate-900">480</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">Total XP</p>
            </div>
            <div className="text-center px-4 border-r border-slate-100 last:border-0">
              <h3 className="text-4xl font-semibold text-slate-900">15</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">Badges Earned</p>
            </div>
            <div className="text-center px-4 border-r border-slate-100 last:border-0">
              <h3 className="text-4xl font-semibold text-slate-900">12</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-medium">Certificates</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart & Courses */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Learning Hours Chart */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm h-80 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900">Learning Hours</h3>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> UI/UX Design <span className="text-slate-900 ml-1">82%</span></span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Development <span className="text-slate-900 ml-1">12%</span></span>
                  </div>
                </div>
                <select className="text-sm bg-transparent border-none text-slate-500 font-medium outline-none cursor-pointer">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>

              {/* Chart Placeholder (Bar chart) */}
              <div className="flex-1 flex items-end justify-between gap-2 pt-4 relative">
                 {/* Y-axis labels */}
                 <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 pb-6">
                   <span>180</span><span>120</span><span>80</span><span>40</span><span>20</span><span>0</span>
                 </div>
                 <div className="flex-1 flex items-end justify-around pl-8 h-full pb-6 relative z-10">
                   {/* Dummy Bars */}
                   {[40, 60, 50, 80, 70, 90, 100, 60, 50, 40, 20, 10].map((h, i) => (
                     <div key={i} className="flex flex-col gap-1 items-center justify-end h-full w-full px-1 group">
                       <div className="w-full bg-slate-100 rounded-t-md relative flex items-end overflow-hidden h-full group-hover:bg-slate-200 transition-colors">
                          <div style={{height: `${h}%`}} className="w-full bg-primary rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity"></div>
                       </div>
                       <span className="text-[10px] text-slate-400 font-medium mt-2">
                         {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                       </span>
                     </div>
                   ))}
                 </div>
                 {/* Grid lines */}
                 <div className="absolute inset-0 pl-8 pb-6 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                 </div>
              </div>
            </div>

            {/* Courses (horizontal scroll or grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {loading ? (
                <div className="flex gap-4 col-span-2">
                  {[1, 2].map(i => (
                    <div key={i} className="flex-1 bg-white rounded-3xl h-48 animate-pulse shadow-sm border border-black/5" />
                  ))}
                </div>
              ) : myCourses.length > 0 ? (
                myCourses.map(course => (
                  <Link href={`/module/${course._id}`} key={course._id} className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-slate-900 leading-tight pr-8">{course.title}</h4>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors absolute right-5 top-5">
                        <span className="material-symbols-outlined text-[16px] -rotate-45">arrow_forward</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Masud Hasan • Instructor</p>
                    <div className="flex items-center gap-4 mt-2 mb-1">
                      <div>
                        <span className="text-xl font-bold text-slate-900">20</span>
                        <span className="text-xs text-slate-500 ml-1">Hours</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900">{course.lessonsCount || 15}</span>
                        <span className="text-xs text-slate-500 ml-1">Lessons</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">Beginner</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">Design</span>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-500">On Progress</span>
                        <span className="text-slate-900">60%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full w-[60%] relative">
                           {/* Add stripe effect if wanted */}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
               ) : (
                <div className="col-span-2 bg-white rounded-3xl p-8 border border-black/5 shadow-sm text-center">
                  <p className="text-slate-500 mb-4">No courses enrolled yet.</p>
                  <Link href="/module" className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-full text-sm inline-block shadow-sm hover:shadow-md transition-all">Explore Catalog</Link>
                </div>
               )}
            </div>

          </div>

          {/* Right Column: Calendar & Upcoming */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Calendar</h3>
                <span className="text-xs font-semibold text-slate-500">OCT 2025</span>
              </div>
              <div className="flex justify-between items-center text-center">
                 {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
                   <div key={d} className="flex flex-col gap-2 items-center">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer ${i === 2 ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}`}>
                       {14 + i}
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Class</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBF9F1] border border-[#F4EED8]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined">design_services</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">UI/UX Design Masterclass</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Today, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Advanced React Patterns</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
