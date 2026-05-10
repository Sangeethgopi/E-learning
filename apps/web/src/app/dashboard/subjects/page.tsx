"use client";
// Force reload trigger

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Book, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  description: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("v1/subjects/");
        setSubjects(response.data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit">My Subjects</h1>
          <p className="text-slate-400 mt-2">Explore and manage your learning paths</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, idx) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Book size={24} />
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                  <Star size={14} fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>

              <h3 className="text-xl font-bold font-outfit mb-2 group-hover:text-indigo-400 transition-colors">
                {subject.name}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                {subject.description || "Master the core concepts of this subject with AI-powered personalized lessons and competitive quizzes."}
              </p>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  <span className="text-slate-300">12</span> Lessons
                </div>
                <Link 
                  href={`/dashboard/subjects/${subject.id}`}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Start Learning
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredSubjects.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-900 border border-slate-800 mb-6 text-slate-500">
            <Search size={48} />
          </div>
          <h3 className="text-xl font-bold">No subjects found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
