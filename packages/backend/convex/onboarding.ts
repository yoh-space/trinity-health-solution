import { v } from "convex/values";
import { type Auth } from "convex/server";
import { internalQuery, mutation, query } from "./_generated/server";

const mealIdeaPreferenceIds = [
  "plantBased",
  "budget",
  "healthyEating",
  "familyMeals",
] as const;

const mealIdeaPreferenceValidator = v.union(
  v.literal("plantBased"),
  v.literal("budget"),
  v.literal("healthyEating"),
  v.literal("familyMeals"),
);
const opalAudienceValidator = v.union(
  v.literal("myself"),
  v.literal("child"),
  v.literal("family"),
  v.literal("caregiver"),
);
const opalAgeBandValidator = v.union(
  v.literal("under5"),
  v.literal("age5to17"),
  v.literal("age18to39"),
  v.literal("age40to59"),
  v.literal("age60plus"),
);
const opalGoalValidator = v.union(
  v.literal("healthyEating"),
  v.literal("familyMeals"),
);

function getOpalAudience(value: string) {
  switch (value) {
    case "myself":
    case "child":
    case "family":
    case "caregiver":
      return value;
    default:
      return undefined;
  }
}

function getOpalAgeBand(value: string) {
  switch (value) {
    case "under5":
    case "age5to17":
    case "age18to39":
    case "age40to59":
    case "age60plus":
      return value;
    default:
      return undefined;
  }
}

async function requireUserId({ auth }: { auth: Auth }) {
  const identity = await auth.getUserIdentity();
  if (!identity?.subject) throw new Error("Sign in is required to save a profile");
  return identity.subject;
}

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) return null;

    return await ctx.db
      .query("onboardingProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const hasProfile = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) return false;

    const profile = await ctx.db
      .query("onboardingProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
    return profile !== null;
  },
});

export const getMealIdeaPreferences = internalQuery({
  args: { userId: v.string() },
  returns: v.object({
    hasProfile: v.boolean(),
    preferences: v.array(mealIdeaPreferenceValidator),
  }),
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("onboardingProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return { hasProfile: false, preferences: [] };

    const allowedPreferences = new Set([
      ...profile.eatingPatterns,
      ...profile.goals,
    ]);
    const preferences = mealIdeaPreferenceIds.filter((preference) =>
      allowedPreferences.has(preference),
    );

    return { hasProfile: true, preferences };
  },
});

export const getOpalProfileContext = internalQuery({
  args: { userId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      audience: v.optional(opalAudienceValidator),
      ageBand: v.optional(opalAgeBandValidator),
      goals: v.array(opalGoalValidator),
    }),
  ),
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("onboardingProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return null;

    const audience = getOpalAudience(profile.audience);
    const ageBand = getOpalAgeBand(profile.age);
    const selectedGoals = new Set(profile.goals);
    const goals = (["healthyEating", "familyMeals"] as const).filter((goal) =>
      selectedGoals.has(goal),
    );

    return {
      ...(audience ? { audience } : {}),
      ...(ageBand ? { ageBand } : {}),
      goals,
    };
  },
});

export const saveProfile = mutation({
  args: {
    consent: v.literal(true),
    audience: v.string(),
    age: v.string(),
    support: v.array(v.string()),
    generalSupport: v.boolean(),
    otherSupport: v.string(),
    meals: v.string(),
    activity: v.string(),
    eatingPatterns: v.array(v.string()),
    goals: v.array(v.string()),
    otherGoal: v.string(),
    consultation: v.string(),
    otherConsultation: v.string(),
    heightCm: v.optional(v.number()),
    weightKg: v.optional(v.number()),
    ageYears: v.optional(v.number()),
    formulaSex: v.optional(v.union(v.literal("male"), v.literal("female"))),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const updatedAt = Date.now();
    const isAdult = ["age18to39", "age40to59", "age60plus"].includes(args.age);
    if (
      args.ageYears !== undefined &&
      (!Number.isInteger(args.ageYears) ||
        args.ageYears < 18 ||
        args.ageYears > 100 ||
        args.audience !== "myself" ||
        !isAdult ||
        args.support.includes("pregnancy"))
    ) {
      throw new Error("Exact age is only accepted for an adult profile for yourself.");
    }
    if (
      args.formulaSex !== undefined &&
      (args.audience !== "myself" ||
        !isAdult ||
        args.support.includes("pregnancy"))
    ) {
      throw new Error("Equation choice is only accepted for an adult profile for yourself.");
    }
    const bmiEligible =
      args.audience === "myself" &&
      isAdult &&
      !args.support.includes("pregnancy");

    let heightCm: number | undefined;
    let weightKg: number | undefined;
    let bmi: number | undefined;
    if (bmiEligible && args.heightCm !== undefined && args.weightKg !== undefined) {
      if (
        !Number.isFinite(args.heightCm) ||
        !Number.isFinite(args.weightKg) ||
        args.heightCm < 100 ||
        args.heightCm > 250 ||
        args.weightKg < 25 ||
        args.weightKg > 300
      ) {
        throw new Error("Height or weight is outside the accepted range");
      }
      heightCm = args.heightCm;
      weightKg = args.weightKg;
      const heightM = args.heightCm / 100;
      bmi = Math.round((args.weightKg / (heightM * heightM)) * 10) / 10;
    }
    const ageYears =
      args.audience === "myself" &&
      isAdult &&
      !args.support.includes("pregnancy") &&
      args.ageYears !== undefined &&
      Number.isInteger(args.ageYears) &&
      args.ageYears >= 18 &&
      args.ageYears <= 100
        ? args.ageYears
        : undefined;
    const formulaSex =
      args.audience === "myself" && isAdult && !args.support.includes("pregnancy")
        ? args.formulaSex
        : undefined;

    const profile = {
      userId,
      audience: args.audience,
      age: args.age,
      support: args.support,
      generalSupport: args.generalSupport,
      otherSupport: args.otherSupport,
      meals: args.meals,
      activity: args.activity,
      eatingPatterns: args.eatingPatterns,
      goals: args.goals,
      otherGoal: args.otherGoal,
      consultation: args.consultation,
      otherConsultation: args.otherConsultation,
      ...(heightCm !== undefined && weightKg !== undefined && bmi !== undefined
        ? { heightCm, weightKg, bmi }
        : {}),
      ...(ageYears !== undefined ? { ageYears } : {}),
      ...(formulaSex !== undefined ? { formulaSex } : {}),
      consentedAt: updatedAt,
      updatedAt,
    };

    const existing = await ctx.db
      .query("onboardingProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.replace(existing._id, profile);
      return existing._id;
    }
    return await ctx.db.insert("onboardingProfiles", profile);
  },
});
