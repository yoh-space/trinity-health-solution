"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#183a25]">
      <header className="border-b border-[#dce8de] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/admin" className="text-lg font-semibold text-[#23472e]">
            Trinity publisher desk
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-[#52705b]">
            <Link href="/learn">View library</Link>
            <Link href="/staff">Staff desk</Link>
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
