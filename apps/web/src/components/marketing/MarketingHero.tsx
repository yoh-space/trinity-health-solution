"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  ShieldCheck,
  Globe,
  MessageSquare,
  Smartphone,
  BookOpen,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function MarketingHero() {
  const { language, t } = useMarketingLanguage();
  const [activeTab, setActiveTab] = useState<"home" | "learn" | "food">("home");

  const screenshotMap = {
    home: "/images/app-screen-home.png",
    learn: "/images/app-screen-learn.png",
    food: "/images/app-screen-food.png",
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfaf6] via-[#f7f5ed] to-[#fbfaf6]">
      {/* Background ambient circular rings */}
      <div className="pointer-events-none absolute -right-36 -top-24 size-[540px] rounded-full border border-[#dfe5d8] sm:-right-24 sm:top-[-150px] sm:size-[760px]" />
      <div className="pointer-events-none absolute -right-16 top-16 size-[390px] rounded-full border border-[#e8ebdf] sm:right-[-3rem] sm:top-[-3rem] sm:size-[600px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-1/3 size-96 rounded-full bg-[#e9f0e3]/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:pb-32 lg:pt-24">
        {/* Left Column: Headline, Value Proposition, Action CTAs */}
        <div className="relative z-10">
          {/* Eyebrow badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6dfd2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#294d3a] shadow-xs">
            <span className="size-2 rounded-full bg-[#287343]" />
            {t("የተረጋገጠ የጤና ትምህርት · Practical Health Learning", "የተረጋገጠ የጤና ትምህርት · Practical Health Learning")}
          </div>

          {/* Main Title */}
          <h1 className="max-w-[700px] text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.06em] text-[#193b2d]">
            {language === "am" ? (
              <>
                ትንሽ እውቀት።
                <br />
                <span className="font-serif italic text-[#4a7356]">
                  ብዙ እንክብካቤ።
                </span>
                <br />
                በየዕለቱ።
              </>
            ) : (
              <>
                A little more
                <br />
                <span className="font-serif italic text-[#4a7356]">
                  well-informed.
                </span>
                <br />
                Every single day.
              </>
            )}
          </h1>

          {/* Subtitle description */}
          <p className="mt-6 max-w-[560px] text-base leading-7 text-[#57695e] sm:mt-7 sm:text-lg sm:leading-8">
            {t(
              "Clear, practical health learning designed for Ethiopian families—grounded in Amharic, familiar pantry staples, and verified by health professionals.",
              "ለኢትዮጵያውያን ቤተሰቦች የተዘጋጀ ግልጽ እና ተግባራዊ የጤና ትምህርት—በአማርኛ፣ በየቤታችን በሚገኙ የምግብ ዓይነቶችና በጤና ባለሙያዎች የተረጋገጠ።"
            )}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:mt-10">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#1c573e] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(28,87,62,0.18)] transition hover:-translate-y-0.5 hover:bg-[#154631] active:translate-y-0"
            >
              {t("Explore Learning Library", "ትምህርቶችን በነፃ ይጀምሩ")}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <a
              href="#mobile-app"
              className="inline-flex items-center gap-2 rounded-full border border-[#c4cec2] bg-white/90 px-5 py-3.5 text-sm font-semibold text-[#294d3a] shadow-xs transition hover:border-[#1c573e] hover:bg-white active:scale-95"
            >
              <Smartphone size={16} className="text-[#1c573e]" />
              {t("Get Mobile App (APK)", "የአንድሮይድ መተግበሪያ")}
            </a>
          </div>

          {/* Proof Badges */}
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#183b2d]/10 pt-7 text-xs font-medium text-[#65766a]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#287343]" />
              <span>{t("100% Free & Open Access", "100% ነፃ እና ክፍት")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#287343]" />
              <span>{t("UNICEF-Aligned Guidance", "ከዩኒሴፍ መመሪያዎች ጋር የተጣጣመ")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#287343]" />
              <span>{t("Bilingual Amharic + English", "በአማርኛ እና በእንግሊዝኛ")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Interactive Phone & App Mockup */}
        <div className="relative mx-auto w-full max-w-[480px] lg:ml-auto">
          {/* Subtle colorful backdrops */}
          <div className="absolute -left-6 top-12 size-36 rounded-full bg-[#f1dfba]/50 blur-3xl" />
          <div className="absolute -bottom-10 right-2 size-48 rounded-full bg-[#c3dbc0]/60 blur-3xl" />

          {/* Interactive Screen Selector Pills */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                activeTab === "home"
                  ? "bg-[#1c573e] text-white shadow-xs"
                  : "bg-white/80 text-[#54685b] border border-[#d2ddd0] hover:bg-white"
              }`}
            >
              {t("Daily Home", "መነሻ")}
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                activeTab === "learn"
                  ? "bg-[#1c573e] text-white shadow-xs"
                  : "bg-white/80 text-[#54685b] border border-[#d2ddd0] hover:bg-white"
              }`}
            >
              {t("Lessons", "ትምህርቶች")}
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                activeTab === "food"
                  ? "bg-[#1c573e] text-white shadow-xs"
                  : "bg-white/80 text-[#54685b] border border-[#d2ddd0] hover:bg-white"
              }`}
            >
              {t("Pantry Meal", "የምግብ ሀሳብ")}
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="relative mx-auto w-full max-w-[340px] rounded-[3rem] border-[9px] border-[#1f2823] bg-[#1a211d] p-1.5 shadow-[0_25px_60px_-15px_rgba(20,40,28,0.35)]">
            {/* Top speaker notch / camera */}
            <div className="absolute left-1/2 top-3 z-30 h-4 w-28 -translate-x-1/2 rounded-full bg-[#111613]" />

            {/* Inner Phone Display */}
            <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.3rem] bg-[#fbfaf6]">
              <Image
                src={screenshotMap[activeTab]}
                alt="Trinity Health Solution Android release application screenshot"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                priority
                className="object-cover object-top transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Offline Trust Badge */}
          <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 rounded-2xl border border-[#d6dfd2] bg-white p-3.5 shadow-md sm:-bottom-5 sm:-left-8 sm:p-4">
            <div className="grid size-10 place-items-center rounded-xl bg-[#e5eddf] text-[#1c573e]">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#79887d]">
                {t("Android Release APK", "የአንድሮይድ መተግበሪያ")}
              </p>
              <p className="text-xs font-bold text-[#1f3f2f]">
                {t("100% Offline Capable", "ያለ ኢንተርኔት ይሰራል")}
              </p>
            </div>
          </div>

          {/* Floating Opal Guidance Badge */}
          <div className="absolute -right-4 top-24 z-20 hidden rounded-2xl border border-[#164933] bg-[#1c573e] p-3 text-white shadow-md sm:block">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <MessageSquare size={14} className="text-[#f1dfba]" />
              <span>{t("Ask Opal Guidance", "ኦፓል የጤና መመሪያ")}</span>
            </div>
            <p className="mt-1 text-[11px] text-[#d6e5d8]">
              {t("Verified maternal & nutrition answers", "የተረጋገጡ የጤና እና አመጋገብ መልሶች")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
