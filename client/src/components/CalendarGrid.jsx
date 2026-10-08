import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Bell,
  Sparkles,
} from 'lucide-react';

const WEEKDAYS = [
  { name: 'Sunday', short: 'Sun', color: 'text-rose-500' },
  { name: 'Monday', short: 'Mon', color: 'text-slate-600' },
  { name: 'Tuesday', short: 'Tue', color: 'text-slate-600' },
  { name: 'Wednesday', short: 'Wed', color: 'text-slate-600' },
  { name: 'Thursday', short: 'Thu', color: 'text-slate-600' },
  { name: 'Friday', short: 'Fri', color: 'text-slate-600' },
  { name: 'Saturday', short: 'Sat', color: 'text-amber-500' },
];

export default function CalendarGrid({
  currentDate,
  setCurrentDate,
  selectedDate,
  onSelectDate,
  logsMap,
  remindersMap,
  onOpenDayModal,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const todayIso = today.toISOString().split('T')[0];
    onSelectDate(todayIso);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Generate calendar cells
  const calendarCells = [];

  // Trailing days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Days of current month
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const cellDate = new Date(year, month, dayNum);
    const yyyy = cellDate.getFullYear();
    const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: true,
    });
  }

  // Complete grid to 35 or 42 cells for consistent large spacious layout
  const totalSlots = calendarCells.length > 35 ? 42 : 35;
  const remaining = totalSlots - calendarCells.length;
  for (let dayNum = 1; dayNum <= remaining; dayNum++) {
    const nextMonthDate = new Date(year, month + 1, dayNum);
    const dateStr = nextMonthDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Month metrics
  const monthLogsCount = Object.keys(logsMap).filter((d) =>
    d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
  ).length;

  return (
    <div className="bg-white rounded-3xl border-2 border-rose-100 shadow-md overflow-hidden flex flex-col transition-all">
      {/* Top Header of the Calendar */}
      <div className="p-6 bg-gradient-to-r from-rose-50/90 via-pink-50/50 to-amber-50/70 border-b border-rose-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-300/40">
              🌸
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-amber-700 bg-clip-text text-transparent">
                {monthName} <span className="text-slate-800">{year}</span>
              </h2>
              <p className="text-xs font-semibold text-rose-700 flex items-center gap-2 mt-0.5">
                <span>🌱 Daily Work Blooms Log</span>
                <span>•</span>
                <span className="text-emerald-700">{monthLogsCount} days blossomed this month</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToToday}
            className="px-4 py-2 text-xs font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl shadow-sm hover:shadow transition-all active:scale-95"
          >
            🌸 Jump to Today
          </button>
          <div className="flex items-center bg-white rounded-2xl border border-rose-200 p-1 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-5 bg-rose-100 mx-1"></div>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Strip */}
      <div className="grid grid-cols-7 border-b border-rose-100 bg-rose-50/40 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day.short}
            className="py-3 px-1 text-xs font-extrabold uppercase tracking-wider text-slate-600"
          >
            <span className={day.color}>{day.short}</span>
          </div>
        ))}
      </div>

      {/* Spacious Monthly Grid: Increased frame height so nothing feels congested */}
      <div className="grid grid-cols-7 bg-rose-100/50 gap-[1.5px]">
        {calendarCells.map((cell) => {
          const { dateStr, dayNum, isCurrentMonth } = cell;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const dayLog = logsMap[dateStr];
          const bullets = dayLog?.bulletPoints || [];
          const dayReminders = remindersMap[dateStr] || [];

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              onDoubleClick={() => onOpenDayModal(dateStr)}
              className={`min-h-[145px] sm:min-h-[165px] md:min-h-[175px] p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer group relative ${
                isCurrentMonth
                  ? 'bg-white hover:bg-rose-50/40'
                  : 'bg-slate-50/70 text-slate-400'
              } ${
                isSelected
                  ? 'ring-3 ring-rose-400 ring-inset bg-rose-50/60 z-10 shadow-sm'
                  : ''
              }`}
            >
              {/* Day Number and Action Bar */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center text-xs sm:text-sm font-black w-7 h-7 sm:w-8 sm:h-8 rounded-2xl transition-transform ${
                      isToday
                        ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/50 scale-105'
                        : isSelected
                        ? 'bg-slate-800 text-white'
                        : isCurrentMonth
                        ? 'text-slate-700 group-hover:text-rose-600 group-hover:scale-105'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="hidden sm:inline-block text-[10px] font-extrabold text-rose-600 uppercase bg-rose-100 px-1.5 py-0.5 rounded-md">
                      Today 🌸
                    </span>
                  )}
                </div>

                {/* Badges / Add Button */}
                <div className="flex items-center space-x-1.5">
                  {/* Reminders count pill */}
                  {dayReminders.length > 0 && (
                    <span
                      title={`${dayReminders.length} reminder(s) for this day`}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs"
                    >
                      <Bell className="w-3 h-3 text-amber-600" />
                      {dayReminders.length}
                    </span>
                  )}

                  {/* Add work bullet quick button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDayModal(dateStr);
                    }}
                    title="Click to add or edit daily work blooms!"
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* INLINE BULLET POINTS: Completed work on this specific day */}
              <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[110px] pr-0.5">
                {bullets.length > 0 ? (
                  bullets.slice(0, 4).map((bp, bIdx) => (
                    <div
                      key={bIdx}
                      className="text-xs leading-snug text-slate-800 bg-gradient-to-r from-rose-50 to-pink-50/70 border border-rose-200/90 rounded-xl px-2 py-1 flex items-start gap-1.5 shadow-2xs group-hover:border-rose-300 transition-colors"
                      title={bp}
                    >
                      <span className="text-[11px] shrink-0 mt-0.5">🌸</span>
                      <span className="break-words font-medium">{bp}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity">
                    <span className="text-[11px] text-rose-400 font-semibold italic flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add work bloom
                    </span>
                  </div>
                )}
                {bullets.length > 4 && (
                  <span className="text-[11px] font-extrabold text-rose-600 pl-1 block">
                    +{bullets.length - 4} more blossoms
                  </span>
                )}
              </div>

              {/* Bottom Mood Indicator if present */}
              {dayLog?.mood && (
                <div className="mt-1 pt-1 border-t border-rose-100/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-emerald-700 capitalize flex items-center gap-1">
                    ✨ {dayLog.mood}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
