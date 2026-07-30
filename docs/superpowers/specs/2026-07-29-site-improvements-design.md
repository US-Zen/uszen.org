# Site-Wide Improvements for US Zen Institute

## Overview

A comprehensive audit-driven enhancement of uszen.org covering SEO, accessibility, performance, code quality, UX, and build configuration.

## Workstreams

### A. Layout-Level Changes (template-wide, `layout.html`)

- **`<h1>`**: Change each page's existing `<h2>` main heading to `<h1>`.
- **Meta tags**: Add to `<head>` in `layout.html`:
  - `<meta name="description">` — per-page via Nunjucks `{% set description %}`
  - Open Graph: `og:title`, `og:description`, `og:url`, `og:type` (website)
  - Twitter Card: `twitter:card` (summary), `twitter:title`, `twitter:description`
- **Favicon**: Add favicon.ico + apple-touch-icon.png + link tags in `<head>`. Include both in CopyPlugin patterns.
- **Banner close button**: Replace `[data-close-banner]` SVG with a `<button>` element for keyboard accessibility.
- **YouTube**: Switch embedded URLs from `youtube.com` to `youtube-nocookie.com`.
- **Copyright**: Update hardcoded "2025" to "2026" in footer.
- **robots.txt**: Add to `src/` root, CopyPlugin to `dist/`.
- **sitemap.xml**: Use `sitemap-webpack-plugin` in webpack config. Config: `base: 'https://uszen.org'`, paths: all 8 HTML pages.
- **404 page**: Add `src/views/404.html`.

### B. Per-Page Content

- **Each page**: Add `{% set description = "..." %}` for unique meta descriptions.
- **`index.html`**: Keep all carousel images. Add `loading="lazy"` to all slides.
- **`lectures.html`**: nocookie URLs (already covered in A).
- **`courses.html`**: Expand `tinyurl.com` links to their real destination URLs.
- **`ksitigarbha.html`**: Enable full-size image modal on all screen sizes (remove the `>=768px` guard).

### C. Code Quality

- **SCSS**: Consolidate `index.scss` + `main.scss` into a single `main.scss`. Remove `index.scss`.
- **Carousel**: Refactor 32 hardcoded `carouselItem()` calls into a data-driven list in JS or a Nunjucks data array.
- **JS**: Minor cleanup pass (consistent IIFE pattern, avoid globals).
- **`postcss.config.js`**: Remove `postcss-preset-env` (redundant with Tailwind).

### D. Build Configuration

- **`sitemap-webpack-plugin`**: Install and configure in `webpack.config.js`.
- **CopyPlugin**: Add favicon files, `robots.txt` to patterns.
- **`package.json`**: Remove `postcss-preset-env` from devDependencies.

## Page Inventory for Sitemap

| Route | File |
|-------|------|
| `/` | `index.html` |
| `/about` | `about.html` |
| `/columbarium` | `columbarium.html` |
| `/support` | `support.html` |
| `/contact` | `contact.html` |
| `/courses` | `courses.html` |
| `/lectures` | `lectures.html` |
| `/ksitigarbha` | `ksitigarbha.html` |
| `/404` | `404.html` |

## Out of Scope (for this pass)

- Image optimization pipeline (WebP, srcset)
- Carousel reduction (keeping all 32 images)
- Git branch cleanup
- JSON-LD structured data
