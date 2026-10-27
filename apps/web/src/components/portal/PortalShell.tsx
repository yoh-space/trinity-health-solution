"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export function PortalShell({ children }: { children: ReactNode }) {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#183b2d]">
      <header className="border-b border-[#dce8de] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/portal" className="text-lg font-semibold text-[#23472e]">
            Trinity client portal
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-[#52705b]">
            <Link href="/learn">Learn</Link>
            <Link href="/ask-opal">Ask Opal</Link>
            <span className="hidden rounded-full bg-[#eaf4eb] px-3 py-1.5 text-[#397047] sm:inline">
              {user?.firstName ?? "Client"}
            </span>
            <Link href="/" className="text-[#829086]">
              Exit
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}
