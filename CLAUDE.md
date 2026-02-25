# OMS Prototypes — CLAUDE.md

## Project Overview
PM-driven TSX prototype workspace for rapid design iteration.
Goal: lo-fi wireframes → usability test → handoff to UI/UX + dev (Cursor).

## Repo & Deployment
- GitHub: https://github.com/koteswarajav/OMS.git
- Vercel: auto-deploys on every push (main = production, variant/* = preview URLs)
- Scripts run in Git Bash (Windows)

## Tech Stack
- React 18 + TypeScript + Vite
- No Tailwind, no CSS modules — inline styles using tokens only
- react-router-dom for flow navigation

## TOKEN-SAVING RULES (CRITICAL)
- ALWAYS import components from `design-system/components` — never inline component code
- ALWAYS use values from `design-system/tokens.ts` — never hardcode colors, spacing, or font sizes
- For variants: only write what DIFFERS from the base screen — never rewrite the whole screen
- Default fidelity: wireframe (use Placeholder for images, charts, maps, unspecified regions)
- Never rewrite a finalized component — ask first if an update is needed

## Fidelity Levels
- **Wireframe** (default): Placeholder boxes, real labels, real layout, no illustrations
- **Lo-fi**: tokens applied, real copy, icons as text symbols, no animations
- **Mid-fi**: icons, interaction states, real data shapes — only when explicitly requested

## File Conventions
- New screens → `screens/ScreenName.tsx` (copy from `screens/_template.tsx`)
- Variants → `variants/ScreenName-v2.tsx` (copy from `variants/_template-v2.tsx`)
- New flow → `flows/FlowName.tsx`, then register in `prototypes/App.tsx`
- Finalized components → `design-system/components/` + export in `index.ts`

## What's Finalized (do not rewrite)
- `design-system/tokens.ts` — all design tokens
- `design-system/components/` — Button, Card, Input, NavBar, Placeholder
- `flows/FlowRunner.tsx` — navigation shell
- `prototypes/App.tsx` — root router (only add routes, don't restructure)

## Workflow
1. PM describes screen in plain English → Claude writes TSX using existing components
2. PM runs `./scripts/new-screen.sh ScreenName` to scaffold (Git Bash)
3. PM runs `./scripts/deploy-variant.sh variant-name` to get Vercel preview URL
4. PM shares URL with team → collects feedback
5. Winner logged in `handoff/decisions.md`
6. Dev team clones repo, upgrades fidelity in Cursor

## Commands
- Install: `npm install`
- Dev: `npm run dev` (localhost:5173)
- Build: `npm run build`
- New screen: `./scripts/new-screen.sh ScreenName` (Git Bash)
- Deploy variant: `./scripts/deploy-variant.sh variant-name` (Git Bash)

## Git & Safety
- Never auto-commit
- Never push to main without asking
- Variant branches follow pattern: `variant/{name}`
- Confirm before any destructive git operation
