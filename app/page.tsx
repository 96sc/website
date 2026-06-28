import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { formatDate, shortDate } from "@/lib/utils/date";

export default async function Home() {
  const snapshot = await getCmsSnapshot();
  const featuredServices = snapshot.services.filter((service) => service.featured).slice(0, 4);
  const nextEvents = snapshot.events.slice(0, 3);
  const activeAlerts = snapshot.alerts.filter((alert) => alert.active);
  const activeTownAlert =
    activeAlerts.find((alert) => alert.severity === "urgent") ?? activeAlerts[0];
  const activeTownAlertTone =
    activeTownAlert?.severity === "urgent" ? "urgent" : "general";
  const quickActions: Record<string, { label: string; note: string }> = {
    "trash-collection": { label: "Trash pickup", note: "Thursday service" },
    "pay-ticket": { label: "Pay a bill", note: "Tickets and court payments" },
    "business-license-renewal": { label: "Business licenses", note: "Renew online" },
    "utilities-cpw": { label: "Utilities", note: "Water, sewer, electric" }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 aria-label="Ninety Six starts here.">
              <span aria-hidden="true">Ninety Six</span>
              <span aria-hidden="true">starts here.</span>
            </h1>
            <form className="hero-search" action="/search" role="search">
              <label htmlFor="hero-site-search">How can we help?</label>
              <div className="hero-search-control">
                <input
                  id="hero-site-search"
                  name="q"
                  type="search"
                  placeholder="Search services, payments, meetings, and more…"
                  enterKeyHint="search"
                />
                <button type="submit">
                  <Icon name="search" width={20} height={20} />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section
        className={activeTownAlert ? "quick-actions-section has-alert" : "quick-actions-section"}
        aria-label="Common town services"
      >
        {activeTownAlert ? (
          <Link
            className={`common-services-alert common-services-alert-${activeTownAlertTone}`}
            href={activeTownAlert.href ?? "/events"}
            aria-label={`${activeTownAlert.title}: ${activeTownAlert.message}`}
          >
            <span className="common-services-alert-icon">
              <Icon name="bell" width={22} height={22} />
            </span>
            <span className="common-services-alert-copy">
              <strong>{activeTownAlert.title}</strong>
              <span>{activeTownAlert.message}</span>
            </span>
            <span className="common-services-alert-link">
              View alert
              <Icon name="chevron-right" width={18} height={18} />
            </span>
          </Link>
        ) : null}
        <div className="quick-actions-strip">
          <div className="quick-actions-intro">
            <p className="eyebrow">Common services</p>
            <h2>Start with what you need.</h2>
          </div>
          {featuredServices.map((service) => (
            <Link className="quick-action-item" href={`/services/${service.slug}`} key={service.id}>
              <span className="quick-action-icon">
                <Icon name={service.icon} width={24} height={24} />
              </span>
              <span>
                <strong>{quickActions[service.slug]?.label ?? service.title}</strong>
                <small>{quickActions[service.slug]?.note ?? service.summary}</small>
              </span>
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-news" aria-label="Recent news">
        <div className="home-news-inner">
          <div className="home-news-heading">
            <p className="eyebrow">Recent news</p>
            <h2>Latest from town hall.</h2>
            <Link className="news-more-link" href="/events">
              See more
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
          </div>
          {snapshot.alerts.map((alert) => (
            <Link className="home-news-card" href={alert.href ?? "/services"} key={alert.id}>
              <span>{formatDate(alert.updatedAt)}</span>
              <h3>{alert.title}</h3>
              <p>{alert.message}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="task-finder home-task-finder">
        <div className="page-section">
          <SectionHeading
            title="Resident Services"
          />
          <div className="task-list">
            <Link href="/services/pay-ticket">
              Pay a traffic ticket
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
            <Link href="/business">
              Renew a business license
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
            <Link href="/services/trash-collection">
              Check trash pickup
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
            <Link href="/government/meetings">
              Find agendas and minutes
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
            <Link href="/contact">
              Contact a department
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
            <Link href="/government/council">
              See mayor and council
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="story-band">
        <div className="page-section story-grid">
          <div className="story-image">
            <Image
              src="/media/9fde7751-ec34-41a8-8fd4-9602ee0b4ab6MdResProxy.jpg"
              alt="Historical reenactors performing outdoors in Ninety Six"
              width={1000}
              height={559}
            />
          </div>
          <div>
            <p className="eyebrow">Explore Ninety Six</p>
            <h2>Parks, history, events, and local places.</h2>
            <p>
              Plan a visit around town parks, Revolutionary War history, local events, and the
              everyday places that make Ninety Six feel welcoming and easy to know.
            </p>
            <div className="button-row">
              <ActionLink href="/visitors">Explore visitor information</ActionLink>
              <ActionLink href="/events" variant="secondary">
                See events
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section home-events">
        <SectionHeading
          eyebrow="Events"
          title="Upcoming events."
          description="Find town meetings, festivals, community gatherings, and other dates to know."
        />
        <div className="event-grid">
          {nextEvents.map((event) => {
            const eventHref = event.href ?? "/events";
            const external = eventHref.startsWith("http");
            const [month, day] = shortDate(event.date).split(" ");

            return (
              <Link
                className="event-card"
                href={eventHref}
                key={event.id}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <span className="event-date-badge" aria-label={formatDate(event.date)}>
                  <span>{month}</span>
                  <strong>{day}</strong>
                </span>
                <span className="event-card-body">
                  <span className="eyebrow">{event.time}</span>
                  <h3>{event.title}</h3>
                  <span>{event.summary}</span>
                </span>
                <span className="event-card-meta">
                  <strong>{event.location}</strong>
                  <span>
                    View event
                    <Icon name={external ? "external" : "chevron-right"} width={18} height={18} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="button-row">
          <ActionLink href="/events">See all events</ActionLink>
        </div>
      </section>

      <section className="page-section page-section-tight home-public-notice">
        <div className="public-notice">
          <div>
            <p className="eyebrow">Town notices</p>
            <h2>Stay connected to service updates.</h2>
            <p>
              Watch this space for closings, service changes, meeting updates, and other timely
              information from Town Hall.
            </p>
          </div>
          <div className="button-row">
            <ActionLink href="/events">See upcoming events</ActionLink>
            <ActionLink href="/contact" variant="secondary">
              Contact Town Hall
            </ActionLink>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
