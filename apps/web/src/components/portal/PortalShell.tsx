"use client";

import { useState, ReactNode, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Menu, PlusCircle, ShieldCheck, Heart, User } from "lucide-react";
import { ClientSidebar } from "./ClientSidebar";
import { ClientProfileMenu } from "@/components/common/ClientProfileMenu";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";

function PortalHeader({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const getTitle = () => {
    if (pathname.includes("/appointments") || tab === "appointments")
      return "Appointments & Visits";
    if (pathname.includes("/consultations/new") || tab === "new-request")
      return "Request Support";
    if (pathname.includes("/saved") || tab === "saved")
      return "Saved Curriculum Guides";
    if (tab === "requests") return "My Care Requests";
    if (tab === "profile") return "My Profile & Settings";
    return "Care Space Overview";
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dce6dc] bg-white/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="grid size-9 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#2a4c37] transition hover:bg-[#f2f7f1] lg:hidden"
          aria-label="Open portal navigation"
        >
          <Menu size={18} />
        </button>

        {/* Mobile Header Logo */}
        <Link href="/" className="flex items-center lg:hidden" aria-label="Trinity Health Solution home">
          <Image
            src="/images/logo-trinity-web.png"
            alt="Trinity Health Solution Logo"
            width={110}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/portal"
            className="font-bold text-[#1c573e] hover:underline"
          >
            Client Portal
          </Link>
          <span className="text-[#c1cdc0]">/</span>
          <span className="font-semibold text-[#546b5d]">{getTitle()}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Realtime Live Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-[#d6e2d6] bg-[#f2f7f1] px-3 py-1 text-xs font-semibold text-[#2d633f] sm:flex">
          <span className="size-2 rounded-full bg-[#227242] animate-pulse" />
          <span>Realtime Sync</span>
        </div>

        {/* Quick Action Button: New Care Request */}
        <Link
          href="/portal?tab=new-request"
          className="hidden items-center gap-1.5 rounded-full bg-[#1c573e] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-95 sm:inline-flex"
        >
          <PlusCircle size={14} />
          <span>Request Support</span>
        </Link>

        {/* Client Profile Menu Trigger */}
        <ClientProfileMenu />
      </div>
    </header>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#f7faf6] text-[#163826]">
        {/* Left Sidebar */}
        <Suspense fallback={null}>
          <ClientSidebar
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </Suspense>

        {/* Main Workspace Frame (offset by sidebar on desktop) */}
        <div className="flex flex-col lg:pl-64">
          <Suspense fallback={<div className="h-16 border-b border-[#dce6dc] bg-white" />}>
            <PortalHeader onOpenMobile={() => setMobileOpen(true)} />
          </Suspense>

          <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
            {children}
          </main>
        </div>
      </div>
    </MarketingLanguageProvider>
  );
}
