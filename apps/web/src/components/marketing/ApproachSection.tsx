"use client";

import { ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { approachSteps } from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function ApproachSection() {
  const { language, t } = useMarketingLanguage();

  return (
    <section id="approach" className="scroll-mt-20 bg-[#edf0e7] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12">
        {/* Left Column */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd8c6] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3d5e48]">
            <HeartHandshake size={14} className="text-[#c78157]" />
            {t("Our Guiding Philosophy", "መርሆዎቻችን")}
          </div>

          <h2 className="mt-4 max-w-lg text-3xl font-medium leading-[1.08] tracking-tight text-[#193b2d] sm:text-5xl">
            {t(
              "Health information should feel human.",
              "የጤና መረጃ ለሰው ልጆች የቀረበና ሩህሩህ መሆን አለበት።"
            )}
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#5e6f63]">
            {t(
              "We make space for learning that is clear, culturally resonant, and respectful of each family's everyday experience. Trinity bridges the gap between clinical expertise and community warmth.",
              "ለትምህርት ግልጽ፣ ባህላዊ እሴትን ያከበረ እና የእያንዳንዱን ቤተሰብ የዕለት ተዕለት ኑሮ ያማከለ ቦታ እንፈጥራለን። ትሪኒቲ በህክምና እውቀትና በማህበረሰብ እንክብካቤ መካከል ድልድይ ነው።"
            )}
          </p>

          <div className="mt-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#14422f]"
            >
              {t("Explore Our Approach in Practice", "ተግባራዊ ትምህርቶችን ይመልከቱ")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right Column: Step by Step */}
        <div className="divide-y divide-[#d3dbcf] border-y border-[#d3dbcf]">
          {approachSteps.map((step) => (
            <article
              key={step.number}
              className="grid gap-3 py-6 sm:grid-cols-[56px_1fr] sm:gap-5 sm:py-7"
            >
              <span className="text-sm font-bold tracking-widest text-[#7a8c78]">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#234330]">
                  {language === "am" ? step.titleAm : step.titleEn}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#5b6e61]">
                  {language === "am" ? step.descriptionAm : step.descriptionEn}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
