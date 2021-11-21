# blankly.docs

## Setup

Install dependencies:

```bash
yarn install
```

### For Updated Font

For our specific font, make sure you go and update `./node_modules/@nuxt/content-theme-docs/src/tailwind.config.js`
with the `./tailwind.config.js`.

## Development

```bash
yarn dev
```

## Static Generation

This will create the `dist/` directory for publishing to static hosting:

```bash
yarn generate
```

To preview the static generated app, run `yarn start`

**Note that we're using an older version of nuxt to generate the proper formatting.**

For detailed explanation on how things work, checkout [nuxt/content](https://content.nuxtjs.org) and [@nuxt/content theme docs](https://content.nuxtjs.org/themes-docs).
