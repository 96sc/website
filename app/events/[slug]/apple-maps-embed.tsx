type AppleMapsEmbedProps = {
  token?: string;
  latitude?: string;
  longitude?: string;
  placeId?: string;
  title: string;
  address: string;
};

function appleMapsUrl(address: string) {
  return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
}

function appleMapsEmbedUrl({
  token,
  latitude,
  longitude,
  placeId
}: Pick<AppleMapsEmbedProps, "token" | "latitude" | "longitude" | "placeId">) {
  const numericLatitude = latitude ? Number(latitude) : Number.NaN;
  const numericLongitude = longitude ? Number(longitude) : Number.NaN;

  if (!token || !Number.isFinite(numericLatitude) || !Number.isFinite(numericLongitude)) {
    return null;
  }

  const params = new URLSearchParams({
    center: `${numericLatitude.toFixed(5)},${numericLongitude.toFixed(5)}`,
    cameraDistance: "1200",
    token
  });

  if (placeId) {
    params.set("annotations", JSON.stringify([{ place: placeId, selected: 0 }]));
  }

  return `https://embed.apple-mapkit.com/v1/embed?${params.toString()}`;
}

export function AppleMapsEmbed({
  token,
  latitude,
  longitude,
  placeId,
  title,
  address
}: AppleMapsEmbedProps) {
  const embedUrl = appleMapsEmbedUrl({ token, latitude, longitude, placeId });

  if (!embedUrl) {
    return (
      <a className="document-row" href={appleMapsUrl(address)} target="_blank" rel="noreferrer">
        <span>Open location in Apple Maps</span>
      </a>
    );
  }

  return (
    <div className="apple-map-panel">
      <iframe
        className="apple-map-embed"
        src={embedUrl}
        title={`${title} map`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a className="document-row" href={appleMapsUrl(address)} target="_blank" rel="noreferrer">
        <span>Open in Apple Maps</span>
      </a>
    </div>
  );
}
