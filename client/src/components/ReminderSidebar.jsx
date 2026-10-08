import React, { useState } from 'react';
import {
  Bell,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'work', label: '💼 Work' },
  { id: 'study', label: '📚 Study' },
  { id: 'meeting', label: '🗓️ Meeting' },
  { id: 'urgent', label: '⚡ Urgent' },
  { id: 'personal', label: '🌱 Personal' },
];

const PRIORITIES = [
  { id: 'low', label: '🌱 Low', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'medium', label: '⚡ Medium', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'high', label: '🔥 Urgent', color: 'bg-rose-100 text-rose-800 border-rose-300' },
];

export default function ReminderSidebar({
  reminders,
  selectedDate,
  onSelectDate,
  onCreateReminder,
  onToggleReminder,
  onDeleteReminder,
}) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');

  React.useEffect(() => {
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    await onCreateReminder({
      title: title.trim(),
      date: targetDate,
      time,
      priority,
      category,
      notes,
    });

    setTitle('');
    setTime('');
    setNotes('');
  };

  const filteredReminders = reminders.filter((rem) => {
    if (filter === 'selected') return rem.date === selectedDate;
    if (filter === 'pending') return !rem.completed;
    if (filter === 'completed') return rem.completed;
    return true;
  });

  const pendingCount = reminders.filter((r) => !r.completed).length;

  const formatDateDisplay = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today 🌸';
    if (dateStr === tomorrow) return 'Tomorrow 🌻';
    return dateStr;
  };

  return (
    <aside className="bg-white rounded-3xl border-2 border-amber-100 shadow-md overflow-hidden flex flex-col h-full transition-all">
      {/* Header: Dedicated REMAINDER!! */}
      <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  REMAINDER!!
                </h2>
              </div>
              <p className="text-xs text-amber-100 font-semibold mt-0.5">
                My 1st Step of Success • #My1stStepOfSuccess
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-orange-700 shadow-xs">
            {pendingCount} Due
          </span>
        </div>
      </div>

      {/* Form: Add Upcoming Work */}
      <div className="p-6 border-b border-amber-100 bg-amber-50/40">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Upcoming Work or Task
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prepare biology review notes..."
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-xs"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                Time (Optional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              >
                <option value="low">🌱 Low</option>
                <option value="medium">⚡ Medium</option>
                <option value="high">🔥 Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-300/40 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4" /> Save to REMAINDER!!
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3 flex flex-wrap items-center gap-1.5 border-b border-slate-100 bg-white">
        {[
          { id: 'all', label: 'All' },
          { id: 'selected', label: 'On Selected Date' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Done' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List: Spacious cards */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3 max-h-[520px]">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-14 px-4 bg-amber-50/50 rounded-3xl border-2 border-dashed border-amber-200 text-slate-400">
            <span className="text-3xl block mb-2">🌸</span>
            <p className="text-sm font-bold text-slate-600">No tasks in this view</p>
            <p className="text-xs text-slate-400 mt-1">
              Add upcoming work above to schedule your next bloom!
            </p>
          </div>
        ) : (
          filteredReminders.map((item) => {
            const priorityInfo = PRIORITIES.find((p) => p.id === item.priority) || PRIORITIES[1];

            return (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition-all duration-200 group flex items-start justify-between gap-3.5 ${
                  item.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : 'bg-white border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleReminder(item._id)}
                  className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                  title={item.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-amber-500" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold text-slate-800 break-words ${
                      item.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
                    {/* Date Pill: Clickable to sync calendar! */}
                    <button
                      type="button"
                      onClick={() => onSelectDate(item.date)}
                      title="Sync calendar to this date"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors font-bold text-[11px]"
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDateDisplay(item.date)}
                    </button>

                    {item.time && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded-lg font-extrabold border text-[11px] ${priorityInfo.color}`}
                    >
                      {priorityInfo.label}
                    </span>

                    <span className="text-slate-400 uppercase text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteReminder(item._id)}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
