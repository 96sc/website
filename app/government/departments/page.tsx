import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Departments",
  description: "Department contacts and services for the Town of Ninety Six."
};

export default async function DepartmentsPage() {
  const snapshot = await getCmsSnapshot();

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Government</p>
          <h1>Departments</h1>
          <p>Find the right town department, phone option, and service area.</p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading title="Department directory" />
        <div className="department-grid">
          {snapshot.departments.map((department) => (
            <article className="department-card" key={department.id}>
              <h3>{department.name}</h3>
              <p>{department.summary}</p>
              <p>
                <strong>{department.contact.label}</strong>
                <br />
                {department.contact.phone}
              </p>
              {department.contact.address ? <p>{department.contact.address}</p> : null}
              <ul className="clean-list">
                {department.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section-tight">
        <ActionLink href="/contact">Full contact directory</ActionLink>
      </section>
    </>
  );
}
