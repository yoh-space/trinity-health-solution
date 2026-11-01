"use client";

import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function CommunityCta() {
  const { language, t } = useMarketingLanguage();

  return (
    <section
      id="community"
      className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1c573e] px-7 py-12 text-white sm:px-14 sm:py-16 lg:px-20">
        <div className="pointer-events-none absolute -right-20 -top-40 size-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-24 size-64 rounded-full border border-white/10" />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e6d8b5]">
              <Sparkles size={13} />
              {t("For Families & Health Workers", "ለቤተሰቦችና ለጤና ሰራተኞች")}
            </div>

            <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
              {t(
                "Better health learning, shared together.",
                "የተሻለ የጤና እውቀት፣ በጋራ የምንማረው።"
              )}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#d4e1d6] sm:text-base">
              {t(
                "Access free lessons in the web app, download the offline Android app, or use the publisher portal to manage content for your community.",
                "ትምህርቶችን በነፃ በዌብሳይቱ ያግኙ፣ ከመስመር ውጭ የሚሰራውን የአንድሮይድ መተግበሪያ ያውርዱ፣ ወይም ለአካባቢዎ የሚሆን የጤና ይዘት በአሳታሚ ፖርታል ያስተዳድሩ።"
              )}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3.5">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4e6c3] px-6 py-3.5 text-xs font-bold text-[#1c573e] transition hover:bg-white"
            >
              {t("Explore Free Lessons", "ትምህርቶችን ይጀምሩ")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/10"
            >
              {t("Client Portal", "የተገልጋይ ፖርታል")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
