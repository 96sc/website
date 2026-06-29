import { eventPath, eventSlug } from "@/lib/cms/links";
import type { EventRecord } from "@/lib/cms/types";
import { getSiteUrl } from "@/lib/structured-data";

const eventTimeZone = "America/New_York";

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldCalendarLine(line: string) {
  const chunks: string[] = [];
  let remaining = line;

  while (remaining.length > 75) {
    chunks.push(remaining.slice(0, 75));
    remaining = remaining.slice(75);
  }

  chunks.push(remaining);
  return chunks.join("\r\n ");
}

function formatCalendarDate(date: string) {
  return date.replace(/-/g, "");
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + days));

  return value.toISOString().slice(0, 10);
}

function formatTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function parseEventTime(time?: string) {
  const match = time?.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, rawHour, rawMinute = "00", meridiem] = match;
  const hourNumber = Number(rawHour);
  const hour =
    meridiem.toUpperCase() === "PM" && hourNumber !== 12
      ? hourNumber + 12
      : meridiem.toUpperCase() === "AM" && hourNumber === 12
        ? 0
        : hourNumber;

  return `${hour.toString().padStart(2, "0")}${rawMinute.padStart(2, "0")}00`;
}

function eventLocation(event: EventRecord) {
  if (!event.address || event.address === event.location) {
    return event.location;
  }

  return `${event.location}, ${event.address}`;
}

function absoluteEventUrl(event: EventRecord) {
  return `${getSiteUrl()}${eventPath(event)}`;
}

export function eventCalendarPath(event: EventRecord) {
  return `${eventPath(event)}/calendar.ics`;
}

export function buildEventCalendar(event: EventRecord) {
  const startDate = event.startDate ?? event.date;
  const startTime = parseEventTime(event.startTime ?? event.time);
  const endDate = event.endDate ?? (event.endTime ? startDate : undefined);
  const endTime = parseEventTime(event.endTime);
  const eventUrl = absoluteEventUrl(event);
  const description = `${event.summary}\n\nView event: ${eventUrl}`;
  const dateLines = startTime
    ? [
        `DTSTART;TZID=${eventTimeZone}:${formatCalendarDate(startDate)}T${startTime}`,
        endDate && endTime
          ? `DTEND;TZID=${eventTimeZone}:${formatCalendarDate(endDate)}T${endTime}`
          : "DURATION:PT1H"
      ]
    : [
        `DTSTART;VALUE=DATE:${formatCalendarDate(startDate)}`,
        `DTEND;VALUE=DATE:${formatCalendarDate(addDays(endDate ?? startDate, 1))}`
      ];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Town of Ninety Six//Website Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${eventSlug(event)}-${event.id}@ninetysixsc.gov`,
    `DTSTAMP:${formatTimestamp(new Date())}`,
    ...dateLines,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(eventLocation(event))}`,
    `URL:${eventUrl}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return `${lines.map(foldCalendarLine).join("\r\n")}\r\n`;
}
