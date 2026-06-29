import type { MetadataRoute } from "next";
import { getCmsSnapshot } from "@/lib/cms/content";
import { eventPath, newsPath, placePath } from "@/lib/cms/links";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ninetysixsc.gov";
  const snapshot = await getCmsSnapshot();

  const staticRoutes = ["", "/search", "/services", "/government", "/government/council", "/government/meetings", "/government/departments", "/community", "/community/resources", "/community/get-involved", "/community/history", "/places", "/residents", "/visitors", "/events", "/news", "/contact", "/privacy", "/terms"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...snapshot.services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date()
    })),
    ...snapshot.events.map((event) => ({
      url: `${baseUrl}${eventPath(event)}`,
      lastModified: new Date(event.endDate ?? event.date)
    })),
    ...snapshot.places.map((place) => ({
      url: `${baseUrl}${placePath(place)}`,
      lastModified: new Date()
    })),
    ...snapshot.news.map((post) => ({
      url: `${baseUrl}${newsPath(post)}`,
      lastModified: new Date(post.updatedAt)
    }))
  ];
}
