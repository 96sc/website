import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { governmentNavigation } from "@/lib/navigation";
import { formatDate } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Government",
  description: "Town Council, departments, ordinances, meetings, and public records for Ninety Six."
};

export default async function GovernmentPage() {
  const snapshot = await getCmsSnapshot();
  const nextMeeting = snapshot.meetings[0];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Government</p>
          <h1>Meetings, departments, officials, and public records.</h1>
          <p>
            Government information is grouped around transparency: who serves, when meetings happen,
            where records live, and who to contact.
          </p>
        </div>
      </section>

      <nav className="subnav" aria-label="Government sections">
        {governmentNavigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="page-section">
        <SectionHeading title="Government overview" />
        <div className="card-grid">
          <article className="info-card">
            <Icon name="users" width={28} height={28} />
            <h3>Town Council</h3>
            <p>Mayor, ward representatives, council contacts, committees, and appearance rules.</p>
            <ActionLink href="/government/council" variant="quiet">
              View council
            </ActionLink>
          </article>
          <article className="info-card">
            <Icon name="calendar" width={28} height={28} />
            <h3>Meetings</h3>
            <p>Next meeting: {formatDate(nextMeeting.date)} at {nextMeeting.time}.</p>
            <ActionLink href="/government/meetings" variant="quiet">
              Meeting records
            </ActionLink>
          </article>
          <article className="info-card">
            <Icon name="landmark" width={28} height={28} />
            <h3>Ordinances</h3>
            <p>Official ordinances remain available through Municode in v1.</p>
            <ActionLink
              href="https://library.municode.com/sc/ninety_six/codes/code_of_ordinances"
              external
              variant="quiet"
            >
              Open ordinances
            </ActionLink>
          </article>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
