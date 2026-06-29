import type { EventRecord, NewsRecord } from "@/lib/cms/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function eventSlug(event: EventRecord) {
  return event.slug || slugify(event.title) || event.id;
}

export function newsSlug(post: NewsRecord) {
  return post.slug || slugify(post.title) || post.id;
}

export function eventPath(event: EventRecord) {
  return `/events/${eventSlug(event)}`;
}

export function newsPath(post: NewsRecord) {
  return `/news/${newsSlug(post)}`;
}

export function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}
