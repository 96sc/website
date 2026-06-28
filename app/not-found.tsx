import Link from "next/link";
import { ActionLink } from "@/components/action-link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <p className="eyebrow">Page not found</p>
        <h1>That page is not available.</h1>
        <p>
          Try the service dashboard or contact Town Hall if you need help finding a town resource.
        </p>
        <div className="button-row">
          <ActionLink href="/services">Find services</ActionLink>
          <Link className="action-link action-link-secondary" href="/contact">
            Contact Town Hall
          </Link>
        </div>
      </div>
    </section>
  );
}
