# Trinity Web Phase 0 and Phase 1

## Scope

Phase 0 establishes shared web auth/data boundaries and route conventions. Phase 1 delivers the simplified public learning experience: bilingual learning library, article pages, local saved items, and source-limited Opal guidance.

## Design

The web experience reuses Trinity's calm editorial health-learning style: warm off-white surfaces, deep botanical green, generous reading width, rounded cards, and clear bilingual language controls. Public learning is content-first; operational tools remain visually separate under protected routes.

## Structure

- `apps/web/src/app/learn`: public library and article routes.
- `apps/web/src/app/ask-opal`: public educational assistant.
- `apps/web/src/components/education`: reusable cards, filters, article and assistant UI.
- `apps/web/src/lib/education.ts`: shared fallback content shape and local educational matching.
- `apps/web/src/app/ConvexClientProvider.tsx`: Convex/Clerk client boundary.
- `apps/web/src/proxy.ts`: protected portal, staff and admin route groups.

The public routes consume published Convex education content when available and retain a small static fallback so the shell remains useful during local setup. Saved items are local browser state in this phase; persistence will move to a dedicated Convex table during the client-portal phase.
