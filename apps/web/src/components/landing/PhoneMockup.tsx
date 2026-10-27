"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Heart,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { PatternDivider } from "./PatternDivider";
import {
  languages,
  welcomeCopy,
  type LandingLanguage,
} from "./landingContent";

export function PhoneMockup() {
  const [lang, setLang] = useState<LandingLanguage>("am");
  const copy = welcomeCopy[lang];

  return (
    <div className="relative flex flex-col items-center">
      {/* Device Frame */}
      <div className="relative w-full max-w-[395px] h-[835px] max-h-[92vh] rounded-[38px] border-[7px] border-[#14221a] bg-[#f7fbf7] shadow-[0_30px_70px_-20px_rgba(20,34,26,0.45),0_0_0_1px_#34473b] flex flex-col overflow-hidden">
        {/* Subtle dot pattern background inside the phone */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(#ddebdf 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Phone Header / Brand Bar */}
        <div className="relative z-10 flex items-center gap-2.5 px-5 pt-4 pb-2.5 bg-[#f7fbf7]/90 backdrop-blur-sm border-b border-[#e2ede4]">
          <Image
            src="/images/trinity-mark.png"
            alt="Trinity Health Solution"
            width={34}
            height={34}
            className="h-7 w-auto object-contain"
          />
          <span className="text-[14px] font-bold text-[#14221a] tracking-tight">
            Trinity Health Solution
          </span>
        </div>

        {/* Scrollable Phone Screen Content */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4.5 sm:px-5 py-3.5 space-y-3.5 text-left scrollbar-thin">
          {/* Hero Art Card */}
          <div className="relative w-full h-[180px] rounded-[20px] overflow-hidden border border-[#d5e6d3] shadow-sm">
            <Image
              src="/images/health-worker-consultation.jpg"
              alt="Health worker consulting mother and child"
              fill
              className="object-cover object-[30%_35%]"
              priority
            />
            {/* Dark gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a3c1c]/75 via-transparent to-transparent pointer-events-none" />

            {/* Badge on hero image */}
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08743c]/90 text-white text-[10px] font-semibold border border-white/40 shadow-sm backdrop-blur-sm">
                {copy.badge}
              </span>
            </div>
          </div>

          {/* Welcome Text Section */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#39834f]">
              {copy.eyebrow}
            </p>
            <h2 className="text-[25px] sm:text-[27px] font-bold text-[#14251a] leading-[1.18] whitespace-pre-line tracking-tight">
              {copy.headlineFirst}
              <br />
              {copy.headlineSecond}
            </h2>
            <p className="text-[12.5px] leading-[1.55] text-[#35453a]">
              {copy.introduction}
            </p>
            <p className="text-[11.5px] leading-[1.5] text-[#4b5c51]">
              {copy.sdg}
            </p>
            <p className="text-[12px] font-bold leading-snug text-[#0e7a33]">
              {copy.closing}
            </p>

            {/* Category / Pillar Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f4eb] text-[#365f42] text-[11px] font-semibold">
                <BookOpen className="size-3.5 text-[#365f42]" aria-hidden="true" />
                {copy.categories[0]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f4eb] text-[#365f42] text-[11px] font-semibold">
                <Stethoscope className="size-3.5 text-[#365f42]" aria-hidden="true" />
                {copy.categories[1]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f4eb] text-[#365f42] text-[11px] font-semibold">
                <Heart className="size-3.5 text-[#365f42]" aria-hidden="true" />
                {copy.categories[2]}
              </span>
            </div>
          </div>

          {/* Pattern Divider */}
          <div className="py-1">
            <PatternDivider variant="subtle" />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-[12.5px] font-semibold text-[#26382c]">
              {copy.languagePrompt}
            </label>
            <div
              className="grid grid-cols-2 gap-2.5"
              role="radiogroup"
              aria-label="Language selection"
            >
              {languages.map((item) => {
                const active = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setLang(item.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      active
                        ? "bg-[#eef7f0] border-[#0e7a33] border-[1.5px] shadow-sm"
                        : "bg-white border-[#d5e6d3] hover:border-[#9ecaa4]"
                    }`}
                  >
                    <div>
                      <div
                        className={`text-[15px] font-bold leading-tight ${
                          active ? "text-[#0e7a33]" : "text-[#203127]"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#65756a] mt-0.5">
                        {item.translation}
                      </div>
                    </div>
                    {active && (
                      <Check
                        className="size-4.5 text-[#0e7a33] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 pb-1">
            <Link
              href="/notes"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#08713b] hover:bg-[#075f32] active:scale-[0.99] text-white text-[14px] font-bold transition shadow-md shadow-[#08713b]/20"
            >
              <span>{copy.begin}</span>
              <ArrowRight className="size-4.5 shrink-0" aria-hidden="true" />
            </Link>

            <Link
              href="/notes"
              className="w-full flex items-center justify-center gap-1 py-1 text-center text-[12px] font-medium text-[#4b5c51] hover:text-[#0e7a33] transition"
            >
              <span>{copy.explore}</span>
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#558262] pb-1">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{copy.privacyNote}</span>
          </div>

          {/* Phone home indicator bar */}
          <div className="pt-2 pb-1 flex justify-center">
            <div className="w-28 h-1 rounded-full bg-[#1b2b21]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
