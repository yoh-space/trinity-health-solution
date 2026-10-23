# Trinity Health Solution — P0–P1 Implementation Plan

**Status:** Proposed implementation sequence  
**Scope:** P0 trust, safety and production boundary work followed by P1 durable product foundations  
**Repository:** `yoh-space/trinity-health-solution`  
**Primary stack:** Expo/React Native, Next.js, Clerk, Convex, TypeScript

## 1. Outcome

Turn the current bilingual health-education prototype into a trustworthy, offline-capable learning product with an explicit boundary between education and clinical care. The P0 work prevents unsafe or misleading behavior. The P1 work makes the core experience durable, governable and ready for a limited pilot.

At the end of this plan, a user should be able to:

1. Explore reviewed Amharic/English health-learning content without being misled into thinking that the app is diagnosing or treating them.
2. Save lessons and preferences reliably on the device and, when authenticated and online, synchronize them safely.
3. Ask Opal questions that are answered only from approved content, with a visible source and safe refusal for unsupported clinical questions.
4. See the consultation pathway clearly labelled as either a real, status-tracked request or a non-functional prototype; no ambiguous “submitted” state is allowed.
5. Trust that sensitive data is minimized, consented, access-controlled, auditable and not sent to an AI provider without explicit approval.
6. Allow authorized publishers and clinical reviewers to create, review, approve, publish, version and retire content.

## 2. Current baseline and constraints

The repository currently contains:

- A native Expo app with Amharic/English welcome, onboarding, learning, saved-content, food-ideas, Opal and care screens.
- A Next.js marketing site and authenticated publisher area.
- Convex tables for `notes` and `educationContent`.
- Clerk authentication and a publisher allowlist based on `ADMIN_CLERK_USER_IDS`.
- A keyword-based Opal prototype that retrieves prepared lesson text.
- A generic notes feature with optional OpenAI summarization.
- Local-only onboarding answers in SecureStore and in-memory Zustand state for language and saved lesson IDs.

The product must not claim clinical effectiveness, diagnosis, individualized treatment, verified appointment fulfillment or emergency coverage until qualified clinical partners, approved protocols and operational capacity are in place.

## 3. Scope boundaries

### Included

- Safety and trust boundary for education, Opal, notes and consultation UI.
- Privacy, consent, retention, deletion and AI-processing controls.
- Versioned content governance and publisher/reviewer roles.
- Durable user preferences, saved content and lesson progress.
- Offline content cache and reliable synchronization foundations.
- Input validation, safe errors, pagination, audit events, observability and automated checks.
- Structured extension points for later providers, referrals, messaging and care plans.

### Explicitly deferred

- Diagnosis, clinical scoring and individualized treatment.
- Automated emergency triage beyond a reviewed, static safety notice.
- Real telehealth, payments, prescriptions or appointment fulfillment unless an operational provider workflow is approved separately.
- Mental-health, SRH or GBV sensitive workflows before specialist safeguarding review.
- SMS and health-extension-worker workflows.
- Unreviewed generative medical advice.

## 4. Delivery sequence

### Phase 0A — Product boundary and risk controls

**Goal:** Remove ambiguity and prevent unsafe interpretation before adding more capability.

#### 0A.1 Care pathway boundary

**Files/components:**

- `apps/native/src/screens/CareRequestScreen.tsx`
- `apps/native/src/app/(app)/(tabs)/care.tsx`
- care-related copy and navigation components

**Implementation:**

- Decide whether consultation is a real operational request or a prototype-only flow.
- For the current release, use prototype-only mode unless provider operations are confirmed.
- Label the flow at entry, before submission and on the result screen.
- Replace any wording that suggests a request was sent or an appointment was booked.
- If a request is persisted later, use explicit statuses: `requested`, `confirmed`, `completed`, `cancelled`.
- Do not show a professional, provider or appointment time until a verified backend event exists.

**Acceptance criteria:**

- A user can distinguish “preview” from “request sent” without reading fine print.
- No UI displays a confirmed or completed appointment from a local action.
- Every care CTA has loading, error, offline and unavailable states.

#### 0A.2 Opal safety boundary

**Files/components:**

