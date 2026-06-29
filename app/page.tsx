import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { CustomSvgIcon } from "@/components/custom-svg-icon";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { eventPath, newsPath } from "@/lib/cms/links";
import { formatDate, formatTimeRange, shortDate } from "@/lib/utils/date";

export default async function Home() {
  const snapshot = await getCmsSnapshot();
  const featuredServices = snapshot.services.filter((service) => service.featured).slice(0, 4);
  const nextEvents = [...snapshot.events]
    .sort((firstEvent, secondEvent) => {
      return new Date(firstEvent.date).getTime() - new Date(secondEvent.date).getTime();
    })
    .slice(0, 3);
  const latestNews = [...snapshot.news]
    .sort((firstPost, secondPost) => {
      return new Date(secondPost.date).getTime() - new Date(firstPost.date).getTime();
    })
    .slice(0, 3);
  const activeAlerts = snapshot.alerts
    .filter((alert) => alert.active)
    .sort((firstAlert, secondAlert) => {
      if (firstAlert.severity === "urgent" && secondAlert.severity !== "urgent") return -1;
      if (secondAlert.severity === "urgent" && firstAlert.severity !== "urgent") return 1;

      return (
        new Date(secondAlert.updatedAt).getTime() - new Date(firstAlert.updatedAt).getTime()
      );
    });
  const activeTownAlert = activeAlerts[0];
  const activeTownAlertTone =
    activeTownAlert?.severity === "urgent" ? "urgent" : "general";
  const quickActionsSectionClass = [
    "quick-actions-section",
    activeTownAlert ? "has-alert" : null,
    activeTownAlert?.severity === "urgent" ? "has-urgent-alert" : null
  ]
    .filter(Boolean)
    .join(" ");
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
        className={quickActionsSectionClass}
        aria-label="Common town services"
      >
        {activeTownAlert ? (
          <Link
            className={`common-services-alert common-services-alert-${activeTownAlertTone}`}
            href={activeTownAlert.href ?? "/events"}
            aria-label={`${activeTownAlert.title}: ${activeTownAlert.message}`}
          >
            <span className="common-services-alert-icon">
              <CustomSvgIcon
                svg={activeTownAlert.iconSvg}
                className="custom-alert-svg"
                fallback={<Icon name="bell" width={22} height={22} />}
              />
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
            <Link className="news-more-link" href="/news">
              See all news
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
          </div>
          {latestNews.map((post) => (
            <Link className="home-news-card" href={newsPath(post)} key={post.id}>
              <span>{formatDate(post.date)}</span>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
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
            <Link href="/services/business-license-renewal">
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
            <Link href="/community">
              Find community resources
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

      <section className="home-events" aria-label="Town calendar">
        <div className="home-events-inner">
          <div className="home-events-heading">
            <SectionHeading
              eyebrow="Events"
              title="Town calendar."
              description="Find meetings, festivals, community gatherings, and other dates to know."
            />
            <ActionLink href="/events" variant="secondary">
              See all events
            </ActionLink>
          </div>
          {nextEvents.length > 0 ? (
            <div className="home-events-list">
              {nextEvents.map((event) => {
                const [month, day] = shortDate(event.date).split(" ");

                return (
                  <Link
                    className="event-card"
                    href={eventPath(event)}
                    key={event.id}
                  >
                    <span className="event-date-badge" aria-label={formatDate(event.date)}>
                      <span>{month}</span>
                      <strong>{day}</strong>
                    </span>
                    <span className="event-card-body">
                      <span className="eyebrow">{formatTimeRange(event.time, event.endTime)}</span>
                      <h3>{event.title}</h3>
                      <span>{event.summary}</span>
                    </span>
                    <span className="event-card-meta">
                      <strong>
                        <Icon name="map" width={18} height={18} />
                        {event.location}
                      </strong>
                      <span>
                        View event
                        <Icon name="chevron-right" width={18} height={18} />
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="empty-note">No upcoming events are posted right now.</p>
          )}
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
            <ActionLink href="/community" variant="secondary">
              Community resources
            </ActionLink>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
