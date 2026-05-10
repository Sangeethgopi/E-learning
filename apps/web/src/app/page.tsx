"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, BookOpen, Sparkles, ArrowRight, Zap, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight">AI Master</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium hover:text-indigo-400 transition-colors">
            Login
          </Link>
          <Link href="/auth" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-indigo-900/40">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              Powered by Gemini 3 Flash
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold font-outfit leading-[1.1] tracking-tight">
              Master Any Subject with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">AI Intelligence.</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              The world's first gamified learning ecosystem that adapts to your pace. Upload PDFs, generate instant quizzes, and battle with AI tutors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all group">
                Start Learning Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl transition-all">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Joined by <span className="text-slate-200 font-bold">10,000+</span> active learners this month
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2.5rem] blur opacity-20" />
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <Image 
                src="/elearning_hero_1778100007605.png" 
                alt="AI Learning Platform" 
                fill 
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              {/* Floating Cards */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Instant Quiz Ready</h4>
                    <p className="text-xs text-slate-400">Quantum Physics Chapter 4</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  Success
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="border-y border-slate-900 bg-slate-950/50 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-bold font-outfit mb-2">98%</h3>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Accuracy rate</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold font-outfit mb-2">50k+</h3>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Questions solved</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold font-outfit mb-2">24/7</h3>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">AI Tutoring</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold font-outfit mb-2">120+</h3>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Subjects covered</p>
          </div>
        </div>
      </section>
    </div>
  );
}

