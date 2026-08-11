"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "lubricantes",
    name: "Lubricantes",
    description: "Aceites sinteticos, semi-sinteticos y convencionales",
    count: "320+",
    tags: ["Sintetico", "Diesel", "Transmision", "Aditivos"],
  },
  {
    id: "llantas",
    name: "Llantas",
    description: "Touring, alto rendimiento, todo terreno y SUV",
    count: "840+",
    tags: ["Touring", "A/T", "Performance", "SUV"],
  },
  {
    id: "baterias",
    name: "Baterias",
    description: "AGM, libre mantenimiento y alta potencia",
    count: "180+",
    tags: ["AGM", "Auto", "Moto", "Alta potencia"],
  },
  {
    id: "rines",
    name: "Rines",
    description: "Aluminio OEM, deportivos, acero y off-road",
    count: "260+",
    tags: ["Aluminio", "Off-Road", "Deportivos", "Cromo"],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    description: "Limpieza, proteccion, seguridad vial y mas",
    count: "410+",
    tags: ["Limpieza", "Proteccion", "Seguridad", "Kits"],
  },
];

const ICONS: Record<string, React.ReactNode> = {
  llantas: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <line
          key={i}
          x1="24"
          y1="24"
          x2={24 + 16 * Math.cos((a * Math.PI) / 180)}
          y2={24 + 16 * Math.sin((a * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  ),
  lubricantes: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path
        d="M24 4C24 4 12 20 12 30C12 37.2 17.4 44 24 44C30.6 44 36 37.2 36 30C36 20 24 4 24 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M18 32C18 28 21 25 24 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  baterias: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="6" y="14" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="17" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 26L20 18L20 26L26 18L26 26L32 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rines: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2.5" />
      {[0, 72, 144, 216, 288].map((a, i) => (
        <line
          key={i}
          x1={24 + 8 * Math.cos((a * Math.PI) / 180)}
          y1={24 + 8 * Math.sin((a * Math.PI) / 180)}
          x2={24 + 18 * Math.cos((a * Math.PI) / 180)}
          y2={24 + 18 * Math.sin((a * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  ),
  accesorios: (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path
        d="M24 6L28 18L42 18L31 27L35 40L24 32L13 40L17 27L6 18L20 18Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const TOTAL = CATEGORIES.length;

// Shortest circular distance from centerIndex to index, in range [-2, 2] for 5 items
function relativeDistance(index: number, centerIndex: number, total: number) {
  const half = Math.floor(total / 2);
  let diff = (index - centerIndex + half + total) % total;
  return diff - half;
}

export default function CategoryMatrix() {
  // Start with "llantas" (index 1) centered -> lubricantes left, baterias right
  const [centerIndex, setCenterIndex] = useState(1);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggles both on the way down AND on the way back up,
          // so the reveal replays like Apple's product pages.
          setInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.25,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((dir: 1 | -1) => {
    setCenterIndex((prev) => (prev + dir + TOTAL) % TOTAL);
  }, []);

  return (
    <section ref={sectionRef} id="categories" className="bg-gray-50 py-10 md:py-12 overflow-hidden bg-[url('https://www.eceiza.net/wp-content/uploads/2018/10/carreteras-clasificacion.jpg')] bg-no-repeat bg-center bg-cover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff9900] mb-2">
              Categorias
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Explora nuestro catalogo.
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#ff9900] transition-colors self-start sm:self-auto"
          >
            Ver todo <ArrowRight size={14} />
          </a>
        </div>

        {/* 3D Carousel */}
        <div className="relative">
          {/* Prev arrow */}
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Categoria anterior"
            className="absolute left-0 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-[#ff9900] hover:border-[#ff9900] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Siguiente categoria"
            className="absolute right-0 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-[#ff9900] hover:border-[#ff9900] transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div
            className="relative mx-auto w-full max-w-6xl h-[240px] sm:h-[260px] md:h-[280px] lg:h-[300px]"
            style={{ perspective: "1600px" }}
          >
            {CATEGORIES.map((cat, index) => {
              const rel = relativeDistance(index, centerIndex, TOTAL);
              const visible = Math.abs(rel) <= 1;

              // Target (settled) transform once scrolled into view
              let translateX = "0%";
              let translateZ = "0px";
              let rotateY = "0deg";
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;
              let pointerEvents: "auto" | "none" = "auto";

              if (rel === 0) {
                translateX = "0%";
                rotateY = "0deg";
                scale = 1;
                zIndex = 30;
              } else if (rel === -1) {
                translateX = "-108%";
                translateZ = "-70px";
                rotateY = "20deg";
                scale = 0.88;
                zIndex = 20;
              } else if (rel === 1) {
                translateX = "108%";
                translateZ = "-70px";
                rotateY = "-20deg";
                scale = 0.88;
                zIndex = 20;
              } else if (rel === -2) {
                translateX = "-170%";
                translateZ = "-220px";
                rotateY = "24deg";
                scale = 0.7;
                opacity = 0;
                zIndex = 10;
                pointerEvents = "none";
              } else {
                translateX = "170%";
                translateZ = "-220px";
                rotateY = "-24deg";
                scale = 0.7;
                opacity = 0;
                zIndex = 10;
                pointerEvents = "none";
              }

              // Scroll-reveal: before/after being in view, collapse cards
              // toward the center and fade them, like Apple's reveal.
              const settledTransform = `translate(-50%, -50%) translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`;
              const collapsedTransform = `translate(-50%, -50%) translateX(${
                rel === 0 ? "0%" : rel < 0 ? "-15%" : "15%"
              }) translateZ(-200px) rotateY(0deg) scale(0.4)`;

              const transform = inView ? settledTransform : collapsedTransform;
              const finalOpacity = inView ? opacity : 0;

              return (
                <div
                  key={cat.id}
                  className="absolute left-1/2 top-1/2 w-[200px] sm:w-[230px] md:w-[260px] lg:w-[290px] transition-[transform,opacity] duration-700 ease-out "
                  style={{
                    transform,
                    opacity: finalOpacity,
                    zIndex,
                    pointerEvents: visible ? pointerEvents : "none",
                    transformStyle: "preserve-3d",
                  }}
                  aria-hidden={rel !== 0}
                >
                  <Link
                    href={`/products?category=${cat.id}`}
                    onClick={(e) => {
                      // Side cards act as navigation shortcuts to re-center
                      if (rel !== 0) {
                        e.preventDefault();
                        setCenterIndex(index);
                      }
                    }}
                    className="group/card relative block h-100 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(255,153,0,0.18)] transition-all duration-300 hover:scale-[1.06] hover:-translate-y-1"
                  >
                    {/* Corner accents (appear on hover) */}
                    <span className="pointer-events-none absolute -top-[2px] -left-[2px] w-6 h-6 border-t-[3px] border-l-[3px] border-[#ff9900] rounded-tl-2xl opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300" />
                    <span className="pointer-events-none absolute -top-[2px] -right-[2px] w-6 h-6 border-t-[3px] border-r-[3px] border-[#ff9900] rounded-tr-2xl opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300" />
                    <span className="pointer-events-none absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-[3px] border-l-[3px] border-[#ff9900] rounded-bl-2xl opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300" />
                    <span className="pointer-events-none absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-[3px] border-r-[3px] border-[#ff9900] rounded-br-2xl opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300" />

                    {/* Orange top line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ff9900] scale-x-0 group-hover/card:scale-x-100 transition-transform origin-left rounded-t-2xl" />

                    <div className="w-8 h-8 sm:w-9 sm:h-9 text-gray-300 group-hover/card:text-[#ff9900] transition-colors">
                      {ICONS[cat.id]}
                    </div>

                    <div>
                      <div className="font-black text-gray-900 text-sm sm:text-base group-hover/card:text-[#ff9900] transition-colors text-center">
                        {cat.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 text-center">{cat.count} productos</div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-300 group-hover/card:text-[#ff9900] transition-all text-xs font-semibold mt-auto">
                      Ver categoria
                      <ArrowRight size={13} className="group-hover/card:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}