"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { containsLikelyPersonalDetails } from "../lib/opal/safety";
import { generatePantryMealIdea } from "./ai/gemini";

const languageValidator = v.union(v.literal("am"), v.literal("en"));
const mealIdeaPreferenceValidator = v.union(
  v.literal("plantBased"),
  v.literal("budget"),
  v.literal("healthyEating"),
  v.literal("familyMeals"),
);
const audienceValidator = v.union(
  v.literal("family"),
  v.literal("child"),
  v.literal("adolescent"),
  v.literal("pregnantAdult"),
);
const allergenValidator = v.union(
  v.literal("egg"),
  v.literal("nuts"),
  v.literal("dairy"),
  v.literal("sesame"),
);
const mealIdeaValidator = v.object({
  title: v.string(),
  summary: v.string(),
  steps: v.array(v.string()),
  tip: v.string(),
});

const preferenceLabels = {
  plantBased: "Mostly plant-based",
  budget: "Budget-minded",
  healthyEating: "Interested in learning healthy eating",
  familyMeals: "Interested in family meal planning",
} satisfies Record<
  "plantBased" | "budget" | "healthyEating" | "familyMeals",
  string
>;

const allergenLabels = {
  egg: "Egg",
  nuts: "Peanuts and tree nuts",
  dairy: "Milk and dairy",
  sesame: "Sesame",
} satisfies Record<"egg" | "nuts" | "dairy" | "sesame", string>;

export const generateMealIdea = action({
  args: {
    consented: v.literal(true),
    includeProfilePreferences: v.boolean(),
    ingredients: v.array(v.string()),
    audience: audienceValidator,
    excludedAllergens: v.array(allergenValidator),
    language: languageValidator,
  },
  returns: mealIdeaValidator,
  handler: async (ctx, args) => {
    const ingredients = args.ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    if (
      ingredients.length === 0 ||
      ingredients.length > 12 ||
      ingredients.some((ingredient) => ingredient.length > 50) ||
      ingredients.join(", ").length > 300
    ) {
      throw new Error("PANTRY_INVALID_INGREDIENTS");
    }

    if (containsLikelyPersonalDetails(ingredients.join(", "))) {
      throw new Error("PANTRY_INGREDIENTS_ONLY");
    }

    let preferences: string[] = [];
    if (args.includeProfilePreferences) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity?.subject) throw new Error("PANTRY_SIGN_IN_REQUIRED");

      const profile = await ctx.runQuery(
        internal.onboarding.getMealIdeaPreferences,
        { userId: identity.subject },
      );
      if (!profile.hasProfile) throw new Error("PANTRY_PROFILE_NOT_FOUND");
      preferences = profile.preferences.map((preference) =>
        preferenceLabels[preference],
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("PANTRY_NOT_CONFIGURED");

    return await generatePantryMealIdea(
      apiKey,
      ingredients,
      preferences,
      args.language,
      args.audience,
      args.excludedAllergens.map((allergen) => allergenLabels[allergen]),
    );
  },
});
