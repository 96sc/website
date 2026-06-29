import type { AlertRecord } from "@/lib/cms/types";
import { CustomSvgIcon } from "./custom-svg-icon";
import { Icon } from "./icon";

type AlertBannerProps = {
  alerts: AlertRecord[];
};

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <section className="alert-band" aria-label="Town notices">
      <div className="alert-band-inner">
        {alerts.map((alert) => (
          <a
            className={`alert-item alert-${alert.severity}`}
            href={alert.href ?? "#"}
            key={alert.id}
          >
            <CustomSvgIcon
              svg={alert.iconSvg}
              className="custom-alert-svg"
              fallback={<Icon name="bell" width={18} height={18} />}
            />
            <span>
              <strong>{alert.title}:</strong> {alert.message}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
