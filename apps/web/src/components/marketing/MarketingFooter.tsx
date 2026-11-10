"use client";

import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { useMarketingLanguage } from "./MarketingLanguageContext";
import { Globe, PhoneCall, MessageSquare } from "lucide-react";

export function MarketingFooter() {
  const { language, toggleLanguage, t } = useMarketingLanguage();
  const brandName = "Trinity Health Solution";

  return (
    <footer className="border-t border-[#183b2d]/10 bg-[#f4f6ef] text-[#475b4e]">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Wordmark & Mission */}
          <div className="space-y-4">
            <Wordmark />
            <p className="text-xs leading-relaxed text-[#687a6d]">
              {t(
                "Community-first, culturally rooted health education for Ethiopian families, health workers, and public health partners.",
                "ለኢትዮጵያውያን ቤተሰቦች፣ የጤና ሰራተኞች እና አጋር ድርጅቶች የተዘጋጀ ማህበረሰብ-መር የጤና ትምህርት።"
              )}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 rounded-full border border-[#cbd5c8] bg-white px-3 py-1 text-xs font-semibold text-[#254935] hover:border-[#1c573e]"
              >
                <Globe size={13} />
                <span>
                  {language === "am" ? "Switch to English" : "ወደ አማርኛ ቀይር"}
                </span>
              </button>
            </div>
          </div>

          {/* Col 2: Services & Learning */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Services & Learning", "አገልግሎቶች እና ትምህርት")}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/services" className="hover:text-[#1c573e]">
                  {t("Maternal & Child Services", "የእናቶችና ህፃናት አገልግሎቶች")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#1c573e]">
                  {t("Maternal & Infant Products", "የእናቶችና ህፃናት ጤና ምርቶች")}
                </Link>
              </li>
              <li>
                <Link href="/ask-opal" className="hover:text-[#1c573e]">
                  {t("Ask Opal AI Assistant", "ኦፓል የጤና ረዳት")}
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-[#1c573e]">
                  {t("Learning Library", "የትምህርት ቤተ-መጽሐፍት")}
                </Link>
              </li>
              <li>
                <a href="#pantry" className="hover:text-[#1c573e]">
                  {t("Pantry & Nutrition Explorer", "የጓዳ የምግብ ሀሳቦች")}
                </a>
              </li>
              <li>
                <a href="#mobile-app" className="hover:text-[#1c573e]">
                  {t("Download Android App", "የአንድሮይድ መተግበሪያ")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Collaboration & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Collaboration & Care", "አጋርነት እና ፖርታሎች")}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <a href="#partners" className="hover:text-[#1c573e] font-semibold text-[#1c573e]">
                  {t("Become a Partner", "አጋራችን ይሁኑ (Partners)")}
                </a>
              </li>
              <li>
                <Link href="/portal/consultations/new" className="hover:text-[#1c573e]">
                  {t("Book Care Consultation", "የባለሙያ ቀጠሮ ይያዙ")}
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-[#1c573e]">
                  {t("Client Portal", "የተገልጋዮች ፖርታል")}
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-[#1c573e]">
                  {t("Staff Queues & Care Desk", "የሰራተኞች የስራ ሰሌዳ")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#1c573e]">
                  {t("Staff Desk & Management Portal", "የባለሙያ እና የስራ አመራር ፖርታል (Staff Desk)")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotlines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Direct Contact & Support", "የቀጥታ ድጋፍ እና ስልኮች")}
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-xs">
              <a
                href="tel:+251988720194"
                className="flex items-center gap-2 font-bold text-[#1c573e] hover:underline"
              >
                <PhoneCall size={14} className="shrink-0" />
                <span>+251 98 872 0194 (Support)</span>
              </a>
              <a
                href="tel:952"
                className="flex items-center gap-2 font-bold text-[#b45d34] hover:underline"
              >
                <span className="rounded bg-[#ffece2] px-1.5 py-0.5 text-[11px] font-extrabold text-[#a74619]">
                  952
                </span>
                <span>{t("National Emergency Hotline", "ብሄራዊ የጤና መረጃ ስልክ")}</span>
              </a>
              <a
                href="https://t.me/Trinity_health_solution"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#246392] hover:underline"
              >
                <MessageSquare size={14} className="shrink-0" />
                <span>@Trinity_health_solution</span>
              </a>
              <a
                href="#contact"
                className="text-xs text-[#526657] hover:text-[#1c573e] pt-1"
              >
                {t("Visit Contact & Office Info →", "የአድራሻ ዝርዝሮችን ይመልከቱ →")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner with CSS Mosaic Grid */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* CSS Mosaic Grid Generation */}
        <div className="absolute inset-0 flex flex-col w-full h-full pointer-events-none select-none">
          {Array.from({ length: 12 }).map((_, r) => (
            <div key={r} className="flex-1 flex w-full">
              {Array.from({ length: 48 }).map((_, c) => {
                // Deterministic pseudo-randomness for the mosaic pattern
                const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
                const rand = hash - Math.floor(hash);

                // Gradient mapping: top rows are lighter/transparent, bottom rows are solid cyan/blue
                const rowFactor = r / 11; // 0 to 1

                // Base opacity combines the random noise with the vertical gradient
                const opacity = rand * 0.2 + rowFactor * 0.85;

                return (
                  <div
                    key={c}
                    className="flex-1 border-r border-b border-transparent"
                    style={{
                      backgroundColor: `rgba(89, 195, 224, ${opacity})`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Big Text Container */}
        <div className="relative flex items-center justify-center w-full py-2 md:py-3 px-1 md:px-2 z-10 overflow-hidden">
          <span className="text-[13vw] md:text-[14vw] font-black text-white/90 dark:text-white/60 mix-blend-overlay tracking-tighter leading-none select-none text-center whitespace-nowrap">
            {brandName.toUpperCase()}
          </span>
        </div>
      </div>
    </footer>
  );
}
