import { Icon } from "./icon";

export function ContactStrip() {
  return (
    <section className="contact-strip" aria-label="Town Hall contact">
      <div>
        <p className="eyebrow">Need help?</p>
        <h2>Town Hall can point you in the right direction.</h2>
      </div>
      <div className="contact-actions">
        <a href="tel:8645432200">
          <Icon name="phone" width={18} height={18} />
          (864) 543-2200
        </a>
        <a href="/contact">
          <Icon name="map" width={18} height={18} />
          Contact directory
        </a>
      </div>
    </section>
  );
}
