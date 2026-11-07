"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  classifyOpalQuestion,
  containsLikelyPersonalDetails,
  getOpalPrivacyResponse,
  getOpalSafetyResponse,
} from "../lib/opal/safety";
import { generateOpalAnswer } from "./ai/gemini";
import { selectRelevantOpalSources } from "./ai/opalContext";

const languageValidator = v.union(v.literal("am"), v.literal("en"));
const profileContextValidator = v.object({
  audience: v.optional(
    v.union(
      v.literal("myself"),
      v.literal("child"),
      v.literal("family"),
      v.literal("caregiver"),
    ),
  ),
  ageBand: v.optional(
    v.union(
      v.literal("under5"),
      v.literal("age5to17"),
      v.literal("age18to39"),
      v.literal("age40to59"),
      v.literal("age60plus"),
    ),
  ),
  goals: v.array(v.union(v.literal("healthyEating"), v.literal("familyMeals"))),
});

const sourceValidator = v.object({
  id: v.string(),
  title: v.string(),
  titleAm: v.string(),
});

const structuredSectionValidator = v.object({
  title: v.string(),
  points: v.array(v.string()),
});

const serviceSuggestionValidator = v.object({
  title: v.string(),
  description: v.string(),
  actionText: v.string(),
  actionUrl: v.string(),
  phone: v.optional(v.string()),
});

const structuredResponseValidator = v.optional(
  v.object({
    summary: v.string(),
    sections: v.array(structuredSectionValidator),
    practicalTips: v.optional(v.array(v.string())),
    warningSigns: v.optional(v.array(v.string())),
    suggestedServices: v.optional(v.array(serviceSuggestionValidator)),
    supportPhone: v.optional(v.string()),
    emergencyHelpline: v.optional(v.string()),
  }),
);

export const ask = action({
  args: {
    consented: v.literal(true),
    language: languageValidator,
    question: v.string(),
    includeProfileContext: v.optional(v.boolean()),
    profileConsented: v.optional(v.literal(true)),
    guestProfileContext: v.optional(profileContextValidator),
  },
  returns: v.object({
    answer: v.string(),
    structured: structuredResponseValidator,
    safety: v.boolean(),
    redFlag: v.union(
      v.literal("none"),
      v.literal("clinical"),
      v.literal("urgent"),
    ),
    sources: v.array(sourceValidator),
  }),
  handler: async (ctx, args) => {
    const { consented, language, question } = args;
    if (!consented) throw new Error("OPAL_CONSENT_REQUIRED");

    const cleanQuestion = question.trim();
    if (!cleanQuestion) throw new Error("OPAL_EMPTY_QUESTION");
    if (cleanQuestion.length > 1000) throw new Error("OPAL_QUESTION_TOO_LONG");

    const safetyIntent = classifyOpalQuestion(cleanQuestion);
    if (safetyIntent === "urgent") {
      return {
        answer: getOpalSafetyResponse("urgent", language),
        structured: undefined,
        safety: true,
        redFlag: "urgent" as const,
        sources: [],
      };
    }

    if (safetyIntent === "clinical") {
      return {
        answer: getOpalSafetyResponse("clinical", language),
        structured: undefined,
        safety: true,
        redFlag: "clinical" as const,
        sources: [],
      };
    }

    if (containsLikelyPersonalDetails(cleanQuestion)) {
      return {
        answer: getOpalPrivacyResponse(language),
        structured: undefined,
        safety: true,
        redFlag: "none" as const,
        sources: [],
      };
    }

    let profileContext:
      | {
          audience?: "myself" | "child" | "family" | "caregiver";
          ageBand?: "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus";
          goals: Array<"healthyEating" | "familyMeals">;
        }
      | undefined;
    if (args.includeProfileContext) {
      if (args.profileConsented !== true) {
        throw new Error("OPAL_PROFILE_CONSENT_REQUIRED");
      }

      const identity = await ctx.auth.getUserIdentity();
      if (identity?.subject) {
        profileContext =
          (await ctx.runQuery(internal.onboarding.getOpalProfileContext, {
            userId: identity.subject,
          })) ??
          args.guestProfileContext ??
          undefined;
      } else {
        profileContext = args.guestProfileContext;
      }
      if (!profileContext) {
        throw new Error("OPAL_PROFILE_CONTEXT_REQUIRED");
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("OPAL_NOT_CONFIGURED");

    const lessons = await ctx.runQuery(internal.education.listPublishedForOpal, {});
    const relevantSources = selectRelevantOpalSources(
      lessons,
      cleanQuestion,
      language,
    );
    const result = await generateOpalAnswer(
      apiKey,
      cleanQuestion,
      language,
      relevantSources,
      profileContext,
    );

    const allowedSources = new Map(relevantSources.map((source) => [source.id, source]));
    const sources = result.sourceIds
      .map((id) => allowedSources.get(id))
      .filter((source): source is NonNullable<typeof source> => Boolean(source))
      .map(({ id, title, titleAm }) => ({ id, title, titleAm }));

    return {
      answer: result.answer,
      structured: result.structured,
      safety: false,
      redFlag: "none" as const,
      sources,
    };
  },
});
