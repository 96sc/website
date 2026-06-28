import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { ServiceTile } from "@/components/service-tile";
import { getCmsSnapshot, getPageBySlug } from "@/lib/cms/content";
import { externalLinks } from "@/lib/cms/seed";

export const metadata: Metadata = {
  title: "Business",
  description: "Business license renewal, forms, contacts, and business resources for Ninety Six."
};

export default async function BusinessPage() {
  const snapshot = await getCmsSnapshot();
  const page = await getPageBySlug("business");
  const licenseService = snapshot.services.find((service) => service.slug === "business-license-renewal");

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Business</p>
          <h1>{page?.summary ?? "Business resources for Ninety Six."}</h1>
          <p>{page?.body[0]}</p>
          <div className="button-row">
            <ActionLink href={externalLinks.businessLicensePortal} external>
              Renew business license
            </ActionLink>
            <ActionLink href="/contact" variant="secondary">
              Contact Town Hall
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          title="Business licensing"
          description="The renewal portal stays external in v1; explanatory content and contacts live in the CMS."
        />
        {licenseService ? <ServiceTile service={licenseService} /> : null}
      </section>

      <section className="page-section page-section-tight">
        <div className="card-grid">
          <article className="info-card">
            <h3>Starting a new business</h3>
            <p>Use this section for local licensing steps, town contacts, and required forms.</p>
          </article>
          <article className="info-card">
            <h3>Business listing</h3>
            <p>Prepare a staff-editable directory for local businesses once listings are reviewed.</p>
          </article>
          <article className="info-card">
            <h3>Official ordinances</h3>
            <p>Keep the Municode ordinance link prominent for legal reference.</p>
            <ActionLink href={externalLinks.ordinances} external variant="quiet">
              Open Municode
            </ActionLink>
          </article>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
