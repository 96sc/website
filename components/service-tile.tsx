import type { ServiceRecord } from "@/lib/cms/types";
import { ActionLink } from "./action-link";
import { Icon } from "./icon";

type ServiceTileProps = {
  service: ServiceRecord;
  compact?: boolean;
};

export function ServiceTile({ service, compact = false }: ServiceTileProps) {
  return (
    <article className={compact ? "service-tile service-tile-compact" : "service-tile"}>
      <div className="tile-icon">
        <Icon name={service.icon} width={24} height={24} />
      </div>
      <div>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <ActionLink href={`/services/${service.slug}`} variant="quiet">
          Details
        </ActionLink>
      </div>
    </article>
  );
}
