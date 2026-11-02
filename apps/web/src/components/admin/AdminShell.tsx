"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShieldCheck, Layers, LogOut } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Badge } from "./ui/badge";

export function AdminShell({
  children,
  activeTab,
  onTabChange,
}: {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#163826]">
      {/* Persistent Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame (offset for sidebar on large screens) */}
      <div className="flex flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dce6dc] bg-white/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#2a4c37] lg:hidden"
              aria-label="Open sidebar navigation"
            >
              <Menu size={18} />
            </button>

            {/* Mobile Logo Image */}
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

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#546b5d]">
                Trinity Admin
              </span>
              <span className="text-[#c1cdc0]">/</span>
              <span className="text-xs font-bold capitalize text-[#1a3a28]">
                {activeTab ? activeTab.replace("-", " ") : "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* Realtime Live Indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-[#d6e2d6] bg-[#f2f7f1] px-3 py-1 text-[#2d633f] sm:flex">
              <span className="size-2 rounded-full bg-[#227242] animate-pulse" />
              <span>Convex Realtime</span>
            </div>

            <Link
              href="/learn"
              className="hidden rounded-full border border-[#cbd8cb] bg-white px-3 py-1.5 text-[#486352] transition hover:border-[#1c573e] hover:text-[#183a25] sm:inline-flex"
            >
              Public Library
            </Link>

            <Link
              href="/staff"
              className="rounded-full bg-[#1c573e] px-3.5 py-1.5 text-white shadow-xs transition hover:bg-[#14442f]"
            >
              Staff Desk
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
