"use client";

import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { useMarketingLanguage } from "./MarketingLanguageContext";
import { ShieldAlert, Heart, Globe } from "lucide-react";

export function MarketingFooter() {
  const { language, toggleLanguage, t } = useMarketingLanguage();

  return (
    <footer className="border-t border-[#183b2d]/10 bg-[#f4f6ef] text-[#475b4e]">
      {/* Disclaimer Strip */}
      <div className="border-b border-[#183b2d]/[0.06] bg-[#eaeede] py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 text-xs text-[#526657] sm:px-8 lg:px-12">
          <ShieldAlert size={16} className="shrink-0 text-[#c78157]" />
          <p>
            {t(
              "Educational Notice: Trinity Health Solution provides educational guidance and is not a substitute for professional clinical diagnosis or emergency care. For medical emergencies in Ethiopia, please call 952 or contact your local health center.",
              "የትምህርታዊ ይዘት ማሳሰቢያ፡ ትሪኒቲ ሄልዝ ሶሉሽን ትምህርታዊ የጤና መረጃ የሚሰጥ ሲሆን የድንገተኛ ህክምና ወይም የህክምና ባለሙያ ምርመራን አይተካም። ለድንገተኛ አደጋዎች እባክዎ 952 ይደውሉ ወይም በአቅራቢያዎ ወደሚገኝ ጤና ጣቢያ ይሂዱ።"
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
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

          {/* Col 2: Learning & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Explore", "ማሰሻ")}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/learn" className="hover:text-[#1c573e]">
                  {t("Learning Library", "የትምህርት ቤተ-መጽሐፍት")}
                </Link>
              </li>
              <li>
                <Link href="/ask-opal" className="hover:text-[#1c573e]">
                  {t("Ask Opal AI Assistant", "ኦፓል የጤና ረዳት")}
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

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Portals", "ፖርታሎች")}
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/portal" className="hover:text-[#1c573e]">
                  {t("Client Portal", "የተገልጋዮች ፖርታል")}
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-[#1c573e]">
                  {t("Staff Queues & Consultations", "የሰራተኞች የስራ ሰሌዳ")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#1c573e]">
                  {t("Publisher & Curriculum Manager", "የአሳታሚ አስተዳዳሪ")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Commitments & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e3c2c]">
              {t("Emergency Contacts", "አስፈላጊ ስልኮች")}
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-[#687a6d]">
              {t(
                "National Health Hotline (Ethiopia): Dial 952",
                "ብሄራዊ የጤና መረጃ ስልክ (ኢትዮጵያ)፡ 952 ይደውሉ"
              )}
            </p>
            <p className="mt-2 text-xs text-[#687a6d]">
              {t(
                "UNICEF Maternal & Child Health Partner Framework",
                "ከዩኒሴፍ የእናቶችና ህፃናት ጤና አጋርነት ጋር የተጣጣመ"
              )}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#183b2d]/[0.08] pt-8 text-xs text-[#738578] sm:flex-row">
          <p>
            © {new Date().getFullYear()} Trinity Health Solution.{" "}
            {t("All rights reserved.", "መብቱ በህግ የተጠበቀ ነው።")}
          </p>
          <p className="flex items-center gap-1.5">
            <span>{t("Crafted with care for community health", "ለማህበረሰብ ጤና በጥንቃቄ የተዘጋጀ")}</span>
            <Heart size={13} className="text-[#c78157] fill-[#c78157]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
