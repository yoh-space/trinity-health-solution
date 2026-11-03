"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  ArrowRight,
  Check,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  Utensils,
} from "lucide-react";
import {
  pantryIngredients,
  pantryRecipes,
  type PantryRecipe,
} from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function PantryExplorerSection() {
  const { language, t } = useMarketingLanguage();
  const hasSavedProfile = useQuery(anyApi.onboarding.hasProfile);
  const generateMealIdea = useAction(anyApi.pantry.generateMealIdea);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    "misir",
    "gomen",
    "teff",
  ]);
  const [customIngredients, setCustomIngredients] = useState("");
  const [consented, setConsented] = useState(false);
  const [profileConsent, setProfileConsent] = useState(false);
  const [audience, setAudience] = useState<
    "family" | "child" | "adolescent" | "pregnantAdult"
  >("family");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [mealIdea, setMealIdea] = useState<{
    title: string;
    summary: string;
    steps: string[];
    tip: string;
  } | null>(null);

  const toggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const requestMealIdea = async () => {
    if (!consented || isGenerating) return;

    const ingredients = [
      ...pantryIngredients
        .filter((ingredient) => selectedIngredients.includes(ingredient.id))
        .map((ingredient) =>
          language === "am" ? ingredient.nameAm : ingredient.nameEn
        ),
      ...customIngredients
        .split(/[,\n]/)
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
    ];

    setGenerationError("");
    setMealIdea(null);
    setIsGenerating(true);
    try {
      const result = await generateMealIdea({
        consented: true,
        includeProfilePreferences: profileConsent && Boolean(hasSavedProfile),
        ingredients,
        audience,
        excludedAllergens: [],
        language,
      });
      setMealIdea(result);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code.includes("PANTRY_INVALID_INGREDIENTS")) {
        setGenerationError(
          t(
            "Enter 1–12 ingredients, with each name under 50 characters.",
            "ከ1–12 ግብዓቶች ያስገቡ፤ እያንዳንዱ ስም ከ50 ቁምፊ በታች ይሁን።"
          )
        );
      } else if (code.includes("PANTRY_INGREDIENTS_ONLY")) {
        setGenerationError(
          t(
            "Please enter ingredient names only. Do not include personal or health details.",
            "የግብዓት ስሞችን ብቻ ያስገቡ፤ የግል ወይም የጤና መረጃ አያካትቱ።"
          )
        );
      } else if (code.includes("PANTRY_SIGN_IN_REQUIRED")) {
        setGenerationError(
          t(
            "Sign in again to use saved food preferences.",
            "የተቀመጡ የምግብ ምርጫዎችን ለመጠቀም እንደገና ይግቡ።"
          )
        );
      } else if (code.includes("PANTRY_PROFILE_NOT_FOUND")) {
        setGenerationError(
          t(
            "No saved onboarding profile was found. Turn off profile personalization and try again.",
            "የተቀመጠ የመጀመሪያ መገለጫ አልተገኘም። የመገለጫ ግላዊ ማድረግን ያጥፉና እንደገና ይሞክሩ።"
          )
        );
      } else {
        setGenerationError(
          t(
            "We couldn't create a meal idea right now. Please try again.",
            "አሁን የምግብ ሀሳብ ማዘጋጀት አልቻልንም። እባክዎ እንደገና ይሞክሩ።"
          )
        );
      }
    } finally {
      setIsGenerating(false);
    }
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

        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-[#dce3d8] bg-[#f2f7f0] p-6 shadow-[0_16px_40px_rgba(28,60,40,0.06)] sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#1c573e] text-white">
              <Sparkles size={20} />
            </span>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#1b3a2a]">
                {t("Create a meal with AI", "በAI የምግብ ሀሳብ ያዘጋጁ")}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#5a6c5f]">
                {t(
                  "Choose what you have, add anything else, and get a simple meal idea.",
                  "ያሉዎትን ይምረጡ፣ ሌሎች ግብዓቶችንም ይጨምሩና ቀላል የምግብ ሀሳብ ያግኙ።"
                )}
              </p>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-[#294a35]">
              {t("Who is this meal for?", "ይህ ምግብ ለማን ነው?")}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {([
                ["family", "Family", "ቤተሰብ"],
                ["child", "Young child", "ታዳጊ ህፃን"],
                ["adolescent", "Adolescent", "ታዳጊ"],
                ["pregnantAdult", "Pregnant adult", "ነፍሰ ጡር አዋቂ"],
              ] as const).map(([value, en, am]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={audience === value}
                  onClick={() => setAudience(value)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    audience === value
                      ? "border-[#1c573e] bg-[#1c573e] text-white"
                      : "border-[#cfdacf] bg-white text-[#52685a]"
                  }`}
                >
                  {t(en, am)}
                </button>
              ))}
            </div>
            {(audience === "adolescent" || audience === "pregnantAdult") && (
              <p className="mt-2 text-xs leading-5 text-[#718276]">
                {t(
                  "These are general meal ideas only, not personalized clinical or nutrition advice.",
                  "እነዚህ አጠቃላይ የምግብ ሀሳቦች ብቻ ናቸው፤ የግል የሕክምና ወይም የአመጋገብ ምክር አይደሉም።",
                )}
              </p>
            )}
          </fieldset>

          <label
            htmlFor="pantry-custom-ingredients"
            className="mt-6 block text-sm font-semibold text-[#294a35]"
          >
            {t("Add ingredients (separate with commas)", "ግብዓቶችን ያክሉ (በኮማ ይለዩ)")}
          </label>
          <input
            id="pantry-custom-ingredients"
            type="text"
            value={customIngredients}
            onChange={(event) => setCustomIngredients(event.target.value)}
            placeholder={t(
              "e.g. tomatoes, onions, garlic",
              "ለምሳሌ፦ ቲማቲም፣ ሽንኩርት፣ ነጭ ሽንኩርት"
            )}
            className="mt-2 w-full rounded-xl border border-[#cfdacf] bg-white px-4 py-3 text-sm text-[#183b2d] outline-none transition placeholder:text-[#89968b] focus:border-[#1c573e] focus:ring-2 focus:ring-[#1c573e]/15"
          />

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-3 text-xs leading-5 text-[#52685a]">
              <input
                type="checkbox"
                checked={consented}
                onChange={(event) => setConsented(event.target.checked)}
                className="mt-1 accent-[#1c573e]"
              />
              <span>
                {t(
                  "I agree to send my ingredient list and selected meal audience to Google Gemini to create this meal idea. I will enter ingredients only—not names, diagnoses, or other private details. This feature does not save my list. Audience selection gives general meal context only, not individualized clinical advice.",
                  "ይህን የምግብ ሀሳብ ለማዘጋጀት የግብዓት ዝርዝሬና የመመገቢያ ምርጫዬ ወደ Google Gemini እንዲላኩ እስማማለሁ። የግብዓት ስሞችን ብቻ አስገባለሁ፤ ስም፣ ምርመራ ወይም ሌላ የግል መረጃ አላካትትም። ዝርዝሬ አይቀመጥም። የመመገቢያ ምርጫው አጠቃላይ የምግብ አውድ ብቻ ይሰጣል፤ የግል የሕክምና ምክር አይደለም።"
                )}
              </span>
            </label>
            {hasSavedProfile && (
              <label className="flex items-start gap-3 text-xs leading-5 text-[#52685a]">
                <input
                  type="checkbox"
                  checked={profileConsent}
                  onChange={(event) =>
                    setProfileConsent(event.target.checked)
                  }
                  className="mt-1 accent-[#1c573e]"
                />
                <span>
                  {t(
                    "Also use my saved non-clinical food preferences (plant-based, budget-minded, healthy-eating learning, or family meal planning). Only these selected preferences will be shared—not my name, age, health conditions, allergy information, measurements, or other profile details.",
                    "የተቀመጡትን ክሊኒካዊ ያልሆኑ የምግብ ምርጫዎቼንም ይጠቀሙ (ከዕፅዋት የተዘጋጀ፣ በበጀት የተመጣጠነ፣ ጤናማ አመጋገብን መማር ወይም የቤተሰብ ምግብ ማቀድ)። የተመረጡት ምርጫዎች ብቻ ይላካሉ፤ ስም፣ ዕድሜ፣ የጤና ሁኔታ፣ የአለርጂ መረጃ፣ መለኪያዎች ወይም ሌላ የመገለጫ መረጃ አይላክም።"
                  )}
                </span>
              </label>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void requestMealIdea()}
              disabled={!consented || isGenerating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c573e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#164531] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Utensils size={17} />
              )}
              {isGenerating
                ? t("Creating your idea…", "የምግብ ሀሳብ በማዘጋጀት ላይ…")
                : t("Suggest a meal", "የምግብ ሀሳብ ያግኙ")}
            </button>
            <p className="text-xs leading-5 text-[#718276]">
              {t(
                "For everyday inspiration only—not medical or allergy advice.",
                "ለዕለታዊ ሀሳብ ብቻ ነው፤ የሕክምና ወይም የአለርጂ ምክር አይደለም።"
              )}
            </p>
          </div>

          {generationError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#e7c9bd] bg-white px-4 py-3 text-sm text-[#8b3f2a]"
            >
              {generationError}
            </p>
          )}

          {mealIdea && (
            <article className="mt-6 rounded-2xl border border-[#dce3d8] bg-white p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a7550]">
                {t("Your meal idea", "የምግብ ሀሳብዎ")}
              </p>
              <h4 className="mt-2 text-xl font-bold text-[#1b3a2a]">
                {mealIdea.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#5a6c5f]">
                {mealIdea.summary}
              </p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#294a35]">
                {mealIdea.steps.map((step, index) => (
                  <li key={`${index}-${step}`}>{step}</li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl bg-[#f2f7f0] px-4 py-3 text-xs leading-5 text-[#52685a]">
                <span className="font-bold">{t("Tip: ", "ማስታወሻ፡ ")}</span>
                {mealIdea.tip}
              </p>
            </article>
          )}
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
              <div className="absolute bottom-4 left-4 rounded-xl border border-[#d6dfd2] bg-white p-3 shadow-sm">
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
