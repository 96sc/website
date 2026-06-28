import type { CmsSnapshot } from "./types";
import { seedContent } from "./seed";
import { getWordPressSnapshot } from "./wordpress";

let cachedSnapshot: CmsSnapshot | null = null;

export async function getCmsSnapshot(): Promise<CmsSnapshot> {
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  const wpSnapshot = await getWordPressSnapshot();
  cachedSnapshot = {
    ...seedContent,
    ...wpSnapshot,
    pages: wpSnapshot?.pages ?? seedContent.pages,
    services: wpSnapshot?.services ?? seedContent.services,
    alerts: wpSnapshot?.alerts ?? seedContent.alerts,
    events: wpSnapshot?.events ?? seedContent.events,
    meetings: wpSnapshot?.meetings ?? seedContent.meetings,
    departments: wpSnapshot?.departments ?? seedContent.departments,
    officials: wpSnapshot?.officials ?? seedContent.officials,
    documents: wpSnapshot?.documents ?? seedContent.documents,
    externalLinks: wpSnapshot?.externalLinks ?? seedContent.externalLinks
  };

  return cachedSnapshot;
}

export async function getServiceBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.services.find((service) => service.slug === slug) ?? null;
}

export async function getPageBySlug(slug: string) {
  const snapshot = await getCmsSnapshot();
  return snapshot.pages.find((page) => page.slug === slug) ?? null;
}
