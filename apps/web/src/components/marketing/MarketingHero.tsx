"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  HeartHandshake,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function MarketingHero() {
  const { language, t } = useMarketingLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfaf6] via-[#f7f5ed] to-[#fbfaf6] py-6 sm:py-10 lg:py-12">
      {/* Subtle ambient rings */}
      <div className="pointer-events-none absolute -right-28 -top-16 size-[380px] rounded-full border border-[#dfe5d8] sm:size-[480px]" />
      <div className="pointer-events-none absolute -right-8 top-10 size-[260px] rounded-full border border-[#e8ebdf] sm:size-[360px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-12">
        {/* Left Column: Maternal & Healthcare Access Value Proposition */}
        <div className="relative z-10">
          {/* Pillar 1 Focus Tag */}
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#cbe0d0] bg-[#eef7f0] px-3 py-1 text-[11px] font-bold text-[#1c573e]">
            <HeartHandshake size={13} className="text-[#b45d34]" />
            <span>{t("Pillar 1: Healthcare Access for Women & Girls", "ምዕራፍ 1፡ ለሴቶችና ልጃገረዶች የጤና ተደራሽነት")}</span>
          </div>

          {/* Compact, Powerful Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-[46px] leading-[1.12]">
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
          <p className="mt-3.5 max-w-[530px] text-xs leading-relaxed text-[#53685a] sm:text-sm sm:leading-6">
            {t(
              "Accessible health and nutrition education supporting mothers, girls, and families across antenatal and newborn care—grounded in Amharic, local dietary staples, and community health guidance.",
              "ለእናቶች፣ ወጣት ልጃገረዶች እና ቤተሰቦች ከቅድመ ወሊድ እስከ ጨቅላ ህፃናት እንክብካቤ የተዘጋጀ ተደራሽ የጤና እና የአመጋገብ ትምህርት—በአማርኛ፣ በየቤታችን በሚገኙ የምግብ ዓይነቶች እና በማህበረሰብ ጤና መመሪያዎች ላይ ያተኮረ።"
            )}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-95"
            >
              <span>{t("Explore Learning Library", "ትምህርቶችን ይጀምሩ")}</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>

            <a
              href="#mobile-app"
              className="inline-flex items-center gap-2 rounded-full border border-[#c4cec2] bg-white px-4 py-2.5 text-xs font-semibold text-[#294d3a] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] active:scale-95"
            >
              <Smartphone size={14} className="text-[#1c573e]" />
              <span>{t("Get Mobile App (APK)", "የአንድሮይድ መተግበሪያ")}</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#183b2d]/10 pt-4 text-[11px] font-medium text-[#65766a]">
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

        {/* Right Column: Mother & Child Transparent Hero Image */}
        <div className="relative mx-auto flex w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] items-center justify-center lg:ml-auto">
          {/* Radiant warm aura and concentric rings */}
          <div className="pointer-events-none absolute inset-0 -m-4 sm:-m-8 rounded-full bg-gradient-to-tr from-[#1c573e]/12 via-[#f4eee4]/60 to-[#b45d34]/10 blur-2xl" />
          <div className="pointer-events-none absolute size-[280px] sm:size-[360px] rounded-full border border-[#dce6d8]" />
          <div className="pointer-events-none absolute size-[210px] sm:size-[270px] rounded-full border border-[#e9efe6]" />

          {/* Mother carrying her baby/child portrait */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <Image
              src="/images/maternal-care-hero.png"
              alt="Ethiopian mother gently carrying and caring for her child, symbolizing maternal and child healthcare access"
              width={896}
              height={1200}
              priority
              className="h-auto w-full max-h-[440px] sm:max-h-[480px] object-contain drop-shadow-[0_20px_35px_rgba(20,50,30,0.18)] transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>

          {/* Top-Right Floating Badge: Maternal & Child Care */}
          <div className="absolute -right-2 top-4 z-20 rounded-2xl border border-[#d6e3d5] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-md sm:-right-4 sm:top-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1c573e]">
              <HeartHandshake size={14} className="text-[#b45d34]" />
              <span>{t("Maternal & Child Health", "የእናቶች እና የህፃናት ጤና")}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-[#5b7062]">
              {t("Antenatal to Early Nutrition", "የቅድመ ወሊድ እና የህፃናት አመጋገብ")}
            </p>
          </div>

          {/* Bottom-Left Floating Badge: Healthcare Access */}
          <div className="absolute -bottom-2 -left-2 z-20 flex items-center gap-2.5 rounded-2xl border border-[#d6e3d5] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-md sm:-bottom-3 sm:-left-4">
            <div className="grid size-8 place-items-center rounded-xl bg-[#e8efe6] text-[#1c573e]">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#708475]">
                {t("Care Access Focus", "የእንክብካቤ ተደራሽነት")}
              </p>
              <p className="text-xs font-bold text-[#163826]">
                {t("Women & Girls Health", "ለሴቶች እና ልጃገረዶች")}
              </p>
            </div>
          </div>

          {/* Bottom-Right Subtle Badge: Community Guidance */}
          <div className="absolute -bottom-2 right-2 z-20 hidden rounded-xl border border-[#164933] bg-[#1c573e]/95 px-2.5 py-1.5 text-white shadow-xs backdrop-blur-md sm:flex sm:items-center sm:gap-1.5">
            <Sparkles size={12} className="text-[#f1dfba]" />
            <span className="text-[10px] font-semibold">
              {t("Community Health Grounded", "በማህበረሰብ ጤና ላይ የተመሰረተ")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
