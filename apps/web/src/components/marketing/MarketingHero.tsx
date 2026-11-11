"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function MarketingHero() {
  const { language, t } = useMarketingLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-[#3d4c3d] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(108deg,#29382f_0%,#394a3b_45%,#59664f_76%,#798168_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[58%] bg-[linear-gradient(90deg,rgba(57,74,59,0)_0%,rgba(121,129,104,0.1)_100%)] lg:block"
      />

      <div className="relative mx-auto grid min-h-[760px] w-full max-w-7xl grid-cols-1 items-center gap-0 px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 lg:px-12 lg:py-0 xl:min-h-[700px]">
        <div className="relative z-10 max-w-[610px] lg:py-16">
          <div aria-hidden="true" className="mb-6 h-px w-14 bg-[#d8bd7c]" />
          <h1 className="font-serif text-[2.8rem] leading-[1.04] tracking-[-0.035em] text-[#fffdf8] sm:text-6xl lg:text-[4.45rem]">
            {language === "am" ? (
              <>
                ትንሽ እውቀት።
                <br />
                <em className="font-serif italic text-[#e4d0a0]">ብዙ እንክብካቤ።</em>
                <br />
                በየዕለቱ።
              </>
            ) : (
              <>
                A little more
                <br />
                <em className="font-serif italic text-[#e4d0a0]">well-informed.</em>
                <br />
                Every single day.
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[550px] text-sm leading-6 text-[#f2f0e9]/90 sm:text-base sm:leading-7">
            {t(
              "Accessible health and nutrition education supporting mothers, girls, and families across antenatal and newborn care—grounded in Amharic, local dietary staples, and community health guidance.",
              "ለእናቶች፣ ወጣት ልጃገረዶች እና ቤተሰቦች ከቅድመ ወሊድ እስከ ጨቅላ ህፃናት እንክብካቤ የተዘጋጀ ተደራሽ የጤና እና የአመጋገብ ትምህርት—በአማርኛ፣ በየቤታችን በሚገኙ የምግብ ዓይነቶች እና በማህበረሰብ ጤና መመሪያዎች ላይ ያተኮረ።"
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex min-h-12 items-center gap-3 rounded-md bg-[#c68e18] px-6 py-3 text-sm font-semibold text-[#fffdf8] shadow-sm transition-colors hover:bg-[#ad7911] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d997]"
            >
              {t("Explore Learning Library", "ትምህርቶችን ይጀምሩ")}
              <ArrowRight
                size={17}
                aria-hidden="true"
                className={language === "am" ? "rotate-180" : ""}
              />
            </Link>

            <a
              href="#mobile-app"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-md border border-white/45 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Smartphone size={16} aria-hidden="true" />
              {t("Get Mobile App (APK)", "የአንድሮይድ መተግበሪያ")}
            </a>
          </div>

          <p className="mt-6 border-t border-white/20 pt-4 text-xs leading-5 text-[#f2f0e9]/80 sm:text-sm">
            {t(
              "Free and open access · Amharic + English · Grounded in community health",
              "ነፃ እና ክፍት ተደራሽነት · አማርኛ እና እንግሊዝኛ · በማህበረሰብ ጤና ላይ የተመሰረተ"
            )}
          </p>
        </div>

        <div className="relative mx-auto mt-5 flex h-[390px] w-full max-w-[430px] items-end justify-center sm:h-[470px] lg:mt-0 lg:h-[640px] lg:max-w-none xl:h-[700px]">
          <Image
            src="/images/maternal-care-hero.png"
            alt={t(
              "A mother holding her baby, representing maternal and child health",
              "እናት ህፃኗን ይዛ የምትንከባከብ፣ የእናቶችና የህፃናት ጤናን የሚወክል"
            )}
            width={896}
            height={1200}
            priority
            sizes="(max-width: 1023px) 90vw, 46vw"
            className="h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_22px_40px_rgba(0,0,0,0.24)]"
          />
        </div>
      </div>
    </section>
  );
}
