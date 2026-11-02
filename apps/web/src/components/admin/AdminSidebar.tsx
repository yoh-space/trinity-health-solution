"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  BarChart3,
  Stethoscope,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Layers,
  Home,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";

export interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeTab = "overview",
  onTabChange,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin =
    userEmail === "yohansdam@gmail.com" ||
    userEmail === "yashaknike@gmail.com" ||
    user?.publicMetadata?.role === "admin";
  const role = isAdmin ? "admin" : String(user?.publicMetadata?.role ?? "admin");

  const navItems = [
    {
      group: "Operations & Triage",
      items: [
        {
          id: "overview",
          label: "Analytics & KPIs",
          icon: BarChart3,
          isTab: true,
        },
        {
          id: "triage",
          label: "Care Triage Queue",
          icon: Stethoscope,
          isTab: true,
        },
        {
          id: "roster",
          label: "Staff Directory",
          icon: Users,
          isTab: true,
        },
        {
          id: "appointments",
          label: "Consultations",
          icon: Calendar,
          isTab: true,
        },
      ],
    },
    {
      group: "Curriculum & AI",
      items: [
        {
          id: "curriculum",
          label: "Curriculum Studio",
          icon: BookOpen,
          isTab: true,
        },
        {
          id: "public-learn",
          label: "Learning Library",
          icon: Layers,
          href: "/learn",
          isTab: false,
        },
        {
          id: "ask-opal",
          label: "Ask Opal Guidance",
          icon: MessageSquare,
          href: "/ask-opal",
          isTab: false,
        },
      ],
    },
    {
      group: "Portals & Workspaces",
      items: [
        {
          id: "staff-desk",
          label: "Staff Portal Desk",
          icon: ShieldCheck,
          href: "/staff",
          isTab: false,
        },
        {
          id: "client-portal",
          label: "Family Client Portal",
          icon: Home,
          href: "/portal",
          isTab: false,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between border-r border-[#dbe4db] bg-white text-[#183a25]">
      {/* Top Header & Branding */}
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

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="grid size-8 place-items-center rounded-lg text-[#65776a] hover:bg-[#edf2eb] lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Workspace Indicator Pill */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between rounded-xl border border-[#d6e2d6] bg-[#f4f7f2] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#227242] animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-[#1a3828]">
                  Administrator Desk
                </p>
                <p className="text-[10px] text-[#637769]">Convex Realtime</p>
              </div>
            </div>
            <Badge variant="emerald" className="text-[9px] px-1.5 py-0 uppercase">
              {role}
            </Badge>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="mt-2 flex flex-col gap-5 px-3">
          {navItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#829687]">
                {group.group}
              </p>
              <div className="mt-1.5 flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent =
                    item.isTab && activeTab === item.id
                      ? true
                      : !item.isTab && item.href && pathname === item.href;

                  if (item.isTab) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (onTabChange) onTabChange(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-[#1c573e] text-white shadow-xs"
                            : "text-[#4d6354] hover:bg-[#edf4ec] hover:text-[#183a25]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        {isCurrent && (
                          <ChevronRight size={13} className="opacity-80" />
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href!}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isCurrent
                          ? "bg-[#1c573e] text-white shadow-xs"
                          : "text-[#4d6354] hover:bg-[#edf4ec] hover:text-[#183a25]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      <ExternalLink size={12} className="opacity-50" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile & Session Panel */}
      <div className="border-t border-[#e5ede4] p-4">
        <div className="flex items-center justify-between rounded-xl border border-[#dfe7df] bg-[#f8faf7] p-2.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1c573e] text-white font-bold text-xs">
              {user?.firstName ? user.firstName[0] : "A"}
            </div>
            <div className="truncate">
              <p className="truncate text-xs font-bold text-[#1c3c29]">
                {user?.fullName || "System Admin"}
              </p>
              <p className="truncate text-[10px] text-[#718576]">
                {user?.primaryEmailAddress?.emailAddress || "admin@trinity.health"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            title="Exit to Marketing Site"
            className="grid size-7 place-items-center rounded-lg border border-[#d2dbd0] bg-white text-[#576b5d] hover:bg-[#edf3ec] hover:text-[#183a25]"
          >
            <LogOut size={13} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
