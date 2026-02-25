# Prototype Handoff

**Repo:** https://github.com/koteswarajav/OMS
**Tech:** React 18 + TypeScript + Vite
**Dev Tool:** Open in Cursor — clone repo, open `screens/` folder

---

## Active Variants

| Variant | Description | Vercel Preview URL | Status |
|---------|-------------|-------------------|--------|
| Template | Base template | _(push to get URL)_ | Reference |

_Add rows here as variants are deployed. URL appears in Vercel dashboard after pushing._

---

## Flows Available

| Flow | Route | Screens |
|------|-------|---------|
| Template Flow | `/template` | _template |

---

## For Developers (Cursor)

```bash
git clone https://github.com/koteswarajav/OMS.git
cd OMS
npm install
npm run dev
```

- Each screen is in `screens/` — self-contained TSX component
- Props: `onNext?: () => void`, `onBack?: () => void`
- Design tokens: `design-system/tokens.ts`
- Reusable components: `design-system/components/`
- To upgrade fidelity: replace `<Placeholder />` with real UI, keep tokens

---

## For UI/UX Designers

- Screens use a token system in `design-system/tokens.ts`
- Colors, spacing, radius, and typography are all defined there
- Map token values directly to Figma styles / variables
- Component list: Button, Card, Input, NavBar, Placeholder
