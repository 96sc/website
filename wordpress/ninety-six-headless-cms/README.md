# Town of Ninety Six Headless CMS

This WordPress plugin provides the staff-editable CMS for the Next.js public site.

## Install

1. Copy `wordpress/ninety-six-headless-cms/` into the WordPress site's `wp-content/plugins/` directory.
2. Activate **Town of Ninety Six Headless CMS** in WordPress.
3. Add or import content in the new admin sections: Services, Alerts, Events, Meetings, Departments, Officials, Staff, Documents, and External Links. Use regular WordPress Posts for News.
4. For WordPress Pages that should appear in the public site snapshot, edit the page and check **Include in headless snapshot**.

## WP-CLI Local Test

If you already have a local WordPress site, set `WP_PATH` to its WordPress root. For LocalWP, it usually looks like:

```bash
export WP_PATH="$HOME/Local Sites/ninety-six-cms/app/public"
```

Copy or sync this plugin into that WordPress install:

```bash
rsync -a --delete \
  "/Users/gibsonbell/Documents/Town of 96 Website/wordpress/ninety-six-headless-cms/" \
  "$WP_PATH/wp-content/plugins/ninety-six-headless-cms/"
```

Activate the plugin:

```bash
wp --path="$WP_PATH" plugin activate ninety-six-headless-cms
```

Seed demo content:

```bash
wp --path="$WP_PATH" eval-file \
  "/Users/gibsonbell/Documents/Town of 96 Website/wordpress/ninety-six-headless-cms/bin/seed-demo-content.php"
```

Check the API:

```bash
WP_URL="$(wp --path="$WP_PATH" option get siteurl)"
curl "$WP_URL/wp-json/ninety-six/v1/snapshot"
```

If you use `wp server`, the fallback REST URL is also valid:

```bash
curl "$WP_URL/index.php?rest_route=/ninety-six/v1/snapshot"
```

Point the Next.js site at the local WordPress URL in `.env.local`:

```bash
WORDPRESS_API_URL=http://your-local-wp-site.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN=your-apple-maps-embed-token
```

## API

The public snapshot is available at:

```text
/wp-json/ninety-six/v1/snapshot
```

The response matches the Next.js `CmsSnapshot` shape in `lib/cms/types.ts`:

```text
pages, services, alerts, news, events, meetings, departments, officials, staff, documents, externalLinks
```

Set the Next.js environment variable to the WordPress REST root:

```bash
WORDPRESS_API_URL=https://cms.ninetysixsc.gov/wp-json
```

The Next.js adapter also accepts the WordPress site URL:

```bash
WORDPRESS_API_URL=https://cms.ninetysixsc.gov
```

## Stable IDs

Each edit screen includes an optional **Stable record ID** field. Use the existing seed IDs when migrating content, such as:

```text
service-trash
service-license
alert-business-license
link-business
link-ordinances
```

If a stable ID is blank, the API creates one from the WordPress slug.

## Related Documents

Create documents in **Documents** first. To attach documents to a Service or Meeting, add one document stable ID, WordPress slug, or post ID per line in **Related document IDs or slugs**.

## Event Maps

Every published Event gets an individual page on the public website. Fill in **Map address**,
**Map latitude**, and **Map longitude** to show an Apple Maps Embed API iframe when the Next.js
environment has `NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN` set.

For richer place details, use Apple's Place ID Lookup tool and paste the value into **Apple Maps
Place ID** on the event. If map fields are blank, the public event page falls back to a regular
Apple Maps link.

## Editor Guidance

Each custom content type has a **Publishing checklist** box in the editor. For Alerts, fill in the
title, alert message, severity, and check **Active** when it should display on the public site.
Alerts also include an optional **Custom icon SVG** field. Paste a complete inline SVG there when
the public alert should use a specific icon instead of the default bell.
Published WordPress Posts appear as News and receive their own public pages.
