import { wedding } from "@/config/wedding";

export function GET() {
  const start = wedding.event.calendarStartUtc;
  const end = wedding.event.calendarEndUtc;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Asmaa & Mahmoud//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:asmaa-mahmoud-20261202@wedding.local",
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${wedding.couple.bride} & ${wedding.couple.groom} — Wedding`,
    `LOCATION:${wedding.venue.full}`,
    "DESCRIPTION:Join us for an evening beneath the walls of Salah El-Din Citadel.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="asmaa-mahmoud-wedding.ics"',
    },
  });
}
