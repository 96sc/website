import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Town Council",
  description: "Mayor and Town Council contacts for Ninety Six, South Carolina."
};

export default async function CouncilPage() {
  const snapshot = await getCmsSnapshot();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Government</p>
          <h1>Town Council</h1>
          <p>
            Elected officials, ward contacts, and rules for requesting an appearance before council.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          title="Elected officials"
          description="Council records are CMS-ready so staff can keep roles, emails, wards, and committees current."
        />
        <div className="official-grid">
          {snapshot.officials.map((official) => (
            <article className="official-card" key={official.id}>
              <p className="eyebrow">{official.ward ?? official.role}</p>
              <h3>{official.name}</h3>
              <p>{official.role}</p>
              {official.email ? <p><a href={`mailto:${official.email}`}>{official.email}</a></p> : null}
              {official.committees?.length ? (
                <p>Committees: {official.committees.join(", ")}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section-tight">
        <div className="portal-reserve">
          <p className="eyebrow">Appear before council</p>
          <h2>Requests are due before the regular meeting deadline.</h2>
          <p>
            Requests should be submitted before 12:00 noon on the second Wednesday preceding the
            regular meeting held the third Monday of each month.
          </p>
          <ActionLink href="/services/appear-before-council">View request steps</ActionLink>
        </div>
      </section>
    </>
  );
}
