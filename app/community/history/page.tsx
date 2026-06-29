import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "History",
  description:
    "A starting point for Ninety Six history, Revolutionary War heritage, landmarks, and local traditions."
};

const historyTopics = [
  {
    title: "Revolutionary War heritage",
    description:
      "Ninety Six is known for its deep Revolutionary War history and nationally recognized historic landscape."
  },
  {
    title: "Town landmarks",
    description:
      "Main Street, local civic spaces, and visitor destinations help tell the story of how the town grew."
  },
  {
    title: "Community traditions",
    description:
      "Festivals, public gatherings, and local service keep history connected to everyday community life."
  }
];

export default function CommunityHistoryPage() {
  return (
    <>
      <section className="page-hero community-history-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Community</p>
          <h1>Ninety Six history.</h1>
          <p>
            Start here for the places, stories, and traditions that connect Ninety Six residents and
            visitors to the town's past.
          </p>
          <div className="button-row">
            <ActionLink href="/visitors">Visitor information</ActionLink>
            <ActionLink href="/community" variant="secondary">
              Community hub
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="community-history-layout">
          <div>
            <SectionHeading
              title="History as part of community life"
              description="Ninety Six history is not just something to look back on. It shapes where people visit, gather, learn, and celebrate today."
            />
            <div className="community-history-list">
              {historyTopics.map((topic) => (
                <article className="department-card" key={topic.title}>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="community-history-note" aria-label="History resources">
            <p className="eyebrow">Explore more</p>
            <h2>Plan a visit around history and local places.</h2>
            <p>
              The visitor page is the best next stop for nearby attractions, outdoor places, and
              history-focused trip planning.
            </p>
            <ActionLink href="/visitors" variant="secondary">
              Go to visitor info
            </ActionLink>
          </aside>
        </div>
      </section>
    </>
  );
}
