# KEM Enterprises — Production & SEO setup

## What is already fixed
- KEM production title/description replaces Emergent branding.
- Reusable SEO manager adds canonical, robots, Open Graph, Twitter metadata and JSON-LD.
- Product/category/blog pages use their admin SEO fields with safe fallbacks.
- Admin, search, compare, enquiry and private catalogue views are noindex.
- Backend dynamic sitemap uses PUBLIC_SITE_URL and includes categories, canonical product URLs and published blog posts.
- robots rules exclude private/non-search pages.
- Real .env files are intentionally excluded from this delivery.

## Before going live (after buying the domain)
1. Set frontend REACT_APP_SITE_URL=https://yourdomain.com
2. Set frontend REACT_APP_BACKEND_URL=https://your-backend-host
3. Set backend PUBLIC_SITE_URL=https://yourdomain.com
4. Set backend CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com (as applicable).
5. Replace the example.com entries in frontend/public/robots.txt and frontend/public/sitemap.xml.
6. Recommended: expose/proxy the backend dynamic /api/sitemap.xml at https://yourdomain.com/sitemap.xml so the complete product/category/blog sitemap is always current.
7. Add the final domain to Google Search Console and submit /sitemap.xml.
8. Add the Search Console verification value in Admin > Settings > SEO & Verification.
9. Rotate production secrets/credentials before launch and configure them only in the hosting provider environment settings.

## Build note
The uploaded ZIP contained a partial/corrupt node_modules directory. Source JSX syntax and Python syntax were verified after the fixes, but a clean production build requires a fresh dependency install (`npm install`/`yarn install`) in an environment with package-registry access. Do not deploy the included old node_modules directory.
