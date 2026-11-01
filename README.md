# Mobile Store: Premium Smartphone Frontend

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · Motion (motion/react) · lucide-react
Languages: Persian (`/fa`, default, real RTL) and English (`/en`, LTR).

## Run

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000  (redirects to /fa)
npm run typecheck && npm run lint && npm run build
```

## Where to change things

| What | File |
| --- | --- |
| Store name, logo, currency/market, contact, social, enabled services | `src/data/site-config.ts` |
| Homepage image paths | `src/data/home-assets.ts` |
| Products (names, prices, stock, specs) | `src/data/products.ts` (accessed only via `src/lib/catalog`) |
| All Persian / English texts | `src/lib/i18n/fa.ts`, `src/lib/i18n/en.ts` |
| Colours (design tokens) | `:root` in `src/app/globals.css` |

## Routes (every one exists under /fa and /en)

`/` home · `/shop` (filters, sort, search, load-more; URL-synced) · `/brand/[brand]` · `/brands` · `/collections` · `/new` ·
`/product/[slug]` (gallery + zoom + fullscreen, variants, tabs, related, recently viewed, FAQ, sticky mobile buy bar) ·
`/search` + full-screen search overlay · `/compare` + floating compare tray · `/wishlist` · `/cart` + drawer · `/checkout` (demo) ·
`/signin` `/signup` `/forgot-password` (demo) · `/account` `/account/profile|addresses|orders|saved` (demo) ·
info pages: offers, about, contact, faq, shipping, returns, warranty, privacy, terms.

## Motion

`motion/react` is used for: route entrance (`template.tsx`), toasts, cart drawer, search overlay, filter sheet, compare tray,
fullscreen viewer, wishlist heart. CSS handles reveal-on-scroll and hover. Everything respects `prefers-reduced-motion`.
GSAP/ScrollTrigger, Lenis, Embla and Three.js were deliberately NOT added: they could not be installed and tested in the build
environment, Lenis risks scroll-hijacking, and the existing scroll-snap carousel already covers mouse, touch and keyboard.

## Local state (non-sensitive only, localStorage)

`cart:v2`, `wishlist:v1`, `compare:v1`, `recent:v1`, `searches:v1`. Passwords, payment data and addresses are never stored.

## Backend integration points

- `src/lib/catalog/*`: data access (swap the local array for an API/DB)
- `src/lib/catalog/search.ts`: search service (swap for server search)
- `src/lib/services/orders.ts`: `OrderService` contract with a demo implementation
- `src/components/account/AuthForm.tsx`: replace the demo submit with real auth
- `site-config.ts` `newsletterEndpoint`

## Fonts (Nian)

Put the files in `public/fonts/` using these exact names (edit `globals.css` if yours differ):

`w_Nian Thin.ttf`, `w_Nian ExtraLight.ttf`, `w_Nian Light.ttf`, `w_Nian.ttf` (Regular), `w_Nian SemiBold.ttf`,
`w_Nian Bold.ttf`, `w_Nian ExtraBold.ttf`, `w_Nian Black.ttf`.

Until they exist the site falls back to Tahoma / system fonts. English pages use Inter (body) and Cormorant Garamond (headings) via `next/font`.

## Images

Missing images show a neutral placeholder, never a broken icon. Paths:
- Home: `public/images/home/hero/hero-left.webp`, `hero-right.webp`, `brands/{samsung,xiaomi,google-pixel,apple}.webp`, `story/{story-main,story-01,story-02,story-03}.webp`, `collections/{flagship,budget,photography,gaming,compact,latest}.webp`, `services/store-experience.webp`
- Brand pages: `public/images/brands/<samsung|xiaomi|google|apple>/{hero,editorial}.webp`
- Products: `public/images/products/<samsung|xiaomi|google|apple>/<product-slug>/{1,2,3}.webp` (slugs in `src/data/products.ts`)

## Data rules

No prices, stock, ratings or specs are invented. A product with `price: null` shows "price on request".
When you add a price, also fill `source` and `updatedAt`. Product structured data (JSON-LD) is emitted only for products with a real price.

## Demo / not connected

- Checkout is a UI prototype: it validates and shows a clearly labelled demo result. No order, no payment.
- Newsletter: set `newsletterEndpoint` in `site-config.ts` (POST `{ email }`); otherwise an honest "not connected" message appears.
- Account/sign-in pages are demos with no authentication.
- Product specs, colours, storage, prices and stock are empty on purpose until real data is entered in `products.ts`; filters/comparison rows fill in automatically as data appears.
- Info pages (about, contact, FAQ, shipping, returns, warranty, privacy, terms) contain placeholder text for you to fill.


## Deploy to GitHub Pages

Static export (`output: 'export'`, `trailingSlash`) + GitHub Actions. Base path comes from `NEXT_PUBLIC_BASE_PATH` /
`GITHUB_REPOSITORY` (only when `GITHUB_PAGES=true`); locally nothing changes. All `/public` asset URLs go through
`src/lib/utils/base-path.ts`, and Nian `@font-face` rules are emitted by `components/layout/FontFaces.tsx`.

1. Push the project to a repo named `mobile-store` on branch `main`.
2. Run `npm install` once locally and commit `package-lock.json` (the workflow uses `npm ci` when it exists).
3. Repo -> Settings -> Pages -> Build and deployment -> Source: **GitHub Actions**.
4. Push to `main` (or run the workflow manually). Site: `https://USERNAME.github.io/mobile-store/`.

Static-hosting limits: no middleware or server redirects (the root `public/index.html` forwards to `./fa/`), no server-side
`searchParams` (shop and search read the query string in the browser), and unknown URLs show the generated 404 page.
