"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import {
  displaySummary,
  displayTitle,
  fallbackEducation,
  type EducationItem,
  type EducationLanguage,
} from "@/lib/education";

export function EducationLibrary() {
  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const [language, setLanguage] = useState<EducationLanguage>("en");
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
    <main className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
      <section className="border-b border-[#183b2d]/10 bg-[#eef7ee]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-[#438451]">
                TRINITY LEARNING LIBRARY
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
                A little learning. A lot of care.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#5d7063]">
                Practical, source-backed notes for food, water, pregnancy, and
                everyday family wellbeing.
              </p>
            </div>
            <div className="flex rounded-full border border-[#bcd4bf] bg-white p-1 text-sm font-semibold shadow-sm">
              {(["en", "am"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLanguage(value)}
                  className={`rounded-full px-4 py-2 ${language === value ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
                >
                  {value === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex-1">
            <span className="sr-only">Search learning notes</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                language === "am"
                  ? "ትምህርቶችን ይፈልጉ..."
                  : "Search learning notes..."
              }
              className="w-full rounded-2xl border border-[#cfddd1] bg-white px-5 py-4 outline-none ring-[#87b791] placeholder:text-[#9aa99d] focus:ring-2"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${category === value ? "border-[#287343] bg-[#287343] text-white" : "border-[#cfddd1] bg-white text-[#52705b]"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item._id}
              className="flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-[#dce8de] bg-white shadow-[0_12px_30px_rgba(36,87,51,0.06)] transition hover:-translate-y-1 hover:shadow-md"
            >
              {item.coverImageUrl ? (
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  {!item.coverImageUrl && (
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#579165]">
                      {item.category}
                    </span>
                  )}
                  <div className={item.coverImageUrl ? "ml-auto" : ""}>
                    <button
                      type="button"
                      aria-label={
                        saved.includes(item._id) ? "Remove saved item" : "Save item"
                      }
                      onClick={() => toggleSaved(item._id)}
                      className={`rounded-full p-1 ${saved.includes(item._id) ? "text-[#287343]" : "text-[#a4b4a7]"}`}
                    >
                      {saved.includes(item._id) ? (
                        <BookmarkCheck
                          size={20}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      ) : (
                        <Bookmark size={20} strokeWidth={1.8} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-[#23472e]">
                  {displayTitle(item, language)}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#68796d]">
                  {displaySummary(item, language)}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[#f0f4ee] pt-4">
                  <span className="text-xs font-semibold text-[#829086]">
                    {item.readMinutes} {language === "am" ? "ደቂቃ" : "min read"}
                  </span>
                  <Link
                    href={`/learn/${item._id}?lang=${language}`}
                    className="rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white hover:bg-[#154631] transition shadow-2xs"
                  >
                    {language === "am" ? "አንብብ" : "Read note"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#bed2c1] p-12 text-center text-[#6b7d70]">
            {language === "am"
              ? "ምንም ትምህርት አልተገኘም።"
              : "No learning notes match that search."}
          </div>
        )}
      </section>
    </main>
  );
}
