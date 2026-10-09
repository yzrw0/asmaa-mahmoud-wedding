"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wedding } from "@/config/wedding";
import { MessageForm } from "./WeddingForms";
import { Ornament, Star } from "./Ornament";

const googleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${wedding.couple.groom} & ${wedding.couple.bride} — Wedding`)}&dates=${wedding.event.calendarStartUtc}%2F${wedding.event.calendarEndUtc}&details=${encodeURIComponent("Join us for an evening beneath the walls of Salah El-Din Citadel.")}&location=${encodeURIComponent(wedding.venue.full)}`;

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const distance = Math.max(0, new Date(wedding.event.targetISOString).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function Countdown() {
  const [left, setLeft] = useState<TimeLeft | null>(null);
  useEffect(() => {
    const initial = window.setTimeout(() => setLeft(getTimeLeft()), 0);
    const timer = window.setInterval(() => setLeft(getTimeLeft()), 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, []);
  const units = left ? (["days", "hours", "minutes", "seconds"] as const) : [];
  return <div className="countdown" aria-live="polite" aria-label="Countdown to the wedding">{left ? units.map((unit) => <div className="countdown-unit" key={unit}><strong>{String(left[unit]).padStart(2, "0")}</strong><span>{unit}</span></div>) : <span className="countdown-loading">Preparing the countdown…</span>}</div>;
}

function Palm({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 180 360" aria-hidden="true"><path className="palm-trunk" d="M102 355C98 282 105 207 91 126"/><g className="palm-fronds"><path d="M92 129C54 89 27 88 3 94c36 7 61 21 89 35Z"/><path d="M92 127C48 111 22 124 1 143c34-11 62-9 91-16Z"/><path d="M93 125C68 77 44 64 16 61c31 18 50 38 77 64Z"/><path d="M94 124C88 72 103 46 128 28c-16 32-19 61-34 96Z"/><path d="M94 126c35-38 65-40 84-31-35 7-56 18-84 31Z"/><path d="M94 126c42-8 69 8 84 29-33-14-57-15-84-29Z"/><path d="M93 123C108 75 99 48 82 22c5 36 0 66 11 101Z"/><path d="M94 126c25-29 48-32 70-28-25 10-44 20-70 28Z"/></g></svg>;
}

function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6 7-12A7 7 0 0 0 5 9c0 6 7 12 7 12Z" /><circle cx="12" cy="9" r="2.2" /></svg>; }

export function WeddingExperience() {
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const [musicChoice, setMusicChoice] = useState<"music" | "quiet" | null>(null);
  const [entered, setEntered] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.add("is-locked");
    const hardMaximum = window.setTimeout(() => setLoaderDismissed(true), 1100);
    return () => { window.clearTimeout(hardMaximum); document.body.classList.remove("is-locked"); };
  }, []);

  const chooseEntry = useCallback((withMusic: boolean) => {
    setMusicChoice(withMusic ? "music" : "quiet");

    if (!withMusic) return;

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.muted = false;
    const playback = audio.play();
    if (playback) {
      playback.catch(() => {
        setAudioPlaying(false);
        if (audio.error) setAudioAvailable(false);
      });
    }
  }, []);

  const openInvitation = useCallback(() => {
    if (entered || !musicChoice) return;
    setEntered(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !overlayRef.current) {
      setIntroVisible(false);
      document.body.classList.remove("is-locked");
      return;
    }

    const root = overlayRef.current;
    gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setIntroVisible(false);
        document.body.classList.remove("is-locked");
        window.scrollTo(0, 0);
      },
    })
      .to(root.querySelector(".invitation-actions"), { opacity: 0, y: 8, duration: 0.24 })
      .to(root.querySelector(".wax-seal"), { scale: 0.92, y: 2, duration: 0.12, ease: "power2.out" }, "<")
      .to(root.querySelector(".wax-seal"), { scale: 0.8, y: 18, rotate: 4, opacity: 0, duration: 0.34, ease: "power2.in" })
      .to(root.querySelector(".envelope-flap"), { rotateX: -166, duration: 0.82, ease: "power3.inOut" }, "-=.12")
      .to(root.querySelector(".inner-sheet"), { yPercent: -34, duration: 0.86, ease: "power3.out" }, "-=.48")
      .to(root.querySelectorAll(".fold-wing"), { rotateY: (index) => index === 0 ? -164 : 164, duration: 0.76, stagger: 0.04, ease: "power3.inOut" }, "-=.46")
      .to(root.querySelector(".invitation-light"), { opacity: 0.68, scale: 1.12, duration: 0.72 }, "-=.62")
      .to(root.querySelector(".inner-card-face"), { scale: 1.008, duration: 0.45, ease: "power2.out" }, "-=.42")
      .to(root.querySelector(".invitation-object"), { y: -10, duration: 0.55, ease: "power2.out" }, "-=.4")
      .to(root, { opacity: 0, duration: 0.68, ease: "power2.inOut" }, "+=.9");
  }, [entered, musicChoice]);

  useLayoutEffect(() => {
    if (!entered || !mainRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => gsap.from(element, { opacity: 0, y: 48, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } }));
      const media = gsap.matchMedia();
      media.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" }, ({ conditions }) => {
        const mobile = conditions?.mobile;
        const scene = { trigger: ".citadel-journey", start: "top top", end: "bottom bottom", scrub: mobile ? 1.1 : 1.5 };
        gsap.to(".scene-atmosphere", { xPercent: mobile ? 2 : 5, opacity: 0.76, ease: "none", scrollTrigger: scene });
        gsap.to(".scene-main", { yPercent: mobile ? -2 : -5, scale: mobile ? 1.02 : 1.045, ease: "none", scrollTrigger: scene });
        gsap.fromTo(".scene-gate-layer", { clipPath: "inset(100% 0 0 0)", opacity: 0.25 }, { clipPath: "inset(0% 0 0 0)", opacity: mobile ? 0.62 : 0.76, yPercent: mobile ? -2 : -6, ease: "none", scrollTrigger: scene });
        gsap.to(".scene-palm--left", { xPercent: mobile ? -3 : -9, yPercent: mobile ? -5 : -12, ease: "none", scrollTrigger: scene });
        gsap.to(".scene-palm--right", { xPercent: mobile ? 3 : 9, yPercent: mobile ? -4 : -10, ease: "none", scrollTrigger: scene });
        gsap.timeline({ scrollTrigger: scene })
          .to(".scene-hero-copy", { opacity: 0, yPercent: -7, duration: 0.36, ease: "none" })
          .to(".scene-copy", { opacity: 1, yPercent: mobile ? -2 : -5, duration: 0.46, ease: "none" }, "+=.18");
      });
      gsap.to(".closing-star", { rotate: 90, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".closing", start: "top bottom", end: "bottom bottom", scrub: 1.5 } });
    }, mainRef);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => { window.clearTimeout(refresh); context.revert(); };
  }, [entered]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !audioAvailable) return;
    if (audio.paused) {
      try { await audio.play(); } catch { if (audio.error) setAudioAvailable(false); }
    } else { audio.pause(); setAudioPlaying(false); }
  };

  const audioLabel = useMemo(() => !audioAvailable ? "Music will be available when the final track is added" : audioPlaying ? "Pause music" : "Play music", [audioAvailable, audioPlaying]);

  return <>
    <audio ref={audioRef} loop preload="metadata" playsInline onCanPlay={() => setAudioAvailable(true)} onPlay={() => setAudioPlaying(true)} onPause={() => setAudioPlaying(false)} onError={() => setAudioAvailable(false)}>
      <source src={wedding.music.src} type="audio/mpeg" />
    </audio>

    {introVisible && <div className="opening-layer" ref={overlayRef} aria-label="Open the wedding invitation">
      <div className={`loader ${loaderDismissed ? "is-dismissed" : ""}`} role="status" aria-live="polite"><div className="loader-monogram">M<span>·</span>A</div><div className="loader-line"><i /></div><p>Preparing your invitation</p></div>
      <div className="invitation-stage">
        <div className="opening-aura" aria-hidden="true" />
        <div className="invitation-light" aria-hidden="true" />
        <div
          className={`invitation-object ${musicChoice ? "is-ready" : ""}`}
          role={musicChoice ? "button" : undefined}
          tabIndex={musicChoice ? 0 : -1}
          aria-label={musicChoice ? "Open the sealed wedding invitation" : undefined}
          onClick={openInvitation}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openInvitation(); } }}
        >
          <div className="invitation-shadow" />
          <div className="envelope-back" />
          <div className="inner-sheet">
            <div className="fold-wing fold-wing--left" />
            <div className="fold-wing fold-wing--right" />
            <div className="inner-card-face">
              <p className="card-names"><span>{wedding.couple.groom}</span><i>&</i><span>{wedding.couple.bride}</span></p>
              <strong>We’re getting married</strong>
              <small>{wedding.event.dateLabel} · {wedding.event.timeLabel}</small>
              <em>{wedding.venue.name}<br />{wedding.venue.landmark}</em>
            </div>
          </div>
          <div className="envelope-pocket" />
          <div className="envelope-flap" />
          <div className="wax-seal"><span>M</span><i>·</i><span>A</span></div>
        </div>
        <div className={`invitation-actions ${musicChoice ? "has-choice" : ""}`}>
          {!musicChoice ? <>
            <p>A private invitation awaits</p>
            <div><button onClick={() => chooseEntry(true)}>Enter with music</button><button onClick={() => chooseEntry(false)}>Enter quietly</button></div>
            <small>Choose how you would like to enter</small>
          </> : <>
            <p>{musicChoice === "music" && !audioPlaying && audioAvailable ? "Music is ready" : musicChoice === "music" && !audioAvailable ? "Music unavailable — the invitation is ready" : "The invitation is ready"}</p>
            <button className="open-prompt" onClick={openInvitation}>Tap the seal to open</button>
          </>}
        </div>
      </div>
    </div>}

    {entered && <main ref={mainRef} className="wedding-site">
      {wedding.sections.citadel && <section className="citadel-journey" aria-labelledby="hero-title">
        <div className="citadel-scene">
          <div className="scene-sky" /><div className="scene-atmosphere" /><div className="scene-moon" />
          <div className="scene-main"><Image src={wedding.assets.illustratedScene} alt="A painted architectural panorama of Salah El-Din Citadel" fill priority sizes="100vw" /></div>
          <div className="scene-gate-layer"><Image src={wedding.assets.illustratedGate} alt="" fill sizes="(max-width: 767px) 68vw, 42vw" /></div>
          <Palm className="scene-palm scene-palm--left" /><Palm className="scene-palm scene-palm--right" />
          <div className="scene-hero-copy">
            <p className="eyebrow">We’re getting married</p>
            <h1 id="hero-title"><span>{wedding.couple.groom}</span><i>&</i><span>{wedding.couple.bride}</span></h1>
            <Ornament compact />
            <p className="scene-hero-date">{wedding.event.dateLabel} · {wedding.event.timeLabel}</p>
            <p className="scene-hero-venue">{wedding.venue.name} · {wedding.venue.landmark}</p>
          </div>
          <div className="scene-copy" aria-hidden="true"><p className="eyebrow">The place that holds the night</p><h2>Through storied walls,<br /><em>toward forever</em></h2><span>Salah El-Din Citadel · Bir Yusuf</span></div>
          <div className="scroll-cue"><span>Enter the evening</span><i /></div>
        </div>
      </section>}

      <section className="date-section section" aria-labelledby="date-title"><div className="date-orbit" aria-hidden="true"><span /><span /><span /></div><div data-reveal><p className="eyebrow">Save the date</p><h2 id="date-title"><span>{wedding.event.day}</span><i>{wedding.event.month}</i><span>{wedding.event.yearShort}</span></h2><p className="date-time">Six o’clock in the evening · Cairo time</p>{wedding.sections.countdown && <Countdown />}</div></section>

      {wedding.sections.venue && <section className="venue section" aria-labelledby="venue-title">
        <div className="venue-visual" data-reveal><div className="venue-moon" /><div className="venue-terraces"><i /><i /><i /></div><div className="venue-tower-art"><Image src={wedding.assets.illustratedTower} alt="An illustrated round tower and stone stairway at Salah El-Din Citadel" fill sizes="(max-width: 800px) 86vw, 45vw" /></div><Palm className="venue-palm" /><div className="venue-visual-frame" /><span className="venue-number">I</span></div>
        <div className="venue-copy" data-reveal><p className="eyebrow">The gathering place</p><h2 id="venue-title">Bir Yusuf</h2><p className="venue-landmark">Salah El-Din Citadel</p><p>{wedding.venue.city}<br />{wedding.event.dateLabel} · {wedding.event.timeLabel}</p><div className="no-children-note"><Image src="/no-kids.png" alt="" width={32} height={32} /><p>Little ones, we wish you the sweetest dreams at home.</p></div><div className="venue-actions"><a className="gold-button" href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer"><PinIcon />Open in Google Maps</a><a className="text-link" href={googleCalendar} target="_blank" rel="noreferrer">Google Calendar <ArrowIcon /></a><a className="text-link" href="/calendar.ics" download>Download .ics <ArrowIcon /></a></div></div>
      </section>}

      {wedding.sections.message && <section className="message-section section" aria-labelledby="message-title">
        <div className="message-heading" data-reveal><Star className="message-star" /><p className="eyebrow">From your heart to ours</p><h2 id="message-title">Leave a message<br /><em>for the couple</em></h2><p>A few words from you will become part of this evening forever.</p></div>
        <div className="form-shell form-shell--dark" data-reveal><MessageForm /></div>
      </section>}

      {wedding.sections.closing && <footer className="closing" aria-label="Closing invitation"><div className="closing-sky" /><div className="closing-architecture"><Image src={wedding.assets.illustratedGate} alt="An illustrated historic Citadel gate" fill sizes="90vw" /></div><div className="closing-overlay" /><Star className="closing-star" /><div className="closing-content" data-reveal><p className="eyebrow">Until we meet beneath the Citadel walls</p><h2>{wedding.couple.groom.split(" ")[0]} <i>&</i> {wedding.couple.bride.split(" ")[0]}</h2><Ornament /><p>{wedding.event.numericDateLabel}</p><small>With love, we await you.</small></div></footer>}
    </main>}

    {entered && <button className={`audio-control ${audioPlaying ? "is-playing" : ""}`} type="button" onClick={toggleAudio} disabled={!audioAvailable} aria-label={audioLabel} title={audioLabel}><span aria-hidden="true">{audioAvailable ? (audioPlaying ? "Ⅱ" : "♪") : "×"}</span><i /></button>}
  </>;
}