- `apps/native/src/screens/OpalScreen.tsx`
- `apps/native/src/components/public/educationContent.ts`
- future shared rules module under `apps/native/src/lib/opal/`

**Implementation:**

- Define supported intents: education lookup, food-safety education, meal-idea navigation, pregnancy general education, child-feeding education and unsupported clinical question.
- Keep retrieval bounded to published/approved content.
- Add visible source title, content version and “general education, not medical advice” copy to each answer.
- Add deterministic refusal for diagnosis, treatment, dosage, symptom interpretation and emergency questions.
- Provide a safe next step: open a related lesson or contact an appropriate qualified service when one is verified.
- Keep keyword matching as the first safe implementation; do not introduce open-ended generation in this phase.

**Acceptance criteria:**

- Every supported answer links to its source lesson.
- Unsupported clinical questions never receive an improvised answer.
- An unavailable content source produces an uncertainty state rather than a fabricated response.

#### 0A.3 Starter notes decision

**Files/components:**

- `apps/native/src/app/(app)/(tabs)/`
- `apps/native/src/screens/NotesDashboardScreen.tsx`
- `apps/web/src/components/notes/`
- `packages/backend/convex/notes.ts`

**Implementation:**

- Remove generic notes from primary health navigation, or rename/reframe it as a private “learning journal”.
- If retained, add a clear warning that users must not enter identifiable or sensitive health information.
- Disable AI summarization by default until privacy and processing controls are complete.
- Ensure all demo-only features are visibly marked as prototype features.

**Acceptance criteria:**

- The first-time user cannot mistake generic notes for a clinical record.
- The core health-learning journey does not depend on notes.

### Phase 0B — Privacy, security and data lifecycle

**Goal:** Establish safe handling before storing more profile or care information.

#### 0B.1 Data classification and consent

**New documentation:**

- `docs/privacy/data-classification.md`
- `docs/privacy/consent-and-retention.md`
- `docs/security/threat-model.md`

**Implementation:**

- Classify data as public content, account data, preferences, private journal data and sensitive health data.
- Define purpose, collection minimum, access role, retention period, deletion behavior and export behavior for each class.
- Add an in-app consent record with consent version and timestamp for personalization and any AI processing.
- Make optional personalization and AI processing independently declinable.
- Add a “clear this device” action and an account deletion path for synced records.

**Acceptance criteria:**

- Users see what is stored, where it is stored and why before opting in.
- Declining optional data collection does not block public learning.
- Deletion behavior is documented and testable.

#### 0B.2 AI processing controls

**Files/components:**

- `packages/backend/convex/openai.ts`
- `packages/backend/convex/notes.ts`
- notes UI in native and web

**Implementation:**

- Remove the public `openaiKeySet` side-channel; expose capability only where required.
- Add explicit `aiProcessingConsent` and `summaryStatus` fields.
- Add maximum input lengths and reject or sanitize content that is not suitable for external processing.
- Do not send content to OpenAI unless the user has opted in.
- Store provider, model, request status, failure code and timestamps, but avoid storing raw prompts in logs.
- Return safe user-facing error messages; never persist dashboard URLs or internal configuration errors as summaries.
- Add retry limits and a terminal failed state.

**Acceptance criteria:**

- No note content reaches OpenAI without explicit consent.
- A failed summary is shown as failed/pending, never as a misleading text summary.
- Internal error details are absent from user-facing messages.

#### 0B.3 Backend authorization and abuse controls

**Implementation:**

- Add server-side maximum lengths to all mutations.
- Add consistent authorization helpers for user-owned data, publishers, clinical reviewers and administrators.
- Add rate limits or bounded request behavior for notes, education mutations and future Opal endpoints.
- Add safe structured logging without sensitive content.

**Acceptance criteria:**

- Ownership is enforced on every read, mutation and deletion.
- Oversized or malformed requests are rejected server-side.
- Unauthorized publisher actions fail consistently.

### Phase 0C — Clinical content governance

**Goal:** Make every published health lesson traceable, reviewable and reversible.

#### 0C.1 Schema and lifecycle

**Files:**

- `packages/backend/convex/schema.ts`
- `packages/backend/convex/education.ts`

