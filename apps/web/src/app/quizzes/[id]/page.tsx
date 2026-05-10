"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
}

import axios from "@/lib/api";

export default function QuizViewPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`questions/?quiz_id=${id}`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestions();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <header className="flex items-center gap-4 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
          <Brain size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-outfit">AI Generated Quiz</h1>
          <p className="text-slate-400">Generated from your uploaded document</p>
        </div>
      </header>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold">
                {idx + 1}
              </span>
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold leading-tight">{q.question_text}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                        option.is_correct 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-slate-800/50 border-slate-700 text-slate-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{option.option_text}</span>
                      {option.is_correct && <CheckCircle2 size={18} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
