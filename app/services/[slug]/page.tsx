import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { Icon } from "@/components/icon";
import { getCmsSnapshot, getServiceBySlug } from "@/lib/cms/content";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const snapshot = await getCmsSnapshot();
  return snapshot.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.summary
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Service</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
          <div className="button-row">
            <ActionLink
              href={service.action.href}
              external={service.action.external}
            >
              {service.action.label}
            </ActionLink>
            <ActionLink href="/services" variant="secondary">
              All services
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="page-section detail-layout">
        <div className="detail-main">
          <section className="detail-panel">
            <h2>Who this is for</h2>
            <p>{service.audience}</p>
          </section>

          <section className="detail-panel">
            <h2>Steps</h2>
            <ol className="clean-list">
              {service.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="detail-panel">
            <h2>Fees and deadlines</h2>
            <ul className="clean-list">
              {service.feesAndDeadlines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="detail-panel">
            <h2>Documents and records</h2>
            {service.documents.length > 0 ? (
              <div>
                {service.documents.map((document) => (
                  <a
                    className="document-row"
                    href={document.href}
                    key={document.id}
                    target={document.href.startsWith("http") ? "_blank" : undefined}
                    rel={document.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span>{document.title}</span>
                    <Icon name="file" width={18} height={18} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="empty-note">No documents are required for this service.</p>
            )}
          </section>
        </div>

        <aside className="contact-card" aria-label="Service contact">
          <div className="tile-icon">
            <Icon name={service.icon} width={24} height={24} />
          </div>
          <h2>{service.contact.label}</h2>
          {service.contact.phone ? <p>{service.contact.phone}</p> : null}
          {service.contact.email ? (
            <p>
              <a href={`mailto:${service.contact.email}`}>{service.contact.email}</a>
            </p>
          ) : null}
          {service.contact.address ? <p>{service.contact.address}</p> : null}
          <ActionLink
            href={service.action.href}
            external={service.action.external}
          >
            {service.action.label}
          </ActionLink>
        </aside>
      </section>
    </>
  );
}
