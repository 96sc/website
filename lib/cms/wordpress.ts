import type { CmsSnapshot } from "./types";

type WordPressApiOptions = {
  baseUrl?: string;
};

const snapshotPath = "/ninety-six/v1/snapshot";
function getSnapshotUrls(baseUrl: string) {
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  if (cleanBaseUrl.endsWith(snapshotPath)) {
    return [cleanBaseUrl];
  }

  if (cleanBaseUrl.endsWith("/wp-json")) {
    const siteUrl = cleanBaseUrl.slice(0, -"/wp-json".length);
    return [`${cleanBaseUrl}${snapshotPath}`, `${siteUrl}/index.php?rest_route=${snapshotPath}`];
  }

  return [`${cleanBaseUrl}/wp-json${snapshotPath}`, `${cleanBaseUrl}/index.php?rest_route=${snapshotPath}`];
}

function readCollection<T extends unknown[]>(value: unknown): T | undefined {
  return Array.isArray(value) ? (value as T) : undefined;
}

function normalizeSnapshot(value: unknown): Partial<CmsSnapshot> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Record<string, unknown>;
  const snapshot: Partial<CmsSnapshot> = {
    pages: readCollection<CmsSnapshot["pages"]>(source.pages),
    services: readCollection<CmsSnapshot["services"]>(source.services),
    alerts: readCollection<CmsSnapshot["alerts"]>(source.alerts),
    news: readCollection<CmsSnapshot["news"]>(source.news),
    events: readCollection<CmsSnapshot["events"]>(source.events),
    places: readCollection<CmsSnapshot["places"]>(source.places),
    meetings: readCollection<CmsSnapshot["meetings"]>(source.meetings),
    departments: readCollection<CmsSnapshot["departments"]>(source.departments),
    officials: readCollection<CmsSnapshot["officials"]>(source.officials),
    staff: readCollection<CmsSnapshot["staff"]>(source.staff),
    documents: readCollection<CmsSnapshot["documents"]>(source.documents),
    externalLinks: readCollection<CmsSnapshot["externalLinks"]>(source.externalLinks)
  };

  return Object.values(snapshot).some((collection) => Array.isArray(collection)) ? snapshot : null;
}

async function getJson(path: string, options: WordPressApiOptions = {}): Promise<unknown> {
  const baseUrl = options.baseUrl ?? process.env.WORDPRESS_API_URL;

  if (!baseUrl) {
    return null;
  }

  const urls = path === snapshotPath ? getSnapshotUrls(baseUrl) : [`${baseUrl.replace(/\/$/, "")}${path}`];
  const fetchOptions =
    process.env.NODE_ENV === "development"
      ? ({ cache: "no-store" } as const)
      : ({ next: { revalidate: 60 } } as const);

  for (const url of urls) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        continue;
      }

      return await response.json();
    } catch {
      continue;
    }
  }

  return null;
}

export async function getWordPressSnapshot(): Promise<Partial<CmsSnapshot> | null> {
  const snapshot = await getJson(snapshotPath);
  return normalizeSnapshot(snapshot);
}
