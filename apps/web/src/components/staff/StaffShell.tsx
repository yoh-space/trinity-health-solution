"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import {
  Stethoscope,
  Users,
  Calendar,
  Layers,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  BookOpen,
  Home,
} from "lucide-react";
import { Badge } from "../admin/ui/badge";

export function StaffShell({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = user?.publicMetadata?.role === "admin"
    ? "admin"
    : user?.publicMetadata?.role === "clinician"
      ? "clinician"
      : "counselor";

  const staffNavItems = [
    { label: "Staff Overview", href: "/staff", icon: Stethoscope },
    { label: "Care Requests", href: "/staff/requests", icon: Layers },
    { label: "Client Directory", href: "/staff/clients", icon: Users },
    { label: "Appointments", href: "/staff/appointments", icon: Calendar },
    ...(role === "admin"
      ? [{ label: "Team Members", href: "/staff/team", icon: ShieldCheck }]
      : []),
    { label: "Curriculum Publisher", href: "/admin", icon: BookOpen },
  ];

  const sidebar = (
    <div className="flex h-full flex-col justify-between border-r border-[#dbe4db] bg-white text-[#183a25]">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-[#e5ede4] px-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition hover:opacity-90"
            aria-label="Trinity Health Solution home"
          >
            <Image
              src="/images/logo-trinity-web.png"
              alt="Trinity Health Solution Logo"
              width={140}
              height={44}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="grid size-8 place-items-center rounded-lg text-[#65776a] hover:bg-[#edf2eb] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 pb-2">
          <div className="flex items-center justify-between rounded-xl border border-[#d6e2d6] bg-[#f4f7f2] px-3.5 py-2.5">
            <div>
              <p className="text-[11px] font-bold text-[#1a3828] capitalize">
                {role} Care Desk
              </p>
              <p className="text-[10px] text-[#637769]">Active Practitioner</p>
            </div>
            <Badge variant="emerald" className="text-[9px] px-1.5 py-0 uppercase">
              Online
            </Badge>
          </div>
        </div>

        <nav className="mt-3 flex flex-col gap-1 px-3">
          {staffNavItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isCurrent
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "text-[#4d6354] hover:bg-[#edf4ec] hover:text-[#183a25]"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#e5ede4] p-4">
        <div className="flex items-center justify-between rounded-xl border border-[#dfe7df] bg-[#f8faf7] p-2.5">
          <div className="truncate">
            <p className="truncate text-xs font-bold text-[#1c3c29]">
              {user?.fullName || "Staff Practitioner"}
            </p>
            <p className="truncate text-[10px] text-[#718576] capitalize">
              Role: {role}
            </p>
          </div>

          <Link
            href="/"
            title="Exit"
            className="grid size-7 place-items-center rounded-lg border border-[#d2dbd0] bg-white text-[#576b5d] hover:bg-[#edf3ec]"
          >
            <LogOut size={13} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#183b2d]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-full shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dce6dc] bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#2a4c37] lg:hidden"
            >
              <Menu size={18} />
            </button>
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
            <span className="text-xs font-bold capitalize text-[#1a3a28]">
              {pathname.replace("/staff", "").replace("/", "") || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/admin"
              className="rounded-full border border-[#cbd8cb] bg-white px-3 py-1.5 text-[#486352] transition hover:border-[#1c573e]"
            >
              Publisher Desk
            </Link>
            <Link
              href="/portal"
              className="rounded-full bg-[#1c573e] px-3.5 py-1.5 text-white"
            >
              Client Portal
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
