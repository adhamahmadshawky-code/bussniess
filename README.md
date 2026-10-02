# PERSONAL BRAND — MASTER TEMPLATE

A reusable, data-driven single-page website for personal brands, freelancers, creators
and service providers.

**The demo ships with zero real client content.** Every personal field is a visible
placeholder like `[CLIENT NAME]`. Replace the contents of one file — `assets/js/config.js` —
and the entire site becomes that person's.

```
index.html                  document shell: meta, fonts, section scaffolding
assets/
  css/styles.css            design system (tokens → components → responsive)
  js/config.js              ALL client content. the only file you edit per client
  js/main.js                renderer + interactions. reads config.js only
  js/icons.js               icon geometry (45 glyphs, inline, zero requests)
  branding/  profile/  projects/  social/    client-supplied files
```

No build step, no framework, no dependencies. Open `index.html` and it runs.

---

## 1 · Quick start

```bash
# any static server works
npx serve .
python -m http.server 8000
```

Then open `http://localhost:8000`. Deploy by uploading the folder to Netlify, Vercel,
Cloudflare Pages, GitHub Pages or any shared host. There is nothing to compile.

---

## 2 · Customising a client

### The only file that matters

Everything lives in `assets/js/config.js`. Search for the `/*` block headers and work
top to bottom.

```js
client: {
  name: '[CLIENT NAME]',
  role: '[CLIENT ROLE / PROFESSION]',
  tagline: '[SHORT TAGLINE]',
  profileImage: '/assets/profile/profile.jpg',
  ...
}
```

| Want to change | Field |
| --- | --- |
| Name, profession, tagline, bio | `client.*` |
| Profile photo | `client.profileImage` (+ `client.profileImageAlt`) |
| Location / availability / experience | `client.location`, `.availability`, `.experience` |
| Services (3–6) | `services.items[]` — title, description, icon, price |
| Social platforms | `socials.items[]` — set `enabled: false` to remove one |
| Work / projects | `work.items[]` — title, description, image, link, tags |
| Testimonials + stats | `proof.*` (section is off by default) |
| Contact details & buttons | `contact.methods[]`, `contact.primary`, `contact.secondary` |
| All button labels | `cta.*` |
| Accent colour | `theme.accent` |
| Fonts | `theme.fonts` (+ the `<link>` in `index.html`) |
| Corner rounding | `theme.radius` |
| Light/dark default | `theme.default` |
| Footer text | `footer.*` |
| Show/hide interface chrome | `features.*` |

### Hiding things

* Set any text field to `""` → that element is not rendered.
* Set a section's `enabled: false` → the whole section leaves the DOM.
* Remove a service, social or project from the array → it disappears, and the grid
  re-balances its column count automatically (1–3 items fill one row, 4 becomes 2×2,
  5–6 become 3 columns).
* Nav links whose target section is missing are dropped from the menu automatically.

### Placeholders are visible on purpose

Any value wrapped in `[brackets]` is treated as a placeholder and marked in the UI when
the highlighter button (the pen icon in the navbar) is on. Use it to show a client exactly
which fields you still need from them. Real content renders as normal text.

---

## 3 · Brand system

### Accent colour — one variable, whole site

```js
theme: { accent: '#d8b26b' }
```

At runtime this expands into four derived tokens so the accent stays legible everywhere:

```css
--accent        the colour itself
--accent-soft   13% tint for backgrounds and hovers
--accent-line   34% tint for borders and rules
--accent-glow   28% tint for shadows
--accent-ink    auto-picked readable text colour for filled buttons
```

Preview candidates live in the console:

```js
PB.setAccent('#c8a06a')   // warm sand
PB.setAccent('#7ab8a4')   // sage
PB.setAccent('#8ab4f8')   // electric blue
PB.setAccent('#e07a5f')   // terracotta
PB.setTheme('light')
```

To change the neutral base instead, edit the two token blocks at the top of
`assets/css/styles.css` (`:root` for dark, `[data-theme="light"]` for light).

### Typography — one place

The default pairing is an editorial serif (`Instrument Serif`) over a neutral UI sans
(`Inter`). To swap it:

1. Add the `<link>` for the new family in `index.html`.
2. Set `theme.fonts.display` and `theme.fonts.body` in `config.js`.

