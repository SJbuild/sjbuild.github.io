# SJ Build — Website

Static marketing website for SJ Build luxury villa complex, built with Vite + TypeScript + Tailwind CSS v4. Bilingual: Bulgarian (`/`) and English (`/en/`).

---

## Search engine & AI bot blocking

The site is currently **fully blocked** from all crawlers, search engines, and AI training bots. Three independent layers are in place. All three must be removed or updated before the site goes public.

---

### Layer 1 — `robots.txt`

**File:** `public/robots.txt`

The first thing any well-behaved crawler checks. Currently set to `Disallow: /` for all bots (`User-agent: *`), with explicit named entries for ~25 specific crawlers including Google, Bing, OpenAI's GPTBot, CCBot, ClaudeBot, PerplexityBot, Bytespider, and others.

**To disable (go public):** Replace the entire file content with:

```
User-agent: *
Allow: /

Sitemap: https://sjbuild.bg/sitemap.xml
```

You'll also want to restore a `sitemap.xml` at `public/sitemap.xml` so search engines can efficiently discover both pages. A minimal starting point:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://sjbuild.bg/</loc>
    <xhtml:link rel="alternate" hreflang="bg" href="https://sjbuild.bg/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://sjbuild.bg/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://sjbuild.bg/" />
  </url>
  <url>
    <loc>https://sjbuild.bg/en/</loc>
    <xhtml:link rel="alternate" hreflang="bg" href="https://sjbuild.bg/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://sjbuild.bg/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://sjbuild.bg/" />
  </url>
</urlset>
```

---

### Layer 2 — Meta robots tags

**Files:** `index.html`, `en/index.html`

Belt-and-suspenders in case a bot crawls the page despite `robots.txt`. Located near the top of each `<head>`:

```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<meta name="googlebot" content="noindex, nofollow" />
```

**To disable (go public):** Remove both lines from both HTML files, or replace them with the indexing-friendly version:

```html
<meta name="robots" content="index, follow" />
```

The `googlebot`-specific tag can be removed entirely — it is only needed to override `robots.txt` for Google, which is not required when `robots.txt` already allows crawling.

---

### Layer 3 — HTTP response headers *(not yet configured)*

The most authoritative signal — operates at the server level and applies to every resource, not just HTML pages. Not currently configured because it depends on the hosting provider.

When the site is deployed, add an `X-Robots-Tag: noindex, nofollow` response header while it is still in pre-launch. On go-live, remove the header entirely.

**How to configure per platform:**

**Netlify** — add a `netlify.toml` at the project root:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
```
Remove the `[[headers]]` block on go-live.

**Vercel** — add a `vercel.json` at the project root:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    }
  ]
}
```
Remove on go-live.

**Nginx** — inside the `server {}` block:
```nginx
add_header X-Robots-Tag "noindex, nofollow" always;
```
Remove the line on go-live.

**Apache** — in `.htaccess`:
```apache
Header set X-Robots-Tag "noindex, nofollow"
```
Remove on go-live.

---

### Go-live checklist

When the client confirms the site is ready to be indexed:

- [ ] Replace `public/robots.txt` with the permissive version (see Layer 1)
- [ ] Restore `public/sitemap.xml` with current `<lastmod>` dates (see Layer 1)
- [ ] Remove the two `<meta name="robots">` lines from `index.html` and `en/index.html` (see Layer 2)
- [ ] Remove or update the `X-Robots-Tag` HTTP header on the hosting platform (see Layer 3)
- [ ] Verify with [Google Search Console](https://search.google.com/search-console) that both pages are indexable
- [ ] Submit the sitemap URL in Google Search Console to accelerate initial indexing

---

## Development

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build locally
```

The build produces two entry points: `dist/index.html` (Bulgarian) and `dist/en/index.html` (English). All static assets are written to `dist/`.
