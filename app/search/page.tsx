import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";
import { Icon } from "@/components/icon";
import { getCmsSnapshot } from "@/lib/cms/content";
import { eventPath, newsPath, placePath } from "@/lib/cms/links";
import type { CmsSnapshot } from "@/lib/cms/types";
import { formatDate, formatDateRange, formatTimeRange } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Search",
  description: "Search town services, meetings, events, departments, records, and public links."
};

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

type SearchResult = {
  id: string;
  type: string;
  title: string;
  summary: string;
  href: string;
  external?: boolean;
  keywords: string[];
};

const coreResults: SearchResult[] = [
  {
    id: "core-services",
    type: "Page",
    title: "Services",
    summary: "Find trash pickup, ticket payment, licenses, utilities, and other town services.",
    href: "/services",
    keywords: ["service", "help", "trash", "ticket", "bill", "license", "utilities"]
  },
  {
    id: "core-government",
    type: "Page",
    title: "Government",
    summary: "Town Council, departments, meetings, ordinances, and public records.",
    href: "/government",
    keywords: ["council", "agenda", "minutes", "records", "ordinance", "department"]
  },
  {
    id: "core-community",
    type: "Page",
    title: "Community",
    summary: "Community hub for events, local spaces, resources, ways to get involved, and history.",
    href: "/community",
    keywords: ["community", "parks", "recreation", "family", "volunteer", "history", "events", "resources"]
  },
  {
    id: "core-community-resources",
    type: "Page",
    title: "Community Resources",
    summary: "Practical links for services, town contacts, meetings, records, events, and local information.",
    href: "/community/resources",
    keywords: ["community", "resources", "services", "contacts", "records", "meetings", "family", "help"]
  },
  {
    id: "core-get-involved",
    type: "Page",
    title: "Get Involved",
    summary: "Ways to participate through meetings, council requests, town contacts, and community events.",
    href: "/community/get-involved",
    keywords: ["get involved", "volunteer", "participate", "council", "meetings", "agenda", "community"]
  },
  {
    id: "core-history",
    type: "Page",
    title: "History",
    summary: "Ninety Six history, Revolutionary War heritage, landmarks, and community traditions.",
    href: "/community/history",
    keywords: ["history", "historic", "heritage", "revolutionary war", "landmarks", "traditions"]
  },
  {
    id: "core-visit",
    type: "Page",
    title: "Visit",
    summary: "Visitor information, outdoor activities, local history, attractions, and events.",
    href: "/visitors",
    keywords: ["visit", "visitors", "history", "parks", "attractions", "outdoors", "recreation"]
  },
  {
    id: "core-contact",
    type: "Page",
    title: "Contact Town Hall",
    summary: "Phone numbers, address, hours, departments, and town contact information.",
    href: "/contact",
    keywords: ["phone", "address", "hours", "department", "town hall", "contact"]
  },
  {
    id: "core-events",
    type: "Page",
    title: "Events",
    summary: "Upcoming town events, public meetings, closures, and community happenings.",
    href: "/events",
    keywords: ["event", "calendar", "festival", "meeting", "notice"]
  },
  {
    id: "core-places",
    type: "Page",
    title: "Places",
    summary: "Civic buildings, visitor stops, parks, historic sites, community spaces, and local destinations.",
    href: "/places",
    keywords: ["places", "location", "map", "visitor center", "town hall", "parks", "historic", "directions"]
  },
  {
    id: "core-privacy",
    type: "Page",
    title: "Privacy Policy",
    summary: "How the Town website handles information, cookies, records, and third-party services.",
    href: "/privacy",
    keywords: ["privacy", "policy", "cookies", "analytics", "records", "personal information"]
  },
  {
    id: "core-terms",
    type: "Page",
    title: "Terms of Use",
    summary: "Website use rules, public information notes, external links, and legal disclaimers.",
    href: "/terms",
    keywords: ["terms", "terms of use", "tos", "website rules", "privacy", "disclaimer"]
  }
];

