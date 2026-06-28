import type { Metadata } from "next";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { ServiceTile } from "@/components/service-tile";
import { getCmsSnapshot, getPageBySlug } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Residents",
  description: "Resident services, trash collection, utilities, parks, meetings, and contact information."
};

export default async function ResidentsPage() {
  const snapshot = await getCmsSnapshot();
  const page = await getPageBySlug("residents");
  const residentServices = snapshot.services.filter((service) =>
    ["trash-collection", "utilities-cpw", "pay-ticket", "emergency-notifications"].includes(service.slug)
  );

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Residents</p>
          <h1>{page?.summary ?? "Resident services for Ninety Six."}</h1>
          <p>{page?.body[0]}</p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="Common resident needs" />
        <div className="service-grid">
          {residentServices.map((service) => (
            <ServiceTile key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="page-section page-section-tight">
        <div className="card-grid">
          <article className="info-card">
            <h3>Moving to Ninety Six</h3>
            <p>Provide a concise onboarding path for utilities, trash pickup, schools, parks, and town contacts.</p>
          </article>
          <article className="info-card">
            <h3>Parks and recreation</h3>
            <p>Keep parks, outdoor activities, and local recreation connected to visitor information.</p>
          </article>
          <article className="info-card info-card-accent">
            <h3>Stay informed</h3>
            <p>Alerts, events, council meetings, and public records remain visible from the homepage.</p>
          </article>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
