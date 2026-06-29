import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Ways to get involved in Ninety Six through meetings, council requests, community events, and town contacts."
};

const involvementOptions = [
  {
    title: "Attend a council meeting",
    icon: "calendar",
    description:
      "Follow meeting dates, agendas, minutes, and recordings so you can keep up with town decisions.",
    href: "/government/meetings",
    action: "Meeting records"
  },
  {
    title: "Appear before council",
    icon: "users",
    description:
      "Review the request steps and deadlines before asking to be placed on a council agenda.",
    href: "/services/appear-before-council",
    action: "Request steps"
  },
  {
    title: "Connect with departments",
    icon: "phone",
    description:
      "Start with the right town office for questions about services, local needs, and public information.",
    href: "/contact",
    action: "Contact town offices"
  },
  {
    title: "Show up for community events",
    icon: "sprout",
    description:
      "Use the town calendar to find public events, community gatherings, and dates where residents connect.",
    href: "/events",
    action: "Upcoming events"
  }
];

export default function GetInvolvedPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Community</p>
          <h1>Get involved in town life.</h1>
          <p>
            Civic participation can be simple: attend a meeting, ask the right office, follow the
            calendar, or take the next step to speak with council.
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
          title="Ways to participate"
          description="Start with the public path that matches what you want to do."
        />
        <div className="card-grid">
          {involvementOptions.map((option) => (
            <article className="info-card community-hub-card" key={option.title}>
              <Icon name={option.icon} width={28} height={28} />
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <ActionLink href={option.href} variant="quiet">
                {option.action}
              </ActionLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
