"use client";

import { useState } from "react";
import { EducationItem } from "./types";

export function ContentPreview({
  item,
  onClose,
}: {
  item: EducationItem;
  onClose: () => void;
}) {
  const [language, setLanguage] = useState<"en" | "am">("en");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102819]/60 p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Content preview"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#fbfaf6] p-6 text-[#183b2d] shadow-2xl sm:p-10">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#579165]">
              LIVE PREVIEW · {item.category}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {language === "en" ? item.title : item.titleAm}
            </h2>
            <p className="mt-2 text-xs text-[#829086]">
              {item.readMinutes} min read · {item.status}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#c9d8cb] px-4 py-2 text-sm font-bold text-[#52705b]"
          >
            Close
          </button>
        </div>
        <div className="mt-6 flex rounded-full border border-[#bcd4bf] bg-white p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-full px-4 py-2 ${language === "en" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("am")}
            className={`rounded-full px-4 py-2 ${language === "am" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
          >
            አማርኛ
          </button>
        </div>
        <p className="mt-6 rounded-2xl bg-[#eaf4eb] p-5 leading-7 text-[#47624d]">
          {language === "en" ? item.summary : item.summaryAm}
        </p>
        <article className="mt-8 whitespace-pre-line text-base leading-8 text-[#4f6254]">
          {language === "en" ? item.content : item.contentAm}
        </article>
      </div>
    </div>
  );
}
