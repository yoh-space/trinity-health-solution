"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Settings,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

export function ClientProfileMenu() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut, openUserProfile, openSignIn } = useClerk();
  const { language, t } = useMarketingLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full bg-[#e8eee6]" />
    );
  }

  // If NOT signed in: Display prominent Sign In Tab
  if (!isSignedIn || !user) {
    return (
      <>
        <button
          type="button"
          onClick={() => openSignIn({ fallbackRedirectUrl: "/portal", signUpFallbackRedirectUrl: "/portal" })}
          className="flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-white px-3.5 py-1.5 text-xs font-bold text-[#1c573e] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] active:scale-95"
          title="Sign in with Google or Phone"
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-[#e8f1e5] text-[#1c573e]">
            <User size={13} />
          </div>
          <span>{language === "am" ? "ግባ" : "Sign In"}</span>
        </button>
      </>
    );
  }

  // User is signed in: Check if admin
  const isAdmin = user.publicMetadata?.role === "admin";
  const displayName = user.fullName || user.firstName || "Client";
  const displayContact =
    user.primaryEmailAddress?.emailAddress ||
    user.primaryPhoneNumber?.phoneNumber ||
    "Verified Client";

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-white p-1 pr-2.5 text-xs font-semibold text-[#183b2d] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] active:scale-98"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-label="Client Profile Menu"
      >
        {/* Avatar */}
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={displayName}
            className="size-7 rounded-full object-cover ring-1 ring-[#cbd8cb]"
          />
        ) : (
          <div className="flex size-7 items-center justify-center rounded-full bg-[#1c573e] text-[11px] font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden flex-col items-start text-left sm:flex">
          <span className="max-w-[100px] truncate font-bold text-[#163826]">
            {user.firstName || "Client"}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-[#627768] transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Profile Options Modal / Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-[#dce6dc] bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Header Summary */}
          <div className="border-b border-[#e5ece4] p-3 pb-3.5">
            <div className="flex items-center gap-3">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  className="size-11 rounded-full object-cover ring-2 ring-[#1c573e]/20"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-full bg-[#1c573e] text-base font-bold text-white shadow-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#163826]">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-[#6d8273]">
                  {displayContact}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d633f]">
                    {isAdmin ? "Admin & Client" : "Verified Client"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Option Items */}
          <div className="py-1.5 space-y-0.5">
            {/* 1. Client Portal Dashboard */}
            <Link
              href="/portal"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#274534] transition hover:bg-[#eaf4eb] hover:text-[#183b2d]"
            >
              <LayoutDashboard size={15} className="text-[#1c573e]" />
              <div className="flex flex-1 items-center justify-between">
                <span>{language === "am" ? "የተገልጋይ ፖርታል ዳሽቦርድ" : "Client Portal Dashboard"}</span>
              </div>
            </Link>

            {/* 2. My Care Requests */}
            <Link
              href="/portal?tab=requests"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#274534] transition hover:bg-[#eaf4eb] hover:text-[#183b2d]"
            >
              <ClipboardList size={15} className="text-[#1c573e]" />
              <span>{language === "am" ? "የእኔ የጤና ጥያቄዎች" : "My Care Requests"}</span>
            </Link>

            {/* 3. My Profile */}
            <Link
              href="/portal?tab=profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#274534] transition hover:bg-[#eaf4eb] hover:text-[#183b2d]"
            >
              <User size={15} className="text-[#1c573e]" />
              <span>{language === "am" ? "የእኔ ፕሮፋይል" : "Profile & Health Info"}</span>
            </Link>

            {/* 4. Appointments */}
            <Link
              href="/portal?tab=appointments"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#274534] transition hover:bg-[#eaf4eb] hover:text-[#183b2d]"
            >
              <Calendar size={15} className="text-[#1c573e]" />
              <span>{language === "am" ? "የቀጠሮ ቀናት" : "Appointments"}</span>
            </Link>

            {/* 5. Account Settings (Clerk profile modal) */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openUserProfile();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#274534] transition hover:bg-[#eaf4eb] hover:text-[#183b2d]"
            >
              <Settings size={15} className="text-[#1c573e]" />
              <span>{language === "am" ? "የመለያ ቅንብሮች" : "Account & Security"}</span>
            </button>

            {/* 6. Admin Desk shortcut if admin */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#1c573e] bg-[#f0f7f1] transition hover:bg-[#e2f0e4]"
              >
                <ShieldCheck size={15} className="text-[#1c573e]" />
                <div className="flex flex-1 items-center justify-between">
                  <span>{language === "am" ? "የአስተዳዳሪ ዴስክ" : "Admin Operations"}</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#e5ece4] pt-1 mt-1">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut({ redirectUrl: "/" });
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#8b3327] transition hover:bg-[#fff2f0]"
            >
              <LogOut size={15} />
              <span>{language === "am" ? "ውጣ" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
