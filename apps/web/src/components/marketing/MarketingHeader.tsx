"use client";

import { useState, useEffect } from "react";
import { Globe, Menu, X, PhoneCall, ShieldCheck } from "lucide-react";
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
  const isHome = pathname === "/";
  const isAtHeroTop = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { labelEn: "Home", labelAm: "ዋና ገጽ", href: "/" },
    { labelEn: "Services", labelAm: "አገልግሎቶች", href: "/services" },
    { labelEn: "Products", labelAm: "ምርቶች", href: "/products" },
    { labelEn: "Ask Opal AI", labelAm: "ኦፓል AI", href: "/ask-opal" },
    { labelEn: "Learning Hub", labelAm: "የትምህርት ማዕከል", href: "/learn" },
    { labelEn: "Contact", labelAm: "አግኙን", href: "/#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome ? "-mb-[75px]" : ""
      } ${
        isScrolled
          ? "border-b border-[#183b2d]/10 bg-[#f5f2e9]/95 backdrop-blur-xl shadow-sm"
          : isAtHeroTop
            ? "border-b border-white/25 bg-transparent"
            : "border-b border-[#183b2d]/[0.06] bg-[#fbfaf6]/90 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-200 sm:px-8 lg:px-12 ${
          isHome ? "h-[74px]" : isScrolled ? "h-[64px]" : "h-[74px]"
        }`}
      >
        <div
          className={
            isAtHeroTop ? "rounded-sm bg-[#fbfaf6]/95 px-2 py-1 shadow-sm" : ""
          }
        >
          <Wordmark />
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigationItems.map((item) => {
            const isActive =
              (item.href === "/" && pathname === "/") ||
              (item.href === "/services" && pathname?.startsWith("/services")) ||
              (item.href === "/products" && pathname?.startsWith("/products")) ||
              (item.href === "/learn" && pathname?.startsWith("/learn")) ||
              (item.href === "/ask-opal" && pathname === "/ask-opal") ||
              (item.href === "/#contact" && pathname === "/#contact");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition ${
                  isAtHeroTop
                    ? isActive
                      ? "text-white underline decoration-white decoration-2 underline-offset-8"
                      : "text-white/90 hover:text-white"
                    : isActive
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
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold shadow-xs transition active:scale-95 ${
              isAtHeroTop
                ? "border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "border-[#d2dbd0] bg-white/80 text-[#254734] hover:border-[#1c573e] hover:bg-white"
            }`}
            title="Switch Language / ቋንቋ ይቀይሩ"
          >
            <Globe
              size={13}
              className={isAtHeroTop ? "text-white" : "text-[#1c573e]"}
            />
            <span
              className={
                language === "am"
                  ? isAtHeroTop
                    ? "font-bold text-white"
                    : "font-bold text-[#1c573e]"
                  : isAtHeroTop
                    ? "text-white/70"
                    : "text-[#718075]"
              }
            >
              አማ
            </span>
            <span className={isAtHeroTop ? "text-white/55" : "text-[#a4aca1]"}>
              /
            </span>
            <span
              className={
                language === "en"
                  ? isAtHeroTop
                    ? "font-bold text-white"
                    : "font-bold text-[#1c573e]"
                  : isAtHeroTop
                    ? "text-white/70"
                    : "text-[#718075]"
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

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`grid size-10 place-items-center rounded-xl border lg:hidden ${
              isAtHeroTop
                ? "border-white/40 bg-white/10 text-white"
                : "border-[#d2ddd0] bg-white text-[#244c39]"
            }`}
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

              <div className="flex items-center justify-center pt-2 text-xs font-semibold text-[#546b5b]">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#1c573e]"
                >
                  {t("Client Portal & Consultations →", "የተገልጋዮች ፖርታል እና ቀጠሮዎች →")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
