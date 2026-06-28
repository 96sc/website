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
  const nextMeeting = snapshot.meetings[0];
  const nextEvents = snapshot.events.slice(0, 3);
  const quickActionDescriptions: Record<string, string> = {
    "trash-collection": "Thursday pickup",
    "pay-ticket": "Case number needed",
    "business-license-renewal": "Renew online",
    "utilities-cpw": "Water, sewer, electric"
  };

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <Image
              className="hero-mark"
              src="/brand/96Logo-White.svg"
              alt=""
              width={420}
              height={116}
              priority
            />
            <p className="eyebrow">Town of Ninety Six, South Carolina</p>
            <h1>Ninety Six starts here.</h1>
            <p>
              A clearer civic front door for the services people use, the meetings that shape town
              life, and the local story that makes Ninety Six unmistakably itself.
            </p>
            <div className="hero-actions">
              <ActionLink href="/services">Find a service</ActionLink>
              <ActionLink href="/government/meetings" variant="secondary">
                See meetings
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions-section" aria-label="Common town services">
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
                <strong>{service.title}</strong>
                <small>{quickActionDescriptions[service.slug] ?? service.summary}</small>
              </span>
              <Icon name="chevron-right" width={18} height={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-notices" aria-label="Town notices">
        <div className="home-notices-inner">
          {snapshot.alerts.map((alert) => (
            <Link className={`home-notice home-notice-${alert.severity}`} href={alert.href ?? "/services"} key={alert.id}>
              <span>{alert.title}</span>
              <strong>{alert.message}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="task-finder home-task-finder">
        <div className="page-section">
          <SectionHeading
            eyebrow="How do I..."
            title="Get to the answer quickly."
            description="The site is organized around real resident questions, not department guesswork."
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

      <section className="page-section home-meeting">
        <SectionHeading
          eyebrow="Meetings"
          title="Town business should be easy to follow."
          description="Council dates, agendas, minutes, recordings, and older public records stay close to the surface."
        />
        <div className="meeting-feature">
          <div className="date-block" aria-label={`Next meeting date ${formatDate(nextMeeting.date)}`}>
            <div>
              <span>{shortDate(nextMeeting.date).split(" ")[0]}</span>
              <strong>{shortDate(nextMeeting.date).split(" ")[1]}</strong>
              <span>{nextMeeting.time}</span>
            </div>
          </div>
          <div className="meeting-detail">
            <p className="eyebrow">Next meeting</p>
            <h3>{nextMeeting.title}</h3>
            <p>{nextMeeting.location}</p>
            <div className="button-row">
              <ActionLink href="/government/meetings">Meeting records</ActionLink>
              <ActionLink href="/government/council" variant="secondary">
                Council members
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="story-band">
        <div className="page-section story-grid">
          <div className="story-image">
            <Image
              src="/media/welcome.png"
              alt="Welcome to Ninety Six"
              width={473}
              height={128}
            />
          </div>
          <div>
            <p className="eyebrow">A town with history and momentum</p>
            <h2>Practical services, rooted in a real place.</h2>
            <p>
              Ninety Six has a name people remember and a history worth showing. The new homepage
              keeps daily civic needs close while giving the town room to feel local, proud, and
              alive.
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
          eyebrow="News and events"
          title="What is coming up next."
          description="Events and notices stay simple, readable, and easy for staff to keep current."
        />
        <div className="event-grid">
          {nextEvents.map((event) => (
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

      <section className="page-section page-section-tight home-portal">
        <div className="portal-reserve">
          <p className="eyebrow">Future portal</p>
          <h2>Built with the next phase in mind.</h2>
          <p>
            V1 does not include login-based resident accounts, but the information architecture and
            custom TypeScript frontend leave space for a full service portal in phase 2.
          </p>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
