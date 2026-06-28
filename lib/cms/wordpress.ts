import type { CmsSnapshot } from "./types";

type WordPressApiOptions = {
  baseUrl?: string;
};

async function getJson<T>(path: string, options: WordPressApiOptions = {}): Promise<T | null> {
  const baseUrl = options.baseUrl ?? process.env.WORDPRESS_API_URL;

  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getWordPressSnapshot(): Promise<Partial<CmsSnapshot> | null> {
  const snapshot = await getJson<Partial<CmsSnapshot>>("/ninety-six/v1/snapshot");
  return snapshot;
}
