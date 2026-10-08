import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CuteQuoteBanner from '../components/CuteQuoteBanner';
import StatsCard from '../components/StatsCard';
import CalendarGrid from '../components/CalendarGrid';
import ReminderSidebar from '../components/ReminderSidebar';
import DayModal from '../components/DayModal';
import { logsAPI, remindersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  // Navigation & selection state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'calendar', 'reminders'

  // Data states
  const [logsMap, setLogsMap] = useState({});
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);

  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const fetchMonthLogs = useCallback(async () => {
    try {
      const res = await logsAPI.getMonthLogs(currentMonthStr);
      if (res.data.success && res.data.data) {
        const map = {};
        res.data.data.forEach((log) => {
          map[log.date] = log;
        });
        setLogsMap(map);
      }
    } catch (err) {
      console.error('Error fetching daily logs:', err);
    }
  }, [currentMonthStr]);

  const fetchReminders = useCallback(async () => {
    try {
      const res = await remindersAPI.getReminders();
      if (res.data.success && res.data.data) {
        setReminders(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchMonthLogs(), fetchReminders()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchMonthLogs, fetchReminders]);

  const remindersMap = React.useMemo(() => {
    const map = {};
    reminders.forEach((r) => {
      if (!map[r.date]) {
        map[r.date] = [];
      }
      map[r.date].push(r);
    });
    return map;
  }, [reminders]);

  const handleOpenDayModal = (dateStr) => {
    setModalDate(dateStr);
    setSelectedDate(dateStr);
    setModalOpen(true);
  };

  const handleSaveDayLog = async (logData) => {
    if (!modalDate) return;
    try {
      const res = await logsAPI.saveLog(modalDate, logData);
      if (res.data.success && res.data.data) {
        setLogsMap((prev) => ({
          ...prev,
          [modalDate]: res.data.data,
        }));
      }
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  };

  const handleDeleteDayLog = async (dateStr) => {
    try {
      await logsAPI.deleteLog(dateStr);
      setLogsMap((prev) => {
        const next = { ...prev };
        delete next[dateStr];
        return next;
      });
    } catch (err) {
      console.error('Failed to clear log:', err);
    }
  };

  const handleCreateReminder = async (reminderData) => {
    try {
      const res = await remindersAPI.createReminder(reminderData);
      if (res.data.success && res.data.data) {
        setReminders((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add reminder:', err);
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      const res = await remindersAPI.toggleReminder(id);
      if (res.data.success && res.data.data) {
        setReminders((prev) =>
          prev.map((r) => (r._id === id ? res.data.data : r))
        );
      }
    } catch (err) {
      console.error('Failed to toggle reminder:', err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await remindersAPI.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  const totalLogsCount = Object.keys(logsMap).length;
  const totalBulletsCount = Object.values(logsMap).reduce(
    (sum, log) => sum + (log.bulletPoints?.length || 0),
    0
  );
  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/40 via-amber-50/20 to-emerald-50/30 flex flex-col selection:bg-rose-200 selection:text-rose-900">
      {/* Top Navigation with View Mode Switcher */}
      <Navbar
        reminderCount={pendingRemindersCount}
        completedLogCount={totalLogsCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Spacious Main Workspace: Expanded to 1550px for ample breathing room */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Full-width Blooming Quote Banner with Artwork */}
        <CuteQuoteBanner />

        {/* Colorful Floral Metric Cards */}
        <StatsCard
          totalLogsCount={totalLogsCount}
          totalBulletsCount={totalBulletsCount}
          pendingRemindersCount={pendingRemindersCount}
        />

        {/* DASHBOARD WORKSPACE WITH SPACIOUS LAYOUT MODES */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* COLUMN 1: Spacious Calendar */}
            <div className="lg:col-span-8 order-1">
              <CalendarGrid
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                logsMap={logsMap}
                remindersMap={remindersMap}
                onOpenDayModal={handleOpenDayModal}
              />
            </div>

            {/* COLUMN 2: Roomy REMAINDER!! Sidebar */}
            <div className="lg:col-span-4 order-2 sticky top-24">
              <ReminderSidebar
                reminders={reminders}
                selectedDate={selectedDate}
                onSelectDate={(newDate) => {
                  setSelectedDate(newDate);
                  const parsed = new Date(newDate + 'T00:00:00');
                  if (
                    parsed.getMonth() !== currentDate.getMonth() ||
                    parsed.getFullYear() !== currentDate.getFullYear()
                  ) {
                    setCurrentDate(parsed);
                  }
                }}
                onCreateReminder={handleCreateReminder}
                onToggleReminder={handleToggleReminder}
                onDeleteReminder={handleDeleteReminder}
              />
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="max-w-full">
            <CalendarGrid
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              logsMap={logsMap}
              remindersMap={remindersMap}
              onOpenDayModal={handleOpenDayModal}
            />
          </div>
        )}

        {viewMode === 'reminders' && (
          <div className="max-w-3xl mx-auto">
            <ReminderSidebar
              reminders={reminders}
              selectedDate={selectedDate}
              onSelectDate={(newDate) => {
                setSelectedDate(newDate);
                const parsed = new Date(newDate + 'T00:00:00');
                if (
                  parsed.getMonth() !== currentDate.getMonth() ||
                  parsed.getFullYear() !== currentDate.getFullYear()
                ) {
                  setCurrentDate(parsed);
                }
              }}
              onCreateReminder={handleCreateReminder}
              onToggleReminder={handleToggleReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          </div>
        )}
      </main>

      {/* Interactive Day Modal for Adding / Editing Daily Work Bullets */}
      <DayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={modalDate}
        initialData={modalDate ? logsMap[modalDate] : null}
        onSave={handleSaveDayLog}
        onDelete={handleDeleteDayLog}
      />
    </div>
  );
}
