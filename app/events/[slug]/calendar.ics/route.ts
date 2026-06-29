import { getCmsSnapshot, getEventBySlug } from "@/lib/cms/content";
import { eventSlug } from "@/lib/cms/links";
import { buildEventCalendar } from "@/lib/calendar";

type EventCalendarRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const snapshot = await getCmsSnapshot();
  return snapshot.events.map((event) => ({ slug: eventSlug(event) }));
}

export async function GET(_request: Request, { params }: EventCalendarRouteProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(buildEventCalendar(event), {
    headers: {
      "Content-Disposition": `attachment; filename="${eventSlug(event)}.ics"`,
      "Content-Type": "text/calendar; charset=utf-8"
    }
  });
}
