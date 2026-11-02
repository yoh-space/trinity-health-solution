"use client";

import { useState } from "react";
import { ArrowRight, Globe, Menu, X, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { useMarketingLanguage } from "./MarketingLanguageContext";
import { ClientProfileMenu } from "@/components/common/ClientProfileMenu";

export function MarketingHeader() {
  const { language, toggleLanguage, t } = useMarketingLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { labelEn: "Our Approach", labelAm: "አሰራራችን", href: "/#approach" },
    { labelEn: "Learning Library", labelAm: "የትምህርት ቤተ-መጽሐፍት", href: "/learn" },
    { labelEn: "Pantry Explorer", labelAm: "የምግብ ሀሳቦች", href: "/#pantry" },
    { labelEn: "Ask Opal", labelAm: "ኦፓልን ይጠይቁ", href: "/ask-opal" },
    { labelEn: "Mobile App", labelAm: "የሞባይል መተግበሪያ", href: "/#mobile-app" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#183b2d]/[0.08] bg-[#fbfaf6]/95 backdrop-blur-md transition-all">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <Wordmark />

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => {
            const isActive =
              item.href === pathname ||
              (item.href === "/learn" && pathname?.startsWith("/learn"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? "text-[#1c573e] underline decoration-[#1c573e] decoration-2 underline-offset-8"
                    : "text-[#495c50] hover:text-[#1c573e]"
                }`}
              >
                {language === "am" ? item.labelAm : item.labelEn}
              </Link>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-[#d2dbd0] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#254734] shadow-xs transition hover:border-[#1c573e] hover:bg-white active:scale-95"
            title="Switch Language / ቋንቋ ይቀይሩ"
          >
            <Globe size={14} className="text-[#1c573e]" />
            <span className={language === "am" ? "font-bold text-[#1c573e]" : "text-[#718075]"}>
              አማ
            </span>
            <span className="text-[#a4aca1]">/</span>
            <span className={language === "en" ? "font-bold text-[#1c573e]" : "text-[#718075]"}>
              EN
            </span>
          </button>

          {/* Client Profile Tab (Signed In: Avatar + Options Modal / Signed Out: Sign In Tab) */}
          <ClientProfileMenu />

          {/* Staff Desk Link */}
          <Link
            href="/admin"
            className="hidden items-center gap-1.5 rounded-full border border-[#c9d2c8] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#244c39] transition hover:border-[#1c573e] hover:bg-white sm:inline-flex"
          >
            <span>{t("Staff Desk", "የባለሙያ ፖርታል")}</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#244c39] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#183b2d]/10 bg-[#fbfaf6] px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#385141] hover:bg-[#eaf0e4]"
              >
                {language === "am" ? item.labelAm : item.labelEn}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-[#183b2d]/10 pt-4">
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-[#1c573e] px-4 py-2.5 text-center text-xs font-bold text-white"
              >
                {t("Client Portal", "የተገልጋዮች ፖርታል")}
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-[#cbd5c9] px-4 py-2.5 text-center text-xs font-semibold text-[#254937]"
              >
                {t("Staff Desk", "የባለሙያ ፖርታል")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
