import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icon";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary" | "quiet";
};

export function ActionLink({ href, children, external, variant = "primary" }: ActionLinkProps) {
  const className = `action-link action-link-${variant}`;

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        <span>{children}</span>
        <Icon name="external" width={18} height={18} />
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      <span>{children}</span>
      <Icon name="chevron-right" width={18} height={18} />
    </Link>
  );
}
