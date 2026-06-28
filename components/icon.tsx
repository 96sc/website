import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Droplets,
  ExternalLink,
  FileText,
  Landmark,
  MapPin,
  Menu,
  Phone,
  Search,
  Shield,
  Sprout,
  Trash2,
  Users,
  X
} from "lucide-react";
import type { SVGProps } from "react";

const iconMap = {
  bell: Bell,
  briefcase: BriefcaseBusiness,
  calendar: CalendarDays,
  "chevron-right": ChevronRight,
  "credit-card": CreditCard,
  droplets: Droplets,
  external: ExternalLink,
  file: FileText,
  landmark: Landmark,
  map: MapPin,
  menu: Menu,
  phone: Phone,
  search: Search,
  shield: Shield,
  sprout: Sprout,
  trash: Trash2,
  users: Users,
  x: X
};

export type IconName = keyof typeof iconMap;

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
};

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[(name as IconName) in iconMap ? (name as IconName) : "file"];
  return <IconComponent aria-hidden="true" focusable="false" {...props} />;
}
