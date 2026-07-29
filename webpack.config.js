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
        { from: "src/favicon.svg", to: "favicon.svg" },
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

  // enable live reload
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
