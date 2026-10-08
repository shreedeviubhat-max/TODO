import React, { useState, useEffect } from 'react';
import { Sparkles, Quote, RefreshCw, Heart } from 'lucide-react';
import { quoteAPI } from '../api/client';

const BLOOM_QUOTES = [
  { text: "Where flowers bloom, so does hope and daily progress.", author: "Lady Bird Johnson" },
  { text: "Every big accomplishment starts with the decision to take the first step.", author: "Gail Devers" },
  { text: "Small daily improvements over time lead to stunning, colorful blooms.", author: "Robin Sharma" },
  { text: "Don't wait for things to be perfect. Walk into your garden and take the first step.", author: "Daily Bloom Wisdom" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "One day or day one. Water your seeds today and watch them bloom.", author: "The Daily Bloom" },
  { text: "Celebrate small wins. They blossom into monumental momentum.", author: "James Clear" },
];

export default function CuteQuoteBanner() {
  const [quote, setQuote] = useState(BLOOM_QUOTES[0]);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await quoteAPI.getQuote();
      if (res.data?.success && res.data?.data) {
        setQuote(res.data.data);
      } else {
        const item = BLOOM_QUOTES[Math.floor(Math.random() * BLOOM_QUOTES.length)];
        setQuote(item);
      }
    } catch {
      const item = BLOOM_QUOTES[Math.floor(Math.random() * BLOOM_QUOTES.length)];
      setQuote(item);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 shadow-md mb-6 transition-all group">
      {/* Background Hero Artwork */}
      <div className="absolute inset-0">
        <img
          src="/bloom-hero.jpg"
          alt="Blooming Flower Garden"
          className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 filter brightness-[0.88] saturate-[1.15]"
        />
        {/* Soft colorful overlay for excellent text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-rose-950/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          {/* Badges / Hashtags */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              The Daily Bloom • My 1st Step of Success
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-rose-200 border border-white/20 backdrop-blur-xs">
              #My1stStepOfSuccess
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-amber-200 border border-white/20 backdrop-blur-xs hidden sm:inline">
              #BloomEveryDay
            </span>
          </div>

          {/* Inspirational Quote */}
          <blockquote className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-sm italic">
            "{quote.text}"
          </blockquote>

          <p className="text-xs sm:text-sm text-rose-200 font-semibold mt-2 flex items-center gap-2">
            <span>🌸 {quote.author || 'Daily Blossom Inspiration'}</span>
            <span>•</span>
            <span className="text-amber-200">Take today's first step with courage!</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Bloom with a new quote"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>New Bloom Vibe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
