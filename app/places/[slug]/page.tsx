import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot, getPlaceBySlug } from "@/lib/cms/content";
import { isExternalHref, placeSlug } from "@/lib/cms/links";
import type { PlaceRecord } from "@/lib/cms/types";
import { buildPlaceJsonLd, stringifyJsonLd } from "@/lib/structured-data";
import { AppleMapsEmbed } from "./apple-maps-embed";

type PlacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const categoryLabels: Record<PlaceRecord["category"], string> = {
  civic: "Civic place",
  park: "Park or outdoor space",
  historic: "Historic site",
  business: "Business",
  community: "Community space",
  visitor: "Visitor information",
  other: "Place"
};

export async function generateStaticParams() {
  const snapshot = await getCmsSnapshot();
  return snapshot.places.map((place) => ({ slug: placeSlug(place) }));
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    return {
      title: "Place"
    };
  }

  return {
    title: place.title,
    description: place.summary,
    openGraph: place.image
      ? {
          images: [
            {
              url: place.image.src,
              alt: place.image.alt ?? place.title
            }
          ]
        }
      : undefined
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const body = place.body?.length ? place.body : [place.summary];
  const appleMapsEmbedToken = process.env.NEXT_PUBLIC_APPLE_MAPS_EMBED_TOKEN;
  const placeJsonLd = buildPlaceJsonLd(place);

  return (
    <>
      <section className="page-hero places-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">{categoryLabels[place.category]}</p>
          <h1>{place.title}</h1>
          <p>{place.summary}</p>
          <div className="button-row">
            <ActionLink href="/places" variant="secondary">
              All places
            </ActionLink>
            {place.website ? (
              <ActionLink href={place.website} external={isExternalHref(place.website)}>
                Visit website
              </ActionLink>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="content-with-sidebar">
          <article className="article-body">
            {place.image ? (
              <img className="place-detail-image" src={place.image.src} alt={place.image.alt ?? ""} />
            ) : null}
            <SectionHeading title="About this place" />
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="detail-sidebar" aria-label="Place information">
            <article className="info-card">
              <h2>Location</h2>
              <p>{place.address}</p>
            </article>
            {place.hours ? (
              <article className="info-card">
                <h2>Hours</h2>
                <p>{place.hours}</p>
              </article>
            ) : null}
            {place.phone || place.email ? (
              <article className="info-card">
                <h2>Contact</h2>
                {place.phone ? <p>{place.phone}</p> : null}
                {place.email ? (
                  <p>
                    <a href={`mailto:${place.email}`}>{place.email}</a>
                  </p>
                ) : null}
              </article>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="page-section page-section-tight">
        <SectionHeading title="Map" />
        <AppleMapsEmbed
          token={appleMapsEmbedToken}
          latitude={place.latitude}
          longitude={place.longitude}
          placeId={place.applePlaceId}
          title={place.title}
          address={place.address}
        />
      </section>

      <ContactStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(placeJsonLd) }}
      />
    </>
  );
}
