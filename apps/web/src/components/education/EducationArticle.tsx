"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import {
  displayContent,
  displayTitle,
  fallbackEducation,
  type EducationItem,
} from "@/lib/education";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "food-safety":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
  "maternal-nutrition":
    "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80",
  "child-feeding":
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
  "clean-water":
    "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80",
  default:
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80",
};

function getHeroImage(item: EducationItem): string {
  if (item.coverImageUrl) return item.coverImageUrl;
  const key = item.category?.toLowerCase() || "";
  if (key.includes("food") || key.includes("safe")) return CATEGORY_FALLBACK_IMAGES["food-safety"];
  if (key.includes("matern") || key.includes("pregnan")) return CATEGORY_FALLBACK_IMAGES["maternal-nutrition"];
  if (key.includes("child") || key.includes("infant") || key.includes("feed")) return CATEGORY_FALLBACK_IMAGES["child-feeding"];
  if (key.includes("water") || key.includes("hygiene")) return CATEGORY_FALLBACK_IMAGES["clean-water"];
  return CATEGORY_FALLBACK_IMAGES.default;
}

export function EducationArticle({ slug }: { slug: string }) {
  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const item = (remote?.length ? remote : fallbackEducation).find(
    (entry) => entry._id === slug,
  );
  const { language, setLanguage } = useMarketingLanguage();

  if (!item)
    return (
      <main className="mx-auto min-h-[60vh] max-w-3xl px-5 py-24 text-[#183b2d]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
          Public Health Curriculum
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#163826]">
          This learning note is not currently available.
        </h1>
        <p className="mt-3 text-sm text-[#5d7063]">
          The note may have been updated or moved to draft status by our clinical team.
        </p>
        <Link
          href="/learn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
        >
          <span>Return to Learning Library</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </main>
    );

  const heroImage = getHeroImage(item);

  return (
    <article className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6b7e71]">
          <Link href="/" className="hover:text-[#1c573e] transition">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#a8b7ac]" />
          <Link href="/learn" className="hover:text-[#1c573e] transition">
            Learning Library
          </Link>
          <ChevronRight size={13} className="text-[#a8b7ac]" />
          <span className="font-semibold text-[#1c573e] capitalize">
            {item.category}
          </span>
        </nav>

        {/* Editorial Article Header */}
        <header className="border-b border-[#e5eee5] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ea] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              <ShieldCheck size={14} />
              <span>{item.category}</span>
            </span>

            {/* Language Switcher Bar */}
            <div className="flex rounded-full border border-[#cbd8cb] bg-white p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3.5 py-1 transition ${
                  language === "en"
                    ? "bg-[#1c573e] text-white shadow-2xs"
                    : "text-[#5e7564] hover:text-[#183b2d]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("am")}
                className={`rounded-full px-3.5 py-1 transition ${
                  language === "am"
                    ? "bg-[#1c573e] text-white shadow-2xs"
                    : "text-[#5e7564] hover:text-[#183b2d]"
                }`}
              >
                አማርኛ
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-5xl leading-tight">
            {displayTitle(item, language)}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[#64796a]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#1c573e]" />
              <span>
                {item.readMinutes} {language === "am" ? "ደቂቃ ንባብ" : "minute read"}
              </span>
            </span>
            <span className="text-[#c7d5c7]">•</span>
            <span>Verified by Community Clinical Team</span>
            <span className="text-[#c7d5c7]">•</span>
            <span className="font-mono text-[11px] text-[#788e7e]">
              REF: TRINITY-{item._id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </header>

        {/* Clean Editorial Featured Photograph */}
        <figure className="mt-8 overflow-hidden rounded-2xl border border-[#dce6dc] bg-[#f0f4ee] shadow-xs">
          <img
            src={heroImage}
            alt={item.title}
            className="aspect-21/10 w-full object-cover object-center"
          />
        </figure>

        {/* Structured Clinical Takeaway Box */}
        <section
          aria-label="Key Takeaway"
          className="mt-8 rounded-2xl border border-[#cfe0d0] bg-[#eef7ee] p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
            <FileText size={16} />
            <span>{language === "am" ? "ዋና ክሊኒካዊ መልእክት" : "Key Clinical Summary"}</span>
          </div>
          <div className="mt-3 text-base font-medium leading-relaxed text-[#23452f] sm:text-lg">
            {displayContent(item, language)}
          </div>
        </section>

        {/* Detailed Curricular Sections */}
        {item.sections && item.sections.length > 0 && (
          <div className="mt-10 divide-y divide-[#e6efe6]">
            {item.sections.map((section, idx) => (
              <section key={section.title || idx} className="py-8 first:pt-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-bold text-[#1c573e]">
                    0{idx + 1}.
                  </span>
                  <h2 className="text-xl font-bold text-[#163826] sm:text-2xl">
                    {language === "am" ? section.titleAm : section.title}
                  </h2>
                </div>
                <p className="mt-4 text-base leading-relaxed text-[#415546]">
                  {language === "am" ? section.bodyAm : section.body}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Institutional Consultation Action Bar */}
        <footer className="mt-12 rounded-2xl border border-[#d8e4d8] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold text-[#163a27]">
                {language === "am"
                  ? "በዚህ ርዕስ ዙሪያ ጥያቄ አለዎት?"
                  : "Have questions about this health guidance?"}
              </h3>
              <p className="mt-1 text-xs text-[#5f7465]">
                {language === "am"
                  ? "የኦፓል የጤና ረዳትን ይጠይቁ ወይም ብቁ የጤና ባለሙያዎችን ያነጋግሩ።"
                  : "Consult Ask Opal for instant guidance matched to Trinity curriculum."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/ask-opal"
                className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631]"
              >
                <MessageSquare size={14} />
                <span>{language === "am" ? "ኦፓልን ይጠይቁ" : "Ask Opal Guidance"}</span>
              </Link>
              <Link
                href="/learn"
                className="rounded-full border border-[#cad6c9] bg-white px-4 py-2.5 text-xs font-semibold text-[#32523d] hover:bg-[#f6f9f5]"
              >
                {language === "am" ? "ሌሎች ትምህርቶች" : "Browse All Topics"}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
