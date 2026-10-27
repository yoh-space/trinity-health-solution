import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Wordmark } from "./Wordmark";

const navigationItems = [
  { label: "Our approach", href: "#approach" },
  { label: "Learning topics", href: "#learning" },
  { label: "For communities", href: "#community" },
  { label: "Learn", href: "/learn" },
  { label: "Ask Opal", href: "/ask-opal" },
];

export function MarketingHeader() {
  return (
    <header className="relative z-20 border-b border-[#183b2d]/[0.08] bg-[#fbfaf6]/90 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <Wordmark />
        <div className="hidden items-center gap-9 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#53645a] transition hover:text-[#1c573e]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="hidden rounded-full bg-[#287343] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c573e] sm:inline-flex"
          >
            Client portal
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-[#c9d2c8] px-4 py-2.5 text-sm font-semibold text-[#244c39] transition hover:border-[#1c573e] hover:bg-white"
          >
            Publisher portal
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </nav>
      <nav
        aria-label="Section navigation"
        className="border-t border-[#183b2d]/[0.06] px-5 py-3 md:hidden"
      >
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto whitespace-nowrap">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-[#53645a] transition hover:text-[#1c573e]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
