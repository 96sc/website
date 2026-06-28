import type { Metadata } from "next";
import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getPageBySlug } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Visitors",
  description: "Visitor information, outdoor activities, local history, attractions, and events in Ninety Six."
};

export default async function VisitorsPage() {
  const page = await getPageBySlug("visitors");

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Visitors</p>
          <h1>{page?.summary ?? "Visit Ninety Six."}</h1>
          <p>{page?.body[0]}</p>
        </div>
      </section>

      <section className="page-section story-grid">
        <div className="story-image">
          <Image
            src="/media/fishing.jpg"
            alt="Outdoor activities near Ninety Six"
            width={509}
            height={339}
          />
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <h2>History, parks, outdoor activities, and local events.</h2>
          <p>
            Visitor content should feel inviting without hiding core civic tasks. The CMS can hold
            attraction pages, event pages, and local history entries separately from resident services.
          </p>
          <div className="button-row">
            <ActionLink href="/events">Events</ActionLink>
            <ActionLink href="https://townofninetysix.sc.gov/local-history" external variant="secondary">
              Local history archive
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading title="Visitor starting points" />
        <div className="card-grid">
          <article className="info-card">
            <h3>Visitor Center</h3>
            <p>97 E. Main Street, Ninety Six, SC 29666</p>
          </article>
          <article className="info-card">
            <h3>Outdoor activities</h3>
            <p>Use WordPress pages for parks, golf, geocaching, fishing, and recreation.</p>
          </article>
          <article className="info-card">
            <h3>Places of interest</h3>
            <p>Keep attractions and landmarks structured for photos, maps, hours, and links.</p>
          </article>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
