import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Retained while the starter note routes are phased out of existing clients.
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
  educationContent: defineTable({
    authorTokenIdentifier: v.string(),
    title: v.string(),
    titleAm: v.string(),
    summary: v.string(),
    summaryAm: v.string(),
    content: v.string(),
    contentAm: v.string(),
    category: v.string(),
    readMinutes: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_authorTokenIdentifier", ["authorTokenIdentifier"]),
});
