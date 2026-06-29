import type { ReactNode } from "react";

type CustomSvgIconProps = {
  svg?: string;
  className?: string;
  fallback: ReactNode;
};

export function CustomSvgIcon({ svg, className, fallback }: CustomSvgIconProps) {
  if (!svg?.trim()) {
    return <>{fallback}</>;
  }

  return (
    <span
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
