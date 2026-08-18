"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "accesorios",
    name: "Accesorios",
    count: "410+",
    description: "Limpieza, protección, seguridad vial y mucho más para tu vehículo.",
    tags: ["Limpieza", "Protección", "Kits"],
    glowFrom: "rgba(52,211,153,0.08)",
    glowTo: "transparent",
  },
  {
    id: "baterias",
    name: "Baterías",
    count: "180+",
    description: "AGM, libre mantenimiento y alta potencia de arranque garantizada.",
    tags: ["AGM", "Auto", "Moto"],
    glowFrom: "rgba(234,179,8,0.08)",
    glowTo: "transparent",
  },
  {
    id: "llantas",
    name: "Llantas",
    count: "840+",
    description: "Touring, alto rendimiento, todo terreno y SUV para cualquier vehículo.",
    tags: ["Touring", "A/T", "Performance", "SUV"],
    glowFrom: "rgba(255,153,0,0.10)",
    glowTo: "transparent",
  },
  {
    id: "rines",
    name: "Rines",
    count: "260+",
    description: "Aluminio OEM, deportivos, acero y off-road para todo tipo de vehículo.",
    tags: ["Aluminio", "Off-Road", "Deportivos"],
    glowFrom: "rgba(168,85,247,0.08)",
    glowTo: "transparent",
  },
  {
    id: "lubricantes",
    name: "Lubricantes",
    count: "320+",
    description: "Aceites sintéticos, semi-sintéticos y convencionales de las mejores marcas.",
    tags: ["Sintético", "Diesel", "Transmisión"],
    glowFrom: "rgba(56,189,248,0.08)",
    glowTo: "transparent",
  },
];

const ICONS: Record<string, (sz: number) => React.ReactNode> = {
  llantas: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <line key={i} x1="24" y1="24"
          x2={24 + 16 * Math.cos((a * Math.PI) / 180)}
          y2={24 + 16 * Math.sin((a * Math.PI) / 180)}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  ),
  lubricantes: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <path d="M24 4C24 4 12 20 12 30C12 37.2 17.4 44 24 44C30.6 44 36 37.2 36 30C36 20 24 4 24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 32C18 28 21 25 24 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  baterias: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="14" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="17" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M14 26L20 18L20 26L26 18L26 26L32 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  rines: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2.5" />
      {[0, 72, 144, 216, 288].map((a, i) => (
        <line key={i}
          x1={24 + 8 * Math.cos((a * Math.PI) / 180)} y1={24 + 8 * Math.sin((a * Math.PI) / 180)}
          x2={24 + 18 * Math.cos((a * Math.PI) / 180)} y2={24 + 18 * Math.sin((a * Math.PI) / 180)}
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </svg>
  ),
  accesorios: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <path d="M24 6L28 18L42 18L31 27L35 40L24 32L13 40L17 27L6 18L20 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
};

/* Rolling tire — dark on light background */
function TireSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#1d1d1f" stroke="#ff9900" strokeWidth="1.4"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={16 + 10.5 * Math.cos(rad)} y1={16 + 10.5 * Math.sin(rad)}
            x2={16 + 14   * Math.cos(rad)} y2={16 + 14   * Math.sin(rad)}
            stroke="#ff9900" strokeWidth="2.8" strokeLinecap="round"
          />
        );
      })}
      <circle cx="16" cy="16" r="8.5" fill="#2a2a2a" stroke="#ff9900" strokeWidth="0.8" strokeOpacity="0.5"/>
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={16 + 3.5 * Math.cos(rad)} y1={16 + 3.5 * Math.sin(rad)}
            x2={16 + 8   * Math.cos(rad)} y2={16 + 8   * Math.sin(rad)}
            stroke="#ff9900" strokeWidth="1.3" strokeOpacity="0.65" strokeLinecap="round"
          />
        );
      })}
      <circle cx="16" cy="16" r="3.5" fill="#ff9900" opacity="0.85"/>
      <circle cx="16" cy="16" r="1.8" fill="#1d1d1f"/>
    </svg>
  );
}

const CARD_GAP = 20;
const SIDE_PAD = 64;
const TIRE_DIAMETER = 32;

