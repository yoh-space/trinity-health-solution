"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Globe, Menu, X, PhoneCall, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { useMarketingLanguage } from "./MarketingLanguageContext";
import { ClientProfileMenu } from "@/components/common/ClientProfileMenu";

export function MarketingHeader() {
  const { language, toggleLanguage, t } = useMarketingLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { labelEn: "Services", labelAm: "አገልግሎቶች", href: "/#services" },
    { labelEn: "Ask Opal AI", labelAm: "ኦፓል AI", href: "/ask-opal" },
    { labelEn: "Learning Hub", labelAm: "የትምህርት ማዕከል", href: "/learn" },
    { labelEn: "Our Approach", labelAm: "አሰራራችን", href: "/#approach" },
    { labelEn: "Partners", labelAm: "አጋሮች", href: "/#partners" },
    { labelEn: "Contact", labelAm: "አግኙን", href: "/#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "border-b border-[#183b2d]/10 bg-[#fbfaf6]/95 backdrop-blur-md shadow-xs"
          : "border-b border-[#183b2d]/[0.06] bg-[#fbfaf6]/90 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-200 sm:px-8 lg:px-12 ${
          isScrolled ? "h-[64px]" : "h-[74px]"
        }`}
      >
        <Wordmark />

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigationItems.map((item) => {
            const isActive =
              item.href === pathname ||
              (item.href === "/learn" && pathname?.startsWith("/learn")) ||
              (item.href === "/ask-opal" && pathname === "/ask-opal");
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-[#d2dbd0] bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-[#254734] shadow-xs transition hover:border-[#1c573e] hover:bg-white active:scale-95"
            title="Switch Language / ቋንቋ ይቀይሩ"
          >
            <Globe size={13} className="text-[#1c573e]" />
            <span
              className={
                language === "am" ? "font-bold text-[#1c573e]" : "text-[#718075]"
              }
            >
              አማ
            </span>
            <span className="text-[#a4aca1]">/</span>
            <span
              className={
                language === "en" ? "font-bold text-[#1c573e]" : "text-[#718075]"
              }
            >
              EN
            </span>
          </button>

          {/* Client Profile Tab (Signed In: Avatar + Options Modal / Signed Out: Sign In Tab) */}
          <ClientProfileMenu />

          {/* Primary Call to Action: Book Consultation */}
          <Link
            href="/portal/consultations/new"
            className="hidden items-center gap-1.5 rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-95 sm:inline-flex"
          >
            <ShieldCheck size={13} />
            <span>{t("Book Consultation", "የባለሙያ ቀጠሮ")}</span>
          </Link>

          {/* Staff Desk Link */}
          <Link
            href="/admin"
            className="hidden items-center gap-1 rounded-full border border-[#c9d2c8] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#244c39] transition hover:border-[#1c573e] hover:bg-white md:inline-flex"
          >
            <span>{t("Staff Desk", "የባለሙያ ፖርታል")}</span>
            <ArrowRight size={12} aria-hidden="true" />
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
          <div className="flex flex-col gap-2.5">
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

            <div className="mt-3 flex flex-col gap-2.5 border-t border-[#183b2d]/10 pt-4">
              <Link
                href="/portal/consultations/new"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-[#1c573e] px-4 py-2.5 text-center text-xs font-bold text-white shadow-xs"
              >
                {t("Book Online Consultation", "የባለሙያ ቀጠሮ ይያዙ")}
              </Link>

              <a
                href="tel:+251988720194"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cbd5c9] bg-white px-4 py-2.5 text-xs font-bold text-[#1c573e]"
              >
                <PhoneCall size={13} />
                <span>+251 98 872 0194</span>
              </a>

              <div className="flex items-center justify-between pt-2 text-xs font-semibold text-[#546b5b]">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#1c573e]"
                >
                  {t("Client Portal", "የተገልጋዮች ፖርታል")}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#1c573e]"
                >
                  {t("Staff Desk", "የባለሙያ ፖርታል")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
