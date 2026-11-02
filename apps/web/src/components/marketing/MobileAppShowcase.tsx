"use client";

import Image from "next/image";
import { Download, Smartphone, QrCode, WifiOff, ShieldCheck, CheckCircle, ExternalLink } from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";
import { ReleaseQrCode } from "./ReleaseQrCode";

const LATEST_RELEASE_APK_URL =
  "https://github.com/yoh-space/trinity-health-solution/releases/latest/download/trinity-health-release.apk";
const ALL_RELEASES_URL =
  "https://github.com/yoh-space/trinity-health-solution/releases";

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
                href={LATEST_RELEASE_APK_URL}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#f4e6c3] px-7 py-4 text-sm font-bold text-[#1a3828] shadow-lg transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
              >
                <Download size={18} />
                <span>{t("Download Android APK (Latest)", "የአንድሮይድ APK አውርድ (አዲስ ስሪት)")}</span>
              </a>

              <a
                href={ALL_RELEASES_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-4 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95"
              >
                <span>{t("Releases & Notes", "ስሪቶችና ማስታወሻዎች")}</span>
                <ExternalLink size={14} className="opacity-80" />
              </a>

              <span className="text-xs text-[#a2baa8]">
                {t("Size: ~52 MB · Android 7.0+", "መጠን፡ ~52 ሜጋባይት · አንድሮይድ 7.0+")}
              </span>
            </div>
          </div>

          {/* Right Column: Scannable QR Code & Direct Mobile Scan Card */}
          <div className="relative mx-auto w-full max-w-[420px] rounded-[2.5rem] border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f4e6c3] text-[#1a3828]">
              <QrCode size={24} />
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {t("Scan with your phone", "በስልክዎ ስካን ያድርጉ")}
            </h3>
            <p className="mt-1.5 text-xs text-[#b8ccbe]">
              {t(
                "Point your mobile camera to download the APK directly from GitHub Releases.",
                "የስልክዎን ካሜራ በማነጣጠር በቀጥታ ከ GitHub Releases ያውርዱ።"
              )}
            </p>

            {/* Camera-scannable QR code */}
            <a
              href={LATEST_RELEASE_APK_URL}
              className="group mx-auto my-6 block size-52 overflow-hidden rounded-2xl border-4 border-white bg-white p-2.5 shadow-2xl transition hover:scale-105"
              title="Click or scan to download Trinity Health APK"
            >
              <ReleaseQrCode className="size-full transition group-hover:opacity-95" />
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#c0d4c6]">
              <CheckCircle size={14} className="text-[#f4e6c3]" />
              <span>{t("Verified SHA-256 release builds via GitHub Actions", "በ GitHub Actions የተረጋገጠ የፕሮጀክት ስሪት")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
