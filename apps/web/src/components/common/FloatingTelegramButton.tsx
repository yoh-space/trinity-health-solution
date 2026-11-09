"use client";

import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

export function FloatingTelegramButton() {
  const { t } = useMarketingLanguage();

  return (
    <aside
      aria-label="Telegram Community"
      className="fixed bottom-6 left-6 z-50 pointer-events-auto"
    >
      <a
        href="https://t.me/Trinity_health_solution"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(
          "Join our Telegram Mothers & Caregivers Community",
          "የቴሌግራም የእናቶችና ተንከባካቢዎች ማህበረሰብን ይቀላቀሉ"
        )}
        className="group relative flex items-center gap-2.5 rounded-full border border-[#1b7fae]/40 bg-[#229ED9] px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shadow-2xl transition-all duration-300 hover:bg-[#1c8ec4] hover:shadow-[0_12px_28px_rgba(34,158,217,0.4)] active:scale-95"
      >
        {/* Telegram Paper Plane Icon Container */}
        <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs">
          <svg
            viewBox="0 0 24 24"
            className="size-4.5 fill-current transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>

          {/* Activity pulsing indicator */}
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
        </div>

        {/* Bilingual Text */}
        <div className="text-left">
          <span className="block text-xs font-bold leading-none tracking-wide text-white">
            {t("Join Community", "ማህበረሰቡን ይቀላቀሉ")}
          </span>
          <span className="block text-[10px] font-medium leading-none text-sky-100 mt-1">
            {t("Telegram Channel", "የቴሌግራም ቻናል")}
          </span>
        </div>
      </a>
    </aside>
  );
}
