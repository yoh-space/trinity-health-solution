# Trinity Health Solution

Trinity Health Solution is a bilingual health-learning and support platform built for a calm, trustworthy digital experience across web and native apps. The product blends public health education, knowledge discovery, staff workflows, and care-request pathways into a shared monorepo powered by Next.js, Expo, Clerk, and Convex.

This repository is designed for a healthcare education product with a clear safety boundary: public learning content and guide-like assistance are emphasized, while clinical workflows are kept clearly labeled and scoped according to the project roadmap.

## Product focus

- Public education library in English and Amharic
- Safe, source-limited AI assistance for general health learning
- Patient and staff portals for consultations, appointments, and operational dashboards
- Care-request experiences that are clearly marked as prototype or operational depending on rollout status
- Admin and reviewer workflows for education and staff management
- Shared backend logic with Convex for content, appointments, onboarding, and care operations

## Stack

- [Next.js 16](https://nextjs.org/) for the marketing and portal web experience
- [Expo / React Native](https://expo.dev/) for the mobile app
- [Convex](https://convex.dev/) for backend data, APIs, and app logic
- [Clerk](https://clerk.com/) for authentication and access control
- [Turborepo](https://turbo.build/repo) + [pnpm](https://pnpm.io/) for monorepo orchestration
- [TypeScript](https://www.typescriptlang.org/) across the stack

## Repository structure

- `apps/web` — Next.js app for public, portal, staff, and admin experiences
- `apps/native` — Expo app for mobile users and staff workflows
- `packages/backend` — Convex backend, schema, server functions, and backend utilities
- `docs/` — implementation plans, product requirements, and project documentation
- `.github/` — CI and release automation

## Prerequisites

- Node.js 20.20+
- pnpm 10.x
- A Clerk account
- A Convex account
- Optional: OpenAI API key for AI-related backend features if enabled in your environment

## Local development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the backend

```bash
pnpm --filter @packages/backend setup
```

This runs Convex setup and creates or connects the workspace to a Convex project, producing `packages/backend/.env.local`.

### 3. Configure auth and environment variables

Set up your environment variables for both frontend apps and the Convex backend.

In the Convex project, configure values such as:

```bash
CLERK_JWT_ISSUER_DOMAIN=https://your-frontend-api.clerk.accounts.dev
```

If a feature uses AI services, also add:

```bash
OPENAI_API_KEY=your_key_here
```

To enable Opal's managed Gemini File Search knowledge base, upload the approved
PDF resources and set the returned store name in the Convex deployment:

```bash
pnpm --filter @packages/backend knowledge:upload
npx convex env set GEMINI_FILE_SEARCH_STORE_NAME fileSearchStores/your-store-name
```

The upload command requires `GEMINI_API_KEY` in the local backend environment.
It reads PDFs from `AIReasources/` and does not commit the API key or store
contents. Until `GEMINI_FILE_SEARCH_STORE_NAME` is set, Opal continues using
the existing published-lesson retrieval path.

Then create `.env.local` files in `apps/web` and `apps/native` and populate them with the matching public keys and Convex URL from your local backend setup.

Common setup pattern:

- `NEXT_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CONVEX_URL` = your Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = Clerk publishable key
- `CLERK_SECRET_KEY` = Clerk secret key for the web app
- For Expo, use the matching Clerk publishable key in the app-specific env file

### 4. Run the workspace

```bash
pnpm dev
```

This starts the monorepo via Turbo, including the backend and all app targets.

## Useful commands

### Web app

```bash
pnpm --filter web-app build
pnpm --filter web-app typecheck
```

### Native app

```bash
pnpm --filter native-app typecheck
```

### Backend

```bash
pnpm --filter @packages/backend typecheck
pnpm --filter @packages/backend dev
```

## Deployment notes

The repo includes a Vercel deployment flow for the web app and a Convex-powered backend setup.

A typical production deployment path for the web app looks like:

```bash
cd packages/backend
pnpm exec convex deploy --cmd 'cd ../../apps/web && pnpm build' --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL
```

## Safety and product boundaries

This project intentionally distinguishes between:

- public health education content
- non-diagnostic informational guidance
- operational healthcare workflows
- prototype-only flows that are clearly labeled as such

The roadmap documentation in `docs/` emphasizes trustworthy boundary setting, privacy, and safe educational guidance before broader clinical or operational features are enabled.

## Contributing

When making changes:

1. Keep the educational and clinical boundaries explicit in UI copy and workflows.
2. Prefer source-limited, reviewed content for health guidance.
3. Preserve privacy and consent expectations in user-facing flows.
4. Keep feature work aligned with the project roadmap and product safety goals.

## License

This project is distributed under the terms of the repository license. See [LICENSE](./LICENSE) for details.
