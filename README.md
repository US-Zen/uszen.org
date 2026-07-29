# US Zen Institute Website

Bilingual (Chinese/English) website for [US Zen Institute](https://uszen.org) in Germantown, MD.

## Getting Started

```sh
npm install
npm start
```

Opens at `http://localhost:3000` with live reload.

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build to `dist/` |
| `npm run format` | Format source files with Prettier |

## Tech Stack

- [Nunjucks](https://mozilla.github.io/nunjucks/) templates in `src/views/`
- [Tailwind CSS v3](https://tailwindcss.com/) + [daisyUI v4](https://daisyui.com/)
- Sass/SCSS in `src/sass/`
- [Webpack v5](https://webpack.js.org/) via `html-bundler-webpack-plugin`
- Vanilla JS in `src/scripts/`

## Project Structure

```
src/
├── views/         Nunjucks HTML templates
├── sass/          Stylesheets
├── scripts/       JavaScript files
├── images/        Image assets
└── documents/     PDFs
```

## License

ISC
