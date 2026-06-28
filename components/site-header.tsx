"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNavigation } from "@/lib/navigation";
import { Icon } from "./icon";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="utility-bar">
        <a href="tel:8645432200">
          <Icon name="phone" width={16} height={16} />
          Town Hall: (864) 543-2200
        </a>
        <a href="/services/pay-ticket">Pay ticket</a>
        <a href="/business">Business license</a>
      </div>

      <div className="main-nav-wrap">
        <Link className="brand-link" href="/" aria-label="Town of Ninety Six home">
          <Image
            src="/brand/96Logo-Blue.svg"
            alt="Town of Ninety Six"
            width={260}
            height={72}
            priority
          />
        </Link>

        <button
          className="icon-button menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Icon name={menuOpen ? "x" : "menu"} width={24} height={24} />
        </button>

        <nav
          id="primary-navigation"
          className={menuOpen ? "primary-nav is-open" : "primary-nav"}
          aria-label="Primary navigation"
        >
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
