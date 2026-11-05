"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Home,
  ClipboardList,
  PlusCircle,
  Calendar,
  Bookmark,
  Layers,
  MessageSquare,
  Utensils,
  User,
  ShieldCheck,
  LogOut,
  X,
  Heart,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface ClientSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function ClientSidebar({
  activeTab = "overview",
  onTabChange,
  mobileOpen,
  onCloseMobile,
}: ClientSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || activeTab || "overview";
  const { user } = useUser();
  const { signOut } = useClerk();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const displayName = user?.fullName || user?.firstName || "Client Account";
  const displayContact =
    user?.primaryEmailAddress?.emailAddress ||
    user?.primaryPhoneNumber?.phoneNumber ||
    "Verified Client";

  const navGroups = [
    {
      group: "Care Space",
      items: [
        {
          id: "overview",
          label: "Dashboard Overview",
          labelAm: "አጠቃላይ እይታ",
          icon: Home,
          href: "/portal",
          isTab: true,
        },
        {
          id: "requests",
          label: "My Care Requests",
          labelAm: "የእኔ የጤና ጥያቄዎች",
          icon: ClipboardList,
          href: "/portal?tab=requests",
          isTab: true,
        },
        {
          id: "new-request",
          label: "Request Support",
          labelAm: "አዲስ ጥያቄ አቅርብ",
          icon: PlusCircle,
          href: "/portal?tab=new-request",
          isTab: true,
        },
        {
          id: "appointments",
          label: "Appointments",
          labelAm: "የቀጠሮ ቀናት",
          icon: Calendar,
          href: "/portal?tab=appointments",
          isTab: true,
        },
        {
          id: "saved",
          label: "Saved Guides",
          labelAm: "የተቀመጡ ማስታወሻዎች",
          icon: Bookmark,
          href: "/portal?tab=saved",
          isTab: true,
        },
      ],
    },
    {
      group: "Community Health",
      items: [
        {
          id: "learning-library",
          label: "Learning Library",
          labelAm: "የትምህርት ቤተ-መጽሐፍት",
          icon: Layers,
          href: "/learn",
          isTab: false,
        },
        {
          id: "ask-opal",
          label: "Ask Opal Guidance",
          labelAm: "ኦፓል የጤና መመሪያ",
          icon: MessageSquare,
          href: "/ask-opal",
          isTab: false,
        },
        {
          id: "pantry-explorer",
          label: "Pantry Explorer",
          labelAm: "የምግብ ሀሳቦች",
          icon: Utensils,
          href: "/#pantry",
          isTab: false,
        },
      ],
    },
    {
      group: "Account & Preferences",
      items: [
        {
          id: "profile",
          label: "My Profile & Settings",
          labelAm: "የእኔ ፕሮፋይልና ቅንብሮች",
          icon: User,
          href: "/portal?tab=profile",
          isTab: true,
        },
      ],
    },
  ];

  const handleNavClick = (item: (typeof navGroups)[0]["items"][0]) => {
    onCloseMobile();
    if (item.isTab && onTabChange) {
      onTabChange(item.id);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-[#163826]">
      <div>
        {/* Sidebar Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#e2eae1] px-5">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 transition hover:opacity-90"
            aria-label="Trinity Health Solution home"
          >
            <Image
              src="/images/logo-trinity-web.png"
              alt="Trinity Health Solution Logo"
              width={160}
              height={50}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="grid size-8 place-items-center rounded-lg border border-[#d2ddd0] text-[#345240] hover:bg-[#f1f6f1] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Workspace Indicator Pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between rounded-xl border border-[#d6e2d6] bg-[#f4f7f2] px-3.5 py-2">
            <p className="text-[11px] font-bold text-[#1a3828]">
              Client Care Space
            </p>
          </div>
        </div>

        {/* Navigation Option Items */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-175px)]">
          {navGroups.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#718776]">
                {group.group}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrentTab = item.isTab && currentTab === item.id;
                  const isCurrentPage = !item.isTab && pathname === item.href;
                  const active = isCurrentTab || isCurrentPage;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                        active
                          ? "bg-[#1c573e] text-white shadow-xs"
                          : "text-[#395643] hover:bg-[#f0f6f1] hover:text-[#183b2d]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={16}
                          className={
                            active
                              ? "text-white"
                              : "text-[#1c573e] group-hover:text-[#163826]"
                          }
                        />
                        <span>{item.label}</span>
                      </div>
                      {!item.isTab && (
                        <ExternalLink
                          size={12}
                          className={
                            active
                              ? "text-white/70"
                              : "text-[#97a89c] opacity-0 group-hover:opacity-100"
                          }
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Admin Desk Link if Designated Admin */}
          {isAdmin && (
            <div className="pt-2 border-t border-[#e5eee5]">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1c573e]">
                Staff & Administration
              </p>
              <div className="mt-2">
                <Link
                  href="/admin"
                  onClick={onCloseMobile}
                  className="flex items-center justify-between rounded-xl bg-[#eaf4eb] px-3.5 py-2.5 text-xs font-bold text-[#1c573e] hover:bg-[#d8ebd9] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} />
                    <span>Admin Operations Desk</span>
                  </div>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="border-t border-[#e2eae1] bg-[#fbfdfb] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="size-9 rounded-full object-cover ring-1 ring-[#cbd8cb]"
              />
            ) : (
              <div className="grid size-9 place-items-center rounded-full bg-[#1c573e] text-xs font-bold text-white shadow-2xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#163826]">
                {displayName}
              </p>
              <p className="truncate text-[10px] text-[#6d8273]">
                {displayContact}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#cbd8cb] text-[#86372b] transition hover:bg-[#fff0ed] hover:border-[#e2b8b2]"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#dbe5dc] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Sliding Sheet */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
