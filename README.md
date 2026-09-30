# AUREL — Independent creative studio

A single-page marketing site for AUREL, a fictional independent creative studio working across
brand identity, digital experiences, and art direction.

Built with **React + TypeScript + Vite + Tailwind CSS**, with `lucide-react` icons. All UI lives in
one component (`src/App.tsx`) with local React state — no router, no state library, no backend.

## Setup

```bash
npm install
npm run dev      # http://127.0.0.1:5173
```

Other scripts:

```bash
npm run build    # type-check (tsc --noEmit) + production build to dist/
npm run preview  # serve the production build locally
```

Requires Node 18+.

## What's in the page

| Section   | Notes                                                                 |
| --------- | --------------------------------------------------------------------- |
| Header    | Transparent over the hero, solid ink after scrolling; full-screen mobile menu with `aria-expanded`, focus trap, Escape-to-close |
| Hero      | Fullscreen background video, gradient + grain + grid scrim, staggered entrance motion |
| Work      | Three alternating case-study cards; each opens an accessible detail modal (Escape / backdrop / focus trap, prev–next) |
| Studio    | Statement + editorial snapshot rows                                   |
| Services  | Four rows linking to the contact section; selection pre-fills the inquiry subject and project type |
| Process   | Four steps with an animated progress line (desktop)                   |
| Contact   | Signal-red close with a validated inquiry form — client-side only, nothing is sent or stored |
| Footer    | Wordmark, anchors, social links (new tab + `rel="noopener noreferrer"`), year generated at runtime |

## Structure

```
index.html            # fonts, meta, .js flag for reveal fallback, noscript content
src/main.tsx          # React entry
src/App.tsx           # the entire site
src/index.css         # Tailwind layers, reveal/texture CSS, reduced-motion overrides
tailwind.config.js    # design tokens: ink / ivory / mist / signal, display + body type
vite.config.ts
```

## Design tokens

- **Colour** — ink `#0B0B0C`, warm ivory `#F4EFE6`, soft mist `#9B968D`, single signal red `#FF3B14`
  (`#C22F0F` for small red text on light backgrounds, so body contrast stays ≥ 4.5:1).
- **Type** — “FSP DEMO - PODIUM Sharp 4.11” (display, via onlinewebfonts) and Inter (body, Google Fonts).
- **Spacing** — 4/8-based scale; sections use `py-20 / md:py-28 / lg:py-36`.

## Accessibility & motion

- Semantic landmarks, skip link, logical heading order, labelled controls, visible focus rings.
- Dialogs and the mobile menu trap focus, restore focus on close, and lock background scroll.
- Reveal animations are gated behind a `.js` class, so content is never hidden without JavaScript;
  an `IntersectionObserver` fallback shows everything if the API is unavailable.
- `prefers-reduced-motion` disables smooth scrolling, reveals, the video zoom, and the scroll cue.
- Form validation is inline with `aria-invalid` / `aria-describedby` / `role="alert"`.
- Layout is checked at 375 / 768 / 1024 / 1440 with no horizontal overflow.

## Notes

- Background video and photography are loaded from remote URLs; the hero falls back to a still image
  and solid ink background if the video fails, and image containers keep their layout if a photo
  fails to load.
- The inquiry form performs **no network request** and stores nothing — the success state is explicit
  about this.
- Studio name, copy, case studies, and contact details are original to this project; social links point
  to the platforms' home pages.
