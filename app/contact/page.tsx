import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import type { StaffRecord } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "Contact",
  description: "Town Hall address, phone directory, visitor center, departments, and contact information."
};

const contactRows: StaffRecord[] = [
  { id: "contact-town-clerk", name: "Town Hall Clerk", role: "Town Hall", phone: "864-543-2200 option 1" },
  {
    id: "contact-municipal-court",
    name: "Municipal Court Clerk",
    role: "Municipal Court",
    phone: "864-543-2200 option 2"
  },
  { id: "contact-mayor", name: "Town Mayor", role: "Mayor", phone: "864-543-2200 option 3" },
  {
    id: "contact-police",
    name: "Police Department",
    role: "Public safety",
    phone: "864-543-2200 option 4"
  },
  { id: "contact-fire", name: "Fire Department", role: "Fire services", phone: "864-543-2200 option 5" },
  { id: "contact-tourism", name: "Tourism", role: "Tourism", phone: "864-543-2200 option 6" },
  { id: "contact-visitor-center", name: "Visitor Center", role: "Visitor information", phone: "864-543-2200 option 7" },
  {
    id: "contact-maintenance",
    name: "Maintenance Department",
    role: "Maintenance",
    phone: "864-543-2200 option 8"
  },
  { id: "contact-code", name: "Code Enforcement", role: "Code Enforcement", phone: "864-543-2200 option 9" }
];

export default async function ContactPage() {
  const snapshot = await getCmsSnapshot();
  const staffRows = snapshot.staff.length > 0 ? snapshot.staff : contactRows;

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
        <SectionHeading title="Staff directory" />
        <div className="department-grid">
          {staffRows.map((staff) => (
            <article className="department-card staff-card" key={staff.id}>
              {staff.profileImage ? (
                <img
                  className="profile-card-photo"
                  src={staff.profileImage.src}
                  alt={staff.profileImage.alt || `Photo of ${staff.name}`}
                  loading="lazy"
                />
              ) : null}
              <div>
                <h3>{staff.name}</h3>
                <p>{[staff.role, staff.department].filter(Boolean).join(" | ")}</p>
                {staff.phone ? <p>{staff.phone}</p> : null}
                {staff.email ? (
                  <p>
                    <a href={`mailto:${staff.email}`}>{staff.email}</a>
                  </p>
                ) : null}
              </div>
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
