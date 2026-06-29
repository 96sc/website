import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { eventPath } from "@/lib/cms/links";
import { buildEventsJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { formatDateRange, formatTimeRange } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Events",
  description: "Town events, council meetings, closures, and community happenings."
};

export default async function EventsPage() {
  const snapshot = await getCmsSnapshot();
  const eventsJsonLd = buildEventsJsonLd(snapshot.events);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Events</p>
          <h1>Town events and public meetings.</h1>
          <p>
            Staff can publish events, closures, and meeting notices in WordPress, then the public site
            renders them here.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="Upcoming and featured" />
        <div className="event-grid">
          {snapshot.events.map((event) => (
            <Link className="event-card" href={eventPath(event)} key={event.id}>
              {event.image ? (
                <img
                  className="event-card-image"
                  src={event.image.src}
                  alt={event.image.alt ?? ""}
                  loading="lazy"
                />
              ) : null}
              <div className="event-card-content">
                <p className="eyebrow">{formatDateRange(event.date, event.endDate)}</p>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <p>
                  <strong>{formatTimeRange(event.time, event.endTime)}</strong> at {event.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(eventsJsonLd) }}
      />
    </>
  );
}
