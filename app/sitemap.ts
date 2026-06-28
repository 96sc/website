import type { MetadataRoute } from "next";
import { getCmsSnapshot } from "@/lib/cms/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ninetysixsc.gov";
  const snapshot = await getCmsSnapshot();

  const staticRoutes = ["", "/search", "/services", "/government", "/government/council", "/government/meetings", "/government/departments", "/residents", "/business", "/visitors", "/events", "/contact"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...snapshot.services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date()
    }))
  ];
}
