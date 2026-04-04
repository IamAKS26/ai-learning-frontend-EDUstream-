"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { SkeletonBar, SkeletonBlock } from "@/components/Skeleton";

export default function SettingsPage() {
  const { user } = useAuth();
  const [initializing, setInitializing] = useState(true);
  
  const [notifications, setNotifications] = useState({
    emailDigests: true,
    studyReminders: true,
    newCourseAlerts: false
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    aiVoice: "neutral"
  });

  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (initializing) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="space-y-2">
            <SkeletonBar className="h-8 w-36" />
            <SkeletonBar className="h-4 w-72" />
          </div>
          {/* Profile section */}
          <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm space-y-6">
            <SkeletonBar className="h-6 w-40" />
            <div className="flex items-center gap-6">
              <SkeletonBlock className="w-20 h-20 rounded-full" />
              <SkeletonBar className="h-9 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <SkeletonBar className="h-3 w-20" />
                <SkeletonBar className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <SkeletonBar className="h-3 w-28" />
                <SkeletonBar className="h-11 w-full rounded-xl" />
              </div>
            </div>
            <SkeletonBar className="h-11 w-36 rounded-xl" />
          </div>
          {/* Notifications section */}
          <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm space-y-6">
            <SkeletonBar className="h-6 w-32" />
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <SkeletonBar className="h-4 w-40" />
                  <SkeletonBar className="h-3 w-64" />
                </div>
                <SkeletonBlock className="w-11 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-8 pb-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Settings</h2>
          <p className="text-slate-500">Manage your profile, preferences, and notifications.</p>
        </div>

        <section className="glass-card rounded-2xl p-8 bg-white border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-primary">person</span> Profile Information
          </h3>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary shadow-inner">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <button className="px-4 py-2 bg-white hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all border border-black/5 shadow-sm">
                Change Avatar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || "Student User"} 
                  className="w-full bg-slate-50 border border-black/5 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || "student@edustream.io"} 
                  className="w-full bg-slate-50 border border-black/5 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
            
            <button className="mt-4 px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-[0_4px_12px_rgba(255,179,0,0.2)]">
              Save Changes
            </button>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-8 bg-white border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-primary">notifications</span> Notifications
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Weekly Activity Digest</h4>
                <p className="text-xs text-slate-500 mt-0.5">Receive a weekly email summarizing your learning progress.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.emailDigests} onChange={() => setNotifications(prev => ({...prev, emailDigests: !prev.emailDigests}))}/>
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.4)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Study Reminders</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get notified when you haven't logged in for 3 days.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.studyReminders} onChange={() => setNotifications(prev => ({...prev, studyReminders: !prev.studyReminders}))}/>
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.4)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">New Course Recommendations</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get alerts when AI generates new personalized module paths.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.newCourseAlerts} onChange={() => setNotifications(prev => ({...prev, newCourseAlerts: !prev.newCourseAlerts}))}/>
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.4)]"></div>
              </label>
            </div>
          </div>
        </section>
        
        <section className="glass-card rounded-2xl p-8 border-red-500/20">
          <h3 className="text-xl font-bold mb-2 text-red-500 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span> Danger Zone
          </h3>
          <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 font-bold rounded-xl transition-all text-sm">
            Delete Account
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
