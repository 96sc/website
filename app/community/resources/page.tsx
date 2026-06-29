import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Community Resources",
  description:
    "Practical community resource links for services, contacts, meetings, records, events, and local information in Ninety Six."
};

const resourceGroups = [
  {
    title: "Everyday services",
    icon: "sprout",
    description: "Trash pickup, utility contacts, business licensing, payments, and common town services.",
    href: "/services",
    action: "Find services"
  },
  {
    title: "Town contacts",
    icon: "phone",
    description: "Town Hall, visitor information, departments, phone options, and public contact details.",
    href: "/contact",
    action: "Contact town offices"
  },
  {
    title: "Meetings and records",
    icon: "file",
    description: "Council meetings, agendas, minutes, recordings, documents, and public record links.",
    href: "/government/meetings",
    action: "View records"
  },
  {
    title: "Events calendar",
    icon: "calendar",
    description: "Town events, public meetings, community dates, closures, and featured happenings.",
    href: "/events",
    action: "See calendar"
  },
  {
    title: "Departments",
    icon: "landmark",
    description: "Department contact information, service areas, and town office responsibilities.",
    href: "/government/departments",
    action: "View departments"
  },
  {
    title: "Visit and local places",
    icon: "map",
    description: "Civic buildings, visitor stops, parks, historic sites, and local points of interest.",
    href: "/places",
    action: "Explore places"
  }
];

export default function CommunityResourcesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Community</p>
          <h1>Community resources.</h1>
          <p>
            A practical starting point for the town services, contacts, records, events, and local
            information residents ask for most.
          </p>
          <div className="button-row">
            <ActionLink href="/community" variant="secondary">
              Community hub
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          title="Resource cards"
          description="Choose the area that fits what you need, then continue to the related town page."
        />
        <div className="card-grid">
          {resourceGroups.map((resource) => (
            <article className="info-card community-hub-card" key={resource.title}>
              <Icon name={resource.icon} width={28} height={28} />
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <ActionLink href={resource.href} variant="quiet">
                {resource.action}
              </ActionLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
