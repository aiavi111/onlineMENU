# NOIR — Premium Mobile Restaurant Ordering

A dark, monochrome, mobile-first food ordering experience that feels like a native iOS app. Built with Next.js 15, React 19, Tailwind CSS v4 and Framer Motion.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — ideally in a mobile viewport (390–430 px) or on your phone. Deploys to Vercel with zero config.

## What's inside

- **Hero** — parallax restaurant photo, rating/ETA/fees glass card, favorite + share
- **Search** — animated glass bar with voice pulse, working filters (veg-only, sorting)
- **Categories** — sticky rail with sliding active pill; compact header unfolds on scroll
- **Dish cards** — scroll-reveal animation, badges, favorites, one-tap quick add
- **Product sheet** — drag-to-dismiss bottom sheet, swipeable gallery, nutrition tiles, sizes, extras, sauces, notes, live-priced add-to-cart
- **Cart** — floating white pill with live total; sheet with swipe-to-remove rows, promo codes (`NOIR10`, `CHEF20`), animated totals
- **Checkout** — delivery/pickup toggle, animated vector map, validated form (React Hook Form + Zod), payment methods, confirmation animation
- Cart and favorites persist in `localStorage` (Zustand). Safe-area aware, reduced-motion aware, keyboard accessible.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Zustand · TanStack Query · React Hook Form + Zod · Embla Carousel · react-intersection-observer · Lucide

## Structure

```
src/
  app/            layout, home, checkout, providers, global tokens
  components/     hero, search, categories, dish card/grid/sheet
    cart/         floating pill, cart sheet
    checkout/     map preview
    ui/           button, bottom sheet, segmented, stepper, skeletons…
  data/           restaurant + menu (swap for your API)
  store/          cart + favorites (Zustand, persisted)
  lib/            utils, hooks
  types/          shared models
```

Food photography via Unsplash (hotlinked for the demo — replace with your own assets in `src/data/menu.ts`).