**Implementation:**

Extend `educationContent` with:

```text
sourceName
sourceUrl
reviewStatus
reviewedBy
reviewedAt
reviewNotes
version
effectiveDate
expiryDate
retiredAt
lastEditedBy
```

Use a lifecycle such as:

```text
draft → clinical_review → approved → published → retired
```

Only `approved` content may be published. Retiring content must preserve its history and must not delete the audit trail.

#### 0C.2 Publisher and reviewer roles

**Implementation:**

- Replace the long-term dependency on `ADMIN_CLERK_USER_IDS` with a server-side staff/role model or Clerk organization roles.
- Separate publisher, clinical reviewer, administrator and read-only auditor permissions.
- Enforce permissions inside Convex, not only in the web route middleware.

#### 0C.3 Admin experience

**Files:**

- `apps/web/src/app/admin/AdminManager.tsx`

**Implementation:**

- Add edit existing draft/content support.
- Add preview in both English and Amharic.
- Add review checklist, source fields, version history and publish/retire confirmation.
- Show who changed and approved each version.
- Add audit-event history to each content item.

**Acceptance criteria:**

- An unreviewed item cannot be published.
- A published item can be retired without destroying history.
- The mobile app receives only approved, published content.
- A reviewer can identify the source and effective version of every lesson.

### Phase 1A — Durable user state and offline foundation

**Goal:** Make the core value usable across app restarts and intermittent connectivity.

#### 1A.1 User profile and preferences

**Files:**

- `packages/backend/convex/schema.ts`
- new `packages/backend/convex/profiles.ts`
- `apps/native/src/screens/OnboardingScreen.tsx`
- `apps/native/src/store/useTrinityStore.ts`

**Implementation:**

Add tables for:

```text
userProfiles
userPreferences
consentRecords
```

Persist only the minimum required profile data:

```text
userId
language
careStage
consentVersion
consentedAt
updatedAt
```

Use a repository interface so local and remote storage are interchangeable. Version local SecureStore data and migrate it safely.

#### 1A.2 Saved content and progress

**Implementation:**

Add tables or a unified state model for:

```text
savedContent
lessonProgress
mealIdeas
```

Track content version with saved records so a retired or updated lesson can be handled gracefully.

**Acceptance criteria:**

- Language and saved content survive app restart.
- The user can clear local data without leaving stale UI state.
- Authenticated users can restore preferences on a second device when online.
- Offline changes queue for synchronization rather than disappearing.

#### 1A.3 Offline cache and sync

**Implementation:**

- Cache approved education content locally with version and fetched-at metadata.
- Show cached content when Convex is unavailable.
- Queue saved/progress mutations locally.
- Use idempotency keys for sync operations.
- Retry transient failures with exponential backoff.
- Expose `local-only`, `queued`, `synced` and `failed` states in developer diagnostics.

**Acceptance criteria:**

- The learning library and previously cached lessons open without internet.
- A saved lesson made offline remains saved after restarting the app.
- Reconnecting does not create duplicate saved/progress records.
- Stale content is labelled and refreshed safely.

### Phase 1B — Safer Opal and structured meal guidance

**Goal:** Increase usefulness without expanding into unreviewed clinical advice.

#### 1B.1 Structured Opal retrieval

**Implementation:**

- Move question matching and response assembly into a testable rules module.
- Add intent and source metadata to every response.
- Add “Why this answer?” and “Read the source lesson” actions.
- Add explicit unsupported and urgent-concern responses.
- Add bilingual test fixtures for core Amharic and English questions.

#### 1B.2 Meal idea rules

**Files/components:**

- `apps/native/src/screens/FoodIdeasScreen.tsx`
- new `apps/native/src/lib/meals/`
- future backend content tables if recipes become managed content

**Implementation:**

- Normalize ingredients into known IDs and local aliases.
- Require meal context and allergy selection before generating a result.
- Store bundled recipes with review status, serving guidance, substitutions and safety notes.
- Add child texture and choking-risk warnings where relevant.
- Avoid nutrient numbers unless a validated dataset and quantities are available.
- Never describe food as treatment or a substitute for prescribed therapeutic care.

