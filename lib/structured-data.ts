import type { EventRecord } from "@/lib/cms/types";

const defaultSiteUrl = "https://ninetysixsc.gov";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");
}

function toAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${getSiteUrl()}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${siteUrl}/#organization`,
    name: "Town of Ninety Six",
    alternateName: "Town of Ninety Six, South Carolina",
    url: siteUrl,
    logo: toAbsoluteUrl("/brand/96Logo-Blue.svg"),
    image: toAbsoluteUrl("/media/welcome.png"),
    telephone: "+1-864-543-2200",
    email: "townhall@ninetysixsc.gov",
    address: {
      "@type": "PostalAddress",
      streetAddress: "120 Main Street W",
      addressLocality: "Ninety Six",
      addressRegion: "SC",
      postalCode: "29666",
      addressCountry: "US"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-864-543-2200",
        contactType: "customer service",
        areaServed: "Ninety Six, South Carolina",
        availableLanguage: "English"
      }
    ]
  };
}

function parseEventStartDate(event: EventRecord) {
  const timeMatch = event.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!timeMatch) {
    return event.date;
  }

  const [, rawHour, minute, meridiem] = timeMatch;
  const hourNumber = Number(rawHour);
  const hour =
    meridiem.toUpperCase() === "PM" && hourNumber !== 12
      ? hourNumber + 12
      : meridiem.toUpperCase() === "AM" && hourNumber === 12
        ? 0
        : hourNumber;

  return `${event.date}T${hour.toString().padStart(2, "0")}:${minute}:00`;
}

function buildEventLocation(location: string) {
  if (location === "Ninety Six Visitors Center, 97 Main Street E") {
    return {
      "@type": "Place",
      name: "Ninety Six Visitors Center",
      address: {
        "@type": "PostalAddress",
        streetAddress: "97 Main Street E",
        addressLocality: "Ninety Six",
        addressRegion: "SC",
        postalCode: "29666",
        addressCountry: "US"
      }
    };
  }

  return {
    "@type": "Place",
    name: location,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ninety Six",
      addressRegion: "SC",
      postalCode: "29666",
      addressCountry: "US"
    }
  };
}

export function buildEventsJsonLd(events: EventRecord[]) {
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;

  return events.map((event) => {
    const eventUrl = toAbsoluteUrl(event.href ?? "/events");

    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": `${eventUrl}#${event.id}`,
      name: event.title,
      description: event.summary,
      startDate: parseEventStartDate(event),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: buildEventLocation(event.location),
      organizer: {
        "@type": "GovernmentOrganization",
        "@id": organizationId,
        name: "Town of Ninety Six",
        url: siteUrl
      },
      url: eventUrl
    };
  });
}
