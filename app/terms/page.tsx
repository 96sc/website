import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for the official Town of Ninety Six website, including acceptable use, public information, external links, and disclaimers."
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Terms of Use</p>
          <h1>Using the Town website.</h1>
          <p>
            These terms explain how residents, visitors, and staff should use the official Town of
            Ninety Six website.
          </p>
        </div>
      </section>

      <section className="page-section legal-page">
        <article className="article-body article-body-narrow">
          <p className="legal-updated">Last updated: June 29, 2026</p>

          <h2>Purpose of this website</h2>
          <p>
            This website provides public information about Town of Ninety Six services, meetings,
            events, departments, notices, and links to related resources. It is not a substitute for
            official notices, ordinances, records, permits, court orders, legal advice, or direct
            communication with the appropriate town office.
          </p>

          <h2>Acceptable use</h2>
          <p>
            You may use this website for lawful civic, informational, and service-related purposes.
            You may not use it to disrupt service, attempt unauthorized access, submit malicious
            code, impersonate another person, harass staff or residents, or upload content that is
            unlawful, misleading, harmful, or unrelated to a town service.
          </p>

          <h2>Information accuracy</h2>
          <p>
            The Town works to keep website information current, but errors, omissions, date changes,
            broken links, and service updates can occur. For time-sensitive matters, contact Town
            Hall or the responsible department directly.
          </p>

          <h2>Public records and submissions</h2>
          <p>
            Messages, forms, uploads, and other submissions sent to the Town may become public
            records and may be retained or disclosed as required by law. Do not submit confidential
            or sensitive information unless it is necessary for the town service you are requesting.
          </p>

          <h2>Payments and external services</h2>
          <p>
            Some actions may send you to a third-party service, such as payment processors, map
            providers, document platforms, or state and federal government websites. The Town is not
            responsible for the content, security, accessibility, or privacy practices of external
            websites.
          </p>

          <h2>No legal or emergency advice</h2>
          <p>
            Website content is for general public information only. It is not legal advice and does
            not create an attorney-client relationship, permit approval, benefit entitlement, or
            emergency response. For emergencies, call 911.
          </p>

          <h2>Copyright and reuse</h2>
          <p>
            Town-created website content may be used for personal, civic, or educational purposes
            unless a page says otherwise. Logos, photos, maps, documents, embedded content, and
            third-party materials may have separate ownership or use restrictions.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            The Town may update these terms as services, technology, or legal requirements change.
            Continued use of the website after updates means you accept the revised terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be directed to Town Hall through the{" "}
            <Link href="/contact">contact directory</Link>.
          </p>
        </article>
      </section>

      <ContactStrip />
    </>
  );
}
