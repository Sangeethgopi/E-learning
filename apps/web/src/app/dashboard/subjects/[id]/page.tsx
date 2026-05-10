"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Layout,
  MessageSquare,
  FileText,
  Brain
} from "lucide-react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  description: string;
}

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(`v1/subjects/${id}`);
        setSubject(response.data);
      } catch (error) {
        console.error("Failed to fetch subject:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSubject();
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center animate-pulse text-indigo-400 font-bold">Initializing Study Room...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link href="/dashboard/subjects" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Subjects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Video & Info Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Cinematic Video Player */}
          <div className="relative aspect-video rounded-3xl bg-black overflow-hidden group shadow-2xl border border-slate-800">
            {/* Poster / Placeholder */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-indigo-600/50"
                >
                  <Play size={32} fill="currentColor" />
                </button>
                <p className="mt-4 font-bold text-lg tracking-wide uppercase">Lesson 1: Introduction to {subject?.name}</p>
              </div>
            )}

            {/* Video Element Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex items-center justify-center">
               <div className="flex flex-col items-center gap-4 text-slate-700">
                  <Play size={120} opacity={0.1} />
               </div>
            </div>

            {/* Custom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-indigo-500 rounded-full" />
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="text-white hover:text-indigo-400 transition-colors"><SkipBack size={20} /></button>
                    <button className="text-white hover:text-indigo-400 transition-colors" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button className="text-white hover:text-indigo-400 transition-colors"><SkipForward size={20} /></button>
                    <div className="flex items-center gap-2 ml-4">
                      <Volume2 size={20} className="text-slate-400" />
                      <div className="w-20 h-1 bg-white/20 rounded-full"><div className="w-2/3 h-full bg-white rounded-full" /></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-300 font-mono">
                    <span>12:45 / 45:00</span>
                    <button className="text-white hover:text-indigo-400 transition-colors"><Maximize size={20} /></button>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-outfit">{subject?.name}</h1>
              <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20 text-xs font-bold uppercase tracking-widest">
                Lesson 1 of 12
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {subject?.description || "Dive deep into the fundamental principles of this field. This session covers the foundational architecture and key methodologies required for mastery."}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="space-y-6">
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-outfit border-b border-slate-800 pb-4 flex items-center gap-2">
              <Layout size={20} className="text-indigo-400" />
              Course Content
            </h3>
            <div className="space-y-2">
              <LessonItem active title="1. Introduction" duration="45:00" completed />
              <LessonItem title="2. Core Principles" duration="32:20" />
              <LessonItem title="3. Advanced Analysis" duration="58:15" />
              <LessonItem title="4. Practical Case Study" duration="41:00" />
              <LessonItem title="5. Final Review" duration="25:40" />
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-indigo-600 text-white space-y-4 shadow-xl shadow-indigo-900/20">
            <h3 className="text-lg font-bold">Ready to test?</h3>
            <p className="text-indigo-100 text-sm">Take a quick AI-generated quiz to verify your knowledge of this lesson.</p>
            <button className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              <Brain size={20} />
              Start Quiz
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function LessonItem({ title, duration, active = false, completed = false }: any) {
  return (
    <button className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
      active 
        ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" 
        : "text-slate-400 hover:bg-slate-800/50"
    }`}>
      <div className={`p-2 rounded-lg ${active ? "bg-indigo-500 text-white" : "bg-slate-800"}`}>
        {completed ? <CheckCircle size={16} /> : <Play size={16} />}
      </div>
      <div className="text-left flex-1">
        <p className="text-sm font-bold truncate">{title}</p>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 uppercase font-bold">
          <Clock size={10} />
          {duration}
        </div>
      </div>
    </button>
  );
}
