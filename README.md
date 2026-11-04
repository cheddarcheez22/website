# ContentMatter website

Plain static site. No build step, no dependencies.

## Files

- index.html: home page
- matters.html: The Matters blog (20 posts)
- services/: four industry pages
- hero-shader.js: animated hero background (loads lazily, about 780 KB compressed)
- 404.html, robots.txt, sitemap.xml, _headers: Cloudflare Pages extras

## Before you go live

1. Contact form: open index.html, find `YOUR_FORM_ID` and replace it with your Formspree form ID (free at formspree.io, create a form, copy the ID from its endpoint URL). Until then the form shows a "not connected" note and nothing is sent. The Book a call button works already.
2. Domain: robots.txt, sitemap.xml and the canonical tags use https://contentmatter.co. If your domain is different, find and replace it across the files.

## Hero background

Each page hero uses the shaders library (v4.0.4: Swirl, ChromaFlow, FlutedGlass, FilmGrain), bundled into hero-shader.js. It loads after the page and fades in. It needs WebGPU. Browsers without it, slow loads (30 second limit), and errors keep the static cream and teal glow fallback. With reduced motion turned on, Swirl and FlutedGlass speed is set to 0.

## Deploy with GitHub and Cloudflare Pages

1. Put these files at the root of your GitHub repo and push to main.
2. In Cloudflare, go to Workers and Pages, Create, Pages, Connect to Git, and pick the repo.
3. Build command: leave empty. Build output directory: `/` (the repo root).
4. Save and Deploy. Add your domain under Custom domains.

Pages are served with clean URLs: /matters and /services/restaurants work without .html.
