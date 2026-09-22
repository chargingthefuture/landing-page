# Landing page

Public marketing site for [Charging the Future](https://chargingthefuture.com). A single-page
Vite + React + TypeScript app at the repository root, routed with `wouter`, styled with Tailwind
CSS v4 and shadcn/ui components.

## Routes

| Route | What it is |
|---|---|
| `/` and `/commons` | The landing page |
| `/classic` | The earlier landing page layout |
| `/chat` | Landing page built around the group chat: ask there instead of learning every app |
| `/demos` | Demo videos, one per part of the app |
| `/look-ma` | Problem-and-solution cards |
| `/schemes` | The list of schemes, mirrored one-for-one from the app's ClickLog tag list |

Almost all page content and copy lives in `src/App.tsx`. The scheme names are owned by the app
repository (`ctf/packages/web/lib/click-log/tags.ts`); the descriptions are owned here. The demo
links and plugin descriptions in the `FEATURES` array are owned here too. The invite-card row
(`src/components/InviteStrip.tsx`) reads the blog's published `invites.json`.

Fonts (Bangers, Space Grotesk) are self-hosted from `public/fonts`; there is no request to
Google Fonts.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server (Vite) |
| `npm run build` | Type-check and production build (`dist/`) |
| `npm run preview` | Serve the production build locally |

## Deploy

Deployed by the Vercel GitHub app: merges to `main` deploy production and pull requests get
preview deployments. `vercel.json` rewrites every route to `index.html` for client-side routing.
There are no GitHub Actions workflows in this repository; CI status on a PR comes from Vercel.

## Working here

Agent instructions, including branch naming and the ownership boundary with the design
repository, are in [`CLAUDE.md`](CLAUDE.md).
