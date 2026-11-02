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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfaf6] via-[#f7f5ed] to-[#fbfaf6] py-5 sm:py-8 lg:py-10">
      {/* Subtle ambient rings */}
      <div className="pointer-events-none absolute -right-28 -top-16 size-[380px] rounded-full border border-[#dfe5d8] sm:size-[480px]" />
      <div className="pointer-events-none absolute -right-8 top-10 size-[260px] rounded-full border border-[#e8ebdf] sm:size-[360px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-12">
        {/* Left Column: Minimal, Crisp Value Proposition */}
        <div className="relative z-10">
          {/* Compact, Powerful Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-[44px] leading-[1.12]">
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
          <p className="mt-3 max-w-[520px] text-xs leading-relaxed text-[#53685a] sm:text-sm sm:leading-6">
            {t(
              "Accessible health and nutrition education supporting women, girls, and families—grounded in Amharic, familiar pantry staples, and reviewed public health resources.",
              "ለሴቶች፣ ወጣት ልጃገረዶች እና ቤተሰቦች የተዘጋጀ ተደራሽ የጤና እና የአመጋገብ ትምህርት—በአማርኛ፣ በየቤታችን በሚገኙ የምግብ ዓይነቶች እና በተገመገሙ የጤና መረጃዎች ላይ ያተኮረ።"
            )}
          </p>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-4.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-95"
            >
              <span>{t("Explore Learning Library", "ትምህርቶችን ይጀምሩ")}</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>

            <a
              href="#mobile-app"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c4cec2] bg-white px-3.5 py-2 text-xs font-semibold text-[#294d3a] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] active:scale-95"
            >
              <Smartphone size={13} className="text-[#1c573e]" />
              <span>{t("Get Mobile App (APK)", "የአንድሮይድ መተግበሪያ")}</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#183b2d]/10 pt-3.5 text-[11px] font-medium text-[#65766a]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#287343]" />
              <span>{t("100% Free & Open Access", "100% ነፃ እና ክፍት")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#287343]" />
              <span>{t("Community Health Grounded", "በማህበረሰብ ጤና እውቀት ላይ የተመሰረተ")}</span>
            </div>
            <span className="text-[#cbd4c8]">•</span>
            <div className="flex items-center gap-1.5">
              <Globe size={13} className="text-[#287343]" />
              <span>{t("Amharic + English", "አማርኛ እና እንግሊዝኛ")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Compact Mobile Phone Mockup */}
        <div className="relative mx-auto w-full max-w-[300px] lg:ml-auto">
          {/* Interactive Screen Selector Pills */}
          <div className="mb-2.5 flex items-center justify-center gap-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                activeTab === "home"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Daily Home", "መነሻ")}
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                activeTab === "learn"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Lessons", "ትምህርቶች")}
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                activeTab === "food"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "bg-white text-[#54685b] border border-[#d2ddd0] hover:bg-[#f3f7f3]"
              }`}
            >
              {t("Pantry Meal", "የምግብ ሀሳብ")}
            </button>
          </div>

          {/* 3D Perspective Container */}
          <div className="perspective-[1000px]">
            {/* Compact 3D Phone Frame */}
            <div className="relative mx-auto w-full max-w-[215px] sm:max-w-[230px] rounded-[2rem] border-[5px] border-[#18211b] bg-[#121814] p-1 shadow-[0_15px_35px_-10px_rgba(20,50,30,0.3)] ring-1 ring-white/10 transition-all duration-500 ease-out hover:rotate-0 hover:scale-[1.02] [transform:rotateY(-4deg)_rotateX(2deg)_rotateZ(-0.5deg)]">
              {/* Speaker Bar & Camera Hole */}
              <div className="absolute left-1/2 top-1.5 z-30 flex h-2.5 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#0a0d0b]">
                <div className="size-1 rounded-full bg-[#1b261e]" />
              </div>

              {/* Inner Phone Display (Compact Height ~350px) */}
              <div className="relative h-[320px] sm:h-[350px] w-full overflow-hidden rounded-[1.6rem] bg-[#fbfaf6]">
                <Image
                  src={screenshotMap[activeTab]}
                  alt="Trinity Health Solution Android application screenshot"
                  fill
                  sizes="(max-width: 768px) 100vw, 230px"
                  priority
                  className="object-cover object-top transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Offline Trust Badge */}
          <div className="absolute -bottom-2 -left-3 z-20 flex items-center gap-2 rounded-xl border border-[#d6dfd2] bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-xs sm:-bottom-2 sm:-left-4">
            <div className="grid size-7 place-items-center rounded-lg bg-[#e5eddf] text-[#1c573e]">
              <Smartphone size={14} />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#79887d]">
                {t("Android APK", "የአንድሮይድ መተግበሪያ")}
              </p>
              <p className="text-[10px] font-bold text-[#1f3f2f]">
                {t("Offline Learning Notes", "ያለ ኢንተርኔት የሚነበቡ ማስታወሻዎች")}
              </p>
            </div>
          </div>

          {/* Opal Guidance Badge */}
          <div className="absolute -right-2 top-10 z-20 hidden rounded-xl border border-[#164933] bg-[#1c573e]/95 px-2.5 py-1.5 text-white shadow-sm backdrop-blur-xs sm:block">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold">
              <MessageSquare size={12} className="text-[#f1dfba]" />
              <span>{t("Ask Opal Guidance", "ኦፓል የጤና መመሪያ")}</span>
            </div>
            <p className="text-[9px] text-[#d6e5d8]">
              {t("Reviewed maternal & nutrition learning", "የተገመገሙ የእናቶችና የተመጣጠነ ምግብ ትምህርቶች")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
