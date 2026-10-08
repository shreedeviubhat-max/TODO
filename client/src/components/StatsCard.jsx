import React from 'react';
import { Award, CheckCircle, Bell, Sparkles } from 'lucide-react';

export default function StatsCard({ totalLogsCount, totalBulletsCount, pendingRemindersCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
      {/* Metric 1 - Petal Pink */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/80 shadow-xs flex items-center space-x-4 hover:border-rose-300 transition-all hover:shadow-sm group">
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-300/40 shrink-0 group-hover:scale-110 transition-transform">
          🌸
        </div>
        <div>
          <p className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">
            Blooming Days
          </p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-3xl font-black text-slate-800">{totalLogsCount}</span>
            <span className="text-xs text-rose-600 font-bold">Days in Garden</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">#My1stStepOfSuccess</p>
        </div>
      </div>

      {/* Metric 2 - Garden Emerald */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs flex items-center space-x-4 hover:border-emerald-300 transition-all hover:shadow-sm group">
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-300/40 shrink-0 group-hover:scale-110 transition-transform">
          🌻
        </div>
        <div>
          <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
            Petals of Progress
          </p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-3xl font-black text-slate-800">{totalBulletsCount}</span>
            <span className="text-xs text-emerald-600 font-bold">Work Accomplished</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">#BloomEveryDay</p>
        </div>
      </div>

      {/* Metric 3 - Sunflower Amber */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs flex items-center space-x-4 hover:border-amber-300 transition-all hover:shadow-sm group">
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-300/40 shrink-0 group-hover:scale-110 transition-transform">
          🪴
        </div>
        <div>
          <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
            Seeds to Grow (Reminders)
          </p>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-3xl font-black text-slate-800">{pendingRemindersCount}</span>
            <span className="text-xs text-amber-600 font-bold">Upcoming Tasks</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">#DailyGrowth</p>
        </div>
      </div>
    </div>
  );
}
