# Local development education seed

This seed initializes the existing `educationContent` collection with the five bilingual native starter lessons: `food-safety`, `pregnancy`, `child-nutrition`, `breastfeeding`, and `safe-water`. The native fallback is used as the canonical seed source because it contains the fuller section structure and takeaways. The web fallback's known alternate title pairs are included only for safe legacy-record matching.

New records are inserted as **drafts** with a seed-owned author marker so a publisher can review them before publishing. The mutation is idempotent by `contentKey`. If it finds one legacy record with an exact known title pair and category, it only attaches the stable `contentKey` and category key; it does not replace its current copy, author, or publication status. Ambiguous duplicates or unexpectedly large category sets abort the whole mutation rather than guessing. Repeat runs update only records still owned by this seed and preserve their status.

## Run against a development deployment

From the repository root, after the Convex project is linked and its local development configuration is present:

```sh
pnpm --filter @packages/backend run seed:education:dev
```

The runner reads `CONVEX_DEPLOYMENT` from the environment or `packages/backend/.env.local`, refuses targets that do not start with `dev:`, then pushes the backend schema/function changes and invokes `seed:seedEducation` on that explicit dev deployment. It never accepts a production or local-only target. Review the deployment name printed by the script before proceeding. The invoking machine must be authenticated with the Convex CLI.

## Scope and follow-up

This command seeds education articles only. It does not seed onboarding options, Opal prompt presets, food catalogs, marketing copy, staff/appointment demos, user profiles, notes, or chat data. Those require separate, typed content models and editorial/access decisions.

The app still contains its bundled fallback articles and has not yet been switched to use `contentKey` for all native routes/bookmarks. New seed records are drafts and will not appear in the public `listPublished` query until a publisher approves them. Seeding alone therefore does not complete the planned app-reader migration; that should be implemented and tested separately before retiring bundled fallbacks.
