# Strapi API Forms

A Strapi 5 plugin for form building, submissions and the mails sent after a submission. It is
published to npm as `@ef2/strapi-api-forms` and installed in customer CMS projects. Feature
overview: `README.md`. This repository is public, and so is everything written here.

## Run and test

```bash
yarn install
yarn test
yarn test:ts:back
yarn test:ts:front
yarn build
```

These are the four steps of `.github/workflows/checks.yml`, which runs on every pull request and on
`main`. Yarn 4 comes from `packageManager`; Node 22 is the upper bound in `engines`.

There is no Strapi instance in this repository. The tests stub the `strapi` global and import the
server code directly (see `tests/`). Behaviour inside a real CMS is proven in a project that uses
the plugin, with the built `dist` copied or linked into its `node_modules`.

## Releasing

Publishing is manual: bump `version` in `package.json` on `main`, then `yarn npm publish`.
`prepublishOnly` runs the build, and `dist` is in `.gitignore`, so it is never committed. Only
`dist` goes into the package (`files`).

Projects that still depend on the unscoped `strapi-api-forms` get nothing from a release here.
They have to switch the dependency to `@ef2/strapi-api-forms` first.

## Do not touch without reading this

- Calls to `strapi.documents(...)` take `filters`, `sort` and the other shared query keys only.
  Since Strapi 5.37 any other key (`where`, `orderBy`) is dropped without an error, so a
  `findFirst` returns the first row of the table. That once sent every notification through the
  wrong form. `tests/document-service-params.test.ts` scans the source for it; keep it green.
  `strapi.db.query(...)` is the other layer and keeps `where`.
- A notification's `to` is either an address or the name of a form field whose submitted value is
  the address. A confirmation always uses a field name. Anything else must be skipped with a log
  line, never handed to the provider: `getValueFromSubmissionByKey` returns `-` for a missing
  field, and a provider answers that with a rejected message.
- A notification's `from` needs an address. Without one the provider rejects the whole message,
  so `resolveSender` falls back to the provider's default sender.

## Branches and pull requests

Open pull requests against `main`. Yassir Saouf reviews. No `Co-Authored-By` trailers and no
"Generated with" lines. Do not commit `dist`, a `package-lock.json` (this is a Yarn repo) or
`node_modules`.
