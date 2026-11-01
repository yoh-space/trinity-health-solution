"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { learningTopics } from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function LearningTopicsSection() {
  const { language, t } = useMarketingLanguage();

  const lessonImages: Record<string, string> = {
    "home-food-safety": "/images/kitchen-meal.jpg",
    "pregnancy-nutrition-variety": "/images/pregnancy-plate.jpg",
    "child-complementary-feeding": "/images/child-feeding.jpg",
  };

  return (
    <section
      id="learning"
      className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7550]">
            {t("Culturally Validated Curriculum", "የተረጋገጡ የትምህርት ርዕሶች")}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.05em] text-[#193b2d] sm:text-5xl">
            {t(
              "Good health starts with understanding.",
              "ጥሩ ጤና የሚጀምረው በማወቅና በመረዳት ነው።"
            )}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="max-w-sm text-sm leading-6 text-[#67776b]">
            {t(
              "Short 3-minute lessons designed around everyday Ethiopian household routines, food staples, and parenting moments.",
              "በዕለት ተዕለት የኢትዮጵያውያን የቤት ውስጥ ልምዶች፣ የምግብ ዓይነቶችና የቤተሰብ እንክብካቤ ላይ ያተኮሩ አጫጭር የ3 ደቂቃ ትምህርቶች።"
            )}
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1c573e] hover:underline"
          >
            {t("View All Lessons", "ሁሉንም ትምህርቶች ይመልከቱ")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {learningTopics.map((topic) => {
          const Icon = topic.icon;
          const imageSrc = lessonImages[topic.slug];

          return (
            <article
              key={topic.number}
              className="group flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#e4e8dc] bg-white transition hover:-translate-y-1 hover:border-[#ccd7c6] hover:shadow-[0_20px_45px_rgba(28,60,40,0.08)]"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eaf0e4]">
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={language === "am" ? topic.titleAm : topic.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                    <Clock size={12} />
                    {t("3 min read", "የ3 ደቂቃ ንባብ")}
                  </span>
                  <span className="text-xs font-bold tracking-widest opacity-80">
                    {topic.number}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid size-8 place-items-center rounded-lg ${topic.tint}`}
                    >
                      <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#79887d]">
                      {t("Lesson Module", "የትምህርት ክፍል")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-[#1e3c2c]">
                    {language === "am" ? topic.titleAm : topic.titleEn}
                  </h3>

                  <p className="mt-2.5 text-xs leading-5 text-[#65766a]">
                    {language === "am" ? topic.descriptionAm : topic.descriptionEn}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#eef2ea] pt-4">
                  <Link
                    href={`/learn/${topic.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1c573e] transition group-hover:gap-3"
                  >
                    {t("Read this note", "ትምህርቱን ያንብቡ")}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
