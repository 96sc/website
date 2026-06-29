"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNavigation } from "@/lib/navigation";
import { Icon } from "./icon";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [overHero, setOverHero] = useState(isHome);
  const useHeroHeader = isHome && overHero;
  const headerClassName = [
    "site-header",
    isHome ? "site-header-home" : null,
    useHeroHeader ? "site-header-over-hero" : null
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }

    const updateHeaderTone = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const header = document.querySelector<HTMLElement>(".site-header");

      if (!hero || !header) {
        setOverHero(false);
        return;
      }

      setOverHero(hero.getBoundingClientRect().bottom > header.offsetHeight);
    };

    updateHeaderTone();

    const hero = document.querySelector<HTMLElement>(".hero");
    const header = document.querySelector<HTMLElement>(".site-header");
    const observer =
      hero && header
        ? new IntersectionObserver(
            ([entry]) => {
              setOverHero(entry.isIntersecting);
            },
            {
              rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
              threshold: 0
            }
          )
        : null;

    if (observer && hero) {
      observer.observe(hero);
    }
    window.addEventListener("scroll", updateHeaderTone, { passive: true });
    window.addEventListener("resize", updateHeaderTone);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateHeaderTone);
      window.removeEventListener("resize", updateHeaderTone);
    };
  }, [isHome]);

  return (
    <header className={headerClassName}>
      <div className="main-nav-wrap">
        <Link className="brand-link" href="/" aria-label="Town of Ninety Six home">
          <Image
            src={useHeroHeader ? "/brand/96Logo-White.svg" : "/brand/96Logo-Black.svg"}
            alt="Town of Ninety Six"
            width={220}
            height={61}
            priority
          />
        </Link>

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

        <div className="header-actions">
          <Link
            className="header-search-link"
            href="/search"
            aria-current={pathname === "/search" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="search" width={18} height={18} />
            <span>Search</span>
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
        </div>
      </div>
    </header>
  );
}
