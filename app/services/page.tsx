import type { Metadata } from "next";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { ServiceTile } from "@/components/service-tile";
import { getCmsSnapshot } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Resident service dashboard for the Town of Ninety Six."
};

export default async function ServicesPage() {
  const snapshot = await getCmsSnapshot();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Services</p>
          <h1>Town services organized around resident tasks.</h1>
          <p>
            Start with what you need to do, then find the steps, contacts, deadlines, documents,
            and official action links.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          title="Service directory"
          description="Each service page follows the same format so residents can scan quickly."
        />
        <div className="service-grid">
          {snapshot.services.map((service) => (
            <ServiceTile key={service.id} service={service} />
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
