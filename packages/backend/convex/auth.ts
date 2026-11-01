import type { Auth } from "convex/server";
import type { QueryCtx } from "./_generated/server";

type AuthenticatedContext = { auth: Auth };
type StaffDatabaseContext = { auth: Auth; db: QueryCtx["db"] };
export type StaffRole = "counselor" | "clinician" | "admin";

export const ADMIN_EMAILS = new Set([
  "yohansdam@gmail.com",
]);

export function isDesignatedAdminEmail(email?: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase().trim());
}

export function getEffectiveRole(identity: {
  email?: string;
  role?: string;
}): StaffRole | undefined {
  if (isDesignatedAdminEmail(identity.email)) {
    return "admin";
  }
  if (
    identity.role === "admin" ||
    identity.role === "clinician" ||
    identity.role === "counselor"
  ) {
    return identity.role as StaffRole;
  }
  return undefined;
}

export const requireIdentity = async (ctx: AuthenticatedContext) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Authentication required.");
  return identity;
};

export const getIdentityForRole = async (
  ctx: AuthenticatedContext,
  role: StaffRole,
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const effectiveRole = getEffectiveRole(identity);
  if (effectiveRole !== role) return null;
  return { ...identity, role: effectiveRole };
};

export const requireRole = async (
  ctx: AuthenticatedContext,
  role: StaffRole,
) => {
  const identity = await requireIdentity(ctx);
  const effectiveRole = getEffectiveRole(identity);
  if (effectiveRole !== role) {
    throw new Error(`${role} access required.`);
  }
  return { ...identity, role: effectiveRole };
};

export const requireAdmin = async (ctx: AuthenticatedContext) =>
  await requireRole(ctx, "admin");

export const getActiveStaffIdentity = async (
  ctx: StaffDatabaseContext,
  role: StaffRole,
) => {
  const identity = await getIdentityForRole(ctx, role);
  if (!identity) return null;

  if (role === "admin" && isDesignatedAdminEmail(identity.email)) {
    return identity;
  }

  const profile = await ctx.db
    .query("staffProfiles")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  return profile?.active && profile.role === role ? identity : null;
};

export const requireActiveStaff = async (
  ctx: StaffDatabaseContext,
  role: StaffRole,
) => {
  const identity = await requireRole(ctx, role);

  if (role === "admin" && isDesignatedAdminEmail(identity.email)) {
    return identity;
  }

  const profile = await ctx.db
    .query("staffProfiles")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (!profile || !profile.active || profile.role !== role) {
    throw new Error("An active staff directory profile is required.");
  }

  return identity;
};
