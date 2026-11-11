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


## Approved homepage hero refresh (2026-11-11)

### Scope and implementation

Refresh the homepage hero to follow the user's supplied Kuri mother-and-child reference. Reuse `apps/web/public/images/maternal-care-hero.png`, a transparent portrait cutout, as the large focal image over a full-bleed botanical/olive background with a restrained contrast wash. Place the bilingual value proposition and existing calls to action on the left with an editorial serif headline, preserving responsive behavior and existing destinations. No new image asset or dependency is needed.

Remove the `Pillar 1: Healthcare Access for Women & Girls` focus label, the floating hero badge cards, the Community Health Grounded sparkle callout, decorative rings/orbs, and repeated chip-like hero labels. Keep only text wrappers needed for headline emphasis and action labels; present useful trust information as a restrained line rather than a collection of badge tags.

On the homepage, the marketing header overlays the hero at initial scroll position and remains sticky. On scroll it transitions to a nearly opaque, blurred surface with a subtle boundary/shadow. Keep the established solid header appearance on internal marketing routes. Maintain readable contrast and adapt the composition for narrow screens and both supported languages.

### Design

Use an editorial maternal-health direction: deep botanical/olive field, warm restrained undertones, white/cream copy, a large serif-led headline, spacious left-aligned text, and the existing mother-and-child portrait as the visual anchor. Avoid decorative circles, floating mini-cards, sparkles, and pill/tag clusters. Interactions remain understated and preserve existing links and language switching.

### Project structure

- `apps/web/src/components/marketing/MarketingHero.tsx`: homepage hero composition, copy, existing portrait, and cleanup of decorative hero labels.
- `apps/web/src/components/marketing/MarketingHeader.tsx`: homepage top/scroll states while preserving internal-route styling.
- `apps/web/src/app/page.tsx`: homepage-only header/hero overlap layout.
- `apps/web/src/app/globals.css`: unchanged unless a small shared style is required by the implemented responsive composition.
