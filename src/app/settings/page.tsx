"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState({
    emailDigests: true,
    studyReminders: true,
    newCourseAlerts: false
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    aiVoice: "neutral"
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-8 pb-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
          <p className="text-slate-500">Manage your profile, preferences, and notifications.</p>
        </div>

        <section className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span> Profile Information
          </h3>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-sm font-medium rounded-lg transition-colors border border-white/5">
                Change Avatar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || "Student User"} 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || "student@nexus.ai"} 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
            
            <button className="mt-4 px-6 py-2.5 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
              Save Changes
            </button>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span> Notifications
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Weekly Activity Digest</h4>
                <p className="text-xs text-slate-500 mt-0.5">Receive a weekly email summarizing your learning progress.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.emailDigests} onChange={() => setNotifications(prev => ({...prev, emailDigests: !prev.emailDigests}))}/>
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[0_0_8px_rgba(255,179,0,0.3)] peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.5)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Study Reminders</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get notified when you haven't logged in for 3 days.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.studyReminders} onChange={() => setNotifications(prev => ({...prev, studyReminders: !prev.studyReminders}))}/>
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[0_0_8px_rgba(255,179,0,0.3)] peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.5)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">New Course Recommendations</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get alerts when AI generates new personalized module paths.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.newCourseAlerts} onChange={() => setNotifications(prev => ({...prev, newCourseAlerts: !prev.newCourseAlerts}))}/>
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[0_0_8px_rgba(255,179,0,0.3)] peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.5)]"></div>
              </label>
            </div>
          </div>
        </section>
        
        <section className="glass-card rounded-2xl p-8 border-red-500/20">
          <h3 className="text-xl font-bold mb-2 text-red-500 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span> Danger Zone
          </h3>
          <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 font-bold rounded-xl transition-all text-sm">
            Delete Account
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
