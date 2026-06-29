import Image from "next/image";
import Link from "next/link";
import { footerNavigation, legalNavigation } from "@/lib/navigation";
import { Icon } from "./icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section className="footer-brand" aria-label="Town contact summary">
          <Image src="/brand/96Logo-White.svg" alt="Town of Ninety Six" width={220} height={61} />
          <address>
            Ninety Six Town Hall
            <br />
            120 Main Street W
            <br />
            Ninety Six, SC 29666
          </address>
          <a className="footer-phone" href="tel:8645432200">
            <Icon name="phone" width={16} height={16} />
            (864) 543-2200
          </a>
        </section>

        <nav aria-label="Footer navigation">
          <h2>Explore</h2>
          <div className="footer-links">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <section>
          <h2>Official Links</h2>
          <div className="footer-links">
            <a href="https://sc.gov/" target="_blank" rel="noreferrer">
              SC.gov
            </a>
            <a href="https://sc.gov/policies" target="_blank" rel="noreferrer">
              SC.gov Policies
            </a>
            <a href="https://townofninetysix.sc.gov/" target="_blank" rel="noreferrer">
              Legacy Site Archive
            </a>
          </div>
        </section>
      </div>
      <div className="footer-bottom">
        <span>Town of Ninety Six, South Carolina</span>
        <nav className="footer-legal" aria-label="Legal links">
          {legalNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Image
          className="footer-design-logo"
          src="/brand/96Design-Logo.svg"
          alt="96 Design"
          width={128}
          height={33}
        />
      </div>
    </footer>
  );
}
