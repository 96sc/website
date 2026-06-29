import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the official Town of Ninety Six website, including data use, public records, cookies, and third-party services."
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Privacy Policy</p>
          <h1>How this website handles information.</h1>
          <p>
            The Town of Ninety Six uses this website to share public information and help residents
            reach town services.
          </p>
        </div>
      </section>

      <section className="page-section legal-page">
        <article className="article-body article-body-narrow">
          <p className="legal-updated">Last updated: June 29, 2026</p>

          <h2>Information we collect</h2>
          <p>
            You can browse most pages without giving the Town personal information. The website may
            collect basic technical information such as browser type, device type, pages visited,
            referring pages, and general usage activity so we can keep the site reliable and improve
            public access.
          </p>
          <p>
            If you contact the Town through a form, email link, phone link, or service request, we
            may receive the information you choose to provide, such as your name, contact
            information, address, request details, attachments, or message content.
          </p>

          <h2>How we use information</h2>
          <p>
            Information submitted through the website may be used to respond to questions, route
            requests to the right department, provide town services, improve website performance,
            maintain security, and meet legal or administrative requirements.
          </p>

          <h2>Public records</h2>
          <p>
            Records provided to the Town may be subject to South Carolina public records law,
            retention rules, subpoenas, court orders, audits, or other lawful disclosure
            requirements. Do not submit sensitive information through the website unless it is needed
            for your request.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            The website may use cookies, server logs, analytics tools, and similar technologies to
            understand site usage, remember basic preferences, protect the site, and diagnose
            technical issues. You can control many cookie settings through your browser.
          </p>

          <h2>Third-party services</h2>
          <p>
            Some features may connect to third-party services, including maps, embedded content,
            online payment providers, forms, document viewers, or external government resources.
            Those services may collect information under their own privacy policies.
          </p>

          <h2>Children</h2>
          <p>
            This website is intended for general civic information and services. The Town does not
            knowingly use this website to collect personal information from children without
            appropriate authorization.
          </p>

          <h2>Security</h2>
          <p>
            The Town uses reasonable administrative and technical measures to protect website
            information, but no website or internet transmission can be guaranteed to be completely
            secure.
          </p>

          <h2>Updates</h2>
          <p>
            This policy may be updated as website features, town services, or legal requirements
            change. The updated date on this page shows when it was last revised.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can be directed to Town Hall through the{" "}
            <Link href="/contact">contact directory</Link>.
          </p>
        </article>
      </section>

      <ContactStrip />
    </>
  );
}
