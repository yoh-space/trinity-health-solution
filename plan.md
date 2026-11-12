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

Refresh the homepage hero to follow the user's supplied Kuri mother-and-child reference. On desktop, reuse `apps/web/public/images/maternal-care-hero.png`, a transparent portrait cutout, as the large focal image over a full-bleed botanical/olive background. For mobile, use the user's supplied mother-and-child photo as a full-bleed background, apply a contrast wash, and hide the desktop portrait to avoid a duplicate image. Store the supplied photo as an optimized WebP in `apps/web/public/images/mother-child-hero-mobile.webp`. Place the bilingual value proposition and existing calls to action over the image and preserve existing destinations.

Remove the `Pillar 1: Healthcare Access for Women & Girls` focus label, the floating hero badge cards, the Community Health Grounded sparkle callout, decorative rings/orbs, and repeated chip-like hero labels. Keep only text wrappers needed for headline emphasis and action labels; present useful trust information as a restrained line rather than a collection of badge tags.

On the homepage, the marketing header overlays the hero at initial scroll position and remains sticky. On scroll it transitions to a nearly opaque, blurred surface with a subtle boundary/shadow. Keep the established solid header appearance on internal marketing routes. Maintain readable contrast and adapt the composition for narrow screens and both supported languages.

### Design

Use an editorial maternal-health direction: deep botanical/olive field, warm restrained undertones, white/cream copy, a large serif-led headline, spacious left-aligned text, and maternal imagery as the visual anchor. Use the supplied photo as the mobile background with enough contrast for copy legibility while retaining the existing portrait-on-gradient composition for desktop. Avoid decorative circles, floating mini-cards, sparkles, and pill/tag clusters. Interactions remain understated and preserve existing links and language switching.

### Project structure

- `apps/web/src/components/marketing/MarketingHero.tsx`: homepage hero composition, copy, existing portrait, and cleanup of decorative hero labels.
- `apps/web/src/components/marketing/MarketingHeader.tsx`: homepage top/scroll states while preserving internal-route styling.
- `apps/web/src/app/page.tsx`: homepage-only header/hero overlap layout.
- `apps/web/src/app/globals.css`: unchanged unless a small shared style is required by the implemented responsive composition.


### Responsive hero imagery follow-up (2026-11-11)

The desktop homepage hero uses the latest supplied mother-and-child photograph as a cover background on the right portion of the section, with a botanical left-to-right gradient to preserve text contrast. The former desktop portrait cutout is removed. Mobile retains the earlier supplied photo as its own full-section background with a stronger contrast wash. Both uploaded photos are stored as optimized WebP assets in `apps/web/public/images/`.


## Project-wide icon refinement (2026-11-12)

Replace decorative sparkle glyphs across the web and native apps with established, feature-specific interface icons while preserving routes, copy, and behavior. Use conversation icons for Opal/help actions, food-related icons for meal and pantry features, book icons for lessons, and a verification/health icon for the curated-products label. In the service admin catalog, make a conversation icon the selectable choice for the Opal assistant. Keep a compatibility alias for previously saved service rows whose icon value is still `Sparkles`, but render that value with the new conversation icon; do not render a sparkle glyph anywhere in the UI.


## Admin navigation and public badge cleanup (2026-11-12)

Constrain the admin sidebar between its fixed branding header and account footer and make the navigation group area independently vertically scrollable with `min-h-0`, `flex-1`, and `overflow-y-auto`; apply the same sizing to the mobile drawer. On customer-facing marketing pages, remove credential-style eyebrow/badge labels such as the certified services and verified products labels, plus similarly styled verification/curation claims. Preserve substantive service and product descriptions, education-source provenance, and operational client-account verification copy.


## Website office-location correction (2026-11-12)

Use one public office address throughout the website: Bahir Dar, Ethiopia — Papyrus Building, 9th Floor (with an Amharic equivalent in the bilingual contact section). Replace city-specific Addis Ababa references in the contact details, services coverage, delivery copy, and diaspora sponsorship copy with Bahir Dar while preserving existing regional coverage. No separate map service or location integration was found in the website source.
