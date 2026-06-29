import type { Metadata } from "next";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";
import { SectionHeading } from "@/components/section-heading";
import { getCmsSnapshot } from "@/lib/cms/content";
import { placePath } from "@/lib/cms/links";
import type { PlaceRecord } from "@/lib/cms/types";

export const metadata: Metadata = {
  title: "Places",
  description:
    "Places in Ninety Six, including civic buildings, visitor information, parks, historic sites, community spaces, and local destinations."
};

const categoryLabels: Record<PlaceRecord["category"], string> = {
  civic: "Civic",
  park: "Park",
  historic: "Historic",
  business: "Business",
  community: "Community",
  visitor: "Visitor",
  other: "Place"
};

export default async function PlacesPage() {
  const snapshot = await getCmsSnapshot();
  const featuredPlaces = snapshot.places.filter((place) => place.featured);
  const places = [...snapshot.places].sort((firstPlace, secondPlace) => {
    if (firstPlace.featured && !secondPlace.featured) return -1;
    if (secondPlace.featured && !firstPlace.featured) return 1;
    return firstPlace.title.localeCompare(secondPlace.title);
  });

  return (
    <>
      <section className="page-hero places-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">Places</p>
          <h1>Find places around Ninety Six.</h1>
          <p>
            Civic buildings, visitor stops, parks, historic sites, community spaces, and other local
            places can live here with photos, contact details, hours, and maps.
          </p>
        </div>
      </section>

      {featuredPlaces.length > 0 ? (
        <section className="page-section">
          <SectionHeading
            title="Featured places"
            description="Helpful starting points and commonly requested locations."
          />
          <div className="place-feature-grid">
            {featuredPlaces.slice(0, 3).map((place) => (
              <Link className="place-feature-card" href={placePath(place)} key={place.id}>
                {place.image ? (
                  <img src={place.image.src} alt={place.image.alt ?? ""} loading="lazy" />
                ) : null}
                <span>
                  <span className="eyebrow">{categoryLabels[place.category]}</span>
                  <h3>{place.title}</h3>
                  <span>{place.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-section page-section-tight">
        <SectionHeading title="All places" />
        {places.length > 0 ? (
          <div className="place-grid">
            {places.map((place) => (
              <Link className="place-card" href={placePath(place)} key={place.id}>
                {place.image ? (
                  <img className="place-card-image" src={place.image.src} alt={place.image.alt ?? ""} loading="lazy" />
                ) : null}
                <span className="place-card-content">
                  <span className="eyebrow">{categoryLabels[place.category]}</span>
                  <h3>{place.title}</h3>
                  <span>{place.summary}</span>
                  {place.address ? <strong>{place.address}</strong> : null}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-note">No places are posted right now.</p>
        )}
      </section>

      <ContactStrip />
    </>
  );
}
