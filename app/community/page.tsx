import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { eventPath, placePath } from "@/lib/cms/links";
import { formatDateRange, formatTimeRange, shortDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Community",
  description:
    "A community hub for events, local places, resources, volunteer opportunities, and history in Ninety Six."
};

const hubCards = [
  {
    title: "Community resources",
    icon: "file",
    description:
      "Find practical links for services, contacts, meetings, records, family needs, and local information.",
    href: "/community/resources",
    action: "Open resources"
  },
  {
    title: "Get involved",
    icon: "users",
    description:
      "See ways to attend meetings, ask questions, volunteer, and take part in civic life.",
    href: "/community/get-involved",
    action: "Find ways in"
  },
  {
    title: "History",
    icon: "landmark",
    description:
      "Start with Ninety Six history, Revolutionary War heritage, landmarks, and town traditions.",
    href: "/community/history",
    action: "Read history"
  }
];

export default async function CommunityPage() {
  const snapshot = await getCmsSnapshot();
  const upcomingEvents = [...snapshot.events]
    .sort((firstEvent, secondEvent) => {
      return new Date(firstEvent.date).getTime() - new Date(secondEvent.date).getTime();
    })
    .slice(0, 3);
  const featuredPlaces = snapshot.places
    .filter((place) => place.featured)
    .slice(0, 3);

  return (
    <>
      <section className="page-hero community-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Community</p>
          <h1>Events, places, resources, and local life.</h1>
          <p>
            A simple hub for what is happening around Ninety Six, where people gather, and how to
            connect with the services, history, and civic life of town.
          </p>
          <div className="button-row">
            <ActionLink href="/events">Upcoming events</ActionLink>
            <ActionLink href="/community/resources" variant="secondary">
              Community resources
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section community-events-preview">
        <div className="community-section-header">
          <SectionHeading
            title="Upcoming events"
            description="Three dates to know, pulled from the town event calendar."
          />
          <ActionLink href="/events" variant="secondary">
            See more events
          </ActionLink>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="community-event-grid">
            {upcomingEvents.map((event) => {
              const [month, day] = shortDate(event.date).split(" ");

              return (
                <Link className="community-event-card" href={eventPath(event)} key={event.id}>
                  <span className="event-date-badge" aria-label={formatDateRange(event.date, event.endDate)}>
                    <span>{month}</span>
                    <strong>{day}</strong>
                  </span>
                  <span className="community-event-card-body">
                    <span className="eyebrow">{formatTimeRange(event.time, event.endTime)}</span>
                    <h3>{event.title}</h3>
                    <span>{event.location}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="empty-note">No upcoming events are posted right now.</p>
        )}
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading
          title="Featured community spaces"
          description="Featured places and starting points for spending time, getting help, and finding your way around town."
        />
        {featuredPlaces.length > 0 ? (
          <div className="community-space-grid">
            {featuredPlaces.map((place) => (
              <article className="community-space-card" key={place.id}>
                {place.image ? <img src={place.image.src} alt={place.image.alt ?? ""} loading="lazy" /> : null}
                <div>
                  <h3>{place.title}</h3>
                  <p>{place.summary}</p>
                  <ActionLink href={placePath(place)} variant="quiet">
                    View place
                  </ActionLink>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-note">No featured places are posted right now.</p>
        )}
        <div className="button-row">
          <ActionLink href="/places" variant="secondary">
            See all places
          </ActionLink>
        </div>
      </section>

      <section className="page-section community-hub-section">
        <SectionHeading
          title="Community hub"
          description="Use these pages as the front door for resources, participation, and local history."
        />
        <div className="card-grid">
          {hubCards.map((card) => (
            <article className="info-card community-hub-card" key={card.title}>
              <Icon name={card.icon} width={28} height={28} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <ActionLink href={card.href} variant="quiet">
                {card.action}
              </ActionLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
