# ContentMatter: Deploy Handoff for Claude Code Cloud

Put this file at the root of your GitHub repo. A Claude Code cloud session only sees what is in the repo, so everything it needs is in this kit.

## What is in this kit

- `site/` is the live static site (plain HTML, CSS, JS, no build step). This becomes the repo root content.
- `design-reference/` is the approved design from the canvas: `cm.css` (shared styles), `*.dc.html` (one file per page), `img/` (photos), `canvas.json` (page list and layout). Treat it as the visual source of truth. Ignore the `<x-dc>`, `<helmet>` and `DCLogic` wrapper tags, they are canvas scaffolding.
- `DEPLOY-HANDOFF.md` is this file.

Suggested repo layout:

```
/ (repo root)
  index.html, matters.html, 404.html, robots.txt, sitemap.xml, _headers
  services/ (four industry pages)
  assets/ (styles.css, site.js, img/)
  hero-shader.js
  design-reference/   (kept for reference, not deployed content)
  DEPLOY-HANDOFF.md
```

---

## Part 1: One time setup (you do this)

1. Plan check. Claude Code on the web needs a Pro, Max, Team or Enterprise plan.
2. GitHub. Create a new repo (for example `contentmatter-site`), private is fine. Add a README so it is not empty.
3. Upload the kit. On the repo page choose Add file, then Upload files. Drag in the contents of `site/` (so `index.html` is at the repo root), plus the `design-reference/` folder and this file. Commit to `main`.
4. Connect GitHub to Claude. Go to claude.ai/code, sign in, and choose Sign in with GitHub or Connect GitHub.
5. Install the Claude GitHub App on that repo (needed for private repos): https://github.com/apps/claude/installations/new. If the repo is under an organization, an owner may need to approve. On Team or Enterprise plans an Owner must first enable the GitHub connector in Organization settings, Connectors.
6. Environment. Claude creates a Default environment automatically. Leave it as is.

## Part 2: Start the cloud session

1. At claude.ai/code pick your repo and the `main` branch.
2. Permission mode: choose Accept edits (or Plan if you want to approve the approach first).
3. Paste the task prompt below and submit.
4. Claude clones the repo, works, and pushes a new branch. Review the diff, leave inline comments if something is off, then choose Create PR and merge it into `main`.
5. The session stays open after the PR, so you can keep asking for changes.

## Part 3: Task prompt to paste

```
You are porting an approved design into a live static website and preparing it for Cloudflare Pages.

Context
- /site content at the repo root is the CURRENT live site: index.html, matters.html, services/*.html, assets/styles.css, assets/site.js, hero-shader.js. No build step. Keep it a plain static site.
- /design-reference holds the APPROVED design. cm.css is the shared stylesheet. Each *.dc.html is one page. Ignore the <x-dc>, <helmet> and DCLogic wrapper tags. img/ has the photos.

Goal
Update the live site so it matches design-reference, page by page, while keeping the live site's JavaScript behavior.

Page mapping
- Main.dc.html -> index.html
- Service-Businesses, Restaurants, Beauty-Clinics, Retail-Brands .dc.html -> services/service-businesses.html, restaurants.html, beauty-clinics.html, retail-brands.html
- Matters.dc.html -> matters.html
- Services, Campaign-Record, How-It-Works, Plans, Sample-Work .dc.html -> new pages: services/index.html (or services.html), campaign-record.html, how-it-works.html, plans.html, sample-work.html
- Post-<industry>-<why|what|where|when|who>.dc.html (20 files) -> individual post pages at /matters/<industry>-<topic>.html, each with breadcrumb, byline, and a "More in <industry>" list. Link the matters.html index titles to them.

Rules
1. Merge cm.css into assets/styles.css (or load both). Keep the teal at #3CBFB0 everywhere.
2. Move photos from design-reference/img to assets/img and reference them with root relative paths (/assets/img/...).
3. Keep and re-attach the live site's JS: scroll reveal (IntersectionObserver), header turning solid after 10px scroll, back to top button, carousel arrows, the teal dot cursor, and the WebGPU hero shader on the home hero. The canvas used CSS stand ins for these; the real JS wins.
4. Navigation order: Services (dropdown, first item "All services"), Work, How it works, Plans, theMATTERS, Contact. Same header and footer on every page.
5. Do NOT add any mention of Los Angeles, SoCal, or Pan Asian. Do not add location text to the footer.
6. Every page needs: unique <title> (50 to 60 chars), meta description (150 to 160 chars), one H1, canonical URL, Open Graph tags, descriptive alt text on images, and lazy loading below the fold.
7. Blog posts: add Article JSON-LD (headline, datePublished in September 2026, dateModified 2026-09-30, author = ContentMatter). Add FAQPage JSON-LD to the FAQ on the home page.
8. Update sitemap.xml to include every new page. Keep robots.txt allowing search and AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended).
9. Contact forms post to Formspree. Leave the placeholder YOUR_FORM_ID and list every file that contains it in your summary. Do not invent an ID.
10. The pricing FAQ answer is an intentional placeholder. Leave it and list it in your summary.
11. Retail pages have no photo yet. Use a neutral soft background card, no stock images.
12. Use clean URLs that match Cloudflare Pages defaults (about /services/restaurants, not .html, in links).

Verify before finishing
- Open each page locally (python3 -m http.server) and check for broken links, missing images, console errors, and horizontal scroll at 390px, 768px and 1440px widths.
- Grep the whole repo for: "Los Angeles", "SoCal", "Pan Asian", "#1F7F74", "YOUR_FORM_ID". Report results.
- Confirm Lighthouse style basics: one H1 per page, all images have alt, all links resolve.

Output
Commit in small logical commits on a new branch, push, and give me a summary: pages changed, new pages, anything you could not match exactly, and open TODOs.
```

## Part 4: Deploy to Cloudflare Pages (you do this)

Claude cannot log into your Cloudflare account, so this part is manual.

1. Merge the PR into `main`.
2. In Cloudflare dashboard go to Workers & Pages, Create, Pages, Connect to Git. Authorize GitHub and choose the repo.
3. Build settings: Framework preset None. Build command empty. Build output directory `/` (or leave blank). Save and Deploy.
4. You get a `*.pages.dev` URL in about a minute. Every push to `main` redeploys automatically; other branches get preview URLs.
5. Custom domain. In the Pages project choose Custom domains, Set up a domain, enter `contentmatter.co` (and `www`). If the domain is already on Cloudflare DNS it wires itself up; otherwise follow the CNAME instructions shown.
6. Make sure canonical, robots and sitemap all use `https://contentmatter.co`.

## Part 5: After launch checklist

- [ ] Replace `YOUR_FORM_ID` with the real Formspree form ID, then submit a test lead.
- [ ] Fill in the pricing FAQ answer.
- [ ] Add a retail storefront photo.
- [ ] Add real proof (case studies, numbers) to Sample Work.
- [ ] Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Run PageSpeed Insights on the home page. The hero shader is about 780 KB, so confirm it loads after first paint.
- [ ] Check every page at phone width.

## Troubleshooting

- Repo does not show in claude.ai/code: the Claude GitHub App is not installed on that repo. Reinstall and select it.
- Cloudflare shows a blank page: output directory is wrong. It must be `/` so `index.html` is at the top.
- 404 on a post: check the link uses the clean URL and the file exists in `/matters/`.
- Images missing: paths must start with `/assets/img/`.
- Form does nothing: `YOUR_FORM_ID` is still a placeholder.
- Cloud session ran out of room: ask it to port the home and industry pages first, merge, then start a second session for the 20 posts.
