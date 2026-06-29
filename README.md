# Town of Ninety Six Civic Website

Fresh-start civic website implementation for Ninety Six, South Carolina.

## Stack

- Next.js with the App Router
- TypeScript
- Headless WordPress-ready content adapter
- Static seed content for local development and prototype review

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## CMS Integration

The public site reads from `lib/cms/content.ts`. By default it uses `lib/cms/seed.ts`.

The WordPress backend lives in `wordpress/ninety-six-headless-cms/`. Install that folder as a
WordPress plugin on the CMS site. It registers staff-editable content types for:

- pages
- news posts
- services
- alerts
- events
- meetings
- departments
- officials
- staff
- documents
- external links

The plugin exposes a JSON endpoint shaped like `CmsSnapshot` at:

```text
{WORDPRESS_API_URL}/ninety-six/v1/snapshot
```

`WORDPRESS_API_URL` may be the WordPress REST root or the WordPress site URL. These both work:

```text
https://cms.ninetysixsc.gov/wp-json
https://cms.ninetysixsc.gov
```

Then set the production environment:

```bash
WORDPRESS_API_URL=https://cms.ninetysixsc.gov/wp-json
NEXT_PUBLIC_SITE_URL=https://ninetysixsc.gov
NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN=your-apple-maps-embed-token
```

The API contract is represented in `lib/cms/types.ts`. If the WordPress endpoint is unavailable,
the site falls back to `lib/cms/seed.ts`.

Events and news posts each get public pages on the Next.js site. Event pages use the Apple Maps
Embed API when `NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN` is set and the event has latitude and longitude
fields from WordPress. Add an Apple Maps Place ID in WordPress when you want the embed to show place
card details.

## Content Notes

V1 preserves official external tools for payments, ordinances, DNR licensing, and legacy meeting archives. The current Drupal site should stay available until older records are reviewed and migrated.
