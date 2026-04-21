# Deployment Guide

**Product:** Stèlegraphy
**Version:** 0.1.0
**Last Updated:** April 2026

---

## Overview

Stèlegraphy is deployed as a **static Next.js application** on [Vercel](https://vercel.com). There is no backend, no database, and no server runtime required. The build process produces static HTML, CSS, and JavaScript assets that are served from Vercel's global Edge CDN.

**Live URL:** [https://stelegraphy.vercel.app](https://stelegraphy.vercel.app)

---

## 1. Environment Variables

Stèlegraphy requires **no environment variables** for either local development or production deployment.

All cipher logic uses browser-native Web APIs (`encodeURIComponent`, `btoa`, `atob`). No API keys, secrets, database connection strings, or external service credentials are needed.

| Variable | Required | Description |
|---|---|---|
| *(none)* | — | No environment variables are used |

> If you fork this project and add server-side features, create a `.env.local` file (excluded by `.gitignore`) for local secrets and configure them in the Vercel Dashboard → Project Settings → Environment Variables.

---

## 2. Vercel Deployment (Recommended)

### 2.1 One-Click Deploy via GitHub

1. Push the repository to GitHub (already done at `kevinpradith/stelegraphy`).
2. Log in to [vercel.com](https://vercel.com).
3. Click **Add New Project** → Import the `stelegraphy` GitHub repository.
4. Vercel auto-detects **Next.js** and pre-fills the build settings from `vercel.json`.
5. Click **Deploy**.

That's it. Subsequent pushes to the `main` branch trigger automatic re-deployments.

### 2.2 Vercel Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "cleanUrls": true
}
```

| Field | Value | Description |
|---|---|---|
| `framework` | `nextjs` | Enables Vercel's Next.js build optimization |
| `buildCommand` | `npm run build` | Production build command |
| `installCommand` | `npm install` | Dependency installation |
| `cleanUrls` | `true` | Serves `/about` instead of `/about.html` |

### 2.3 Vercel Project Settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Node.js Version | 18.x (recommended) |
| Root Directory | `./` (project root) |
| Output Directory | `.next` (auto-detected) |

---

## 3. Manual Deployment / Self-Hosting

### 3.1 Build

```bash
# Install dependencies
npm install

# Create an optimized production build
npm run build
```

The build output is located in `.next/`. The build includes:
- Server-side rendering files (used by `npm start`)
- Static assets optimized for CDN delivery

### 3.2 Serve Production Build Locally

```bash
npm run start
```

The server listens on `http://localhost:3000` by default.

To use a different port:

```bash
npm run start -- -p 8080
```

### 3.3 Static Export (Optional)

If you want a fully static export (no Node.js server required), add the following to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  // ...existing config
};
```

Then run:

```bash
npm run build
```

The static files will be output to the `out/` directory and can be served by any static file host (Apache, Nginx, GitHub Pages, Cloudflare Pages, etc.).

> **Note:** Static export disables server-side features. Since Stèlegraphy has no server-side logic, this mode is fully compatible.

---

## 4. CI/CD Pipeline

### 4.1 Vercel Automatic CI/CD

Vercel provides built-in CI/CD with zero configuration:

| Event | Action |
|---|---|
| Push to `main` | Triggers a production deployment |
| Pull Request opened | Triggers a preview deployment with a unique URL |
| Pull Request merged | Promotes preview to production |

### 4.2 Pipeline Flow

```
Developer pushes code
        │
        ▼
  GitHub (kevinpradith/stelegraphy)
        │
        │  Vercel Webhook (automatic)
        ▼
  Vercel Build Runner
  ├── npm install          (~30s)
  ├── npm run build        (~45–90s)
  │   ├── TypeScript type-check
  │   ├── ESLint (if configured as build step)
  │   └── Next.js compilation (Turbopack in dev; Webpack in build)
  └── Deploy to Edge CDN   (~10s)
        │
        ▼
  https://stelegraphy.vercel.app (production)
  https://<hash>-stelegraphy.vercel.app (preview)
```

### 4.3 Adding GitHub Actions (Optional)

If you want to add linting or type-checking to the CI pipeline before Vercel deploys, create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript type check
        run: npx tsc --noEmit
```

This workflow runs on every push and pull request, blocking deployments if linting or type errors are found.

---

## 5. Domain Configuration

### 5.1 Default Vercel Domain

The project is automatically assigned:
- `https://stelegraphy.vercel.app` (production)

### 5.2 Custom Domain

To attach a custom domain:

1. Vercel Dashboard → Project → **Settings → Domains**
2. Add your domain (e.g., `stelegraphy.com`)
3. Update your domain registrar's DNS:

| Record | Type | Name | Value |
|---|---|---|---|
| Apex domain | `A` | `@` | `76.76.21.21` |
| `www` subdomain | `CNAME` | `www` | `cname.vercel-dns.com` |

4. Wait for DNS propagation (up to 48 hours).
5. Vercel auto-provisions a **TLS/SSL certificate** via Let's Encrypt.

---

## 6. Security Headers in Production

Security headers are configured in `next.config.ts` and are applied to every route at the Next.js layer (not Vercel config). They are included in every deployment automatically.

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'` |

To verify headers in production:

```bash
curl -I https://stelegraphy.vercel.app
```

---

## 7. Rollback

Vercel keeps a full deployment history. To roll back to a previous deployment:

1. Vercel Dashboard → Project → **Deployments**
2. Click the **...** menu on any previous deployment
3. Select **Promote to Production**

This is instant — no rebuild required.

---

## 8. Performance Checklist

Before every production release, verify:

- [ ] `npm run build` completes with no errors or warnings
- [ ] `npm run lint` passes with no violations
- [ ] `npx tsc --noEmit` reports zero type errors
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] No console errors in production build (`npm run start`)
- [ ] Dark mode loads without a white flash (FOUC test)
- [ ] Theme toggle persists correctly across page reloads
- [ ] Encrypt → Decrypt roundtrip produces correct plaintext (`decrypt(encrypt(text, key), key) === text`)
