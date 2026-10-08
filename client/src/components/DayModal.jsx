import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Smile,
  BookOpen,
} from 'lucide-react';

const MOODS = [
  { id: 'productive', label: '🌸 Blooming', emoji: '🌸' },
  { id: 'victorious', label: '🏆 Big Win', emoji: '🏆' },
  { id: 'focused', label: '🎯 Deep Focus', emoji: '🎯' },
  { id: 'calm', label: '🍵 Peaceful', emoji: '🍵' },
  { id: 'busy', label: '⚡ High Energy', emoji: '⚡' },
];

export default function DayModal({
  isOpen,
  onClose,
  date,
  initialData,
  onSave,
  onDelete,
}) {
  const [bulletPoints, setBulletPoints] = useState([]);
  const [newBullet, setNewBullet] = useState('');
  const [summary, setSummary] = useState('');
  const [mood, setMood] = useState('productive');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBulletPoints(initialData.bulletPoints || []);
      setSummary(initialData.summary || '');
      setMood(initialData.mood || 'productive');
    } else {
      setBulletPoints([]);
      setSummary('');
      setMood('productive');
    }
    setNewBullet('');
  }, [initialData, date, isOpen]);

  if (!isOpen) return null;

  const handleAddBullet = (e) => {
    e?.preventDefault();
    if (!newBullet.trim()) return;
    setBulletPoints([...bulletPoints, newBullet.trim()]);
    setNewBullet('');
  };

  const handleRemoveBullet = (index) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBullet();
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    let finalBullets = [...bulletPoints];
    if (newBullet.trim()) {
      finalBullets.push(newBullet.trim());
    }

    try {
      await onSave({
        bulletPoints: finalBullets,
        summary,
        mood,
      });

      // Joyful celebratory floral confetti!
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'],
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-pop-in">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border-2 border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <div>
              <h3 className="font-black text-lg text-white">Daily Bloom Journal</h3>
              <p className="text-xs text-rose-100 font-semibold">{formattedDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Spacious and clean */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Work Bullet Points Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>🌱</span>
                Completed Work & Progress Blooms ({bulletPoints.length})
              </label>
            </div>

            {/* Input field */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What work did you bloom today? (Press Enter)"
                className="flex-1 px-4 py-3 rounded-2xl border border-rose-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30"
              />
              <button
                type="button"
                onClick={handleAddBullet}
                className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-black flex items-center gap-1 transition-all shadow-md shadow-rose-300/40 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* List of bullets */}
            {bulletPoints.length === 0 ? (
              <div className="text-center py-8 px-4 bg-rose-50/40 rounded-2xl border-2 border-dashed border-rose-200 text-slate-400 text-xs">
                <span className="text-2xl block mb-1">🌸</span>
                <p className="font-bold text-slate-600">No blooms recorded for this day yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Type what you finished above to grow your garden!</p>
              </div>
            ) : (
              <ul className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {bulletPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-between gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-rose-50/70 to-pink-50/50 border border-rose-200/80 text-slate-800 text-sm group hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-sm mt-0.5 shrink-0">🌸</span>
                      <span className="break-words font-semibold leading-relaxed">{point}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(index)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mood Pill Selector */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              Day's Energy & Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    mood === m.id
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-600 border-rose-100 hover:bg-rose-50'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Daily Reflection or Win of the Day
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g., Felt so energized after finishing the project outline today!"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-rose-100 flex items-center justify-between">
          {initialData && initialData.bulletPoints?.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all work entries for this day?')) {
                  onDelete(date);
                  onClose();
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Clear Day
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-2xl shadow-md shadow-rose-300/40 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>🌸</span>
              <span>Save Blooms</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
