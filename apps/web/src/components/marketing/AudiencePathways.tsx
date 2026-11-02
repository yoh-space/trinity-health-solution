"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { audiencePathways } from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function AudiencePathways() {
  const { language, t } = useMarketingLanguage();

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7550]">
          {t("Built for the Whole Ecosystem", "ለሁሉም የተዘጋጀ መድረክ")}
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-[#193b2d] sm:text-5xl">
          {t(
            "Connecting families, care providers, and partners.",
            "ቤተሰቦችን፣ የጤና ባለሙያዎችንና አጋሮችን እናገናኛለን።"
          )}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#627367] sm:text-base">
          {t(
            "Whether you are looking for guidance for your family, organizing community outreach, or publishing verified public health curricula, Trinity provides tailored tools.",
            "ለቤተሰብዎ የጤና እውቀት ቢፈልጉ፣ የማህበረሰብ ጤና ስራዎችን ቢያስተባብሩ ወይም የጤና መመሪያዎችን ቢያትቱ፣ ትሪኒቲ ተስማሚ መሳሪያዎችን ያቀርባል።"
          )}
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {audiencePathways.map((pathway) => {
          const Icon = pathway.icon;
          const points = language === "am" ? pathway.pointsAm : pathway.pointsEn;

          return (
            <div
              key={pathway.id}
              className="flex flex-col justify-between rounded-[2rem] border border-[#dce3d8] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-[#ccd7c7] hover:shadow-[0_20px_45px_rgba(28,60,40,0.08)] sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${pathway.tint}`}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <span className="rounded-full bg-[#f4f7f1] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#637568]">
                    {language === "am" ? pathway.badgeAm : pathway.badgeEn}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#1a3828]">
                  {language === "am" ? pathway.titleAm : pathway.titleEn}
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#5f7063]">
                  {language === "am" ? pathway.descriptionAm : pathway.descriptionEn}
                </p>

                <div className="mt-6 border-t border-[#edf2ea] pt-5">
                  <ul className="flex flex-col gap-2.5">
                    {points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#445b4c]">
                        <Check size={14} className="shrink-0 text-[#287343] mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-[#edf2ea] pt-5">
                <Link
                  href={pathway.ctaHref}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#f4f7f1] py-3 text-xs font-bold text-[#1c573e] transition hover:bg-[#1c573e] hover:text-white"
                >
                  <span>
                    {language === "am" ? pathway.ctaLabelAm : pathway.ctaLabelEn}
                  </span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
