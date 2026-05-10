"use client";
// Force reload trigger

import { useEffect, useState } from "react";
import axios from "@/lib/api";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Zap, TrendingUp, Search } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  xp_points: number;
  streak_count: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("v1/users/leaderboard");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        // Fallback mock data if API is not yet ready
        setUsers([
          { id: "1", username: "AlexChen", xp_points: 12500, streak_count: 15, rank: 1 },
          { id: "2", username: "Sarah_AI", xp_points: 11200, streak_count: 8, rank: 2 },
          { id: "3", username: "CodeMaster", xp_points: 9800, streak_count: 22, rank: 3 },
          { id: "4", username: "LearnFast", xp_points: 8500, streak_count: 5, rank: 4 },
          { id: "5", username: "StudyPro", xp_points: 7200, streak_count: 12, rank: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
          <Trophy size={48} />
        </div>
        <h1 className="text-4xl font-bold font-outfit">Global Leaderboard</h1>
        <p className="text-slate-400">Compete with students around the world and rise to the top</p>
      </header>

      {/* Podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 items-end pt-12 pb-8">
          <PodiumPlace user={users[1]} place={2} />
          <PodiumPlace user={users[0]} place={1} />
          <PodiumPlace user={users[2]} place={3} />
        </div>
      )}

      {/* Full List */}
      <div className="rounded-3xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Rank</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider text-center">Streak</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">XP Points</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse border-b border-slate-800/50">
                  <td colSpan={4} className="px-8 py-6 h-16 bg-slate-800/20" />
                </tr>
              ))
            ) : (
              users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group ${
                    idx < 3 ? "bg-indigo-500/5" : ""
                  }`}
                >
                  <td className="px-8 py-6">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                      idx === 0 ? "bg-amber-500 text-white" :
                      idx === 1 ? "bg-slate-300 text-slate-900" :
                      idx === 2 ? "bg-orange-500 text-white" :
                      "text-slate-500"
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{user.username}</p>
                        <p className="text-xs text-slate-500">Student</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold">
                      <Zap size={14} fill="currentColor" />
                      {user.streak_count}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono font-bold text-indigo-400">
                    {user.xp_points.toLocaleString()} XP
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumPlace({ user, place }: { user: LeaderboardUser; place: number }) {
  const colors = {
    1: { bg: "bg-amber-500", text: "text-amber-500", shadow: "shadow-amber-500/20", icon: <Crown size={32} /> },
    2: { bg: "bg-slate-300", text: "text-slate-300", shadow: "shadow-slate-300/20", icon: <Medal size={28} /> },
    3: { bg: "bg-orange-500", text: "text-orange-500", shadow: "shadow-orange-500/20", icon: <Medal size={24} /> },
  }[place as 1|2|3];

  return (
    <div className={`flex flex-col items-center ${place === 1 ? "order-2" : place === 2 ? "order-1" : "order-3"}`}>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: place * 0.1 }}
        className="relative mb-4"
      >
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 ${colors.shadow} shadow-2xl flex items-center justify-center bg-slate-900 overflow-hidden`}>
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-3xl">
            {user?.username[0].toUpperCase()}
          </div>
        </div>
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${colors.text}`}>
          {colors.icon}
        </div>
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${colors.bg} text-white flex items-center justify-center font-bold border-2 border-slate-800`}>
          {place}
        </div>
      </motion.div>
      <div className="text-center">
        <p className="font-bold text-slate-200">{user?.username}</p>
        <p className={`text-sm font-bold ${colors.text}`}>{user?.xp_points.toLocaleString()} XP</p>
      </div>
      <div className={`mt-4 w-full rounded-t-2xl ${colors.bg}/10 border-x border-t border-slate-800 flex flex-col justify-end items-center`} style={{ height: place === 1 ? '120px' : place === 2 ? '80px' : '60px' }}>
        <div className={`w-full h-1 ${colors.bg}`} />
      </div>
    </div>
  );
}
