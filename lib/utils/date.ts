export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(new Date(`${value}T12:00:00-04:00`));
}

export function shortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York"
  }).format(new Date(`${value}T12:00:00-04:00`));
}

export function formatDateRange(startDate: string, endDate?: string) {
  if (!endDate || endDate === startDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function formatTimeRange(startTime: string, endTime?: string) {
  if (!endTime || endTime === startTime) {
    return startTime;
  }

  return `${startTime} - ${endTime}`;
}
