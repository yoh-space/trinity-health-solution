"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Clock, Search, ShieldCheck } from "lucide-react";
import {
  displaySummary,
  displayTitle,
  fallbackEducation,
  type EducationItem,
} from "@/lib/education";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

export function EducationLibrary() {
  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const { language, setLanguage } = useMarketingLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All topics");
  const [saved, setSaved] = useState<string[]>([]);

  const items = remote?.length ? remote : fallbackEducation;
  const categories = [
    "All topics",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const visible = useMemo(() => {
    const query = search.toLocaleLowerCase().trim();
    return items.filter((item) => {
      const matchesCategory =
        category === "All topics" || item.category === category;
      const haystack =
        `${item.title} ${item.titleAm} ${item.summary} ${item.summaryAm}`.toLocaleLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [category, items, search]);

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  return (
    <div className="py-8 sm:py-12">
      {/* Editorial Header Section */}
      <section className="border-b border-[#e2eae1] pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
                  COMMUNITY HEALTH KNOWLEDGE
                </span>
                <span className="text-[#cbd6cc]">•</span>
                <span className="text-xs font-semibold text-[#667e6e]">
                  Curated Curriculum
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-5xl">
                {language === "am"
                  ? "የትምህርት ቤተ-መጽሐፍት"
                  : "Learning Library"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#5a6e60] sm:text-base">
                {language === "am"
                  ? "በህክምና ባለሙያዎች የተረጋገጡ ተግባራዊ የጤና እና የአመጋገብ መመሪያዎች ለኢትዮጵያውያን ቤተሰቦች።"
                  : "Calm, practical health guides grounded in familiar foods, clean water, and clinical evidence."}
              </p>
            </div>

            {/* Language Selection */}
            <div className="flex rounded-full border border-[#cbd8cb] bg-white p-0.5 text-xs font-bold shadow-2xs self-start md:self-end">
              {(["en", "am"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLanguage(value)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    language === value
                      ? "bg-[#1c573e] text-white shadow-2xs"
                      : "text-[#5e7564] hover:text-[#183b2d]"
                  }`}
                >
                  {value === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Content Grid */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#809485]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                language === "am"
                  ? "የርዕስ ወይም ይዘት ፍለጋ..."
                  : "Search curriculum by topic, food, or keyword..."
              }
              className="w-full rounded-full border border-[#cfddd1] bg-white py-3 pl-11 pr-5 text-sm outline-none placeholder:text-[#9aa99d] focus:border-[#1c573e]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === value
                    ? "bg-[#1c573e] text-white shadow-2xs"
                    : "border border-[#cfddd1] bg-white text-[#52705b] hover:bg-[#f6faf5]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Note Cards Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item._id}
              className="flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-[#dce6dc] bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {item.coverImageUrl ? (
                <div className="aspect-16/9 w-full overflow-hidden bg-[#eef3ee]">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-102"
                  />
                </div>
              ) : null}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c573e]">
                    {item.category}
                  </span>

                  <button
                    type="button"
                    aria-label={
                      saved.includes(item._id)
                        ? "Remove saved item"
                        : "Save item"
                    }
                    onClick={() => toggleSaved(item._id)}
                    className={`rounded-full p-1 transition ${
                      saved.includes(item._id)
                        ? "text-[#1c573e]"
                        : "text-[#a4b4a7] hover:text-[#1c573e]"
                    }`}
                  >
                    {saved.includes(item._id) ? (
                      <BookmarkCheck size={18} strokeWidth={2} />
                    ) : (
                      <Bookmark size={18} strokeWidth={2} />
                    )}
                  </button>
                </div>

                <h2 className="mt-3 text-xl font-bold leading-snug text-[#163826]">
                  {displayTitle(item, language)}
                </h2>

                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-[#5e7063]">
                  {displaySummary(item, language)}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#f0f4ee] pt-4 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#7a8d80]">
                    <Clock size={13} className="text-[#1c573e]" />
                    <span>
                      {item.readMinutes} {language === "am" ? "ደቂቃ" : "min read"}
                    </span>
                  </span>

                  <Link
                    href={`/learn/${item._id}?lang=${language}`}
                    className="rounded-full bg-[#1c573e] px-4 py-1.5 font-bold text-white shadow-2xs hover:bg-[#154631] transition"
                  >
                    {language === "am" ? "አንብብ" : "Read Note"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#bed2c1] bg-[#fbfdfa] p-12 text-center text-sm text-[#6b7d70]">
            {language === "am"
              ? "ምንም ትምህርት አልተገኘም። እባክዎ ሌላ ቃል ይፈልጉ።"
              : "No learning notes match that search term. Please try another keyword."}
          </div>
        )}
      </section>
    </div>
  );
}
