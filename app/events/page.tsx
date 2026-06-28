import type { Metadata } from "next";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Events",
  description: "Town events, council meetings, closures, and community happenings."
};

export default async function EventsPage() {
  const snapshot = await getCmsSnapshot();

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
            <article className="event-card" key={event.id}>
              <p className="eyebrow">{formatDate(event.date)}</p>
              <h3>{event.title}</h3>
              <p>{event.summary}</p>
              <p>
                <strong>{event.time}</strong> at {event.location}
              </p>
            </article>
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
