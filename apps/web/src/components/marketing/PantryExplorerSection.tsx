"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Utensils, Sparkles, Check, ArrowRight, Lightbulb } from "lucide-react";
import {
  pantryIngredients,
  pantryRecipes,
  type PantryRecipe,
} from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function PantryExplorerSection() {
  const { language, t } = useMarketingLanguage();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    "misir",
    "gomen",
    "teff",
  ]);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // Find recipes matching any selected ingredients, sorted by number of matched ingredients
  const matchedRecipes = pantryRecipes
    .map((recipe) => {
      const matchCount = recipe.requiredIngredients.filter((ing) =>
        selectedIngredients.includes(ing)
      ).length;
      return { ...recipe, matchCount };
    })
    .sort((a, b) => b.matchCount - a.matchCount);

  const topRecipe: PantryRecipe = matchedRecipes[0] ?? pantryRecipes[0];

  return (
    <section id="pantry" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7550]">
            {t("Culturally Grounded Cooking", "ምን እናብስል? · የጓዳ ሀሳቦች")}
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-[#193b2d] sm:text-5xl">
            {t(
              "Nourishing meals from what you have.",
              "ካለዎት ነገር ጥሩና የተመጣጠነ ምግብ ይስሩ።"
            )}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#627367] sm:text-base">
            {t(
              "Select familiar ingredients commonly found in Ethiopian kitchens to discover nutrient-rich, family-friendly recipe ideas.",
              "በጓዳዎ የሚገኙ የተለመዱ የዕለት ተዕለት ግብዓቶችን ይምረጡና ለቤተሰብ ጤና ተስማሚ የሆኑ የተመጣጠኑ የምግብ አዘገጃጀቶችን ይመልከቱ።"
            )}
          </p>
        </div>

        {/* Interactive Ingredients Grid */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {pantryIngredients.map((ing) => {
            const isSelected = selectedIngredients.includes(ing.id);
            return (
              <button
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "bg-[#1c573e] text-white shadow-sm"
                    : "border border-[#d2ddd0] bg-white text-[#455c4e] hover:border-[#1c573e]"
                }`}
              >
                {isSelected ? (
                  <Check size={14} className="text-[#a8e0b6]" />
                ) : (
                  <span className="size-1.5 rounded-full bg-[#c78157]" />
                )}
                <span>{language === "am" ? ing.nameAm : ing.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Matching Recipe Card */}
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#dce3d8] bg-white shadow-[0_20px_50px_rgba(28,60,40,0.08)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Details */}
            <div className="flex flex-col justify-between p-7 sm:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f4e8df] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9b593e]">
                    {language === "am" ? topRecipe.badgeAm : topRecipe.badgeEn}
                  </span>
                  <span className="text-xs text-[#718276]">
                    {t("Family nutrition note", "የቤተሰብ አመጋገብ ማስታወሻ")}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1b3a2a] sm:text-3xl">
                  {language === "am" ? topRecipe.titleAm : topRecipe.titleEn}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5a6c5f]">
                  {language === "am"
                    ? topRecipe.descriptionAm
                    : topRecipe.descriptionEn}
                </p>

                {/* Nutrition Tip Callout */}
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e1e9dd] bg-[#f8fbf6] p-4 text-xs text-[#2a4c37]">
                  <Lightbulb size={18} className="shrink-0 text-[#c78157]" />
                  <div>
                    <span className="font-bold">
                      {t("Health Tip: ", "የጤና ምክር፡ ")}
                    </span>
                    <span>
                      {language === "am"
                        ? topRecipe.nutritionTipAm
                        : topRecipe.nutritionTipEn}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf2ea] pt-6">
                <span className="text-xs font-medium text-[#718276]">
                  {t(
                    "Explore 20+ more pantry recipes in the mobile app.",
                    "በሞባይል መተግበሪያው ከ20 በላይ ተጨማሪ የምግብ ሀሳቦችን ያግኙ።"
                  )}
                </span>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  {t("Nutrition Lessons", "የአመጋገብ ትምህርቶች")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Recipe Visual */}
            <div className="relative min-h-[280px] bg-[#eef2ea] lg:min-h-full">
              <Image
                src="/images/kitchen-meal.jpg"
                alt="Ethiopian kitchen nutrition meal"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/10 lg:to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-4 py-2.5 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7e72]">
                  {t("Recommended Plate", "የተመከረ ሚዛናዊ ምግብ")}
                </p>
                <p className="text-xs font-bold text-[#1c573e]">
                  {t("Rich in Iron & Fiber", "በብረትና ፋይበር የበለፀገ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
