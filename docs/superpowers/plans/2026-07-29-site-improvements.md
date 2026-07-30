# Site Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement SEO, accessibility, code quality, and build improvements across uszen.org.

**Architecture:** Single-pass enhancement across the Nunjucks layout template, all page templates, webpack config, JS files, and build assets. Each task builds on the previous; tasks run sequentially.

**Tech Stack:** Nunjucks, Tailwind CSS, daisyUI, Webpack 5, sitemap-webpack-plugin

---

### Task 1: Create branch and install dependencies

**Files:**
- Modify: `package.json`
- New: none

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b site-improvements
```

- [ ] **Step 2: Install sitemap-webpack-plugin**

```bash
npm install --save-dev sitemap-webpack-plugin
```

Expected output: `+ sitemap-webpack-plugin@1.1.1`

- [ ] **Step 3: Remove unused postcss-preset-env**

```bash
npm uninstall postcss-preset-env
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add sitemap-webpack-plugin, remove postcss-preset-env"
```

---

### Task 2: Build configuration

**Files:**
- Modify: `webpack.config.js`
- Modify: `postcss.config.js`

- [ ] **Step 1: Update webpack.config.js**

Add `SitemapPlugin` to plugins and add favicon + robots.txt to CopyPlugin:

```js
const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const isProd = !process.argv.find((str) => str.includes('development'));

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'inline-source-map',
  stats: 'minimal',

  output: {
    path: path.join(__dirname, 'dist/'),
    clean: true,
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: 'src/views/index.html',
        about: 'src/views/about.html',
        columbarium: 'src/views/columbarium.html',
        support: 'src/views/support.html',
        contact: 'src/views/contact.html',
        courses: 'src/views/courses.html',
        lectures: 'src/views/lectures.html',
        ksitigarbha: 'src/views/ksitigarbha.html',
        '404': 'src/views/404.html'
      },
      js: {
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
      preprocessor: 'nunjucks',
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/documents", to: "documents" },
        { from: "src/favicon.ico", to: "favicon.ico", noErrorOnMissing: true },
        { from: "src/apple-touch-icon.png", to: "apple-touch-icon.png", noErrorOnMissing: true },
        { from: "src/robots.txt", to: "robots.txt" },
      ],
    }),
    new SitemapPlugin({
      base: 'https://uszen.org',
      paths: [
        '/', '/about', '/columbarium', '/support', '/contact',
        '/courses', '/lectures', '/ksitigarbha'
      ],
      options: {
        filename: 'sitemap.xml',
        lastmod: true,
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|scss)/,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(ico|png|jp?g|svg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },

  devServer: {
    open: true,
    compress: true,
    devMiddleware: {
      writeToDisk: true,
    },
    static: path.resolve(__dirname, 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};
```

- [ ] **Step 2: Update postcss.config.js**

```js
module.exports = {
  plugins: ['tailwindcss'],
};
```

- [ ] **Step 3: Commit**

```bash
git add webpack.config.js postcss.config.js
git commit -m "build: add sitemap plugin, favicon copy, remove postcss-preset-env"
```

---

### Task 3: New assets (favicon, robots.txt, 404 page)

**Files:**
- Create: `src/favicon.ico`
- Create: `src/apple-touch-icon.png`
- Create: `src/robots.txt`
- Create: `src/views/404.html`

- [ ] **Step 1: Create robots.txt**

```text
User-agent: *
Allow: /

Sitemap: https://uszen.org/sitemap.xml
```

Write to `src/robots.txt`.

- [ ] **Step 2: Create 404.html**

```html
{% extends "src/views/layout.html" %}
{% set activePage = "404" %}
{% set title="Page Not Found - US Zen Institute" %}
{% set description="The page you are looking for does not exist at US Zen Institute." %}

{% block content %}
<div class="container mx-auto">
    <div class="prose-sm lg:prose-base max-w-none p-10 text-center">
        <h1>404 — Page Not Found</h1>
        <p class="text-gray-600">The page you are looking for does not exist.</p>
        <p class="text-gray-600">您查找的頁面不存在。</p>
        <a href="index.html" class="inline-block mt-6 bg-yellow-500 text-black px-5 py-2 rounded font-semibold hover:bg-yellow-600">
            Return Home 返回首頁
        </a>
    </div>
</div>
{% endblock %}
```

Write to `src/views/404.html`.

- [ ] **Step 3: Create favicon.ico**

Create a 16x16 favicon using Python (generates a simple recognizable ICO):

```bash
python3 << 'PYEOF'
import struct

# Build a 16x16 32bpp ICO with a blue "U" shape on transparent background
width, height = 16, 16
# BGRA pixel data (top-to-bottom, Windows BMP is bottom-to-top)
pixels = []
for y in range(height):
    for x in range(width):
        # U shape: vertical bars on sides, flat bottom curve
        in_u = (x < 3 or x >= width - 3) and y < height - 3
        # bottom bar
        in_u = in_u or (y >= height - 4 and x >= 3 and x < width - 3 and y < height - 1)
        if in_u:
            pixels.extend([0x00, 0x60, 0xc8, 0xff])  # blue, opaque
        else:
            pixels.extend([0x00, 0x00, 0x00, 0x00])  # transparent
# BMP padding - each row must be multiple of 4 bytes
row_size = width * 4
padding = (4 - row_size % 4) % 4

# BMP data (bottom-up rows)
bmp_data = bytearray()
for y in range(height - 1, -1, -1):
    start = y * width * 4
    bmp_data.extend(pixels[start:start + width * 4])
    bmp_data.extend(b'\x00' * padding)

# ICO header
ico = struct.pack('<HHH', 0, 1, 1)
# ICO directory entry
ico += struct.pack('<BBBBHHII', 16, 16, 0, 0, 1, 32, len(bmp_data) + 40, 22)
# BMP info header (BITMAPINFOHEADER)
ico += struct.pack('<IiiHHIIiiII', 40, width, height * 2, 1, 32, 0, len(bmp_data), 0, 0, 0, 0)
# Pixel data
ico += bmp_data

with open('src/favicon.ico', 'wb') as f:
    f.write(ico)
print("Created src/favicon.ico")
PYEOF
```

- [ ] **Step 4: Create apple-touch-icon.png**

Generate a 180x180 blue square PNG via Python:

```bash
python3 << 'PYEOF'
import struct, zlib

width, height = 180, 180
# RGBA pixel data - blue background
raw = bytearray()
for y in range(height):
    raw.extend(b'\x00\x00\x00\x00')  # filter byte
    for x in range(width):
        raw.extend([0x00, 0x60, 0xc8, 0xff])  # RGBA blue

# Build PNG
def chunk(chunk_type, data):
    c = chunk_type + data
    return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

png = b'\x89PNG\r\n\x1a\n'
png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
png += chunk(b'IDAT', zlib.compress(raw))
png += chunk(b'IEND', b'')

with open('src/apple-touch-icon.png', 'wb') as f:
    f.write(png)
print("Created src/apple-touch-icon.png")
PYEOF
```

- [ ] **Step 5: Commit**

```bash
git add src/robots.txt src/views/404.html src/favicon.ico
git commit -m "feat: add 404 page, robots.txt, favicon"
```

---

### Task 4: Layout template updates

**Files:**
- Modify: `src/views/layout.html`

- [ ] **Step 1: Add meta tags, favicon links, update footer, fix banner button, fix YouTube URLs**

Read the current file first to understand the full content, then apply edits.

Replace the `<head>` section to add meta tags and favicon links:

```html
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>{{ title }}</title>
    <meta name="description" content="{% if description %}{{ description }}{% else %}US Zen Institute — Buddhist temple in Germantown, Maryland offering bilingual teachings, meditation, and community events.{% endif %}">
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{% if description %}{{ description }}{% else %}US Zen Institute — Buddhist temple in Germantown, Maryland.{% endif %}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://uszen.org">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:description" content="{% if description %}{{ description }}{% else %}US Zen Institute — Buddhist temple in Germantown, Maryland.{% endif %}">
    <link rel="icon" href="../favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="../apple-touch-icon.png">
    <link rel="stylesheet" href="../sass/index.scss">
</head>
```

Replace the banner close button with an accessible `<button>`:

```html
<button data-close-banner type="button" class="max-md:mt-4" aria-label="Close announcement">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 cursor-pointer fill-white inline-block" viewBox="0 0 320.591 320.591">
        <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
        <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
    </svg>
</button>
```

Update footer copyright year:

```html
<span>2026 © US Zen Institute, Inc.</span>
```

Update YouTube embed URL in the accordion macro — change `youtube.com` to `youtube-nocookie.com` in the embed URL pattern. The base URL variable is fine as-is for the playlist link; only the `embedUrl` parameter values need to be updated in `lectures.html` (handled in Task 5).

- [ ] **Step 2: Commit**

```bash
git add src/views/layout.html
git commit -m "feat: add SEO meta tags, favicon links, accessible banner button, update copyright"
```

---

### Task 5: Per-page content updates

**Files:**
- Modify: `src/views/index.html`
- Modify: `src/views/about.html`
- Modify: `src/views/columbarium.html`
- Modify: `src/views/support.html`
- Modify: `src/views/contact.html`
- Modify: `src/views/courses.html`
- Modify: `src/views/lectures.html`
- Modify: `src/views/ksitigarbha.html`

- [ ] **Step 1: Add unique h1 and meta description to each page**

For each page, change `<h2 class="text-center">` to `<h1 class="text-center">` (or adjust the heading), and add `{% set description = "..." %}`.

**index.html** — already has no h2 heading as primary, add a visually-hidden h1:

```html
{% extends "src/views/layout.html" %}
{% set activePage = "index" %}
{% set title="US Zen Institute" %}
{% set description="US Zen Institute — a Buddhist temple in Germantown, Maryland. Bilingual Chinese/English teachings, meditation, and community since 1988." %}
```

Add hidden h1 after the `<main>` tag (before banner or as first element in content):

Edit the content block to include a visually-hidden `h1`:

```html
{% block content %}
<h1 class="sr-only">US Zen Institute</h1>
<div class="flex justify-center items-center mb-16">
```

**about.html**:

```html
{% set description="Learn about US Zen Institute, a Buddhist temple in Germantown, MD founded in 1988. Bilingual teachings, monastic community, and meditation center." %}
```

Change `<h2 class="text-center">About US Zen Institute</h2>` → `<h1 class="text-center">About US Zen Institute</h1>`

**columbarium.html**:

```html
{% set description="Support the US Zen Institute columbarium wing project — a sacred space with Kṣitigarbha Bodhisattva for monastic and lay memorial niches in Germantown, MD." %}
```

Change `<h2 class="text-center">Columbarium Wing Project` → `<h1 class="text-center">Columbarium Wing Project`

**support.html**:

```html
{% set description="Support US Zen Institute through donations: check, credit card, PayPal, Zelle. 501(c)(3) non-profit. Your contribution supports Buddhist teachings and community." %}
```

**contact.html**:

```html
{% set description="Contact US Zen Institute at 19225 Liberty Mill Road, Germantown, MD 20874. Phone: (301) 353-9781. Open Sundays 9 AM - 5 PM." %}
```

**courses.html**:

```html
{% set description="Lecture handouts for Diamond Sutra teachings by Ven. Dhammadipa at US Zen Institute. Study materials in Chinese." %}
```

Change `<h2 class="text-center">Courses</h2>` → `<h1 class="text-center">Courses</h1>`

**lectures.html**:

```html
{% set description="Video lectures by Ven. Dhammadipa on the Diamond Sutra and Heart Sutra from US Zen Institute in Germantown, MD." %}
```

Change `<h2 class="text-center">Lectures</h2>` → `<h1 class="text-center">Lectures</h1>`

**ksitigarbha.html**:

```html
{% set description="Photos of the Kṣitigarbha Bodhisattva statue created by Rev. Masahiro Maeda at Bukkyo University Museum, Kyoto, for US Zen Institute's columbarium." %}
```

Change `<h2 class="text-center">Kṣitigarbha Bodhisattva</h2>` → `<h1 class="text-center">Kṣitigarbha Bodhisattva</h1>`

- [ ] **Step 2: Update courses.html — replace tinyurl links**

Replace each `https://tinyurl.com/...` with the expanded real URL:

| tinyurl | Resolved URL |
|---------|-------------|
| `DiamondSutraPPT1` | `https://drive.google.com/file/d/1fMguyWzj3-B2crvXenJwzTNxeDAs7Vn_/view?usp=sharing` |
| `DiamondSutraHandout2` | `https://drive.google.com/file/d/1tsxhghr4i58F9g8ndIQhqdw7-KPJxZlC/view?usp=sharing` |
| `DiamondSutraHandout3` | `https://drive.google.com/file/d/1zlTJc9EevyoMhGpvfMXRbHp4G4Zj2NCR/view?usp=sharing` |
| `DiamondSutraHandout4` | `https://drive.google.com/file/d/1c0CPRnlBq4b7RP-c6FBvmq2eOP2dpXWH/view?usp=sharing` |
| `DiamondSutraRef1` | `https://drive.google.com/file/d/1OqJmUZjfdVBj59-TClLJOuOOC4fWwwW9/view?usp=sharing` |

In `courses.html`, replace each `href="https://tinyurl.com/..."` with the corresponding resolved Google Drive URL.

- [ ] **Step 3: Update lectures.html — youtube-nocookie.com**

Replace `www.youtube.com/embed` with `www.youtube-nocookie.com/embed` in the two `accordianEntry` calls:

```
https://www.youtube.com/embed/videoseries?si=WC-GiAvixTvlryk1&amp;list=PL9I1Ncy5MTbHdYxq8_h5nW4zoFhlXH_wL
→
https://www.youtube-nocookie.com/embed/videoseries?si=WC-GiAvixTvlryk1&amp;list=PL9I1Ncy5MTbHdYxq8_h5nW4zoFhlXH_wL
```

(Same for the second playlist.)

- [ ] **Step 4: Update ksitigarbha.html — enable modal on mobile**

In `src/scripts/ksitigarbha.js`, remove the `window.innerWidth < 768` guard:

```js
(function () {
  var modalImage = document.getElementById('modalImage');
  var imageModal = document.getElementById('imageModal');
  if (!modalImage || !imageModal) return;

  document.addEventListener('click', function (e) {
    var galleryItem = e.target.closest('[data-gallery-item]');
    if (!galleryItem) return;
    var img = galleryItem.querySelector('img');
    if (img) {
      modalImage.src = img.src;
      if (typeof imageModal.showModal === 'function') {
        imageModal.showModal();
      }
    }
  });
})();
```

- [ ] **Step 5: Commit**

```bash
git add src/views/index.html src/views/about.html src/views/columbarium.html src/views/support.html src/views/contact.html src/views/courses.html src/views/lectures.html src/views/ksitigarbha.html src/scripts/ksitigarbha.js
git commit -m "feat: add h1 and meta descriptions per page, enable gallery modal on mobile"
```

---

### Task 6: SCSS consolidation

**Files:**
- Delete: `src/sass/index.scss`
- Modify: `src/sass/main.scss` (no change needed, stays as-is)

- [ ] **Step 1: Update layout.html to reference main.scss instead of index.scss**

In `src/views/layout.html`, change:

```html
<link rel="stylesheet" href="../sass/index.scss">
```

to:

```html
<link rel="stylesheet" href="../sass/main.scss">
```

- [ ] **Step 2: Remove index.scss**

```bash
rm src/sass/index.scss
```

- [ ] **Step 3: Commit**

```bash
git add src/views/layout.html src/sass/index.scss
git commit -m "refactor: consolidate SCSS into single main.scss"
```

---

### Task 7: Refactor carousel to data-driven

**Files:**
- Modify: `src/views/index.html`
- Modify: `src/scripts/carousel.js`

- [ ] **Step 1: Move image paths to Nunjucks array**

In `index.html`, replace the 32 individual `carouselItem()` calls with:

```jinja2
{% set carouselImages = [
  '../images/homepage/1768422571103.jpg',
  '../images/homepage/1768422572115.jpg',
  '../images/homepage/1768422572828.jpg',
  '../images/homepage/1768422573510.jpg',
  '../images/homepage/1768422573954.jpg',
  '../images/homepage/1768422578619.jpg',
  '../images/homepage/20260131_114551.jpg',
  '../images/homepage/20260131_114730.jpg',
  '../images/homepage/20260131_115356.jpg',
  '../images/homepage/1771015782232.jpg',
  '../images/homepage/1771015782253.jpg',
  '../images/homepage/1771015782255.jpg',
  '../images/homepage/1771015782292.jpg',
  '../images/homepage/1774887468803.jpg',
  '../images/homepage/1774887468828.jpg',
  '../images/homepage/1774887468830.jpg',
  '../images/homepage/1774887473158.jpg',
  '../images/homepage/1775838100626.jpg',
  '../images/homepage/1775838100664.jpg',
  '../images/homepage/1775838100676.jpg',
  '../images/homepage/1775838100681.jpg',
  '../images/homepage/1776345606796.jpg',
  '../images/homepage/1776345612025.jpg',
  '../images/homepage/1776345616310.jpg',
  '../images/homepage/1776345620323.jpg',
  '../images/homepage/1785357399814.jpg',
  '../images/homepage/1785357405303.jpg',
  '../images/homepage/1785357408364.jpg',
  '../images/homepage/1785357411553.jpg',
  '../images/homepage/1785357414600.jpg',
  '../images/homepage/1785357417826.jpg',
  '../images/homepage/1785357420941.jpg',
] %}

<div id="carousel" class="carousel mx-auto my-4 w-full sm:max-w-[600px] md:max-w-[800px] px-2">
  {% for image in carouselImages %}
    {{ carouselItem(loop.index, image) }}
  {% endfor %}
</div>
```

- [ ] **Step 2: Add loading="lazy" to all carousel images**

In the `carouselItem` macro, ensure the `<img>` tag already has `loading="lazy"` (it does). All images already lazy-load.

- [ ] **Step 3: Commit**

```bash
git add src/views/index.html
git commit -m "refactor: move carousel images to data array for maintainability"
```

---

### Task 8: Build and verify

**Files:**
- None

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds, `dist/` contains all HTML files, `dist/sitemap.xml` exists, `dist/favicon.ico` and `dist/robots.txt` are present.

- [ ] **Step 2: Verify sitemap**

```bash
cat dist/sitemap.xml
```

Should contain 8 `<url>` entries with `https://uszen.org` base.

- [ ] **Step 3: Verify 404 page**

Check `dist/404.html` exists and renders properly.

- [ ] **Step 4: Verify all pages render**

```bash
for f in dist/index.html dist/about.html dist/columbarium.html dist/support.html dist/contact.html dist/courses.html dist/lectures.html dist/ksitigarbha.html dist/404.html; do
  if [ -f "$f" ]; then
    echo "✓ $f ($(wc -c < "$f") bytes)"
  else
    echo "✗ $f MISSING"
  fi
done
```

- [ ] **Step 5: Verify no unstaged changes**

```bash
git status
```

Expected: only `dist/` and `node_modules/` should be unstaged (both are gitignored). No unexpected modifications.
