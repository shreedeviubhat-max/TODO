import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LogOut,
  Dices,
  Calendar,
  Bell,
  LayoutGrid,
  Columns,
  ListTodo,
} from 'lucide-react';

export default function Navbar({
  reminderCount,
  completedLogCount,
  viewMode,
  setViewMode,
}) {
  const { user, logout, changeAvatar, getDiceBearUrl } = useAuth();
  const [isRolling, setIsRolling] = useState(false);

  const handleRollAvatar = async () => {
    setIsRolling(true);
    const styles = ['adventurer', 'bottts', 'lorelei', 'notionists', 'fun-emoji'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = `${user?.name || 'bloom'}_${Math.random().toString(36).substring(2, 7)}`;
    await changeAvatar(randomSeed, randomStyle);
    setTimeout(() => setIsRolling(false), 400);
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-rose-300/40 p-1 overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/bloom-mascot.jpg"
                alt="The Daily Bloom Mascot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs">🌸</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                The Daily Bloom
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                🌱 My Garden
              </span>
            </div>

            {/* Nextline & Hashtags */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
              <span className="text-emerald-700 font-bold">
                My 1st Step of Success 🌱🌸
              </span>
              <span className="hidden sm:inline text-rose-300">•</span>
              <span className="hidden sm:inline text-rose-500 font-medium">
                #My1stStepOfSuccess
              </span>
              <span className="hidden md:inline text-amber-500 font-medium">
                #BloomEveryDay
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher to eliminate congested feeling */}
        <div className="flex items-center bg-rose-50/70 p-1 rounded-2xl border border-rose-200/60 shadow-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
            title="Spacious two-column layout"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spacious View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
            title="Full-width calendar view"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Big Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('reminders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'reminders'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-amber-600'
            }`}
            title="Full-width reminders board"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REMAINDER!! Focus</span>
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          {/* Garden counter pill */}
          <div className="hidden lg:flex items-center space-x-2.5 bg-gradient-to-r from-rose-50 to-amber-50 px-3.5 py-1.5 rounded-full text-xs border border-rose-200/60 shadow-2xs">
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              🌸 {completedLogCount || 0} Blooms Logged
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-amber-700 flex items-center gap-1">
              🔔 {reminderCount || 0} Reminders
            </span>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center space-x-2 bg-white border border-rose-200 rounded-full pl-1.5 pr-3 py-1 shadow-xs hover:border-rose-300 transition-colors">
            <div className="relative group">
              <img
                src={getDiceBearUrl(user?.avatarSeed, user?.avatarStyle)}
                alt={user?.name || 'User Avatar'}
                className={`w-8 h-8 rounded-full bg-rose-100 border border-white shadow-xs transition-transform duration-300 ${
                  isRolling ? 'rotate-180 scale-90' : 'group-hover:scale-105'
                }`}
              />
              <button
                onClick={handleRollAvatar}
                title="Roll a cute new avatar!"
                className="absolute -bottom-1 -right-1 p-0.5 bg-gradient-to-tr from-rose-500 to-amber-400 text-white rounded-full shadow-xs hover:opacity-90 transition-transform active:scale-90"
              >
                <Dices className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="text-left hidden xs:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Gardener'}
              </p>
              <p className="text-[10px] text-rose-500 font-medium capitalize">
                Growing every day ✨
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
