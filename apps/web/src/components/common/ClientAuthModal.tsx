"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClerk } from "@clerk/nextjs";
import { X, Smartphone, ShieldCheck, ArrowRight, Lock } from "lucide-react";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signIn" | "signUp";
}

export function ClientAuthModal({
  isOpen,
  onClose,
  initialMode = "signIn",
}: ClientAuthModalProps) {
  const { openSignIn, openSignUp } = useClerk();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+251");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleGoogleSignIn = () => {
    onClose();
    openSignIn({
      fallbackRedirectUrl: "/portal",
      signUpFallbackRedirectUrl: "/portal",
    });
  };

  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (!cleanNumber || cleanNumber.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError(null);
    onClose();
    const fullNumber = `${countryCode}${cleanNumber.startsWith("0") ? cleanNumber.slice(1) : cleanNumber}`;
    openSignIn({
      initialValues: {
        phoneNumber: fullNumber,
      },
      fallbackRedirectUrl: "/portal",
      signUpFallbackRedirectUrl: "/portal",
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Client Sign In"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative my-auto w-full max-w-[420px] overflow-hidden rounded-3xl border border-[#dce6dc] bg-[#fbfaf6] text-[#163826] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full border border-[#cbd8cb] bg-white text-[#193a27] shadow-2xs transition hover:bg-[#eaf2ea] active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#e2eae1] bg-white p-6 pb-5 text-center sm:p-7 sm:pb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#1c573e] text-white shadow-md">
            <ShieldCheck size={26} />
          </div>
          <h2 className="mt-3.5 text-2xl font-bold tracking-tight text-[#163826]">
            Client Care Portal
          </h2>
          <p className="mt-1 text-xs text-[#5d7364]">
            Access your verified family health requests, nutrition guides, and care plans.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* PRIMARY: Google One-Click Sign In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#cbd8cb] bg-white py-3 px-4 text-sm font-bold text-[#1f3f2d] shadow-2xs transition hover:border-[#1c573e] hover:bg-[#f6faf6] hover:shadow-sm active:scale-98"
            >
              {/* Google 'G' official SVG */}
              <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="mt-1.5 text-center text-[11px] text-[#788a7c]">
              Fastest sign-in for Android & Google accounts
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#dce6dc]" />
            <span className="absolute bg-[#fbfaf6] px-3 text-[10px] font-bold uppercase tracking-wider text-[#798e7f]">
              or with phone
            </span>
          </div>

          {/* SECONDARY: Phone Number Sign In */}
          <form onSubmit={handlePhoneSignIn} className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#35523f]">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="rounded-xl border border-[#cbd8cb] bg-white px-2.5 py-2.5 text-xs font-semibold text-[#1f3f2d] outline-none focus:border-[#1c573e]"
              >
                <option value="+251">🇪🇹 +251 (ET)</option>
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+254">🇰🇪 +254 (KE)</option>
                <option value="+971">🇦🇪 +971 (AE)</option>
              </select>
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="91 123 4567"
                  className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3 py-2.5 text-xs text-[#1f3f2d] placeholder:text-[#88998b] outline-none focus:border-[#1c573e] focus:ring-1 focus:ring-[#1c573e]"
                />
              </div>
            </div>

            {error && <p className="text-[11px] text-red-600">{error}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1c573e] py-2.5 px-4 text-xs font-bold text-white shadow-2xs transition hover:bg-[#154631] active:scale-98"
            >
              <Smartphone size={14} />
              <span>Continue with Phone Number</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Privacy & Trust Assurance */}
          <div className="rounded-2xl border border-[#e2ece2] bg-[#f0f6f1] p-3 text-center text-[11px] text-[#4d6653]">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-[#1c573e]">
              <Lock size={12} />
              <span>Private & Confidential Health Learning</span>
            </div>
            <p className="mt-0.5 text-[10px] leading-relaxed">
              Your inquiries and requests are kept strictly private between you and verified health staff.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
