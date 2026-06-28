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

To connect a WordPress backend later, expose a JSON endpoint shaped like `CmsSnapshot` at:

```text
{WORDPRESS_API_URL}/ninety-six/v1/snapshot
```

Then set:

```bash
WORDPRESS_API_URL=https://cms.ninetysixsc.gov/wp-json
NEXT_PUBLIC_SITE_URL=https://ninetysixsc.gov
```

The planned CMS record types are represented in `lib/cms/types.ts`: pages, services, alerts, events, meetings, departments, officials, documents, and external links.

## Content Notes

V1 preserves official external tools for payments, ordinances, DNR licensing, and legacy meeting archives. The current Drupal site should stay available until older records are reviewed and migrated.
