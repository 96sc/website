export type CmsStatus = "published" | "draft" | "archived";

export type ExternalLink = {
  id: string;
  title: string;
  href: string;
  description: string;
  type: "payment" | "ordinance" | "archive" | "state" | "form" | "resource";
};

export type DocumentRecord = {
  id: string;
  title: string;
  href: string;
  kind: "agenda" | "minutes" | "recording" | "form" | "map" | "ordinance" | "archive";
  date?: string;
};

export type ContactPoint = {
  label: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
};

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  status: CmsStatus;
  updatedAt: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: string;
  steps: string[];
  feesAndDeadlines: string[];
  contact: ContactPoint;
  documents: DocumentRecord[];
  action: {
    label: string;
    href: string;
    external?: boolean;
  };
  icon: string;
  featured?: boolean;
};

export type AlertRecord = {
  id: string;
  title: string;
  message: string;
  severity: "notice" | "warning" | "urgent";
  active?: boolean;
  iconSvg?: string;
  href?: string;
  updatedAt: string;
};

export type NewsRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  date: string;
  updatedAt: string;
  href?: string;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  applePlaceId?: string;
  summary: string;
  body?: string[];
  image?: {
    src: string;
    alt?: string;
  };
  href?: string;
};

export type PlaceRecord = {
  id: string;
  slug: string;
  title: string;
  category: "civic" | "park" | "historic" | "business" | "community" | "visitor" | "other";
  summary: string;
  body?: string[];
  image?: {
    src: string;
    alt?: string;
  };
  address: string;
  latitude?: string;
  longitude?: string;
  applePlaceId?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  featured?: boolean;
};

export type MeetingRecord = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  documents: DocumentRecord[];
};

export type DepartmentRecord = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  contact: ContactPoint;
  services: string[];
};

export type OfficialRecord = {
  id: string;
  name: string;
  role: string;
  ward?: string;
  email?: string;
  committees?: string[];
};

export type StaffRecord = {
  id: string;
  name: string;
  role: string;
  department?: string;
  phone?: string;
  email?: string;
};

export type CmsSnapshot = {
  pages: PageRecord[];
  services: ServiceRecord[];
  alerts: AlertRecord[];
  news: NewsRecord[];
  events: EventRecord[];
  places: PlaceRecord[];
  meetings: MeetingRecord[];
  departments: DepartmentRecord[];
  officials: OfficialRecord[];
  staff: StaffRecord[];
  documents: DocumentRecord[];
  externalLinks: ExternalLink[];
};
