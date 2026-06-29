import type { Metadata } from "next";
import { GovBanner } from "@/components/gov-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildOrganizationJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ninetysixsc.gov"),
  title: {
    default: "Town of Ninety Six",
    template: "%s | Town of Ninety Six, SC"
  },
  description:
    "Official civic website for the Town of Ninety Six, South Carolina, with resident services, meetings, departments, events, business resources, and contact information.",
  openGraph: {
    title: "Town of Ninety Six",
    description:
      "Resident-first civic services, meetings, events, departments, and town information.",
    images: ["/media/welcome.png"],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/plv6kdj.css?v=2" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <GovBanner />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
