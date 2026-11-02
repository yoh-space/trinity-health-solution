"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  MessageSquare,
  Smartphone,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfaf6] via-[#f7f5ed] to-[#fbfaf6] py-8 sm:py-12 lg:py-16">
      {/* Subtle ambient rings */}
      <div className="pointer-events-none absolute -right-32 -top-20 size-[420px] rounded-full border border-[#dfe5d8] sm:size-[560px]" />
      <div className="pointer-events-none absolute -right-10 top-10 size-[300px] rounded-full border border-[#e8ebdf] sm:size-[440px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-12">
        {/* Left Column: Minimal, Crisp Value Proposition */}
        <div className="relative z-10">
          {/* Eyebrow badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d6dfd2] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#294d3a] shadow-2xs">
            <span className="size-2 rounded-full bg-[#287343]" />
            {t("የተረጋገጠ የጤና ትምህርት · Practical Health Learning", "የተረጋገጠ የጤና ትምህርት · Practical Health Learning")}
          </div>

          {/* Compact, Powerful Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-5xl leading-[1.12]">
            {language === "am" ? (
              <>
                ትንሽ እውቀት።{" "}
                <span className="font-serif italic text-[#356d47]">
                  ብዙ እንክብካቤ።
                </span>{" "}
                በየዕለቱ።
              </>
            ) : (
              <>
                A little more{" "}
                <span className="font-serif italic text-[#356d47]">
                  well-informed.
                </span>{" "}
                Every single day.
              </>
            )}
          </h1>

          {/* Subtitle description */}
          <p className="mt-3.5 max-w-[540px] text-xs leading-relaxed text-[#53685a] sm:text-sm sm:leading-6">
            {t(
              "Clear, practical health learning designed for Ethiopian families—grounded in Amharic, familiar pantry staples, and verified by health professionals.",
              "ለኢትዮጵያውያን ቤተሰቦች የተዘጋጀ ግልጽ እና ተግባራዊ የጤና ትምህርት—በአማርኛ፣ በየቤታችን በሚገኙ የምግብ ዓይነቶችና በጤና ባለሙያዎች የተረጋገጠ።"
            )}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-95"
            >
              <span>{t("Explore Learning Library", "ትምህርቶችን ይጀምሩ")}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <a
              href="#mobile-app"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c4cec2] bg-white px-4 py-2.5 text-xs font-semibold text-[#294d3a] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] active:scale-95"
            >
              <Smartphone size={14} className="text-[#1c573e]" />
              <span>{t("Get Mobile App (APK)", "የአንድሮይድ መተግበሪያ")}</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3.5 border-t border-[#183b2d]/10 pt-4 text-[11px] font-medium text-[#65766a]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#287343]" />
              <span>{t("100% Free & Open Access", "100% ነፃ እና ክፍት")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#287343]" />
              <span>{t("UNICEF-Aligned", "ከዩኒሴፍ መመሪያዎች ጋር የተጣጣመ")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-[#287343]" />
              <span>{t("Amharic + English", "አማርኛ እና እንግሊዝኛ")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Phone Mockup */}
        <div className="relative mx-auto w-full max-w-[340px] lg:ml-auto">
          {/* Interactive Screen Selector Pills */}
          <div className="mb-3 flex items-center justify-center gap-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                activeTab === "home"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Daily Home", "መነሻ")}
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                activeTab === "learn"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Lessons", "ትምህርቶች")}
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                activeTab === "food"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Pantry Meal", "የምግብ ሀሳብ")}
            </button>
          </div>

          {/* Compact Phone Frame */}
          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px] rounded-[2.4rem] border-[6px] border-[#1e2722] bg-[#1a211d] p-1 shadow-xl">
            {/* Speaker bar */}
            <div className="absolute left-1/2 top-2 z-30 h-3 w-20 -translate-x-1/2 rounded-full bg-[#111613]" />

            {/* Inner Phone Display */}
            <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[2rem] bg-[#fbfaf6]">
              <Image
                src={screenshotMap[activeTab]}
                alt="Trinity Health Solution Android application screenshot"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                priority
                className="object-cover object-top transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Offline Trust Badge */}
          <div className="absolute -bottom-3 -left-2 z-20 flex items-center gap-2.5 rounded-xl border border-[#d6dfd2] bg-white p-2.5 shadow-sm sm:-bottom-4 sm:-left-4">
            <div className="grid size-8 place-items-center rounded-lg bg-[#e5eddf] text-[#1c573e]">
              <Smartphone size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#79887d]">
                {t("Android APK", "የአንድሮይድ መተግበሪያ")}
              </p>
              <p className="text-[11px] font-bold text-[#1f3f2f]">
                {t("100% Offline", "ያለ ኢንተርኔት")}
              </p>
            </div>
          </div>

          {/* Opal Guidance Badge */}
          <div className="absolute -right-2 top-16 z-20 hidden rounded-xl border border-[#164933] bg-[#1c573e] p-2.5 text-white shadow-sm sm:block">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <MessageSquare size={13} className="text-[#f1dfba]" />
              <span>{t("Ask Opal Guidance", "ኦፓል የጤና መመሪያ")}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-[#d6e5d8]">
              {t("Verified maternal & nutrition answers", "የተረጋገጡ የጤና መልሶች")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
