"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useState } from "react";
import {
  displayContent,
  displayTitle,
  fallbackEducation,
  type EducationItem,
  type EducationLanguage,
} from "@/lib/education";

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
          Back to the library →
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-20">
        <Link href="/learn" className="text-sm font-bold text-[#438451]">
          ←{" "}
          {language === "am" ? "ወደ ትምህርት ቤተ-መጽሐፍት" : "Back to learning library"}
        </Link>
        <div className="mt-12 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#579165]">
              {item.category}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              {displayTitle(item, language)}
            </h1>
            <p className="mt-5 text-sm text-[#829086]">
              {item.readMinutes} {language === "am" ? "ደቂቃ ንባብ" : "min read"}
            </p>
          </div>
          <div className="flex rounded-full border border-[#bcd4bf] bg-white p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-4 py-2 ${language === "en" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("am")}
              className={`rounded-full px-4 py-2 ${language === "am" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
            >
              አማርኛ
            </button>
          </div>
        </div>
        <div className="mt-12 rounded-3xl bg-[#eaf4eb] p-7 text-lg leading-8 text-[#365b40] sm:p-10">
          {displayContent(item, language)}
        </div>
        <div className="mt-12 grid gap-8">
          {item.sections?.map((section) => (
            <section
              key={section.title}
              className="border-b border-[#dce8de] pb-8"
            >
              <h2 className="text-2xl font-semibold text-[#23472e]">
                {language === "am" ? section.titleAm : section.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d7063]">
                {language === "am" ? section.bodyAm : section.body}
              </p>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/ask-opal"
            className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
          >
            {language === "am" ? "ኦፓልን ይጠይቁ" : "Ask Opal about this"}
          </Link>
          <Link
            href="/learn"
            className="rounded-full border border-[#bcd4bf] bg-white px-5 py-3 text-sm font-bold text-[#287343]"
          >
            {language === "am" ? "ሌላ ትምህርት ይፈልጉ" : "Find another note"}
          </Link>
        </div>
      </div>
    </main>
  );
}
