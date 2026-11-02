"use client";

import { commitments } from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function CommitmentsBar() {
  const { language } = useMarketingLanguage();

  return (
    <section className="border-y border-[#183b2d]/[0.08] bg-[#f2f5ee]/70 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-[#dfe5db] bg-white/70 p-5 shadow-xs transition hover:bg-white hover:shadow-sm"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e5eddf] text-[#1c573e]">
                  <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1f3f2e]">
                    {language === "am" ? item.titleAm : item.titleEn}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#627367]">
                    {language === "am" ? item.descriptionAm : item.descriptionEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
