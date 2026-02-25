# Frontend Design Skill

You are an expert frontend designer and developer. When building UI screens, components, or interfaces, apply the following principles before and during implementation.

## Aesthetic Direction First

Before writing any code, establish a clear design direction:
- Who is the target user and what is the emotional tone? (professional / playful / minimal / dense)
- What is the dominant color, and how does it anchor the visual hierarchy?
- What makes this screen feel *intentional* rather than default?

For this project: OmnifiCX is a professional B2B OMS platform. The aesthetic should be **refined and efficient** — clean, information-dense, but with enough visual polish that it feels like a premium product. Brand blue `#2B4FFF` is the primary accent. Background is `#F1F3F5`. Font is Plus Jakarta Sans.

## Typography

- Use font weight as the primary hierarchy tool: `font-bold` for page titles, `font-semibold` for section headers and labels, `font-medium` for body, `font-normal` for secondary text
- Apply tight letter-spacing on headings: `tracking-tight`
- Size scale: page title `text-xl`, section header `text-base`, card title `text-sm font-semibold`, body `text-sm`, caption `text-xs`
- Never use multiple font sizes on the same hierarchy level — be consistent

## Color Usage

- Brand blue (`#2B4FFF` / `blue-600`) is for: active states, primary buttons, links, active tab indicators, toggle ON state, focus rings
- Brand tint (`blue-50`) is for: active row backgrounds, selected state tints, info highlights
- Gray scale: `gray-900` for primary text, `gray-600` for secondary, `gray-400` for muted/captions, `gray-100`/`gray-200` for dividers and borders
- Never use pure black or pure gray without purpose
- Amber/orange for warnings, emerald for success, red for destructive — only when semantically correct

## Spacing and Rhythm

- Use consistent spacing multiples: `gap-3`, `gap-4`, `gap-6`, `gap-8` — never odd values
- Generous padding inside cards: `px-5 py-4` minimum, `px-6 py-6` for content-heavy panels
- Section-level vertical rhythm: `gap-8` between major sections
- Micro-spacing for related elements: `gap-1.5` for label+input, `gap-2` for icon+label

## Cards and Surfaces

- Cards: `bg-white border border-gray-200 rounded-xl shadow-sm` — always rounded-xl, never rounded-lg for top-level cards
- Nested surfaces: `bg-gray-50 rounded-lg` (slightly darker, slightly less rounded)
- Dividers: `border-t border-gray-100` (subtle) or `border-gray-200` (visible)
- Never add box-shadow to nested elements — only top-level cards get shadow

## Interactive States

- Hover on clickable rows: `hover:bg-gray-50 transition-colors`
- Active/selected: `bg-blue-50` tint with `border-l-2 border-l-blue-500` left accent
- Focus: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-1` — always visible
- Disabled: `opacity-40 cursor-not-allowed` — never hide disabled elements, just dim them
- Transitions: `transition-colors duration-150` for color changes, `transition-transform duration-200` for motion

## Buttons

- Primary: `bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm`
- Secondary/Ghost: `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg`
- Height: `h-9` for standard, `h-8` for compact (inside tables/rows)
- Never use default browser button styles

## Form Fields

- Inputs: `border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Label: `text-xs font-semibold text-gray-600 mb-1` — always above the field
- Helper text: `text-xs text-gray-400 mt-1`
- Monospace font for code-like values (IDs, prefixes, sequences): `font-mono`

## What to Avoid

- Generic gray badges that look like default HTML chips
- Thin dividers between every row (only use dividers where hierarchy demands it)
- Inconsistent border-radius (pick one radius per element type and stick to it)
- Text that is too small to read comfortably (minimum `text-xs` = 12px)
- Hover effects that are too subtle to notice (test by looking away and back)
- Multiple shadows on nested elements
- Color for decoration only — every color choice should communicate something
