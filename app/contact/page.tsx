import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Town Hall address, phone directory, visitor center, departments, and contact information."
};

const contactRows = [
  ["Town Hall Clerk", "864-543-2200 option 1"],
  ["Municipal Court Clerk", "864-543-2200 option 2"],
  ["Town Mayor", "864-543-2200 option 3"],
  ["Police Department", "864-543-2200 option 4"],
  ["Fire Department", "864-543-2200 option 5"],
  ["Tourism", "864-543-2200 option 6"],
  ["Visitor Center", "864-543-2200 option 7"],
  ["Maintenance Department", "864-543-2200 option 8"],
  ["Code Enforcement", "864-543-2200 option 9"]
];

export default async function ContactPage() {
  const snapshot = await getCmsSnapshot();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Contact</p>
          <h1>Reach the right town office.</h1>
          <p>
            Town Hall is the front door for most questions. Department numbers and phone options stay
            visible on every device.
          </p>
          <div className="button-row">
            <ActionLink href="tel:8645432200">Call Town Hall</ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="Main offices" />
        <div className="card-grid">
          <article className="info-card">
            <Icon name="map" width={28} height={28} />
            <h3>Town Hall</h3>
            <p>120 Main Street W, Ninety Six, SC 29666</p>
            <p>(864) 543-2200</p>
          </article>
          <article className="info-card">
            <Icon name="map" width={28} height={28} />
            <h3>Visitor Center</h3>
            <p>97 E. Main Street, Ninety Six, SC 29666</p>
            <p>(864) 543-2200 option 7</p>
          </article>
          <article className="info-card info-card-accent">
            <Icon name="phone" width={28} height={28} />
            <h3>Fax</h3>
            <p>(864) 970-0303</p>
          </article>
        </div>
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading title="Phone directory" />
        <div className="department-grid">
          {contactRows.map(([label, phone]) => (
            <article className="department-card" key={label}>
              <h3>{label}</h3>
              <p>{phone}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading title="Department contacts" />
        <div className="department-grid">
          {snapshot.departments.map((department) => (
            <article className="department-card" key={department.id}>
              <h3>{department.name}</h3>
              <p>{department.contact.phone}</p>
              {department.contact.address ? <p>{department.contact.address}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
