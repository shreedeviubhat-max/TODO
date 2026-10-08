import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Dices,
  Heart,
} from 'lucide-react';

const AVATAR_STYLES = [
  { id: 'adventurer', name: '🌸 Adventurer' },
  { id: 'notionists', name: '🌱 Notionist' },
  { id: 'bottts', name: '🌻 Cute Bot' },
  { id: 'lorelei', name: '🌷 Lorelei' },
  { id: 'fun-emoji', name: '✨ Fun Emoji' },
];

export default function AuthPage() {
  const { login, register, authError, setAuthError, getDiceBearUrl } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('bloom_hero');
  const [avatarStyle, setAvatarStyle] = useState('adventurer');
  const [submitting, setSubmitting] = useState(false);

  const handleRollAvatar = () => {
    const randomSeed = `bloom_${Math.random().toString(36).substring(2, 8)}`;
    setAvatarSeed(randomSeed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password, avatarStyle);
    }

    setSubmitting(false);
  };

  const handleQuickDemo = () => {
    setEmail('demo@dailybloom.com');
    setPassword('success123');
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-100/60 via-amber-50 to-emerald-100/60 relative overflow-hidden">
      {/* Decorative floral background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Welcoming Visual Garden & Mascot Card */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          {/* Mascot Sticker */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1.5 bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 shadow-xl shadow-rose-300/40 transform group-hover:rotate-2 transition-transform">
              <img
                src="/bloom-mascot.jpg"
                alt="The Daily Bloom Mascot"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 text-2xl animate-bounce">🌸</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
              The Daily Bloom
            </h1>

            {/* Nextline & Hashtags */}
            <p className="text-base font-extrabold text-emerald-800 mt-1 flex items-center justify-center md:justify-start gap-1.5">
              <span>My 1st Step of Success</span>
              <span>🌱🌸✨</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                #My1stStepOfSuccess
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                #BloomEveryDay
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                #DailyGrowth
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mt-3 leading-relaxed max-w-sm">
              Your colorful personal daily work journal, interactive calendar, and reminder garden. Every flower begins as a tiny seed taking its first step!
            </p>
          </div>
        </div>

        {/* Right Side: Colorful Auth Form */}
        <div className="md:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-xl">
          {/* Tab Switcher */}
          <div className="flex bg-rose-50/80 p-1.5 rounded-2xl mb-6 border border-rose-100">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Sign In to Bloom
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Create Garden Account
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Interactive Avatar Preview */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/70 to-amber-50/70 border border-rose-100 mb-5">
            <div className="relative">
              <img
                src={getDiceBearUrl(name || avatarSeed, avatarStyle)}
                alt="Avatar Preview"
                className="w-14 h-14 rounded-2xl bg-white border-2 border-rose-200 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRollAvatar}
                title="Roll a cute garden avatar!"
                className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-tr from-rose-500 to-amber-400 text-white rounded-full shadow-sm hover:scale-105 active:scale-95"
              >
                <Dices className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-800">
                {name ? `${name}'s Garden Vibe` : 'Your Cute Gardener Avatar'}
              </p>
              <p className="text-[11px] text-rose-600 font-semibold">
                DiceBear dynamic avatar • Click dice to reroll!
              </p>

              {!isLogin && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {AVATAR_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setAvatarStyle(st.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                        avatarStyle === st.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-white text-slate-600 border border-rose-200'
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-rose-300/40 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {submitting ? (
                <span>Watering your seeds...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Enter The Daily Bloom 🌸' : 'Start My 1st Step of Success 🌱'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Want to test instantly?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="font-bold text-rose-600 hover:text-rose-700 underline decoration-rose-300"
            >
              Fill Demo Login
            </button>
          </div>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="mt-8 text-center text-xs font-extrabold text-slate-500 flex items-center justify-center gap-1.5">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span>The Daily Bloom • My 1st Step of Success 🌱 #BloomEveryDay</span>
      </div>
    </div>
  );
}
