import { v } from "convex/values";
import { type Auth } from "convex/server";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireRole } from "./auth";

async function requirePublisher(ctx: { auth: Auth }) {
  return await requireRole(ctx, "admin");
}

async function hydrateCoverImageUrl<
  T extends { coverImageStorageId?: string; coverImageUrl?: string },
>(
  ctx: { storage: { getUrl: (id: any) => Promise<string | null> } },
  item: T,
): Promise<T> {
  if (item.coverImageStorageId) {
    const url = await ctx.storage.getUrl(item.coverImageStorageId);
    if (url) {
      return { ...item, coverImageUrl: url };
    }
  }
  return item;
}

const productArgs = {
  slug: v.string(),
  order: v.number(),
  category: v.string(),
  badgeEn: v.string(),
  badgeAm: v.string(),
  titleEn: v.string(),
  titleAm: v.string(),
  subtitleEn: v.string(),
  subtitleAm: v.string(),
  descriptionEn: v.string(),
  descriptionAm: v.string(),
  highlightsEn: v.array(v.string()),
  highlightsAm: v.array(v.string()),
  idealForEn: v.string(),
  idealForAm: v.string(),
  formatEn: v.string(),
  formatAm: v.string(),
  coverImageStorageId: v.optional(v.id("_storage")),
  coverImageUrl: v.optional(v.string()),
  orderUrl: v.string(),
  phoneContact: v.string(),
  inStock: v.boolean(),
};

function validateProduct(args: {
  slug: string;
  category: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
}) {
  if (
    !args.slug.trim() ||
    !args.category.trim() ||
    !args.titleEn.trim() ||
    !args.titleAm.trim() ||
    !args.descriptionEn.trim() ||
    !args.descriptionAm.trim()
  ) {
    throw new Error("Complete required product title, category, and descriptions before saving.");
  }
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requirePublisher(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("productsContent")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(50);
    return await Promise.all(docs.map((doc) => hydrateCoverImageUrl(ctx, doc)));
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requirePublisher(ctx);
    const docs = await ctx.db
      .query("productsContent")
      .withIndex("by_order")
      .take(100);
    return await Promise.all(docs.map((doc) => hydrateCoverImageUrl(ctx, doc)));
  },
});

export const create = mutation({
  args: productArgs,
  handler: async (ctx, args) => {
    const identity = await requirePublisher(ctx);
    validateProduct(args);

    const existing = await ctx.db
      .query("productsContent")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("A product with this identifier already exists.");
    }

    const now = Date.now();
    return await ctx.db.insert("productsContent", {
      ...args,
      status: "draft",
      authorTokenIdentifier: identity.tokenIdentifier,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("productsContent"),
    ...productArgs,
  },
  handler: async (ctx, { id, ...args }) => {
    await requirePublisher(ctx);
    validateProduct(args);

    const item = await ctx.db.get(id);
    if (!item) throw new Error("This product no longer exists.");

    await ctx.db.patch(id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const publish = mutation({
  args: { id: v.id("productsContent"), publish: v.boolean() },
  handler: async (ctx, { id, publish }) => {
    await requirePublisher(ctx);
    const item = await ctx.db.get(id);
    if (!item) throw new Error("This product no longer exists.");

    const now = Date.now();
    await ctx.db.patch(id, {
      status: publish ? "published" : "draft",
      publishedAt: publish ? now : undefined,
      updatedAt: now,
    });
  },
});

export const toggleStock = mutation({
  args: { id: v.id("productsContent"), inStock: v.boolean() },
  handler: async (ctx, { id, inStock }) => {
    await requirePublisher(ctx);
    const item = await ctx.db.get(id);
    if (!item) throw new Error("This product no longer exists.");

    await ctx.db.patch(id, {
      inStock,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("productsContent") },
  handler: async (ctx, { id }) => {
    await requirePublisher(ctx);
    const item = await ctx.db.get(id);
    if (!item) throw new Error("This product no longer exists.");
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { orderedIds: v.array(v.id("productsContent")) },
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

export const ensureSeedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    await requirePublisher(ctx);
    return await ctx.runMutation(internal.seedCatalog.seedCatalogInternal, {});
  },
});
