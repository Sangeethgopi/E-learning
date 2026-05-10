"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, ArrowLeft, Play, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <header className="space-y-6">
        <div className="flex items-center gap-3 text-indigo-400 font-bold uppercase tracking-widest text-xs">
          <BookOpen size={16} />
          <span>Lesson Content</span>
        </div>
        <h1 className="text-5xl font-bold font-outfit leading-tight">
          Data Engineering Masterclass: <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Summative Case Study</span>
        </h1>
        <div className="flex items-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800" />
            <span>Instructor: AI System</span>
          </div>
          <span>•</span>
          <span>Duration: 15 mins read</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-all" />
            <button className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 relative z-10 group-hover:scale-110 transition-transform">
              <Play fill="white" size={32} />
            </button>
            <span className="absolute bottom-6 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Preview Video</span>
          </div>

          <article className="prose prose-invert max-w-none space-y-4 text-slate-300">
            <p className="text-lg leading-relaxed">
              Welcome to the Summative Case Study for CST4255. In this lesson, we explore the core principles of Data Engineering, focusing on Hadoop clusters, PySpark transformations, and Google Cloud Storage integration.
            </p>
            <h3 className="text-xl font-bold text-white font-outfit mt-8">Core Objectives</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Configuring HDFS Replication Factors</li>
              <li>Implementing Hadoop Streaming Word Count</li>
              <li>PySpark Data Transformations & Sampling</li>
              <li>GCS Connector Configuration</li>
            </ul>
          </article>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-900/40 space-y-4">
            <h3 className="font-bold text-lg">Ready to test?</h3>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Generate an instant AI quiz from this lesson material to lock in your knowledge.
            </p>
            <Link 
              href={`/dashboard`}
              className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <Brain size={20} />
              Generate Quiz
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Resources</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-400" size={18} />
                  <span className="text-sm font-medium">Lesson Slides.pdf</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-400" size={18} />
                  <span className="text-sm font-medium">Dataset Link.txt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
