"use client";

import { useState } from "react";
import { X, Clock, BookOpen, Sparkles, Layers } from "lucide-react";
import { EducationItem } from "./types";

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80";

export function ContentPreview({
  item,
  onClose,
}: {
  item: EducationItem;
  onClose: () => void;
}) {
  const [language, setLanguage] = useState<"en" | "am">("en");
  const heroImage = item.coverImageUrl || DEFAULT_COVER_IMAGE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Content preview"
    >
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#fbfaf6] text-[#183b2d] shadow-2xl flex flex-col">
        {/* Top Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Preview"
          className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full bg-white/80 text-[#193a27] shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* --- HERO SECTION --- */}
          <section className="relative w-full aspect-21/9 min-h-[260px] sm:min-h-[340px] overflow-hidden bg-slate-900">
            <img
              src={heroImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152e1f] via-[#152e1f]/40 to-transparent" />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#1c573e] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-xs">
                  {item.category}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <Clock size={12} />
                  <span>{item.readMinutes} min read</span>
                </span>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-200 capitalize backdrop-blur-md">
                  {item.status}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black text-white tracking-tight sm:text-4xl drop-shadow-sm max-w-2xl leading-snug">
                {language === "en" ? item.title : item.titleAm}
              </h1>
            </div>
          </section>

          {/* Body Content Container */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64796a] uppercase tracking-wider">
                  Select Language:
                </span>
                <div className="flex rounded-full border border-[#bcd4bf] bg-white p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      language === "en"
                        ? "bg-[#1c573e] text-white shadow-xs"
                        : "text-[#5e7564] hover:text-[#183925]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("am")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      language === "am"
                        ? "bg-[#1c573e] text-white shadow-xs"
                        : "text-[#5e7564] hover:text-[#183925]"
                    }`}
                  >
                    አማርኛ (Amharic)
                  </button>
                </div>
              </div>

              <span className="text-xs text-[#718576] font-medium hidden sm:inline">
                Curriculum Preview Mode
              </span>
            </div>

            {/* Summary Highlight Box */}
            <div className="rounded-2xl border border-[#d3e2d3] bg-[#edf6ee] p-5 text-sm sm:text-base leading-relaxed text-[#234630] font-medium">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1c573e] uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>Executive Summary</span>
              </div>
              {language === "en" ? item.summary : item.summaryAm}
            </div>

            {/* Article Body */}
            <article className="prose prose-emerald max-w-none whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#3b4e41]">
              {language === "en" ? item.content : item.contentAm}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
