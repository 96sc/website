import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Town Council meeting dates, agendas, minutes, recordings, and archive links."
};

export default async function MeetingsPage() {
  const snapshot = await getCmsSnapshot();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Government</p>
          <h1>Meetings, agendas, minutes, and recordings.</h1>
          <p>
            V1 keeps legacy records linked while new meeting records can be published directly from
            WordPress.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="Meeting records" />
        <div className="event-grid">
          {snapshot.meetings.map((meeting) => (
            <article className="event-card" key={meeting.id}>
              <p className="eyebrow">{formatDate(meeting.date)}</p>
              <h3>{meeting.title}</h3>
              <p>
                <strong>{meeting.time}</strong> at {meeting.location}
              </p>
              {meeting.documents.map((document) => (
                <a
                  className="document-row"
                  href={document.href}
                  key={document.id}
                  target={document.href.startsWith("http") ? "_blank" : undefined}
                  rel={document.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span>{document.title}</span>
                  <Icon name="file" width={18} height={18} />
                </a>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section-tight">
        <div className="portal-reserve">
          <p className="eyebrow">Legacy archive</p>
          <h2>Older public records remain preserved.</h2>
          <p>
            Until all records are reviewed and migrated, older agendas, minutes, attachments, and
            recordings stay available on the current official site.
          </p>
          <ActionLink
            href="https://townofninetysix.sc.gov/minutes-agendas-and-recordings"
            external
          >
            Open legacy records
          </ActionLink>
        </div>
      </section>
    </>
  );
}
