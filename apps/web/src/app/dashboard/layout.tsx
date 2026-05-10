"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut,
  Flame,
  Zap
} from "lucide-react";
import Link from "next/link";
import axios from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    } else if (!user) {
      // Try to recover user profile if token exists but user is null
      const fetchUser = async () => {
        try {
          const response = await axios.get("v1/users/me");
          useAuthStore.getState().setUser(response.data);
        } catch (error) {
          console.error("Failed to recover user profile:", error);
          logout();
          router.push("/auth");
        }
      };
      fetchUser();
    }
  }, [token, user, router, logout, isMounted]);

  const pathname = usePathname();

  if (!isMounted) return null;
  if (!token) return null;
  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading your workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            BrainFlow AI
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/dashboard"} />
          <NavItem href="/dashboard/subjects" icon={<BookOpen size={20} />} label="My Subjects" active={pathname === "/dashboard/subjects"} />
          <NavItem href="/dashboard/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" active={pathname === "/dashboard/leaderboard"} />
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" active={pathname === "/dashboard/settings"} />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button 
            onClick={() => {
              logout();
              router.push("/auth");
            }}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/20">
              <Flame size={18} />
              <span className="font-bold font-outfit">{user?.streak_count || 0} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Zap size={18} />
              <span className="font-bold font-outfit">{user?.xp_points || 0} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">{user?.username}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 border-2 border-slate-800" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-900/10" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