const popularSearches = [
  { label: "Trash pickup", href: "/search?q=trash+pickup" },
  { label: "Pay a bill", href: "/search?q=pay+a+bill" },
  { label: "Business licenses", href: "/search?q=business+licenses" },
  { label: "Council meetings", href: "/search?q=council+meetings" }
];

const serviceAliases: Record<string, string[]> = {
  "trash-collection": ["trash pickup", "garbage", "sanitation", "waste pickup"],
  "pay-ticket": ["pay a bill", "pay bill", "pay ticket", "court payment", "traffic ticket"],
  "business-license-renewal": ["business licenses", "renew license", "license renewal"],
  "utilities-cpw": ["utilities", "water bill", "electric", "sewer", "cpw"]
};

function getQuery(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function createSearchIndex(snapshot: CmsSnapshot): SearchResult[] {
  return [
    ...coreResults,
    ...snapshot.pages.map((page) => ({
      id: page.id,
      type: "Page",
      title: page.title,
      summary: page.summary,
      href: `/${page.slug}`,
      keywords: [page.title, page.summary, ...page.body]
    })),
    ...snapshot.services.map((service) => ({
      id: service.id,
      type: "Service",
      title: service.title,
      summary: service.summary,
      href: `/services/${service.slug}`,
      keywords: [
        service.title,
        service.summary,
        service.audience,
        service.slug.replace(/-/g, " "),
        service.contact.label,
        ...(serviceAliases[service.slug] ?? []),
        ...service.steps,
        ...service.feesAndDeadlines,
        ...service.documents.map((document) => document.title)
      ]
    })),
    ...snapshot.alerts.map((alert) => ({
      id: alert.id,
      type: "Alert",
      title: alert.title,
      summary: alert.message,
      href: alert.href ?? "/",
      external: alert.href?.startsWith("http"),
      keywords: [alert.title, alert.message, alert.severity, alert.updatedAt]
    })),
    ...snapshot.news.map((post) => ({
      id: post.id,
      type: "News",
      title: post.title,
      summary: `${formatDate(post.date)}. ${post.summary}`,
      href: newsPath(post),
      keywords: [post.title, post.summary, ...post.body, formatDate(post.date)]
    })),
    ...snapshot.events.map((event) => ({
      id: event.id,
      type: "Event",
      title: event.title,
      summary: `${formatDateRange(event.date, event.endDate)} at ${formatTimeRange(event.time, event.endTime)}. ${event.summary}`,
      href: eventPath(event),
      keywords: [
        event.title,
        event.summary,
        event.location,
        event.address ?? "",
        event.time,
        event.endTime ?? "",
        formatDate(event.date),
        event.endDate ? formatDate(event.endDate) : "",
        ...(event.body ?? [])
      ]
    })),
    ...snapshot.places.map((place) => ({
      id: place.id,
      type: "Place",
      title: place.title,
      summary: `${place.address}. ${place.summary}`,
      href: placePath(place),
      keywords: [
        place.title,
        place.category,
        place.summary,
        place.address,
        place.phone ?? "",
        place.email ?? "",
        place.website ?? "",
        place.hours ?? "",
        ...(place.body ?? [])
      ]
    })),
    ...snapshot.meetings.map((meeting) => ({
      id: meeting.id,
      type: "Meeting",
      title: meeting.title,
      summary: `${formatDate(meeting.date)} at ${meeting.time}. ${meeting.location}.`,
      href: "/government/meetings",
      keywords: [
        meeting.title,
        meeting.location,
        meeting.time,
        formatDate(meeting.date),
        ...meeting.documents.map((document) => document.title)
      ]
    })),
    ...snapshot.departments.map((department) => ({
      id: department.id,
      type: "Department",
      title: department.name,
      summary: department.summary,
      href: "/government/departments",
      keywords: [
        department.name,
        department.summary,
        department.contact.label,
        department.contact.phone ?? "",
        department.contact.address ?? "",
        ...department.services
      ]
    })),
    ...snapshot.officials.map((official) => ({
      id: official.id,
      type: "Official",
      title: official.name,
      summary: [official.role, official.ward].filter(Boolean).join(", "),
      href: "/government/council",
      keywords: [
        official.name,
        official.role,
        official.ward ?? "",
        official.email ?? "",
        ...(official.committees ?? [])
      ]
    })),
    ...snapshot.staff.map((staff) => ({
      id: staff.id,
      type: "Staff",
      title: staff.name,
      summary: [staff.role, staff.department, staff.phone].filter(Boolean).join(", "),
      href: "/contact",
      keywords: [
        staff.name,
        staff.role,
        staff.department ?? "",
        staff.phone ?? "",
        staff.email ?? ""
      ]
    })),
    ...snapshot.documents.map((document) => ({
      id: document.id,
      type: "Record",
      title: document.title,
      summary: `${document.kind} record${document.date ? ` from ${formatDate(document.date)}` : ""}.`,
      href: document.href,
      external: document.href.startsWith("http"),
      keywords: [document.title, document.kind, document.date ?? ""]
    })),
    ...snapshot.externalLinks.map((link) => ({
      id: link.id,
      type: "Official link",
      title: link.title,
      summary: link.description,
      href: link.href,
      external: true,
      keywords: [link.title, link.description, link.type]
    }))
  ];
}

function searchSite(index: SearchResult[], query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(" ").filter((token) => token.length > 1);

  return index
    .map((result) => {
      const title = normalize(result.title);
      const summary = normalize(result.summary);
      const keywords = normalize(result.keywords.join(" "));
      const href = normalize(result.href);
      const haystack = `${title} ${summary} ${keywords} ${href}`;
      let score = 0;

      if (title.includes(normalizedQuery)) score += 40;
      if (keywords.includes(normalizedQuery)) score += 24;
      if (summary.includes(normalizedQuery)) score += 16;
      if (href.includes(normalizedQuery)) score += 6;

      tokens.forEach((token) => {
        if (title.includes(token)) score += 8;
        if (keywords.includes(token)) score += 5;
        if (summary.includes(token)) score += 3;
        if (haystack.includes(token)) score += 1;
      });

      return { ...result, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 12);
}

function SearchResultLink({ result }: { result: SearchResult }) {
  const content = (
    <div className="search-result-content">
      <span className="result-type">{result.type}</span>
      <h2>{result.title}</h2>
      <p>{result.summary}</p>
    </div>
  );

  if (result.external) {
    return (
      <a className="search-result" href={result.href} target="_blank" rel="noreferrer">
        {content}
        <Icon name="external" width={20} height={20} />
      </a>
    );
  }

  return (
    <Link className="search-result" href={result.href}>
      {content}
      <Icon name="chevron-right" width={20} height={20} />
    </Link>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const snapshot = await getCmsSnapshot();
  const params = await searchParams;
  const query = getQuery(params?.q);
  const results = searchSite(createSearchIndex(snapshot), query);

  return (
    <>
      <section className="page-hero search-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Search</p>
          <h1>How can we help?</h1>
          <p>Search town services, meetings, records, departments, events, and official links.</p>
        </div>
      </section>

      <section className="page-section search-page">
        <form className="search-page-form" action="/search" role="search">
          <label htmlFor="site-search">How do I...</label>
          <div className="search-page-control">
            <input
              id="site-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search trash pickup, pay a bill, meetings..."
              enterKeyHint="search"
            />
            <button type="submit">
              <Icon name="search" width={20} height={20} />
              <span>Search</span>
            </button>
          </div>
        </form>

        {query ? (
          <p className="search-results-summary">
            {results.length === 1
              ? `1 result for "${query}"`
              : `${results.length} results for "${query}"`}
          </p>
        ) : (
          <div className="popular-searches" aria-label="Popular searches">
            {popularSearches.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {query && results.length === 0 ? (
          <div className="empty-note">
            No matches yet. Try a shorter phrase like trash, tickets, meetings, licenses, or contact.
          </div>
        ) : null}

        <div className="search-results">
          {results.map((result) => (
            <SearchResultLink key={result.id} result={result} />
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
