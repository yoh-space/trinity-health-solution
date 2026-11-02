"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 left-1/2 z-40 flex items-center gap-2 rounded-full border border-[#164933]/40 bg-[#1c573e]/95 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-[#14442f] hover:shadow-2xl active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0 -translate-x-1/2 pointer-events-auto"
          : "opacity-0 translate-y-4 -translate-x-1/2 pointer-events-none"
      }`}
    >
      <ArrowUp size={14} className="stroke-[2.5]" />
      <span className="text-[11px] font-bold uppercase tracking-wider">Top</span>
    </button>
  );
}
