"use client";

import { useState } from "react";
import { X, Clock, FileText, Layers } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Content preview"
    >
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#fbfaf6] text-[#183b2d] shadow-2xl flex flex-col border border-[#dce6dc]">
        {/* Top Header Bar with Close Button */}
        <div className="flex items-center justify-between border-b border-[#e2eae1] bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#1c573e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#223d2e]">
              Curriculum Preview Mode
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Preview"
            className="grid size-8 place-items-center rounded-full border border-[#cbd8cb] bg-[#f8faf7] text-[#193a27] shadow-xs transition hover:bg-[#eaf2ea] active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
          {/* Metadata Header */}
          <div className="border-b border-[#e2eae1] pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#1c573e]">
                {item.category}
              </span>
              <span className="text-[#cbd6cc]">•</span>
              <span className="flex items-center gap-1 font-medium text-[#5a6e60]">
                <Clock size={12} />
                <span>{item.readMinutes} min read</span>
              </span>
              <span className="text-[#cbd6cc]">•</span>
              <span className="rounded-full bg-[#e8f1e5] px-2.5 py-0.5 text-[11px] font-bold text-[#1c573e] capitalize">
                {item.status}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-[#163826] tracking-tight sm:text-4xl leading-tight">
              {language === "en" ? item.title : item.titleAm}
            </h1>
          </div>

          {/* Clean Editorial Photographic Figure */}
          <figure className="relative w-full aspect-21/9 min-h-[200px] overflow-hidden rounded-2xl border border-[#dce6dc] bg-[#eef3eb]">
            <img
              src={heroImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </figure>

          {/* Language Switcher Bar */}
          <div className="flex items-center justify-between border-b border-[#e5ece4] pb-4">
            <span className="text-xs font-bold text-[#64796a] uppercase tracking-wider">
              {language === "am" ? "ቋንቋ ይምረጡ:" : "Display Language:"}
            </span>
            <div className="flex rounded-full border border-[#bcd4bf] bg-white p-0.5 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-4 py-1.5 transition ${
                  language === "en"
                    ? "bg-[#1c573e] text-white shadow-2xs"
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
                    ? "bg-[#1c573e] text-white shadow-2xs"
                    : "text-[#5e7564] hover:text-[#183925]"
                }`}
              >
                አማርኛ
              </button>
            </div>
          </div>

          {/* Key Clinical Takeaway Summary */}
          <div className="rounded-2xl border border-[#cbe0ce] bg-[#f0f7f1] p-5 text-sm sm:text-base leading-relaxed text-[#234630]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1c573e] uppercase tracking-wider mb-2">
              <FileText size={15} />
              <span>{language === "am" ? "ዋና የትምህርት ማጠቃለያ" : "Core Curriculum Summary"}</span>
            </div>
            {language === "en" ? item.summary : item.summaryAm}
          </div>

          {/* Article Body */}
          <article className="prose prose-emerald max-w-none whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#2c4033]">
            {language === "en" ? item.content : item.contentAm}
          </article>
        </div>
      </div>
    </div>
  );
}
