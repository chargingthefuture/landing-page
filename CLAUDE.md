# CLAUDE.md

Repo: `chargingthefuture/landing-page`. Public-facing marketing/landing site. Vite + React + TypeScript single-page app at the repo root (npm).

## Agent Communication Rules (always apply)

Canonical source: [`chargingthefuture/chargingthefuture` → `.github/instructions/098-agent-communication-rules.mdc`](https://github.com/chargingthefuture/chargingthefuture/blob/main/.github/instructions/098-agent-communication-rules.mdc). Full rules reproduced here since that file lives in another repo.

### Mandatory
- Communicate as a robot/system agent, not a human. Do not use TL;DR, etc.
- Be maximally concise; eliminate every non-essential word.
- Avoid all pleasantries, greetings, and human-like courtesies.
- Provide direct facts and actions only; no hedging or qualifiers.
- Use structured formats (lists, tables, code blocks) instead of prose.
- Omit explanatory preamble; lead with actionable information.

### Response Structure
- Lead with facts, not context-setting.
- Use line breaks for visual separation instead of verbose transitions.
- Combine related information into single messages; avoid multi-step back-and-forth unless necessary.

### Text Formatting
- Minimize bold text. Applies to both chat responses and any `.md` (or other) files agents create or edit.
- Do not bold for emphasis, do not bold every list-item label, and do not bold whole sentences. Bold has no logical value when overused; it adds visual noise without adding information.
- Acceptable bold use is rare and structural only: e.g. a single table header or a one-word inline label where the surrounding document already uses that convention. When in doubt, do not bold.
- Prefer plain prose, lists, headings, and tables to carry structure instead of bold.

### Prohibited
- Verbose explanations of obvious operations.
- Unnecessary elaboration on what the agent is about to do ("I will now...", "I'm going to...").
- Multiple introductory sentences before the actual content.
- Filler comments or padding.

### Information Density Priority
- Max substantive content per message.
- Min transitional or explanatory language.
- Facts before context.
- Structured data before narrative summary.

### Excluded Vocabulary

| Do not use | Use instead | Reason |
|---|---|---|
| punch list | list | Jargon; unclear meaning. |
| stale | deprecated | "Stale" is consistently misused; "deprecated" is the intended meaning. |

## Architecture

- Single-page Vite + React + TypeScript app at the repo root. Routing via `wouter`; routes: `/` (landing), `/demos`, `/look-ma`, plus a 404 fallback. UI built with Tailwind CSS v4 and shadcn/ui components in `src/components/ui`. Most page content and copy live in `src/App.tsx`.
- Design sync (one-way, design → this repo): `chargingthefuture/design` is the source of truth for landing-page layout and copy. Its mirror of this app lives at `artifacts/ctf-landing/src/App.tsx` in that repo. Replicate visual and copy changes from there into this repo's `src/App.tsx` by hand. Sync direction is one-way; never write back to the design repo.
- Ownership boundary: demo links (`youtubeId` / `protonLink`) and plugin descriptions (`desc`) in the `FEATURES` array are owned in this repo's code, not in design. Do not sync those from the design mocks (they are intentionally deprecated there). See the SOURCE OF TRUTH NOTE in `src/App.tsx` and the design repo's `sync-manifest.json` / `DESIGN_BOUNDARY.md`.
- Deploy: handled by the Vercel GitHub app. Pushes/merges to `main` deploy production; PRs get preview deployments. `vercel.json` rewrites all routes to `/index.html` for SPA client-side routing. No GitHub Actions workflows in this repo; CI status on PRs comes from Vercel.

## Commands (run from repo root)

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server (Vite) |
| `npm run build` | Type-check + production build (`tsc -b && vite build` → `dist/`) |
| `npm run preview` | Serve the production build locally |

## Git Branch and PR Naming (always apply)

- Branch names must be descriptive — never use auto-generated or random identifiers (e.g. `claude/gifted-archimedes-oHMEA`).
- Use the pattern `<type>/<short-description>`, e.g. `fix/footer-blog-link`, `feat/category-filter`, `docs/add-claude-md`.
- PR titles must match: concise, action-oriented, no random strings.
- If a branch was created with a bad name, rename it before opening the PR: create a new descriptive branch from the same commits, open the PR from that, close the old one, delete the old branch.