**Acceptance criteria:**

- Allergy selections exclude unsafe recipes.
- Missing ingredients produce safe substitutions or a no-match state.
- Recipes display preparation and storage safety guidance.
- No recipe makes a disease-treatment claim.

### Phase 1C — Product reliability and pilot readiness

**Goal:** Create evidence that the MVP behaves predictably before a limited pilot.

#### 1C.1 Observability

Add structured events and monitoring for:

- Convex query/mutation failures
- Offline sync failures
- Opal unsupported-question rate
- AI summary failures, if summaries remain enabled
- Education publication events
- Care prototype interactions
- App version and content version

Do not include sensitive user text in analytics payloads.

#### 1C.2 Error and loading states

Standardize native and web states for:

```text
loading
empty
offline
stale
retrying
failed
permission_denied
unsupported
```

Replace raw `String(error)` rendering with safe error categories and internal diagnostic IDs.

#### 1C.3 Pagination and indexes

Add pagination for education, notes and future staff lists. Add indexes for status/category/publication date and user/updated date. Avoid fixed `.take(50)`/`.take(100)` limits for growing collections.

#### 1C.4 Automated tests and CI

Add:

- Convex authorization and lifecycle tests
- Opal matching/refusal tests
- Meal allergy and substitution tests
- Localization fallback tests
- Offline persistence and sync tests
- Native and web smoke tests
- Accessibility checks for core screens

CI should run:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build
```

## 5. Suggested implementation order

1. Lock the care boundary and add prototype labels.
2. Disable or gate generic notes and pause AI summaries by default.
3. Add privacy/consent/data-lifecycle documentation and UI.
4. Add server-side validation and safe errors.
5. Extend education schema with review, source and version metadata.
6. Implement reviewer/publisher authorization and audit events.
7. Upgrade the admin content workflow.
8. Add durable local preferences, saved items and progress.
9. Add approved-content offline cache and synchronization.
10. Refactor Opal into tested intent/rules modules.
11. Harden meal-idea safety and allergy handling.
12. Add observability, pagination, automated tests and CI.
13. Run a limited usability and clinical-content review before enabling any real care workflow.

## 6. Definition of P0 completion

P0 is complete only when:

- The app cannot imply that a consultation was sent, confirmed or completed when it was not.
- Opal cannot produce unsupported diagnosis, treatment or emergency advice.
- AI processing is opt-in, bounded and safe, or disabled.
- Sensitive data handling, deletion, retention and access rules are documented.
- Education content has a review state, source metadata and publication audit trail.
- Publisher permissions are enforced in Convex.
- All prototype-only flows are visibly labelled.

## 7. Definition of P1 completion

P1 is complete only when:

- Saved content, language and approved preferences persist after restart.
- Cached learning content works offline.
- Offline changes synchronize safely without duplicates.
- Content versions and retired content are handled predictably.
- Opal responses expose their approved source and safe refusal behavior.
- Meal ideas respect allergies and safety constraints.
- Core backend and product flows have automated checks.
- Errors, sync failures and publication events are observable without logging sensitive content.

## 8. Pilot metrics

Use aggregated or de-identified metrics only:

- Percentage of users who complete the first lesson
- Lesson save rate
- Offline lesson open rate
- Offline sync success rate
- Unsupported Opal question rate
- “Was this helpful?” score
- Meal idea completion/save rate
- Percentage of published lessons with current clinical review
- Number of privacy or safety incidents
- Time from content draft to approved publication

These metrics measure product usability and operational readiness. They must not be presented as evidence of clinical effectiveness without an appropriate evaluation design.

## 9. Risks and decisions requiring owner sign-off

Before production or real care operations, the product owner and qualified reviewers must approve:

- Whether any health profile data will be collected.
- Whether OpenAI processing is permitted for any user-entered content.
- The supported countries, providers and referral pathways.
- The clinical review and content expiry process.
- Emergency and safeguarding language for the supported context.
- Applicable data protection, child safeguarding, telehealth and health-information requirements.
- Whether the consultation flow is a real service or remains a prototype.

Until these decisions are approved, keep the application in education/prototype mode and make that boundary visible in the UI.
