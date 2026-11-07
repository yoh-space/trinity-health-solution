import { v } from "convex/values";
import { type Auth } from "convex/server";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./auth";

async function requirePublisher(ctx: { auth: Auth }) {
  return await requireRole(ctx, "admin");
}

const serviceArgs = {
  slug: v.string(),
  order: v.number(),
  badgeEn: v.string(),
  badgeAm: v.string(),
  categoryEn: v.string(),
  categoryAm: v.string(),
  taglineEn: v.string(),
  taglineAm: v.string(),
  deliverablesEn: v.array(v.string()),
  deliverablesAm: v.array(v.string()),
  guidelineEn: v.string(),
  guidelineAm: v.string(),
  icon: v.string(),
  accent: v.string(),
  primaryCtaLabelEn: v.string(),
  primaryCtaLabelAm: v.string(),
  primaryCtaHref: v.string(),
};

function validateService(args: {
  slug: string;
  categoryEn: string;
  categoryAm: string;
  taglineEn: string;
  taglineAm: string;
}) {
  if (
    !args.slug.trim() ||
    !args.categoryEn.trim() ||
    !args.categoryAm.trim() ||
    !args.taglineEn.trim() ||
    !args.taglineAm.trim()
  ) {
    throw new Error("Complete required English and Amharic titles and summaries before saving.");
  }
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("servicesContent")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(50);
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requirePublisher(ctx);
    return await ctx.db
      .query("servicesContent")
      .withIndex("by_order")
      .take(100);
  },
});

export const create = mutation({
  args: serviceArgs,
  handler: async (ctx, args) => {
    const identity = await requirePublisher(ctx);
    validateService(args);

    const existing = await ctx.db
      .query("servicesContent")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("A service with this identifier already exists.");
    }

    const now = Date.now();
    return await ctx.db.insert("servicesContent", {
      ...args,
      status: "draft",
      authorTokenIdentifier: identity.tokenIdentifier,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("servicesContent"),
    ...serviceArgs,
  },
  handler: async (ctx, { id, ...args }) => {
    await requirePublisher(ctx);
    validateService(args);

    const item = await ctx.db.get(id);
    if (!item) throw new Error("This service no longer exists.");

    await ctx.db.patch(id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const publish = mutation({
  args: { id: v.id("servicesContent"), publish: v.boolean() },
  handler: async (ctx, { id, publish }) => {
    await requirePublisher(ctx);
    const item = await ctx.db.get(id);
    if (!item) throw new Error("This service no longer exists.");

    const now = Date.now();
    await ctx.db.patch(id, {
      status: publish ? "published" : "draft",
      publishedAt: publish ? now : undefined,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("servicesContent") },
  handler: async (ctx, { id }) => {
    await requirePublisher(ctx);
    const item = await ctx.db.get(id);
    if (!item) throw new Error("This service no longer exists.");
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { orderedIds: v.array(v.id("servicesContent")) },
  handler: async (ctx, { orderedIds }) => {
    await requirePublisher(ctx);
    const now = Date.now();
    for (let i = 0; i < orderedIds.length; i++) {
      await ctx.db.patch(orderedIds[i], {
        order: i + 1,
        updatedAt: now,
      });
    }
  },
});

export const ensureSeedServices = mutation({
  args: {},
  handler: async (ctx) => {
    await requirePublisher(ctx);
    return await ctx.runMutation(internal.seedCatalog.seedCatalogInternal, {});
  },
});
