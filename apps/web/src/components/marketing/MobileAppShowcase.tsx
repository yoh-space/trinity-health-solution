"use client";

import Image from "next/image";
import { Download, Smartphone, QrCode, WifiOff, ShieldCheck, CheckCircle } from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function MobileAppShowcase() {
  const { language, t } = useMarketingLanguage();

  return (
    <section id="mobile-app" className="scroll-mt-20 bg-[#163a2a] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Download Information & Specs */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#d4e6d8] backdrop-blur-xs">
              <Smartphone size={14} className="text-[#e8d2a7]" />
              {t("Standalone Android Release", "ገለልተኛ የአንድሮይድ መተግበሪያ")}
            </div>

            <h2 className="mt-4 text-3xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl">
              {t(
                "Health in your hands. Even without internet.",
                "የጤና እውቀት በእጅዎ። ያለ ኢንተርኔት ግንኙነትም ጭምር።"
              )}
            </h2>

            <p className="mt-4 text-base leading-7 text-[#c7d9cc]">
              {t(
                "The Trinity Health Solution Android app is built for everyday reliability in Ethiopia. Pre-bundled with bite-sized lessons, Amharic font rendering, pantry recipe suggestions, and Opal AI assistance.",
                "ትሪኒቲ ሄልዝ ሶሉሽን ለኢትዮጵያውያን ተጠቃሚዎች በአስተማማኝ ሁኔታ የተሰራ ነው። የአማርኛ ፊደላትን አሟልቶ የያዘ፣ ያለ ኢንተርኔት የሚሰራ፣ የምግብ አዘገጃጀቶችና የኦፓል የጤና ረዳትን ያካተተ ነው።"
              )}
            </p>

            {/* Spec Highlights Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <WifiOff size={20} className="shrink-0 text-[#e8d2a7]" />
                <div>
                  <p className="font-bold text-white">
                    {t("100% Offline Mode", "ያለ ኢንተርኔት ይሰራል")}
                  </p>
                  <p className="mt-0.5 text-[#b2c7b7]">
                    {t("Zero mobile data needed after install", "ከተጫነ በኋላ ዳታ አይፈልግም")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck size={20} className="shrink-0 text-[#e8d2a7]" />
                <div>
                  <p className="font-bold text-white">
                    {t("Privacy Preserved", "ሚስጥር የተጠበቀ")}
                  </p>
                  <p className="mt-0.5 text-[#b2c7b7]">
                    {t("Explore without mandatory signup", "ያለ አካውንት መጠቀም ይቻላል")}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Download Strip */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/downloads/trinity-health-release.apk"
                download="trinity-health-release.apk"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#f4e6c3] px-7 py-4 text-sm font-bold text-[#1a3828] shadow-lg transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
              >
                <Download size={18} />
                <span>{t("Download Android APK (v1.0.0)", "የአንድሮይድ APK አውርድ (52 MB)")}</span>
              </a>

              <span className="text-xs text-[#a2baa8]">
                {t("Size: ~52 MB · Android 7.0+", "መጠን፡ ~52 ሜጋባይት · አንድሮይድ 7.0+")}
              </span>
            </div>
          </div>

          {/* Right Column: QR Code & Direct Mobile Scan Card */}
          <div className="relative mx-auto w-full max-w-[420px] rounded-[2.5rem] border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f4e6c3] text-[#1a3828]">
              <QrCode size={24} />
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {t("Scan with your phone", "በስልክዎ ስካን ያድርጉ")}
            </h3>
            <p className="mt-1.5 text-xs text-[#b8ccbe]">
              {t(
                "Point your mobile camera to download and install instantly.",
                "የስልክዎን ካሜራ በማነጣጠር በቀጥታ ወደ ስልክዎ ያውርዱ።"
              )}
            </p>

            {/* Simulated Modern QR Presentation */}
            <div className="mx-auto my-6 grid size-48 place-items-center rounded-2xl border-4 border-white bg-white p-3 shadow-inner">
              <svg
                viewBox="0 0 100 100"
                className="size-full fill-[#163a2a]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR Finder patterns */}
                <rect x="5" y="5" width="26" height="26" rx="4" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="13" width="10" height="10" rx="1" />

                <rect x="69" y="5" width="26" height="26" rx="4" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                <rect x="77" y="13" width="10" height="10" rx="1" />

                <rect x="5" y="69" width="26" height="26" rx="4" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                <rect x="13" y="77" width="10" height="10" rx="1" />

                {/* Decorative data blocks */}
                <rect x="36" y="8" width="6" height="6" />
                <rect x="46" y="8" width="14" height="6" />
                <rect x="36" y="18" width="8" height="8" />
                <rect x="48" y="18" width="8" height="8" />
                <rect x="36" y="36" width="28" height="8" />
                <rect x="8" y="36" width="8" height="12" />
                <rect x="20" y="36" width="8" height="8" />
                <rect x="8" y="52" width="12" height="8" />
                <rect x="72" y="36" width="12" height="12" />
                <rect x="88" y="36" width="6" height="16" />
                <rect x="72" y="52" width="8" height="8" />
                <rect x="36" y="48" width="8" height="16" />
                <rect x="48" y="48" width="16" height="8" />
                <rect x="56" y="60" width="8" height="16" />
                <rect x="36" y="68" width="14" height="8" />
                <rect x="36" y="80" width="8" height="14" />
                <rect x="48" y="80" width="16" height="8" />
                <rect x="72" y="72" width="22" height="8" />
                <rect x="72" y="84" width="8" height="10" />
                <rect x="84" y="84" width="10" height="10" />
              </svg>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#c0d4c6]">
              <CheckCircle size={14} className="text-[#f4e6c3]" />
              <span>{t("Verified SHA-256 release build", "በጥንቃቄ የተረጋገጠ የፕሮጀክት ስሪት")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
