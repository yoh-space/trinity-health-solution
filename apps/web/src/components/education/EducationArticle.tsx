"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Sparkles, BookOpen } from "lucide-react";
import {
  displayContent,
  displayTitle,
  fallbackEducation,
  type EducationItem,
  type EducationLanguage,
} from "@/lib/education";

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
  const [language, setLanguage] = useState<EducationLanguage>("en");

  if (!item)
    return (
      <main className="mx-auto min-h-screen max-w-3xl bg-[#fbfaf6] px-5 py-24 text-[#183b2d]">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#438451]">
          Learning note
        </p>
        <h1 className="mt-4 text-4xl font-semibold">
          This note is not available.
        </h1>
        <Link
          href="/learn"
          className="mt-8 inline-block text-sm font-bold text-[#287343]"
        >
          <span className="inline-flex items-center gap-2">
            Back to the library <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </main>
    );

  const heroImage = getHeroImage(item);

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
      {/* Top Breadcrumb Header */}
      <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#438451] transition hover:text-[#285736]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>
            {language === "am"
              ? "ወደ ትምህርት ቤተ-መጽሐፍት"
              : "Back to learning library"}
          </span>
        </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="mx-auto mt-6 max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-21/10 sm:aspect-21/9 min-h-[300px] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-md">
          <img
            src={heroImage}
            alt={item.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11291b] via-[#11291b]/50 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#1c573e] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
                {item.category}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                <Clock size={13} />
                <span>
                  {item.readMinutes} {language === "am" ? "ደቂቃ ንባብ" : "min read"}
                </span>
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl max-w-3xl leading-tight">
              {displayTitle(item, language)}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Body Container */}
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Language Selection & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2eae1] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#637769]">
              Language:
            </span>
            <div className="flex rounded-full border border-[#bcd4bf] bg-white p-1 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-4 py-1.5 transition ${
                  language === "en"
                    ? "bg-[#287343] text-white shadow-xs"
                    : "text-[#5e7564] hover:text-[#183b2d]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("am")}
                className={`rounded-full px-4 py-1.5 transition ${
                  language === "am"
                    ? "bg-[#287343] text-white shadow-xs"
                    : "text-[#5e7564] hover:text-[#183b2d]"
                }`}
              >
                አማርኛ
              </button>
            </div>
          </div>

          <p className="text-xs font-medium text-[#7a8d7e]">
            Trinity Community Health Guide · Verified Clinical Learning
          </p>
        </div>

        {/* Lead Summary Callout */}
        <div className="mt-8 rounded-3xl border border-[#d6e5d7] bg-[#edf6ee] p-7 text-lg font-medium leading-relaxed text-[#2c4e36] sm:p-9 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e5836] mb-3">
            <Sparkles size={16} />
            <span>Key Takeaway</span>
          </div>
          {displayContent(item, language)}
        </div>

        {/* Extended Sections */}
        {item.sections && item.sections.length > 0 && (
          <div className="mt-12 grid gap-8">
            {item.sections.map((section, idx) => (
              <section
                key={section.title || idx}
                className="rounded-2xl border border-[#e5ece4] bg-white p-6 sm:p-8 shadow-xs"
              >
                <h2 className="text-xl font-bold text-[#1a3d25] sm:text-2xl">
                  {language === "am" ? section.titleAm : section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#4f6454]">
                  {language === "am" ? section.bodyAm : section.body}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-wrap gap-3 border-t border-[#e2eae1] pt-8">
          <Link
            href="/ask-opal"
            className="flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#154430]"
          >
            <Sparkles size={16} />
            <span>{language === "am" ? "ኦፓልን ይጠይቁ" : "Ask Opal AI about this"}</span>
          </Link>
          <Link
            href="/learn"
            className="rounded-full border border-[#bcd4bf] bg-white px-6 py-3 text-sm font-bold text-[#287343] transition hover:bg-[#f3f8f3]"
          >
            {language === "am" ? "ሌላ ትምህርት ይፈልጉ" : "Find another note"}
          </Link>
        </div>
      </div>
    </main>
  );
}
