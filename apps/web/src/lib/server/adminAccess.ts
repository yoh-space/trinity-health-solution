import "server-only";

const configuredAdminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_EMAILS = new Set(
  configuredAdminEmails.length > 0
    ? configuredAdminEmails
    : ["yohansdam@gmail.com", "yashaknike@gmail.com"],
);

export function isConfiguredAdminEmail(email?: string) {
  return Boolean(email && ADMIN_EMAILS.has(email.trim().toLowerCase()));
}
