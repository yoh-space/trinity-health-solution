"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface EditorDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function EditorDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: EditorDrawerProps) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-[#dce6dc] bg-white shadow-2xl"
        style={{ animation: "slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e5ede5] bg-[#f8faf6] px-6 py-4">
          <div>
            <h3 className="text-base font-extrabold text-[#163826]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[#526b5c]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl border border-[#d4e0d4] bg-white text-[#526a5b] transition hover:bg-[#fbeaea] hover:text-[#b43d3d] hover:border-[#f0c3c3]"
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
