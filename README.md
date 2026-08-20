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
  index.html                    homepage
  sportovni-koucink.html        "Sportovní koučink" subpage
  ochrana-osobnich-udaju.html   GDPR privacy policy
  css/styles.css                @font-face + tokens + all component/layout styles
  robots.txt                    crawl rules + sitemap reference
  sitemap.xml                   both URLs, with image entries
  llms.txt                      plain-text summary for AI assistants
  favicon.svg                   "JH" monogram, brand gradient
  apple-touch-icon.png          180×180 iOS home-screen icon
  _headers                      Cloudflare Pages / Netlify response headers
  fonts/                        self-hosted woff2 (see note below)
    quicksand-latin.woff2       body + headings, latin subset
    quicksand-latin-ext.woff2   same, Czech diacritics
    geist-latin.woff2           .tag labels only, latin subset
    geist-latin-ext.woff2       same, Czech diacritics
    LICENSE.txt                 SIL Open Font License 1.1 for both families
  assets/
    holik-portret.jpg           homepage hero (derived from fotka1.jpg)
    beach.avif                  sport page hero
    golf.avif                   sport page "Proč právě já"
    holik.avif                  square portrait, used in og-image.jpg
    og-image.jpg                1200×630 social/search preview card
    fotka1.jpg                  ORIGINAL camera file — source only, not served
    texture-noise.png           grain overlay used on the dark quote bands
```

## Fonts

Quicksand and Geist are **self-hosted**, not loaded from Google Fonts. The
`.woff2` files are the byte-identical variable subsets Google serves (latin and
latin-ext, so Czech diacritics are covered), declared via `@font-face` at the
top of `css/styles.css` with `font-weight: 500 700` / `500 600` ranges.

Two reasons: loading a page then sends no request to any third party — which is
why the privacy policy has no Google Fonts section — and one less DNS lookup and
TLS handshake before text can paint.

To refresh a font, re-download the woff2 from the Google Fonts CSS API using a
weight *range* (`wght@500..700`), not a list — a single value returns a file
clamped to that weight and bold silently stops working. Rename the file when its
content changes: `_headers` marks `/fonts/*` immutable for a year.

## Running locally

Any static file server works, e.g.:

```
cd site
python3 -m http.server 8000
```

then open `http://localhost:8000/`.

## Deploying

Hosted on **Cloudflare**. If the Cloudflare Pages project is connected to
this Git repo, pushing to `main` triggers the deploy automatically; verify
under Workers & Pages → project → Deployments. If it is a Direct Upload
project instead, the files have to be uploaded manually (dashboard
drag & drop or `wrangler pages deploy`).

There is nothing to build — upload the folder as-is.

## Images

`assets/fotka1.jpg` is the untouched 946 KB camera original and is **not
referenced by any page**. The served hero is `assets/holik-portret.jpg`
(899×1200, 148 KB), generated from it with:

```
sips -s format jpeg -s formatOptions 72 -Z 1200 \
     assets/fotka1.jpg --out assets/holik-portret.jpg
```

Do not regenerate these as AVIF with `sips` — its AVIF encoder produces
files that report correct dimensions but render blank in Chromium (verified).
Use a real encoder (`avifenc`, `cwebp`, Squoosh) or stay with JPEG.

`assets/og-image.jpg` is a generated 1200×630 preview card (brand gradient +
the square portrait). To regenerate it, re-create the temporary layout page
and screenshot it at 1200×630 with headless Chrome.

## URLs — no `.html`

The Cloudflare Worker serves static assets with `.html` stripped and
**307-redirects the extension form**:

```
/sportovni-koucink.html  ->  307  ->  /sportovni-koucink
/index.html              ->  307  ->  /
```

So every canonical, sitemap entry, JSON-LD `@id`, Open Graph URL and internal
link uses the extensionless form (`/sportovni-koucink`, `/`). **Do not
reintroduce `.html` into links or SEO URLs** — it makes canonical tags point at
a URL that redirects away from itself, which is a contradictory signal to
search engines. The files on disk keep their `.html` names; only the URLs drop it.

## SEO

Both pages carry:

- unique `<title>` + meta description, `<link rel="canonical">`
- `robots` meta with `max-image-preview:large`
- Open Graph + Twitter card tags pointing at `assets/og-image.jpg`
- JSON-LD structured data — homepage: `WebSite`, `WebPage`, `ImageObject`,
  `Person`, `ProfessionalService` (address, opening hours, service catalog);
  sport page: `WebPage`, `BreadcrumbList`, `Person`, `Service`

`robots.txt` explicitly allows AI/LLM crawlers (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended, Applebot-Extended, CCBot …) so the content
can surface in assistant answers. To opt out of any of them, flip that
agent's `Allow: /` to `Disallow: /`.

`llms.txt` is a plain-text summary of services, contact details, approach and
qualifications for assistants that read it.

### After deploying

1. Submit `https://www.jan-holik.cz/sitemap.xml` in Google Search Console.
2. Check the structured data at <https://search.google.com/test/rich-results>.
3. Refresh the social preview caches:
   - <https://developers.facebook.com/tools/debug/>
   - <https://www.linkedin.com/post-inspector/>

All canonical/OG URLs are hardcoded to `https://www.jan-holik.cz/`. If the
site goes live on a different hostname, those absolute URLs must be updated.
