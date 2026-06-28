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
  href?: string;
  updatedAt: string;
};

export type EventRecord = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  href?: string;
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

export type CmsSnapshot = {
  pages: PageRecord[];
  services: ServiceRecord[];
  alerts: AlertRecord[];
  events: EventRecord[];
  meetings: MeetingRecord[];
  departments: DepartmentRecord[];
  officials: OfficialRecord[];
  documents: DocumentRecord[];
  externalLinks: ExternalLink[];
};
