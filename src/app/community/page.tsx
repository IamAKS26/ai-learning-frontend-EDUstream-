"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CommunityPage() {
  const trendingTopics = [
    { name: "AI Ethics & Safety", posts: 124, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Next.js 16 Patterns", posts: 89, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Figma for Developers", posts: 56, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Groq vs OpenAI Speed", posts: 42, color: "text-orange-500", bg: "bg-orange-50" }
  ];

  const topContributors = [
    { name: "Sarah Connor", xp: 12450, avatar: "SC", color: "bg-pink-100 text-pink-600" },
    { name: "James Halliday", xp: 10200, avatar: "JH", color: "bg-blue-100 text-blue-600" },
    { name: "Hiro Protagonist", xp: 9850, avatar: "HP", color: "bg-emerald-100 text-emerald-600" },
    { name: "Molly Millions", xp: 8700, avatar: "MM", color: "bg-purple-100 text-purple-600" }
  ];

  const recentDiscussions = [
    { 
      title: "How to effectively prompt Llama 3.1 for code?", 
      author: "Alex Rivera", 
      replies: 12, 
      time: "2h ago",
      tags: ["AI", "Prompting"]
    },
    { 
      title: "Share your study streak! I just hit 30 days.", 
      author: "Jordan Lee", 
      replies: 45, 
      time: "5h ago",
      tags: ["Motivation", "Success"]
    },
    { 
      title: "Help with Tailwind 4 custom themes", 
      author: "Sam Chen", 
      replies: 8, 
      time: "Yesterday",
      tags: ["CSS", "Frontend"]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Community Lounge</h2>
            <p className="text-slate-500 text-lg">Connect with fellow learners, share knowledge, and grow together.</p>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-lg">edit_square</span> Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4 mb-2 overflow-x-auto pb-2 no-scrollbar">
              {["All Discussions", "Announcements", "Study Groups", "Career Advice", "Showcase"].map((tab, i) => (
                <button key={tab} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white text-slate-500 border border-black/5 hover:bg-slate-50'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {recentDiscussions.map((post, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{post.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200" />
                       <span className="text-sm font-bold text-slate-600">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                       <span className="flex items-center gap-1.5 text-xs font-bold">
                         <span className="material-symbols-outlined text-lg">chat_bubble</span> {post.replies}
                       </span>
                       <span className="flex items-center gap-1.5 text-xs font-bold">
                         <span className="material-symbols-outlined text-lg">thumb_up</span> Update
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending section */}
            <section className="glass-card p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">trending_up</span> Trending Topics
               </h3>
               <div className="space-y-4">
                 {trendingTopics.map((topic, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${topic.bg} ${topic.color} flex items-center justify-center font-bold text-xs`}>
                          #{i+1}
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{topic.name}</span>
                     </div>
                     <span className="text-xs text-slate-400 font-medium">{topic.posts} posts</span>
                   </div>
                 ))}
               </div>
            </section>

            {/* Top Contributors */}
            <section className="glass-card p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-accent">leaderboard</span> Leaderboard
               </h3>
               <div className="space-y-5">
                 {topContributors.map((user, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center font-black text-xs shadow-sm`}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{user.xp} XP Earned</p>
                        </div>
                     </div>
                     <div className={`text-xs font-black ${i === 0 ? 'text-primary' : 'text-slate-300'}`}>
                        {i === 0 ? '🏆' : `#${i+1}`}
                     </div>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-6 py-3 border border-black/5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
                 View Full Rankings
               </button>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
