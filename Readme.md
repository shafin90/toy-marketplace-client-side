# Toy Swap Circle — Frontend

- **Live URL:** https://toy-marketplace-client-side-r8j2.vercel.app/  
- **Base API:** https://toy-marketplace-server-side-omega.vercel.app/  
- **Backend GitHub:** https://github.com/shafin90/toy-marketplace-server-side  

This is the React/Vite frontend for Toy Swap Circle, a toy marketplace and swap platform with credit-based exchanges, cash purchases, and shop-owner tooling.

### Purpose
- Make quality toys affordable and circular by letting families **swap** or buy with minimal cost.
- Reduce waste and clutter by keeping toys in circulation instead of landfills.
- Empower shop owners to sell, manage inventory, and handle exchanges with clear analytics.

### Problem We Solve
- **High cost & short lifespan:** Kids outgrow toys quickly; quality items are expensive.
- **Waste & storage:** Unused toys pile up or get trashed.
- **Discovery & trust:** Families need an easy, trustworthy way to find, trade, or buy age-appropriate toys.

### How Swapping Works
- Users list old toys to earn credits/discounts.
- They can apply those credits to get other toys, or combine with cash checkout.
- Exchanges can include old-toy-for-new flows with shop owners setting discounts.

## Highlights
- Modern React (hooks) with React Router.
- Auth-gated flows (login required for purchase/exchange).
- Shop owner dashboard with stats and charts (Recharts).
- Price alerts and back-in-stock alerts.
- React Query for data fetching/caching and skeleton loaders.
- Form validation with React Hook Form + Zod.
- PWA-friendly setup with service worker registration hook.

## Key Screens
- **Home & Catalog:** Search/filter, lazy loading, skeleton states, infinite scrolling.
- **Toy Details:** Pricing, availability, exchange eligibility, price/back-in-stock alerts, reviews.
- **Shop Dashboard (owner):** Product list, exchange requests, revenue/orders trend chart, inventory pie chart, push opt-in CTA.
- **Auth:** Login/Register with validated forms; protected routes for shop owners.
- **Chat:** In-app messaging UI (depends on backend sockets).

## Tech Stack
- React 18, Vite
- React Router 6
- React Query (@tanstack/react-query)
- React Hook Form + Zod
- Recharts
- Bootstrap 5 + React-Bootstrap
- Axios

## Environment
Set API base via `src/config/apiConfig.js` (defaults to the Base API above).  
Stripe publishable key is read from `VITE_STRIPE_PUBLISHABLE_KEY` (if enabled).

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — lint sources

## Auth & Purchasing
- All purchases/exchanges require login; Stripe modal refuses to load without a user.
- Protected routes guard shop-owner pages and chat.

## Alerts & Notifications
- Price/back-in-stock alerts on toy details (persisted via backend price-alert API).
- Push notification opt-in prompt for shop owners (browser Notification API; no email).

## Backend Links
- Base API: https://toy-marketplace-server-side-omega.vercel.app/
- GitHub: https://github.com/shafin90/toy-marketplace-server-side

## Deployment
Hosted on Vercel: https://toy-marketplace-client-side-r8j2.vercel.app/

## Impactful Approaches
- **Auth-first commerce:** All purchase/exchange flows are gated; payment modals refuse to load without a logged-in user to prevent anonymous checkout.
- **Performance & UX:** React Query caching, skeletons, and incremental loading for catalog lists reduce perceived latency; code-split routes keep bundles lean.
- **Data trust for owners:** Recharts-driven revenue/orders trend + inventory pie give shop owners a quick health view; analytics API powers charts.
- **Actionable alerts:** Price and back-in-stock alerts tie to the backend so users get notified when deals or stock changes occur.
- **Robust forms:** React Hook Form + Zod validation prevents bad submissions and gives inline guidance on auth and listings.
- **Push over email:** Browser push opt-in CTA (no email) to keep owners informed on orders/exchanges without inbox noise.