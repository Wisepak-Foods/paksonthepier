# Paks on the Pier — Website

Static site for **paksonthepier.com**. Hosted on GitHub Pages, fronted by Cloudflare.

## Files
| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `menu.html` | Full menu |
| `style.css` | All styles |
| `CNAME` | Tells GitHub Pages to serve from paksonthepier.com |
| `robots.txt` | Tells crawlers what to index |
| `sitemap.xml` | Helps Google find every page |
| `images/` | Drop photos here |

## Images you still need to add

Drop these into the `images/` folder (any name works as long as it matches what's in the HTML):

- **`hero.jpg`** — the Chicago skyline + "Paks on the Pier" shot. Use a high-res JPG (~2000px wide), ~300KB after compression. This is the first thing every visitor sees.
- **`og-image.jpg`** — 1200×630px image for social sharing (Facebook/Twitter previews). Could be the hero or a dish photo.
- **`logo.png`** — the Paks logo (transparent PNG ideal).
- **`favicon.ico`** + **`apple-touch-icon.png`** — small icons for the browser tab. Can generate from your logo at https://realfavicongenerator.net (free).
- Food photos when ready — e.g. `bowl-hot.jpg`, `poke.jpg`, `sushi-burrito.jpg`. Once you have these, we'll add a photo grid to the homepage.

## Deploy steps (when you're ready)

1. **Create a GitHub account or organization for the business.** A free Organization under your personal account (recommended) keeps work compartmentalized.
2. **Create a new public repo** called `paksonthepier` (or anything).
3. **Push these files** to the `main` branch.
4. **Enable GitHub Pages**: repo Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)` → Save.
5. **Confirm custom domain**: under the same Pages settings, custom domain should populate as `paksonthepier.com` (from the `CNAME` file). Wait for the green check; SSL will provision automatically.
6. **In Cloudflare DNS**, add these records:
   - `A` record: name `@`, value `185.199.108.153` (proxy off / DNS only)
   - `A` record: name `@`, value `185.199.109.153`
   - `A` record: name `@`, value `185.199.110.153`
   - `A` record: name `@`, value `185.199.111.153`
   - `CNAME` record: name `www`, value `<your-github-username>.github.io`
   - All set to **DNS only** (gray cloud), not Proxied — GitHub Pages handles its own SSL.

## After it's live — the actually-important SEO

The website itself is one piece. For a restaurant, these matter even more:

1. **Google Business Profile** — claim it, add photos, hours, menu link. This is ~70% of local SEO.
2. **Submit sitemap** to Google Search Console: `https://paksonthepier.com/sitemap.xml`
3. **NAP consistency** — make sure your Name/Address/Phone is identical everywhere (site, Google, Facebook, Yelp, TripAdvisor, Navy Pier directory).
4. **Reviews on Google** — ask happy customers.
5. **Get listed**: Navy Pier's tenant directory, Eater Chicago, Choose Chicago, Chicago Reader, TripAdvisor.

## Updating the site later

To change menu items, hours, prices: edit the HTML files directly, commit, push. Site rebuilds in ~1 minute.
