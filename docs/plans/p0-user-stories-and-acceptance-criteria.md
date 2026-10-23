# Trinity Health Solution — P0 User Stories and Acceptance Criteria

**Status:** Ready for implementation  
**Branch:** `docs/p0-user-stories-acceptance-criteria`  
**Related plan:** [`p0-p1-implementation-plan.md`](./p0-p1-implementation-plan.md)

## Purpose

These stories define the P0 trust, safety, privacy and governance work required before Trinity Health Solution is presented as more than an education prototype. The criteria are intentionally behavior-focused so they can be converted into automated tests, manual review scripts and release gates.

P0 is complete only when the app cannot imply that unverified care has occurred, cannot provide unsupported clinical guidance, does not process sensitive user content without appropriate consent, and publishes health content through a reviewable and auditable workflow.

## Personas and roles

- **Guest learner:** Can browse public learning content without an account.
- **Authenticated learner:** Can use optional personalization and private learning features.
- **Publisher:** Can create and edit draft education content.
- **Clinical reviewer:** Can review health content and record approval or required changes.
- **Administrator:** Can manage roles, publication and audit access.
- **Auditor:** Can inspect relevant audit history without changing content.
- **Support operator:** Can see operational statuses but cannot view content outside their permission.

## Release gates

The following are release-blocking P0 gates:

1. The consultation screen clearly distinguishes a prototype preview from a real request.
2. Opal refuses unsupported diagnosis, treatment, dosage and emergency questions.
3. AI processing of user-entered content is opt-in, bounded and auditable, or disabled.
4. Public learning remains available when optional personalization is declined.
5. Sensitive data access is role-restricted and security-relevant actions are audited.
6. Unreviewed health content cannot be published.
7. Users can understand and act on privacy, retention and deletion controls.
8. Server-side validation and safe error handling are present on all P0 mutations.

---

## Epic P0-01: Care boundary and prototype integrity

### US-P0-01 — Understand whether care is real or simulated

**As a guest learner,** I want the consultation area to clearly tell me whether it is a prototype or a real service, **so that** I do not believe that an appointment or request has been submitted when it has not.

**Acceptance criteria**

- **Given** the consultation flow is not connected to an operational provider workflow, **when** I open the care screen, **then** I see a prominent prototype label before any form or action.
- **Given** I am viewing the prototype consultation flow, **when** I read the explanatory copy, **then** it states that no request is sent, no appointment is booked and no professional has reviewed the information.
- **Given** I complete the prototype flow, **when** the result is shown, **then** the result is labelled `Preview only` or equivalent and never `Requested`, `Confirmed` or `Completed`.
- **Given** I am offline, **when** I open the care screen, **then** the app does not imply that an external request can be delivered.
- **Given** a future real workflow is enabled, **when** a request is created, **then** the status is `requested` until a verified backend event changes it.

### US-P0-02 — Avoid false care status

**As an authenticated learner,** I want care status to reflect verified events only, **so that** I can distinguish a local draft from a real provider response.

**Acceptance criteria**

- **Given** no provider has accepted a request, **then** the UI cannot display `confirmed` or `completed`.
- **Given** a request is saved locally but not synchronized, **then** it is labelled `Not sent` or `Queued`, not `Requested`.
- **Given** a synchronization attempt fails, **then** the user sees a safe retry state and the request remains unconfirmed.
- **Given** a status is changed, **then** the backend records the actor, timestamp and source event.

### US-P0-03 — Keep care actions safe and bounded

**As a product owner,** I want the care flow to avoid collecting unnecessary sensitive information, **so that** the prototype does not create an ungoverned clinical record.

**Acceptance criteria**

- The prototype consultation flow collects only the minimum non-sensitive fields needed to demonstrate the interaction.
- The form does not request a diagnosis, medication list, detailed symptoms, identity document, phone number or emergency disclosure.
- The screen tells the user not to enter sensitive health information in a prototype form.
- The app provides a clear route back to general learning without requiring submission.

---

## Epic P0-02: Safe educational assistant

### US-P0-04 — Receive a source-backed educational answer

**As a learner,** I want Opal to answer supported questions using approved learning content, **so that** I can understand where the information came from.

**Acceptance criteria**

- **Given** my question matches a supported education intent, **when** Opal answers, **then** the response comes from an approved published lesson.
- **Then** the response displays the source lesson title and content version or review date where available.
- **Then** the response includes clear general-education language and does not present itself as a diagnosis or treatment plan.
- **Then** I can open the source lesson from the answer.
- **Then** the answer is available in the selected language when an approved translation exists; otherwise the app communicates that the translation is unavailable.

