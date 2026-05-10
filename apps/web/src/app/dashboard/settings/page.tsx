"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { User, Bell, Lock, Palette, Save, Camera, Code, MessageCircle, Link as LinkIcon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-outfit">Account Settings</h1>
        <p className="text-slate-400 mt-2">Manage your profile and platform preferences</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
            icon={<User size={20} />}
            label="Profile"
          />
          <TabButton 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")}
            icon={<Bell size={20} />}
            label="Notifications"
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")}
            icon={<Lock size={20} />}
            label="Security"
          />
          <TabButton 
            active={activeTab === "appearance"} 
            onClick={() => setActiveTab("appearance")}
            icon={<Palette size={20} />}
            label="Appearance"
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-4 rounded-full bg-slate-800 text-slate-500">
                <Palette size={48} />
              </div>
              <h3 className="text-xl font-bold">Coming Soon</h3>
              <p className="text-slate-500 max-w-xs">We're building more customization options for your AI learning experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-3xl border-4 border-slate-800 shadow-xl">
            {user?.username?.[0].toUpperCase()}
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white border-2 border-slate-900 hover:bg-indigo-500 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold">{user?.username}</h3>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="Full Name" placeholder="John Doe" value={user?.username} />
        <InputGroup label="Email Address" placeholder="john@example.com" value={user?.email} disabled />
        <InputGroup label="Username" placeholder="johndoe" value={user?.username} />
        <InputGroup label="Location" placeholder="San Francisco, CA" />
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500">Social Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SocialInput icon={<Code size={18} />} placeholder="github.com/johndoe" />
          <SocialInput icon={<MessageCircle size={18} />} placeholder="twitter.com/johndoe" />
          <SocialInput icon={<LinkIcon size={18} />} placeholder="portfolio.com" />
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all ml-auto">
        <Save size={20} />
        Save Changes
      </button>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function InputGroup({ label, placeholder, value, disabled = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-400">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
      />
    </div>
  );
}

function SocialInput({ icon, placeholder }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <span className="text-slate-500">{icon}</span>
      <input 
        type="text" 
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm flex-1"
      />
    </div>
  );
}
