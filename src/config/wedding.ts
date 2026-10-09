export const wedding = {
  couple: {
    bride: "Asmaa Ayman",
    groom: "Mahmoud Saad",
    initials: "A · M",
  },
  event: {
    date: "2026-12-02",
    dateLabel: "2 December 2026",
    numericDateLabel: "02 · 12 · 2026",
    day: "02",
    month: "December",
    yearShort: "26",
    time: "18:00",
    timeLabel: "6:00 PM",
    timezone: "Africa/Cairo",
    targetISOString: "2026-12-02T18:00:00+02:00",
    calendarStartUtc: "20261202T160000Z",
    calendarEndUtc: "20261202T200000Z",
    durationMinutes: 240,
  },
  venue: {
    name: "Bir Yusuf",
    landmark: "Salah El-Din Citadel",
    city: "Cairo, Egypt",
    full: "Bir Yusuf, Salah El-Din Citadel, Cairo, Egypt",
    mapsUrl: "https://maps.app.goo.gl/13QM3cKGRwm3ogse8?g_st=iw",
  },
  music: {
    src: "/audio/wedding-theme.mp3",
  },
  assets: {
    hero: "/architecture/citadel-hero-main.webp",
    gate: "/architecture/citadel-gate.jpg",
    tower: "/architecture/citadel-round-tower.jpg",
    illustratedScene: "/architecture/citadel-illustrated-scene.webp",
    illustratedGate: "/architecture/citadel-gate-layer.webp",
    illustratedTower: "/architecture/citadel-tower-layer.webp",
  },
  sections: {
    citadel: true,
    saveTheDate: true,
    countdown: true,
    venue: true,
    message: true,
    closing: true,
  },
} as const;

export type WeddingConfig = typeof wedding;
