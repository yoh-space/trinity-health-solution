import { type AuthConfig } from "convex/server";

const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

const issuerDomains = Array.from(
  new Set(
    [
      clerkJwtIssuerDomain,
      "https://clerk.trinityhealthsolution.com.et",
      "https://trinity-health-solution.vercel.app/__clerk",
      "https://enabled-stag-589.clerk.accounts.dev",
      "https://promoted-raven-5308.clerk.accounts.dev",
    ].filter(Boolean) as string[],
  ),
);

export default {
  providers: issuerDomains.map((domain) => ({
    domain,
    applicationID: "convex",
  })),
} satisfies AuthConfig;
