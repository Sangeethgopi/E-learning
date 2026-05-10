"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Zap, Trophy, Target, Brain, TrendingUp, Plus } from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // NOTE: No leading slash — joins with baseURL "/api" → /api/v1/pdf/generate-quiz
      const response = await api.post(
        `v1/pdf/generate-quiz?lesson_id=standalone`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const data = response.data;
      setGeneratedQuestions(data.questions || []);
      alert(`✅ Quiz generated successfully!\n${data.generated_count} questions created from your PDF.`);
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : error?.message || "Upload failed";
      alert(`❌ Error: ${msg}`);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFindBattle = async () => {
    if (!user) return;
    
    try {
      const response = await api.post("v1/matchmaking/join", {
        user_id: user.id,
        username: user.username,
        quiz_id: "default-quiz"
      });
      
      if (response.data.status === "MATCHED") {
        window.location.href = `/battle/${response.data.room_id}`;
      } else {
        alert("Searching for a battle... Please wait (or open another window to match!)");
        const interval = setInterval(async () => {
          const res = await api.post("v1/matchmaking/join", {
            user_id: user.id,
            username: user.username,
            quiz_id: "default-quiz"
          });
          if (res.data.status === "MATCHED") {
            clearInterval(interval);
            window.location.href = `/battle/${res.data.room_id}`;
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Matchmaking failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <input 
        type="file" 
        id="pdf-upload" 
        className="hidden" 
        accept=".pdf" 
        onChange={handleFileUpload}
      />

      <header>
        <h1 className="text-3xl font-bold font-outfit">
          Welcome back, <span className="text-indigo-400">{user?.username}</span>! 👋
        </h1>
        <p className="text-slate-400 mt-2">What would you like to master today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Brain className="text-indigo-400" />} 
          label="Quizzes Completed" 
          value="12" 
          trend="+2 today"
        />
        <StatCard 
          icon={<TrendingUp className="text-cyan-400" />} 
          label="Average Accuracy" 
          value="84%" 
          trend="+5% week"
        />
        <StatCard 
          icon={<Trophy className="text-purple-400" />} 
          label="Global Rank" 
          value="#42" 
          trend="+12 spots"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit">Recent Subjects</h2>
            <button className="text-indigo-400 text-sm font-medium hover:underline">View all</button>
          </div>
          
          <div className="space-y-3">
            <SubjectItem name="Quantum Physics" progress={65} color="bg-indigo-500" />
            <SubjectItem name="Microeconomics" progress={30} color="bg-cyan-500" />
            <SubjectItem name="Organic Chemistry" progress={10} color="bg-purple-500" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-outfit">AI Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => document.getElementById("pdf-upload")?.click()}
              disabled={uploading}
              className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-indigo-600/10 border border-indigo-500/30 hover:border-indigo-400/50 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-400" />
                  ) : (
                    <Plus size={24} />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-bold">{uploading ? "Generating Quiz..." : "Generate Quiz from PDF"}</h3>
                  <p className="text-sm text-slate-400">Upload and learn in seconds</p>
                </div>
              </div>
            </button>

            <button 
              onClick={handleFindBattle}
              className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-rose-600/20 to-rose-600/10 border border-rose-500/30 hover:border-rose-400/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold">Multiplayer Quiz Battle</h3>
                  <p className="text-sm text-slate-400">Challenge other students live</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                Live
              </div>
            </button>

            <button className="flex items-center justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group opacity-60">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold">AI Flashcard Battle</h3>
                  <p className="text-sm text-slate-400">Coming soon</p>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Generated Quiz Output */}
      {generatedQuestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold font-outfit text-white">AI Quiz Output</h2>
              <p className="text-slate-400 mt-1">Generated directly from your document</p>
            </div>
            <button 
              onClick={() => setGeneratedQuestions([])}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-sm font-bold"
            >
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {generatedQuestions.map((q, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain size={80} />
                </div>

                <div className="flex items-start gap-6 mb-8">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-2xl font-bold text-slate-100 leading-tight">{q.question}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                  {q.options.map((opt: string, j: number) => (
                    <div 
                      key={j} 
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        opt === q.correct_answer 
                          ? 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-3 w-3 rounded-full ${opt === q.correct_answer ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`} />
                        <span className="font-medium text-lg">{opt}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="mt-10 ml-16 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-indigo-400">
                        <Zap size={18} fill="currentColor" />
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] block mb-1">AI Context</span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-slate-800">{icon}</div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold font-outfit">{value}</span>
        <span className="text-xs text-green-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function SubjectItem({ name, progress, color }: any) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-4">
      <div className={`h-12 w-12 rounded-lg ${color}/20 flex items-center justify-center text-slate-200 font-bold`}>
        {name[0]}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1.5">
          <h4 className="font-bold text-sm">{name}</h4>
          <span className="text-xs text-slate-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${color}`} 
          />
        </div>
      </div>
    </div>
  );
}
