"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
  ShieldCheck,
  Activity,
  Layers,
  BookOpen,
  Users,
  Calendar,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#163826]">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-[#dce6dc] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[#1c573e] text-white font-bold text-xs">
                T
              </span>
              <span className="font-bold text-sm tracking-tight text-[#163a27]">
                Trinity Health
              </span>
            </Link>

            <span className="text-[#c1cdc0]">/</span>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#486352]">
                Admin Desk
              </span>
              <Badge variant="emerald" className="text-[10px] py-0 px-2">
                Administrator
              </Badge>
            </div>
          </div>

          {/* Quick Cross-Portal Navigation & Status */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Live Sync Status */}
            <div className="hidden items-center gap-2 rounded-full border border-[#d6e2d6] bg-[#f2f7f1] px-3 py-1 text-[#2d633f] sm:flex">
              <span className="size-2 rounded-full bg-[#227242] animate-pulse" />
              <span>Convex Realtime</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/learn"
                className="rounded-full px-3 py-1.5 text-[#546b5c] transition hover:text-[#1c573e] hover:bg-[#edf4ec]"
              >
                Public Library
              </Link>
              <Link
                href="/staff"
                className="rounded-full px-3 py-1.5 text-[#546b5c] transition hover:text-[#1c573e] hover:bg-[#edf4ec]"
              >
                Staff Queues
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1 rounded-full border border-[#cbd8cb] bg-white px-3 py-1.5 text-[#63796a] transition hover:text-[#183a25] hover:border-[#1c573e]"
              >
                <span>Exit</span>
                <LogOut size={12} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
