import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Events, parks, recreation, volunteer opportunities, family resources, and local history in Ninety Six."
};

const communitySections = [
  {
    title: "What's happening",
    icon: "calendar",
    description: "Upcoming events, festivals, public activities, and community dates to know.",
    href: "/events",
    action: "See events"
  },
  {
    title: "Get outside",
    icon: "map",
    description: "Parks, recreation, walking areas, outdoor activities, and local places to explore.",
    href: "/visitors",
    action: "Explore outdoors"
  },
  {
    title: "Get involved",
    icon: "users",
    description: "Volunteer opportunities, boards, community groups, and ways to participate locally.",
    href: "/government/council",
    action: "Find civic info"
  },
  {
    title: "For families",
    icon: "sprout",
    description: "Youth programs, schools, library resources, senior resources, and support services.",
    href: "/services",
    action: "Find services"
  },
  {
    title: "Our story",
    icon: "landmark",
    description: "Local history, Revolutionary War heritage, landmarks, and town traditions.",
    href: "https://townofninetysix.sc.gov/local-history",
    action: "History archive",
    external: true
  }
];

export default function CommunityPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Community</p>
          <h1>Local life, events, parks, and ways to get involved.</h1>
          <p>
            Start here for what is happening around Ninety Six, where to spend time outside, and
            how to connect with the people and traditions that shape town life.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          title="Community starting points"
          description="A practical hub for activities, family resources, local history, and civic involvement."
        />
        <div className="card-grid">
          {communitySections.map((section) => (
            <article className="info-card" key={section.title}>
              <Icon name={section.icon} width={28} height={28} />
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <ActionLink href={section.href} external={section.external} variant="quiet">
                {section.action}
              </ActionLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
