# ASSETS

Drop client-supplied files here. Nothing in this folder ships fake content — every
missing image falls back to a designed empty state inside the site.

```
assets/
  branding/    favicon.svg (placeholder), logo.svg, og-image.jpg (1200x630)
  profile/     profile.jpg  ·  secondary.jpg
  projects/    project-1.jpg · project-2.jpg · project-3.jpg · …
  social/      optional cover art per social card (instagram.jpg, youtube.jpg, …)
```

## Rules of thumb

| File            | Recommended size | Notes                                                    |
| --------------- | ---------------- | -------------------------------------------------------- |
| `profile.jpg`   | 1200x1500 (4:5)  | Portrait. Faces crop best centred and slightly above centre. |
| `secondary.jpg` | 1200x960 (5:4)   | Workspace, process, or detail shot.                      |
| `project-*.jpg` | 1600x1200 (4:3)  | Consistent treatment across the set reads as premium.     |
| `og-image.jpg`  | 1200x630         | Used for link previews.                                  |
| `logo.svg`      | vector           | Set `client.logo` in `config.js` to use it.              |

Convert heavy images before shipping: `.jpg` at quality 80, or `.webp`/`.avif` if the
client's audience supports it. Keep any single image under ~250 KB.

Paths live in `assets/js/config.js`. If a file is missing, the frame stays in its empty
state automatically — nothing breaks, no broken-image icons appear.