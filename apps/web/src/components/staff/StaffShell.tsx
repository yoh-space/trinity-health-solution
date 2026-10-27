"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export function StaffShell({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const role = String(user?.publicMetadata?.role ?? "counselor");
  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#183b2d]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#dce8de] bg-white p-6 lg:block">
        <Link href="/staff" className="text-lg font-semibold text-[#23472e]">
          Trinity staff desk
        </Link>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#579165]">
          {role} workspace
        </p>
        <nav className="mt-10 grid gap-2 text-sm font-semibold text-[#5b7061]">
          <Link
            href="/staff"
            className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
          >
            Overview
          </Link>
          <Link
            href="/staff/requests"
            className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
          >
            Requests
          </Link>
          <Link
            href="/staff/clients"
            className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
          >
            Clients
          </Link>
          <Link
            href="/staff/appointments"
            className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
          >
            Appointments
          </Link>
          {role === "admin" && (
            <Link
              href="/staff/team"
              className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
            >
              Team
            </Link>
          )}
          <Link
            href="/admin"
            className="rounded-xl px-3 py-3 hover:bg-[#eef7ef]"
          >
            Content publisher
          </Link>
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="border-b border-[#dce8de] bg-white">
          <nav className="flex items-center justify-between px-5 py-4 sm:px-8">
            <Link
              href="/staff"
              className="font-semibold text-[#23472e] lg:hidden"
            >
              Trinity staff desk
            </Link>
            <span className="hidden text-sm text-[#6d7e72] lg:inline">
              Internal care workspace
            </span>
            <div className="flex items-center gap-4 text-sm font-semibold text-[#52705b]">
              <span>{user?.fullName ?? "Staff member"}</span>
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
    </div>
  );
}
