export function Ornament({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? "ornament ornament--compact" : "ornament"} viewBox="0 0 420 62" aria-hidden="true">
      <path d="M4 31h122c27 0 36-20 53-20 13 0 20 8 31 20 11-12 18-20 31-20 17 0 26 20 53 20h122" />
      <path d="M145 31c18 0 24 15 33 25M275 31c-18 0-24 15-33 25M177 7c7 2 14 11 16 20M243 7c-7 2-14 11-16 20" />
      <circle cx="210" cy="31" r="4" />
      <circle cx="126" cy="31" r="2" />
      <circle cx="294" cy="31" r="2" />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 0c2 35 15 48 50 50-35 2-48 15-50 50-2-35-15-48-50-50C35 48 48 35 50 0Z" fill="currentColor" />
      <circle cx="50" cy="50" r="7" fill="var(--wine)" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