### US-P0-05 — Refuse unsupported clinical questions

**As a learner,** I want Opal to explain when it cannot safely answer, **so that** I am not given invented medical guidance.

**Acceptance criteria**

- **Given** I ask for a diagnosis, **then** Opal refuses diagnosis and explains that it provides general learning only.
- **Given** I ask for medication dosage, treatment changes or a therapeutic diet, **then** Opal refuses and recommends speaking with a qualified professional.
- **Given** I describe a possible urgent or emergency symptom, **then** Opal does not continue with ordinary nutrition advice and shows the approved safety message for the supported context.
- **Given** the question is outside the approved content set, **then** Opal says that it does not have a reviewed answer rather than guessing.
- **Then** no refusal response exposes internal prompts, matching scores, stack traces or configuration values.

### US-P0-06 — Explain uncertainty and matching

**As a learner,** I want to know why an answer was suggested, **so that** I can judge its relevance.

**Acceptance criteria**

- Supported responses identify the matched topic or intent in plain language.
- A low-confidence or ambiguous match asks me to choose a topic or opens the learning library instead of selecting an arbitrary answer.
- The UI provides a `Why this answer?` or equivalent explanation that identifies the source lesson.
- If the source lesson is unavailable or unpublished, Opal shows an uncertainty state and does not answer from stale hidden content.

### US-P0-07 — Protect against accidental sensitive disclosure to Opal

**As a learner,** I want a reminder not to enter personal or sensitive health information, **so that** I understand the limits of the prototype.

**Acceptance criteria**

- The Opal entry screen displays the privacy reminder before the first question.
- The reminder is available in Amharic and English.
- The app does not claim that messages are confidential clinical records.
- If the user attempts to enter a clearly unsupported sensitive request, the app responds with a safe boundary message and does not store the conversation as a health record.

---

## Epic P0-03: Notes and AI processing boundary

### US-P0-08 — Understand the learning-journal boundary

**As a learner,** I want to know whether notes are a private journal or a clinical record, **so that** I do not store sensitive medical information in the wrong place.

**Acceptance criteria**

- The notes feature is removed from the primary health-care navigation or renamed to `Learning journal`.
- Before creating the first note, the user sees a warning not to enter names, diagnoses, medication details, contact information or other sensitive health information.
- The notes feature does not claim to provide clinical record-keeping, professional review or continuity of care.
- If the product owner disables notes, the health-learning journey remains fully usable.

### US-P0-09 — Consent before AI summarization

**As a learner,** I want to explicitly approve AI summarization, **so that** my note content is not sent to an external AI provider unexpectedly.

**Acceptance criteria**

- AI summarization is off by default.
- The user must actively opt in before content is sent for summarization.
- The consent copy names the purpose of processing and explains that the content is sent to an external AI service when enabled.
- Declining consent still allows the user to save the note locally or through the normal private-note path, subject to the product's privacy policy.
- The consent version and timestamp are recorded without storing the note content in analytics.

### US-P0-10 — See safe AI processing status

**As a learner,** I want to know whether a summary is pending, complete or failed, **so that** I do not mistake a missing result for a completed review.

**Acceptance criteria**

- A requested summary starts in `pending` state.
- A successful response changes the state to `completed` and displays the summary.
- A provider, timeout or configuration failure changes the state to `failed` with a safe retry message.
- The UI never displays a dashboard URL, API key error, stack trace or raw provider error.
- Failed jobs do not retry indefinitely and do not create duplicate summaries.
- The app does not describe an AI summary as clinician-reviewed.

### US-P0-11 — Limit and protect AI input

**As a product owner,** I want AI input bounded and validated, **so that** the feature cannot be abused or used as an ungoverned clinical channel.

**Acceptance criteria**

- Backend mutations enforce maximum lengths for note titles and bodies.
- Empty or malformed requests are rejected server-side.
- Requests that match configured sensitive-data patterns are blocked or require an explicit safe-handling path.
- Raw note content is not written to application logs, analytics events or error messages.
- AI output is bounded by a configured maximum length.
- Provider and model identifiers are recorded for audit without exposing secrets.

---

## Epic P0-04: Privacy, consent and data lifecycle

### US-P0-12 — Understand what data is collected

**As a learner,** I want a plain-language explanation of what Trinity stores and why, **so that** I can make an informed choice.

**Acceptance criteria**

