"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function AnalyticsPage() {
  const skills = [
    { name: "Frontend Development", score: 92, color: "bg-primary", shadow: "shadow-[0_0_8px_#FFB300]" },
    { name: "UI/UX Design", score: 85, color: "bg-accent", shadow: "shadow-[0_0_8px_#FFD700]" },
    { name: "Backend APIs", score: 64, color: "bg-blue-400", shadow: "shadow-[0_0_8px_#60A5FA]" },
    { name: "Database Design", score: 40, color: "bg-purple-400", shadow: "shadow-[0_0_8px_#C084FC]" },
    { name: "DevOps", score: 25, color: "bg-emerald-400", shadow: "shadow-[0_0_8px_#34D399]" }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Learning Analytics</h2>
          <p className="text-slate-500">Deep dive into your performance, knowledge grasp, and skill breakdown.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <span className="material-symbols-outlined text-3xl text-primary mb-3">timer</span>
            <p className="text-slate-500 text-sm font-medium">Total Focus Time</p>
            <h3 className="text-3xl font-bold mt-1">42.5<span className="text-lg text-slate-500 ml-1">hrs</span></h3>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <span className="material-symbols-outlined text-3xl text-accent mb-3">quiz</span>
            <p className="text-slate-500 text-sm font-medium">Avg. Quiz Score</p>
            <h3 className="text-3xl font-bold mt-1">88<span className="text-lg text-slate-500 ml-1">%</span></h3>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <span className="material-symbols-outlined text-3xl text-blue-400 mb-3">local_fire_department</span>
            <p className="text-slate-500 text-sm font-medium">Longest Streak</p>
            <h3 className="text-3xl font-bold mt-1">15<span className="text-lg text-slate-500 ml-1">days</span></h3>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <span className="material-symbols-outlined text-3xl text-emerald-400 mb-3">check_circle</span>
            <p className="text-slate-500 text-sm font-medium">Tasks Completed</p>
            <h3 className="text-3xl font-bold mt-1">124</h3>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Skill Profile Matrix</h3>
            <div className="space-y-5">
              {skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-slate-500">{skill.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${skill.color} rounded-full ${skill.shadow}`} 
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Focus Time (Past Week)</h3>
              <select className="bg-slate-100 border-none rounded text-xs px-2 py-1 outline-none text-slate-700 pointer-events-none">
                <option>This Week</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {[2, 4, 3.5, 5, 2.5, 6, 4].map((hrs, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full relative flex items-end justify-center h-full rounded-t flex-1 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <div 
                      className="w-full bg-primary/80 group-hover:bg-primary group-hover:shadow-[0_0_12px_rgba(255,179,0,0.5)] transition-all rounded-t" 
                      style={{ height: `${(hrs / 8) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