export default function BentoGrid() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const tireRef     = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const tireIconRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const currentX = useRef(0);
  const targetX  = useRef(0);
  const rafId    = useRef<number>(0);

  const [sectionH, setSectionH] = useState("190vh");
  const [headerIn, setHeaderIn] = useState(false);

  useEffect(() => {
    function calcH() {
      const vw = window.innerWidth;
      setSectionH(vw < 640 ? "230vh" : vw < 1024 ? "205vh" : "185vh");
    }
    calcH();
    window.addEventListener("resize", calcH);
    return () => window.removeEventListener("resize", calcH);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderIn(true); },
      { threshold: 0.02 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      const sectionTop  = section.offsetTop;
      const sectionFull = section.offsetHeight;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const progress = Math.max(0, Math.min(1,
        (window.scrollY - sectionTop) / (sectionFull - vh)
      ));

      const trackW  = track.scrollWidth;
      const maxMove = Math.min(0, -(trackW - vw + SIDE_PAD));
      targetX.current = progress * maxMove;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const LERP = 0.085;
    const TIRE_CIRCUMFERENCE = Math.PI * TIRE_DIAMETER;

    function tick() {
      const dx = targetX.current - currentX.current;
      currentX.current += dx * LERP;
      const x = currentX.current;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      if (tireRef.current) {
        tireRef.current.style.transform = `translateY(-50%) translateX(${-x * 0.06}px)`;
      }

      if (progressRef.current && sectionRef.current) {
        const sTop  = sectionRef.current.offsetTop;
        const sFull = sectionRef.current.offsetHeight;
        const vh    = window.innerHeight;
        const p     = Math.max(0, Math.min(1, (window.scrollY - sTop) / (sFull - vh)));

        progressRef.current.style.width = `${p * 100}%`;

        if (tireIconRef.current) {
          const barW     = barRef.current?.offsetWidth ?? 800;
          const travelPx = p * barW;
          const angle    = (travelPx / TIRE_CIRCUMFERENCE) * 360;
          tireIconRef.current.style.left      = `calc(${(p * 100).toFixed(2)}% - ${TIRE_DIAMETER / 2}px)`;
          tireIconRef.current.style.transform = `rotate(${angle.toFixed(1)}deg)`;
        }
      }

      const vw     = window.innerWidth;
      const centre = vw / 2;
      const card0  = cardRefs.current[0];
      const cardW  = card0 ? card0.offsetWidth : 300;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCentre = SIDE_PAD + i * (cardW + CARD_GAP) + cardW / 2 + x;
        const dist       = Math.abs(cardCentre - centre);
        const t          = Math.min(1, dist / (vw * 0.52));
        const scale      = (1 - t * 0.09).toFixed(4);
        const lift       = ((1 - t) * 22).toFixed(2);
        const opacity    = Math.max(0.38, 1 - t * 0.52).toFixed(3);
        card.style.transform = `scale(${scale}) translateY(${-lift}px)`;
        card.style.opacity   = opacity;
      });

      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative bg-[#f5f5f7]"
      style={{ height: sectionH }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

        {/* Subtle diagonal tread texture — light version */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-55deg, transparent 0, transparent 26px, rgba(0,0,0,0.012) 26px, rgba(0,0,0,0.012) 27px)",
          }}
        />

        {/* Large tyre ring — parallaxes, light version */}
        <div
          ref={tireRef}
          className="absolute top-1/2 pointer-events-none select-none"
          style={{
            right: "-8vw",
            width: "clamp(360px, 58vh, 680px)",
            height: "clamp(360px, 58vh, 680px)",
            borderRadius: "50%",
            border: "clamp(18px,3.5vh,46px) solid rgba(0,0,0,0.04)",
            boxShadow: "inset 0 0 0 clamp(5px,1.2vh,14px) rgba(0,0,0,0.02)",
            transform: "translateY(-50%)",
            willChange: "transform",
          }}
        >
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 origin-center"
              style={{
                width: "1px", height: "90%",
                background: "rgba(0,0,0,0.025)",
                transform: `translate(-50%, -50%) rotate(${deg}deg)`,
              }}
            />
          ))}
        </div>

        {/* ── Section header ─────────────────────────────────────── */}
        <div
          className="relative z-10 flex-shrink-0 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-6 flex items-end justify-between"
          style={{
            opacity:    headerIn ? 1 : 0,
            transform:  headerIn ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff9900] mb-3">
              Categorías
            </p>
            <h2
              className="font-black text-[#1d1d1f] tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Explora nuestro<br />catálogo.
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#1d1d1f]/35 hover:text-[#ff9900] transition-colors"
          >
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Horizontal card track ──────────────────────────────── */}
        <div
          ref={trackRef}
          className="relative z-10 flex items-center gap-5 flex-1 pb-8"
          style={{
            paddingLeft:  SIDE_PAD,
            paddingRight: SIDE_PAD,
            willChange:   "transform",
            width:        "max-content",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="flex-none w-[248px] sm:w-[268px] lg:w-[295px] h-[330px] sm:h-[350px]"
              style={{ willChange: "transform, opacity" }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group relative h-full bg-white border border-black/[0.07] rounded-3xl overflow-hidden flex flex-col justify-between p-5 lg:p-6 hover:border-[#ff9900]/50 transition-[border-color,box-shadow] duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              >
                {/* per-category colour wash */}
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 20% 90%, ${cat.glowFrom}, ${cat.glowTo})`,
                  }}
                />
                {/* orange top edge on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl" />
                {/* card number */}
                <div className="absolute top-5 right-6 text-[11px] font-black text-black/10 tabular-nums select-none">
                  0{i + 1}
                </div>

                {/* top section */}
                <div>
                  <div className="text-[#ff9900]/55 group-hover:text-[#ff9900] transition-colors duration-500 mb-3">
                    {ICONS[cat.id]?.(32)}
                  </div>

                  <div
                    className="font-black text-[#1d1d1f] leading-[0.9] tracking-tight mb-1"
                    style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
                  >
                    {cat.name}
                  </div>

                  <div className="text-[#ff9900] font-bold text-[11px] uppercase tracking-[0.18em] mb-2">
                    {cat.count} referencias
                  </div>

                  <p className="text-[#1d1d1f]/55 text-sm leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* bottom section */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-[#1d1d1f]/50 border border-black/[0.10] group-hover:border-[#ff9900]/35 group-hover:text-[#ff9900]/80 px-2.5 py-1 rounded-full font-medium transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[#ff9900]/70 group-hover:text-[#ff9900] text-sm font-bold transition-colors duration-300">
                    Ver {cat.name.toLowerCase()}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* End — "See all" card */}
          <div className="flex-none w-[170px] sm:w-[190px] h-[330px] sm:h-[350px]">
            <Link
              href="/products"
              className="group h-full border border-dashed border-black/[0.12] rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[#ff9900]/40 transition-colors duration-300 px-6"
            >
              <div className="w-11 h-11 rounded-full bg-black/[0.04] group-hover:bg-[#ff9900]/10 flex items-center justify-center transition-colors duration-300">
                <ArrowRight size={18} className="text-black/30 group-hover:text-[#ff9900] transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-[#1d1d1f]/60 font-bold text-sm group-hover:text-[#1d1d1f] transition-colors">Ver catálogo</p>
                <p className="text-[#1d1d1f]/30 text-xs mt-1">+1.600 productos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Progress bar + rolling tire ────────────────────────── */}
        <div
          ref={barRef}
          className="relative z-10 flex-shrink-0 mb-5 mx-6 sm:mx-10 lg:mx-16"
          style={{ height: `${TIRE_DIAMETER + 6}px` }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black/[0.10] rounded-full">
            <div
              ref={progressRef}
              className="h-full bg-[#ff9900] rounded-full"
              style={{ width: "0%", transition: "none" }}
            />
          </div>
          <div
            ref={tireIconRef}
            className="absolute bottom-0 pointer-events-none select-none"
            style={{ left: "0px", willChange: "transform, left" }}
          >
            <TireSVG />
          </div>
        </div>

      </div>
    </section>
  );
}
