import type { CmsSnapshot } from "./types";
import { eventSlug, newsSlug } from "./links";
import { seedContent } from "./seed";
import { getWordPressSnapshot } from "./wordpress";

export async function getCmsSnapshot(): Promise<CmsSnapshot> {
  const wpSnapshot = await getWordPressSnapshot();

  return {
    ...seedContent,
    ...wpSnapshot,
    pages: wpSnapshot?.pages ?? seedContent.pages,
    services: wpSnapshot?.services ?? seedContent.services,
    alerts: wpSnapshot?.alerts ?? seedContent.alerts,
    news: wpSnapshot?.news ?? seedContent.news,
    events: wpSnapshot?.events ?? seedContent.events,
    meetings: wpSnapshot?.meetings ?? seedContent.meetings,
    departments: wpSnapshot?.departments ?? seedContent.departments,
    officials: wpSnapshot?.officials ?? seedContent.officials,
    staff: wpSnapshot?.staff ?? seedContent.staff,
    documents: wpSnapshot?.documents ?? seedContent.documents,
    externalLinks: wpSnapshot?.externalLinks ?? seedContent.externalLinks
  };
}

export async function getServiceBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.services.find((service) => service.slug === slug) ?? null;
}

export async function getPageBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.pages.find((page) => page.slug === slug) ?? null;
}

export async function getEventBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.events.find((event) => eventSlug(event) === slug) ?? null;
}

export async function getNewsBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.news.find((post) => newsSlug(post) === slug) ?? null;
}
