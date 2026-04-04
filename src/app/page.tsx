"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight, 
  BrainCircuit, 
  BookOpenCheck, 
  LineChart, 
  FileCheck2,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Typing animation state
  const typingWords = ["Learn Smarter", "Code Faster", "Think Deeper", "Build Faster"];
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
    // Check auth
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }

    // Check theme
    const savedTheme = localStorage.getItem("edustream-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, [router]);

  // Typing animation effect
  useEffect(() => {
    if (!isMounted) return;
    
    // Determine typing speed
    const baseSpeed = isDeleting ? 80 : 180;
    const currentWord = typingWords[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        const nextPartial = currentWord.substring(0, currentText.length + 1);
        setCurrentText(nextPartial);
        
        if (nextPartial === currentWord) {
          // Finished typing, pause before deleting
          setIsDeleting(true);
        }
      } else {
        // Deleting backward
        const nextPartial = currentWord.substring(0, currentText.length - 1);
        setCurrentText(nextPartial);
        
        if (nextPartial === "") {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typingWords.length);
        }
      }
    }, currentText === currentWord && !isDeleting ? 2000 : baseSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, textIndex, isMounted]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("edustream-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("edustream-theme", "dark");
      setIsDark(true);
    }
  };

  // Prevent hydration mismatch flashes
  if (!isMounted) return null;

  const features = [
    {
      title: "AI Tutor",
      description: "Get personalized guidance, explanations, and instant feedback directly in your study sessions.",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Smart Notes",
      description: "Capture key insights and let our AI automatically structure and highlight important concepts.",
      icon: <BookOpenCheck className="w-6 h-6" />,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Progress Tracking",
      description: "Visualize your learning journey with detailed analytics and skill mastery dashboards.",
      icon: <LineChart className="w-6 h-6" />,
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "AI Generated Quizzes",
      description: "Test your knowledge dynamically with context-aware quizzes tailored to your weak points.",
      icon: <FileCheck2 className="w-6 h-6" />,
      color: "from-rose-400 to-red-500"
    }
  ];

  const steps = [
    { num: "01", title: "Choose a Course", desc: "Select from curated AI-driven modules." },
    { num: "02", title: "Learn with AI", desc: "Interact dynamically with intelligent tools." },
    { num: "03", title: "Track Progress", desc: "Monitor your stats as you level up." }
  ];

  return (
    <div className="min-h-screen font-display bg-[#FFFFFF] text-[#111827] dark:bg-[#0B0F19] dark:text-[#E5E7EB] selection:bg-[#FFB300]/30 transition-colors duration-300 overflow-hidden">
      
      {/* 1. NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl transition-all">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FFB300] flex items-center justify-center shadow-[0_0_20px_rgba(255,179,0,0.3)] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-slate-900 text-2xl font-bold">school</span>
            </div>
            <span className="text-xl font-bold tracking-tight">EduStream</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">How it Works</a>
            <a href="#demo" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Platform</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full hover:scale-105 hover:shadow-lg transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-0 w-full bg-white dark:bg-[#111827] border-b border-black/5 dark:border-white/5 py-6 px-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">How it Works</a>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            <Link href="/login" className="text-lg font-medium">Log in</Link>
            <Link href="/register" className="w-full py-3 bg-[#FFB300] text-slate-900 text-center text-lg font-bold rounded-xl shadow-md">
              Start Learning for Free
            </Link>
          </motion.div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFB300]/20 dark:bg-[#FFB300]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 w-max mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-[#FFB300] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Introducing EduStream 2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
              <span className="inline-block min-w-[280px] md:min-w-[420px]">
                {currentText}
                <span className="animate-pulse text-[#FFB300]">|</span>
              </span>
              <br className="hidden md:block" />
              with <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB300] to-orange-500">AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A premium, personalized AI tutoring platform designed to accelerate your mastery with adaptive lessons, smart notes, and dynamic quizzes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full hover:scale-105 hover:bg-slate-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-black/5 dark:shadow-white/5 group">
                Start Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 text-sm font-bold rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                View Demo
              </a>
            </div>
          </motion.div>

          {/* Right Hero Visuals (Abstract Mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block h-[500px] perspective-1000"
          >
            {/* Base Dashboard Mockup Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 right-0 w-[450px] h-[320px] bg-[#F9FAFB] dark:bg-[#111827] rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl p-6 overflow-hidden"
              style={{ transform: "rotateY(-10deg) rotateX(5deg)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1">
                  <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="h-24 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm" />
                 <div className="h-24 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm" />
              </div>
              <div className="mt-4 h-20 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm flex items-center px-4">
                 <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-[#FFB300]"
                    />
                 </div>
              </div>
            </motion.div>

            {/* Floating Element 1: AI Prompt */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-48 left-0 w-[240px] bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl p-4 z-20 backdrop-blur-sm"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-md bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="w-3 h-3 text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-bold mb-1">AI Tutor</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Excellent progress. Let's tackle Advanced Data Structures next.</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 2: Badge */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 right-10 w-[180px] bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl p-4 z-30 flex items-center gap-3"
            >
               <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-500">
                 <LineChart className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-lg font-bold leading-none">+250 XP</h4>
                  <p className="text-xs text-slate-500 mt-1">Daily streak 🔥</p>
               </div>
            </motion.div>
          </motion.div>
        
        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="py-10 border-y border-black/5 dark:border-white/5 bg-[#F9FAFB]/50 dark:bg-[#111827]/50">
        <div className="max-w-[1200px] mx-auto px-6 overflow-hidden">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by continuous learners</p>
          <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-60 grayscale dark:opacity-40">
             {/* Fake brand placeholder shapes */}
             {[1,2,3,4,5].map((i) => (
               <div key={i} className="h-8 flex items-center gap-2 group hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                 <div className="w-6 h-6 bg-slate-800 dark:bg-slate-300 rounded shape-placeholder mix-blend-multiply dark:mix-blend-screen" 
                      style={{borderRadius: i % 2 === 0 ? '50%' : '8px'}} />
                 <span className="text-lg font-bold text-slate-800 dark:text-slate-300">Brand {String.fromCharCode(64 + i)}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge your learning</h2>
            <p className="text-slate-600 dark:text-slate-400">EduStream provides all the tools you need to grasp complex concepts faster and retain them longer.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-6 bg-[#F9FAFB] dark:bg-[#111827] rounded-3xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl pointer-events-none`} />
                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 bg-[#F9FAFB] dark:bg-[#111827] border-y border-black/5 dark:border-white/5 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How EduStream Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Three simple steps to accelerate your career.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="h-full bg-[#FFB300]" 
               />
            </div>

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex-1 flex flex-col items-center text-center relative z-10"
              >
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-8 border-[#F9FAFB] dark:border-[#111827] shadow-xl flex items-center justify-center mb-6 text-2xl font-black text-[#FFB300]">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE DEMO CTA SECTION */}
      <section id="demo" className="py-24 md:py-32 px-6">
        <div className="max-w-[1000px] mx-auto relative rounded-[2.5rem] bg-slate-900 dark:bg-[#1A2333] overflow-hidden shadow-2xl p-10 md:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-to-b from-[#FFB300]/20 to-transparent blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFB300] flex items-center justify-center mb-8 shadow-lg shadow-[#FFB300]/20">
              <span className="material-symbols-outlined text-slate-900 text-3xl font-bold">bolt</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your learning?</h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
              Join thousands of students mastering new skills with the power of EduStream AI.
            </p>
            <Link 
              href="/register" 
              className="px-8 py-4 bg-[#FFB300] text-slate-900 font-bold rounded-full hover:scale-105 hover:bg-[#FFD700] transition-all shadow-[0_0_30px_rgba(255,179,0,0.3)] text-lg active:scale-95 flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs font-semibold text-slate-500 mt-6 uppercase tracking-wider">No credit card required</p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 px-6 border-t border-black/5 dark:border-white/5 bg-[#F9FAFB] dark:bg-[#0B0F19]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FFB300]">school</span>
            <span className="font-bold">EduStream</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-[#FFB300] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FFB300] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FFB300] transition-colors">Support</a>
          </div>

          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} EduStream Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
