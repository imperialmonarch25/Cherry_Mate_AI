# Cherry Mate AI — Moonlit Mind Sanctuary

A calm, responsive showcase for the Cherry Mate self-regulation and reflection
app. The original interactive sanctuary is preserved as
[`public/cherry-mate-sanctuary.html`](./public/cherry-mate-sanctuary.html) and
embedded in the page with a sandboxed iframe.

The launch button requests browser fullscreen; if fullscreen is unavailable,
the sanctuary remains available in its expanded embedded preview. Press `Esc`
to leave browser fullscreen. Responsive layouts support Mac, Windows, and
Android screen sizes, and fullscreen uses standard and browser-prefixed APIs.
Fullscreen requires a browser that permits it and a secure origin (HTTPS or
localhost).

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## GitHub Pages and custom domain

The `main` branch deploys automatically to GitHub Pages through
`.github/workflows/deploy-pages.yml`. After the first successful deployment,
set `cherrymateai.bond` under the repository's **Settings → Pages → Custom
domain**. At the domain registrar, point the apex (`@`) to GitHub Pages with
these A records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

DNS changes may take up to 24 hours to propagate. Enable **Enforce HTTPS** in
Pages settings once GitHub has issued the certificate.

The sanctuary is a supportive wellbeing project, not clinical therapy or
diagnosis. Its journal and saved notes remain in the browser's local storage.