The CSS variables `--font-display` and `--font-body` are the single source of truth; every
heading, label, quote and piece of body copy derives from them.

### Icons

`assets/js/icons.js` holds 45 inline glyphs in two groups:

* `brand` — instagram, tiktok, youtube, linkedin, facebook, x, behance, dribbble, github,
  whatsapp, telegram, spotify (solid marks)
* `ui` — arrow-right, arrow-up-right, menu, x, sun, moon, check, mail, phone, calendar,
  map-pin, send, message-circle, globe, sparkles, layers, pen-tool, code, camera, video,
  mic, compass, zap, heart, box, briefcase, users, palette, target, feather, eye,
  highlighter, trending-up (stroked)

Reference one by key in `config.js`:

```js
socials: { items: [{ platform: 'behance', ... }] }      // brand mark
services: { items: [{ icon: 'palette', ... }] }         // stroked glyph
```

Both groups follow `currentColor`, so they inherit any accent or text colour. Adding a
glyph is a one-line addition; no icon font, no network request.

---

## 4 · Sections

| Section | Anchor | On by default | Notes |
| --- | --- | --- | --- |
| Hero | `#home` | yes | Name, role, tagline, two CTAs, portrait frame |
| Find me online | `#social` | yes | Social cards with optional cover art |
| More than a profile | `#about` | yes | Editorial bio + facts list |
| What I do | `#services` | yes | 3–6 cards, optional starting price |
| Featured Work | `#work` | yes | Lead card spans the row; 2–6 items |
| Proof | `#proof` | **no** | Stats and testimonials, both optional |
| Contact | `#contact` | yes | Panel, method list, two buttons |
| Footer | — | yes | Auto-generated year |

Each section removes itself from the DOM if it has no content, so a client with no
portfolio gets no empty gaps and no dead nav links.

---

## 5 · Images

Drop client files into the folders listed in `assets/README.md`. If an image is missing the
frame keeps a designed empty state — outlined monogram, faint grid, corner ticks, mono
label — so the page never shows a broken image or an empty grey box.

Recommended: `profile.jpg` 1200×1500, `project-*.jpg` 1600×1200, `og-image.jpg` 1200×630,
under ~250 KB each.

---

## 6 · What was built in

**Motion** — IntersectionObserver reveals with staggered delays, a clip-path wipe on images
and the contact panel, an animated navbar that compacts on scroll, active-section
underlines, magnetic-ish button hover, and a full-screen mobile menu with staggered links.
Every animation collapses to zero under `prefers-reduced-motion: reduce`.

**Accessibility** — semantic landmarks, skip link, labelled controls, `aria-expanded` /
`aria-pressed` / `aria-current`, visible focus rings, focus trap and Escape handling in the
mobile menu, alt text on every image, and text contrast held at or above 4.5:1 in both
themes.

**Performance** — no framework, no icon font, no runtime requests except the two webfonts.
Icons are inline SVG. Images are lazy-loaded except the hero. Reveals use `transform`,
`opacity` and `clip-path` only.

**SEO** — title, description, Open Graph and Twitter tags are written from `config.js` at
runtime, and a `schema.org/Person` JSON-LD block is generated from whatever the client
actually supplied.

---

## 7 · Duplicating for the next client

```bash
cp -r personal-brand-template client-jane
```

1. Open `assets/js/config.js` and replace every `[BRACKETED]` value.
2. Drop images into `assets/`.
3. Set `theme.accent`, `theme.fonts`, `meta.title`, `meta.description`, `meta.url`.
4. Switch off the sections this client does not need.
5. Replace `assets/branding/favicon.svg` and set `meta.image`.
6. Search the folder for `[` once more — nothing placeholder-shaped should remain.

Because the layout, spacing scale, type scale and interaction patterns live in CSS, no
design work is repeated per client. Only content and brand change.

---

## 8 · Notes and known limits

* Content is rendered client-side from `config.js`, so crawlers that execute JS (Google,
  Bing, social preview bots) index it fine, but very old crawlers see only the `<noscript>`
  note. If a client needs a prerendered HTML file, the same render functions can be run at
  build time to emit static markup.
* The social section expects one card per platform. For a brand with more than six
  profiles, raise the `enabled` list and let the grid flow to three columns.
* `theme.accent` accepts a hex value; named colours and `rgb()` are ignored so the derived
  tints stay correct.