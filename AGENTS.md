# US Zen Institute Website

Static bilingual (Chinese/English) website for US Zen Institute.

## Commands

- `npm start` - Start dev server with live reload on port 3000
- `npm run build` - Production build to `dist/`
- `npm run format` - Format source files with Prettier
- `npm run format:check` - Check formatting without writing

## Tech Stack

- Nunjucks templates (.html in `src/views/`)
- Tailwind CSS v3 + daisyUI v4 + @tailwindcss/typography
- Sass/SCSS (`src/sass/`)
- Webpack v5 via html-bundler-webpack-plugin
- Vanilla JS in `src/scripts/`

## Conventions

- Formatting: Prettier (semi, singleQuote, trailingComma all, tabWidth 2, printWidth 100)
- Pre-commit: Husky + lint-staged auto-formats staged files
- No TypeScript, no ESLint, no tests
- JS goes in `src/scripts/` as separate files, referenced via `<script src="../scripts/...">` in templates
- Page-specific JS in per-page files; shared JS in `main.js`
- Each page sets `{% set activePage = "pagename" %}` for `aria-current` on nav
- Images below the fold use `loading="lazy"`
- Accessibility: skip-to-content link, `aria-current` on nav, `aria-label` on external links