- The app explains the difference between public learning, local preferences, private journal data and sensitive health data.
- Optional personalization is clearly identified as optional.
- The user can continue to public learning without providing a profile.
- The consent notice is available in Amharic and English.
- The current consent version and acceptance timestamp are recorded for optional data collection.

### US-P0-13 — Decline optional personalization

**As a guest learner,** I want to decline personalization, **so that** I can still access useful learning without sharing additional information.

**Acceptance criteria**

- The user can skip onboarding without entering a name, phone number, diagnosis or detailed health history.
- Declining personalization does not block the public learning library.
- The home screen does not repeatedly pressure the user to provide optional data.
- No optional profile fields are silently populated from guessed or inferred health information.

### US-P0-14 — Clear local prototype data

**As a learner,** I want to clear data stored on my device, **so that** I can remove preferences and saved content from a shared device.

**Acceptance criteria**

- Settings includes a clearly labelled `Clear this device's prototype data` action.
- The app explains what will be cleared before confirmation.
- The action requires confirmation and cannot be triggered accidentally.
- After clearing, the app removes local language preference, onboarding answers, saved items and local learning state.
- The app does not claim that local clearing deletes server-side data unless it actually does.

### US-P0-15 — Delete or export synced private data

**As an authenticated learner,** I want to request deletion or export of my private data, **so that** I can exercise control over information stored by the service.

**Acceptance criteria**

- The product documents what account-linked data can be exported and deleted.
- A deletion request has a visible status and does not silently fail.
- Deleting a user removes or anonymizes owned private records according to the documented retention policy.
- Deletion does not remove public education content or shared audit evidence that must be retained, but it does remove direct personal linkage where required.
- The user receives a safe confirmation without exposing internal identifiers.

### US-P0-16 — Restrict sensitive data access

**As an administrator,** I want role-based access to private and sensitive records, **so that** staff see only what they need for their role.

**Acceptance criteria**

- Every backend query and mutation that accesses private data checks the authenticated identity and role.
- A user cannot read another user's notes, preferences or private requests by changing an ID in a client request.
- Publishers cannot access private learner data unless a separate permission explicitly grants it.
- Auditors can inspect audit events without editing content or reading unnecessary user content.
- Unauthorized access attempts return a generic permission error and create a security event without logging sensitive payloads.

---

## Epic P0-05: Validation, authorization and operational safety

### US-P0-17 — Validate all P0 inputs server-side

**As a product owner,** I want the backend to reject invalid or oversized inputs, **so that** client-side controls cannot be bypassed.

**Acceptance criteria**

- Education mutations validate required fields, maximum lengths, supported categories and valid read-time ranges.
- Note mutations validate required fields and maximum lengths.
- Future care mutations validate allowed status transitions and required fields.
- Invalid requests do not partially write data.
- Validation errors are safe, localized where appropriate and do not contain stack traces or secrets.

### US-P0-18 — Enforce publisher and reviewer roles

**As a clinical reviewer,** I want only authorized roles to approve health content, **so that** publication reflects accountable review.

**Acceptance criteria**

- A publisher can create and edit drafts but cannot approve content unless granted reviewer permission.
- A clinical reviewer can approve or reject content with review notes.
- Only an authorized publisher or administrator can publish approved content.
- A user who is authenticated but lacks the required role cannot perform the operation through direct Convex calls.
- Role checks do not rely solely on hiding buttons in the web UI.

### US-P0-19 — Handle safe errors and retries

**As a learner,** I want clear recovery guidance when something fails, **so that** I can continue safely without seeing internal system details.

**Acceptance criteria**

- Core screens have explicit loading, empty, offline, retrying, failed and permission-denied states.
- Network failures do not erase locally saved work.
- Retry actions are idempotent and cannot create duplicate records.
- User-facing errors use stable safe messages; detailed diagnostics are kept in protected logs.
- The app does not report a request as completed when the backend response is unknown.

### US-P0-20 — Audit security and content events

**As an administrator or auditor,** I want an audit trail of sensitive actions, **so that** the organization can investigate changes and access.

**Acceptance criteria**

- The system records content create, edit, approve, publish, unpublish and retire events.
- The system records role changes, deletion requests and protected-record access events.
- Each event includes actor, event type, target type/identifier, timestamp and outcome.
- Audit events do not store unnecessary health text or raw AI prompts.
- Audit records are append-only to normal application users and visible only to authorized roles.

---

## Epic P0-06: Clinical content review and publication

### US-P0-21 — Trace every published lesson to a source

