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
  User,
  ShieldCheck,
  LogOut,
  X,
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
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const displayName = user?.fullName || user?.firstName || "Client Account";
  const displayContact =
    user?.primaryEmailAddress?.emailAddress ||
    user?.primaryPhoneNumber?.phoneNumber ||
    "Your account";

  const navGroups = [
    {
      group: "My care",
      items: [
        { id: "overview", label: "Overview", icon: Home, href: "/portal", isTab: true },
        { id: "requests", label: "My questions", icon: ClipboardList, href: "/portal?tab=requests", isTab: true },
        { id: "new-request", label: "Send a question", icon: PlusCircle, href: "/portal?tab=new-request", isTab: true },
        { id: "appointments", label: "Appointments", icon: Calendar, href: "/portal?tab=appointments", isTab: true },
      ],
    },
    {
      group: "Account",
      items: [
        { id: "profile", label: "My details", icon: User, href: "/portal?tab=profile", isTab: true },
      ],
    },
  ];

  const handleNavClick = (item: (typeof navGroups)[0]["items"][0]) => {
    onCloseMobile();
    if (item.isTab && onTabChange) onTabChange(item.id);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-[#163826]">
      <div>
        <div className="flex h-20 items-center justify-between border-b border-[#e2eae1] px-5">
          <Link href="/" onClick={onCloseMobile} aria-label="Trinity Health Solution home">
            <Image
              src="/images/logo-trinity-web.png"
              alt="Trinity Health Solution Logo"
              width={160}
              height={50}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            className="grid size-8 place-items-center rounded-lg border border-[#d2ddd0] text-[#345240] hover:bg-[#f1f6f1] lg:hidden"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div className="rounded-xl border border-[#d6e2d6] bg-[#f4f7f2] px-3.5 py-2">
            <p className="text-[11px] font-bold text-[#1a3828]">My care space</p>
          </div>
        </div>

        <nav className="max-h-[calc(100vh-175px)] space-y-6 overflow-y-auto p-4">
          {navGroups.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#718776]">
                {group.group}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.isTab && currentTab === item.id;
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
                      <span className="flex items-center gap-3">
                        <Icon size={16} className={active ? "text-white" : "text-[#1c573e]"} />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {isAdmin && (
            <div className="border-t border-[#e5eee5] pt-4">
              <Link
                href="/admin"
                onClick={onCloseMobile}
                className="flex items-center justify-between rounded-xl bg-[#eaf4eb] px-3.5 py-2.5 text-xs font-bold text-[#1c573e] hover:bg-[#d8ebd9]"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck size={16} />
                  Admin workspace
                </span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-[#e2eae1] bg-[#fbfdfb] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={displayName} className="size-9 rounded-full object-cover ring-1 ring-[#cbd8cb]" />
            ) : (
              <div className="grid size-9 place-items-center rounded-full bg-[#1c573e] text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#163826]">{isLoaded ? displayName : "Loading account"}</p>
              <p className="truncate text-[10px] text-[#6d8273]">{displayContact}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#cbd8cb] text-[#86372b] hover:border-[#e2b8b2] hover:bg-[#fff0ed]"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#dbe5dc] lg:block">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onCloseMobile} aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
