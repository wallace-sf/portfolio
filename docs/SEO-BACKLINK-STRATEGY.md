# SEO — Backlink & Content Strategy

> Not part of the numbered architecture docs (00–12) — this is product/marketing strategy, not code.
> See also: [ISSUES-FOLLOWUP.md](./ISSUES-FOLLOWUP.md), [ROADMAP.md](./ROADMAP.md).

## Context

While investigating why `wallace-ferreira.dev` pages weren't being indexed by Google/Bing
(root cause: duplicate content across `www` / `.vercel.app` domains, fixed via 301 redirects
— see PR history around 2026-07-09), we used Bing Webmaster Tools' **Backlinks → Backlinks To
Any Site** comparison to benchmark against [paulie.dev](https://www.paulie.dev/), the site
that originally inspired this portfolio's design.

## Findings (2026-07-24 snapshot)

| | wallace-ferreira.dev | paulie.dev |
|---|---|---|
| Total referring domains | 0 (new domain) | 53 |
| Anchor text variations | 0 | 55 |

**Top referring domains for paulie.dev:** `smashingmagazine.com` (22), `thebrandingstore.net`
(11), `marketingsolution.com.au` (9), `creati.ai` (8), `gatsbyjs.com` (7), `yeswebdesigns.com`
(7), `oneseocompany.com` (6), `dev.to` (6), `lightrun.com` (6), `iodroplet.com` (5).

**Top anchor texts:** mostly **blog post titles** — "Using Gatsby Functions as an abstracted
API", "Create an SVG Doughnut Chart From Scratch", "How to fix Gatsby's slow local build
times" — not generic "portfolio" or "homepage" anchors.

## Takeaway

Paulie's backlinks are driven almost entirely by **technical blog content** being cited by
other sites (tech publications, framework ecosystem sites, dev community platforms), plus a
handful of **portfolio showcase/directory sites**. The portfolio itself (the projects listing)
is not the main backlink driver — the writing is.

## Action ideas (not yet scheduled)

1. **Write technical posts** about real problems solved in the showcased projects (Buyr,
   B2B E-Commerce Platform, AI Golf Assistant, etc.) — genuinely useful write-ups are what
   attract organic citations, not the portfolio listing itself.
2. **Publish on `dev.to`** with a canonical/backlink to the relevant portfolio project page —
   low effort, appeared as a real referring domain for Paulie.
3. **Submit to portfolio showcase/directory sites** (the kind of domains seen in the
   `thebrandingstore.net` / `creati.ai` / `yeswebdesigns.com` category).
4. Re-run the Bing backlink comparison periodically to track progress against this baseline.

This is a medium/long-term authority-building strategy, independent of the indexing bugs
(duplicate content, IndexNow setup — tracked separately) that were fixed in July 2026.