**As a learner,** I want to see where health learning came from, **so that** I can judge its trustworthiness.

**Acceptance criteria**

- Every published lesson has source name, review status, version and review/effective date metadata.
- Missing source or review metadata prevents publication.
- The lesson detail screen shows a concise source/review notice without overwhelming the main learning experience.
- Retired or expired content is not returned by the published-content query.

### US-P0-22 — Review content before publication

**As a clinical reviewer,** I want to approve or reject a draft with notes, **so that** unsafe or incomplete content does not reach learners.

**Acceptance criteria**

- A new lesson starts as `draft`.
- A draft can move to `clinical_review` only when required English/Amharic and source fields are complete.
- A reviewer can approve or reject the item and must provide a reason when rejecting.
- Only approved content can move to `published`.
- A published lesson cannot be edited in place without creating a new version or preserving the previous version.

### US-P0-23 — Retire unsafe or outdated content

**As an administrator,** I want to retire content without deleting its history, **so that** outdated guidance stops appearing while the organization retains accountability.

**Acceptance criteria**

- An authorized administrator can retire a published lesson.
- Retired content disappears from public queries after the effective retirement event.
- Existing saved references show a clear retired-content message rather than silently displaying unknown current guidance.
- The previous version and retirement reason remain in the audit trail.
- Retirement cannot be performed by an unauthorized publisher or learner.

### US-P0-24 — Preview bilingual content before publishing

**As a publisher,** I want to preview English and Amharic content as learners will see it, **so that** translation and formatting errors are caught before review.

**Acceptance criteria**

- The admin portal provides English and Amharic previews.
- Preview shows title, summary, body, section order, source notice and limitation copy.
- Preview does not make draft content publicly discoverable.
- Empty or missing translations are visibly flagged before submission for review.
- The reviewer can record a translation or clinical correction without editing the published version directly.

---

## Cross-cutting non-functional acceptance criteria

### Accessibility

- Core P0 flows support readable dynamic text, accessible labels, sufficient contrast and touch targets appropriate for Android devices.
- Amharic and English safety messages are readable with supported Ethiopic fonts.
- Loading, error, refusal and confirmation states are announced or otherwise perceivable to assistive technology.

### Privacy and observability

- Analytics and logs use event names and aggregate metadata rather than note bodies, Opal prompts, health disclosures or raw care details.
- Development and production environments do not print API keys, tokens or private record contents.
- Sensitive screens do not expose private content in notification previews or generic error surfaces.

### Reliability

- P0 mutations are safe to retry.
- Unknown network outcomes remain unknown until verified.
- Local user work is preserved through transient connectivity failures.
- Published-content queries fail closed: unavailable or unapproved content is not presented as current approved guidance.

## Suggested test matrix

| Area | Automated test | Manual scenario | Release evidence |
|---|---|---|---|
| Care boundary | Status transition and prototype-mode tests | Complete preview flow offline and online | Screenshots or test recording plus status assertions |
| Opal safety | Supported, unsupported and urgent-intent fixtures | Ask diagnosis, dosage and emergency questions in both languages | Test report with refusal outcomes |
| AI consent | Consent-required mutation test | Try summarization with consent declined | Provider request audit showing no call |
| Privacy | Ownership and deletion tests | Clear device data and verify local reset | Data-lifecycle test record |
| Roles | Publisher/reviewer/admin authorization tests | Attempt direct unauthorized mutation | Convex test output and audit events |
| Content governance | Lifecycle transition tests | Draft → review → approve → publish → retire | Version history and audit record |
| Error handling | Retry/idempotency tests | Interrupt network during each P0 action | No duplicate/false-success evidence |
| Accessibility | Static labels/contrast checks | Screen-reader and dynamic-type pass | Accessibility checklist |

## Completion checklist

- [ ] Care prototype boundary is visible and false status is impossible.
- [ ] Opal has bounded retrieval, source attribution and refusal paths.
- [ ] Notes are removed from the health core or explicitly reframed as a private learning journal.
- [ ] AI processing is opt-in, bounded, status-tracked and safely failed.
- [ ] Privacy notice, consent versioning, local clear and deletion/export behavior are documented.
- [ ] Backend ownership and role checks cover every P0 query and mutation.
- [ ] Input limits and safe error mapping are implemented server-side.
- [ ] Education content has source, review, version and lifecycle metadata.
- [ ] Clinical approval is required before publication.
- [ ] Audit events cover content, roles, deletion and protected-record access.
- [ ] P0 test fixtures and manual release evidence are available.
