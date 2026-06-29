import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot, getEventBySlug } from "@/lib/cms/content";
import { eventSlug, isExternalHref } from "@/lib/cms/links";
import { buildEventsJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { formatDateRange, formatTimeRange } from "@/lib/utils/date";
import { AppleMapsEmbed } from "./apple-maps-embed";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const snapshot = await getCmsSnapshot();
  return snapshot.events.map((event) => ({ slug: eventSlug(event) }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event"
    };
  }

  return {
    title: event.title,
    description: event.summary,
    openGraph: event.image
      ? {
          images: [
            {
              url: event.image.src,
              alt: event.image.alt ?? event.title
            }
          ]
        }
      : undefined
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const body = event.body?.length ? event.body : [event.summary];
  const locationAddress = event.address ?? event.location;
  const appleMapsEmbedToken = process.env.NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN;
  const eventJsonLd = buildEventsJsonLd([event]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Event</p>
          <h1>{event.title}</h1>
          <p>{event.summary}</p>
          <div className="button-row">
            <ActionLink href="/events" variant="secondary">
              All events
            </ActionLink>
            {event.href ? (
              <ActionLink href={event.href} external={isExternalHref(event.href)}>
                Related details
              </ActionLink>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="content-with-sidebar">
          <article className="article-body">
            {event.image ? (
              <img
                className="event-detail-image"
                src={event.image.src}
                alt={event.image.alt ?? ""}
              />
            ) : null}
            <SectionHeading title="Event details" />
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="detail-sidebar" aria-label="Event information">
            <article className="info-card">
              <h2>When</h2>
              <p>{formatDateRange(event.date, event.endDate)}</p>
              <p>{formatTimeRange(event.time, event.endTime)}</p>
            </article>
            <article className="info-card">
              <h2>Where</h2>
              <p>{event.location}</p>
              {event.address ? <p>{event.address}</p> : null}
            </article>
          </aside>
        </div>
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading title="Map" />
        <AppleMapsEmbed
          token={appleMapsEmbedToken}
          latitude={event.latitude}
          longitude={event.longitude}
          placeId={event.applePlaceId}
          title={event.title}
          address={locationAddress}
        />
      </section>

      <ContactStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(eventJsonLd) }}
      />
    </>
  );
}
