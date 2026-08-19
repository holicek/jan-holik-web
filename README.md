# www.jan-holik.cz — static site

Production build of the two Claude Design mockups from this handoff bundle:

- `project/Jan Holík - web.dc.html` → `index.html` (homepage)
- `project/Jan Holík - sport.dc.html` → `sportovni-koucink.html` (sport coaching subpage)

Plain HTML/CSS, no build step, no framework, no dependency on the Testuvion
design-system files under `project/_ds/` (their tokens were reproduced
directly in `css/styles.css` so this folder is self-contained).

## Structure

```
site/
  index.html                 homepage
  sportovni-koucink.html     "Sportovní koučink" subpage
  css/styles.css             tokens + all component/layout styles
  assets/texture-noise.png   grain overlay used on the dark quote bands
```

## Running locally

Any static file server works, e.g.:

```
cd site
python3 -m http.server 8000
```

then open `http://localhost:8000/`.

## Deploying

Upload the contents of this folder as-is to any static host (Netlify,
Vercel, GitHub Pages, a plain web server, or as custom-code/embedded HTML
inside Wix if that's the preferred route) — there is nothing to build.

## Known placeholders — action needed before launch

Both pages have **three** photo spots left as neutral dashed placeholders
(no real photo exists in the source bundle):

- Homepage hero — portrait of Jan Holík (portrait orientation)
- Homepage "O mně" section — practice photo or portrait
- Sport page hero — sport-context photo (portrait orientation)
- Sport page "Proč právě já" section — training photo or portrait

Replace each `.photo-frame` block's contents with a real `<img>` tag
before launch (keep the wrapping `.frame`/`data-r="frame"` div and its
inline `height`/`border-radius`/`box-shadow` so sizing stays correct).

## SEO

Title/meta description on both pages come from chapter 9 of
`project/Wix návod.dc.html` (the SEO chapter the user already approved).
