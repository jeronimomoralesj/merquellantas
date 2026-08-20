"use client";

import { useState, useEffect } from "react";

export default function MerquitoGreeting() {
  const [up, setUp]         = useState(false);
  const [bubble, setBubble] = useState(false);
  const [wave, setWave]     = useState(false);
  const [down, setDown]     = useState(false);

  useEffect(() => {
    // Already played this session → skip
    if (sessionStorage.getItem("merq-greeting-seen")) return;

    const t1 = setTimeout(() => setUp(true),                    1200);
    const t2 = setTimeout(() => { setBubble(true); setWave(true); }, 1950);
    const t3 = setTimeout(() => setWave(false),                 3500);
    const t4 = setTimeout(() => setBubble(false),               5400);
    const t5 = setTimeout(() => { setDown(true); setUp(false); }, 5700);
    const t6 = setTimeout(
      () => sessionStorage.setItem("merq-greeting-seen", "1"),  6400,
    );

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  // Always render — starts at translateY(102%) (off-screen below),
  // transitions to translateY(0) when "up" is true.
  // Two separate elements: outer handles the slide, inner handles the bob.
  const isShowing = up && !down;

  const slideTransform  = isShowing ? "translateY(0)" : "translateY(102%)";
  const slideTransition = down
    ? "transform 0.55s cubic-bezier(0.55,0,1,0.45)"
    : "transform 0.72s cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 left-5 sm:left-8 z-50 flex flex-col items-start pointer-events-none select-none"
    >
      {/* ── Speech bubble ────────────────────────────────── */}
      <div
        className="relative mb-2 ml-2"
        style={{
          opacity:    bubble ? 1 : 0,
          transform:  bubble ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
          transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm font-bold text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #2a0800 0%, #7a2e00 100%)" }}
        >
          <span
            className="inline-block mr-1.5"
            style={{ animation: wave ? "merqWave 0.6s ease-in-out 3" : "none" }}
          >
            👋
          </span>
          <span>¡Hola!</span>
          <p className="text-[11px] font-normal text-white/60 mt-0.5 whitespace-nowrap">
            Bienvenido a Merquellantas
          </p>
        </div>
        {/* Bubble tail */}
        <div
          className="absolute -bottom-[7px] left-4"
          style={{
            width: 0, height: 0,
            borderLeft:  "8px solid transparent",
            borderRight: "6px solid transparent",
            borderTop:   "8px solid #7a2e00",
          }}
        />
      </div>

      {/* ── Outer wrapper: slide up / down ───────────────── */}
      <div style={{ transform: slideTransform, transition: slideTransition }}>

        {/* ── Inner wrapper: bob while visible ─────────────── */}
        <div className={isShowing ? "animate-merq-bob" : ""}>

          {/* ── Merquito dark container ───────────────────────── */}
          <div
            className="relative overflow-hidden rounded-t-2xl"
            style={{
              width:  "108px",
              height: "168px",
              background: "linear-gradient(to top, #080100 0%, #200800 55%, #5a1e00 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merquito.png"
              alt=""
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 0, height: "300px", mixBlendMode: "screen" }}
            />
            {/* Side fade */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(8,1,0,0.85) 0%, transparent 22%, transparent 78%, rgba(8,1,0,0.85) 100%)",
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
