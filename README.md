# Volt & Bolt Hardware

React and TypeScript storefront demo with a sample catalog, product filters, price sorting, and a locally saved quote request.

## Run locally

Use Node.js 22 or newer.

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and generate the static output in `dist/`.

Edit `src/catalog.ts` to update categories, products and prices. Product imagery is in `public/` and storefront styling is in `src/style.css`. The quote button generates a text file in the browser. For a live shop, replace demo content with verified product information and connect the quote flow to the shop’s chosen enquiry channel.
