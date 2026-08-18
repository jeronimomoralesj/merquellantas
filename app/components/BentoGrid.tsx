"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "llantas",
    name: "Llantas",
    count: "840+",
    description: "Touring, alto rendimiento, todo terreno y SUV para cualquier vehículo.",
    tags: ["Touring", "A/T", "Performance", "SUV"],
    image: "https://scontent2.llantas.mx/images/508X636/models/Aurora_AT_698638317f909.jpg",
  },
  {
    id: "lubricantes",
    name: "Lubricantes",
    count: "320+",
    description: "Aceites sintéticos, semi-sintéticos y convencionales de las mejores marcas.",
    tags: ["Sintético", "Diesel", "Transmisión"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLui5NeMRuN-kC_mqQErOhhjkql8IO6riWkRAngsKlag&s=10",
  },
  {
    id: "baterias",
    name: "Baterías",
    count: "180+",
    description: "AGM, libre mantenimiento y alta potencia de arranque garantizada.",
    tags: ["AGM", "Auto", "Moto"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3vQzJPRnUiYZHldmJnU6bB7xOTiWg6PrOM72oV9YHQA&s=10",
  },
  {
    id: "rines",
    name: "Rines",
    count: "260+",
    description: "Aluminio OEM, deportivos, acero y off-road para todo tipo de vehículo.",
    tags: ["Aluminio", "Off-Road", "Deportivos"],
    image: "https://www.wheelcompany.com.co/public/images/item/1742263056.jpeg",
  },
];

const BG_URL =
  "https://media.istockphoto.com/id/1850894851/es/foto/camiones-blancos-que-conducen-por-la-carretera-que-serpentea-a-trav%C3%A9s-del-paisaje-boscoso-en.jpg?s=612x612&w=0&k=20&c=XDsd62PQONKMs7iX8WwQAzsEbFB74g-X58733aAp8kg=";

export default function BentoGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cards = el.querySelectorAll<HTMLElement>("[data-cat-card]");
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNav, { passive: true });
    updateNav();
    return () => el.removeEventListener("scroll", updateNav);
  }, [updateNav]);

  const goTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-cat-card]")[idx];
    if (card) el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  return (
    <section
      id="categories"
      className="relative pt-28 pb-20 overflow-hidden"
      style={{
        backgroundImage: `url("${BG_URL}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff9900] mb-3">
              Categorías
            </p>
            <h2
              className="font-black text-white tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Explora nuestro<br />catálogo.
            </h2>
          </div>

          {/* Desktop prev/next */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={!canPrev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 disabled:opacity-25 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={!canNext}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 disabled:opacity-25 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              data-cat-card=""
              className="flex-none w-[260px] sm:w-[280px] lg:w-[295px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group block h-[400px] bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.30)] hover:shadow-[0_16px_56px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-500 hover:-translate-y-3"
              >
                {/* Image area */}
                <div className="relative h-[52%] overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                  {/* orange top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ff9900]" />
                  {/* card number */}
                  <div className="absolute bottom-3 right-4 text-[10px] font-black text-white/70 tabular-nums select-none bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    0{i + 1}
                  </div>
                </div>

                {/* Text area */}
                <div className="p-5 flex flex-col justify-between" style={{ height: "48%" }}>
                  <div>
                    <div
                      className="font-black text-[#1d1d1f] leading-[0.9] tracking-tight mb-1"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                    >
                      {cat.name}
                    </div>
                    <div className="text-[#ff9900] font-bold text-[11px] uppercase tracking-[0.18em] mb-3">
                      {cat.count} referencias
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-[#1d1d1f]/50 border border-black/[0.10] group-hover:border-[#ff9900]/35 group-hover:text-[#ff9900]/80 px-2.5 py-0.5 rounded-full font-medium transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#ff9900] text-sm font-bold">
                    Ver {cat.name.toLowerCase()}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* "See all" end card */}
          <div
            className="flex-none w-[170px] sm:w-[190px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link
              href="/products"
              className="group h-[400px] border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[#ff9900]/50 transition-colors duration-300 px-6"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 group-hover:bg-[#ff9900]/20 flex items-center justify-center transition-colors duration-300">
                <ArrowRight size={18} className="text-white/50 group-hover:text-[#ff9900] transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-white/70 font-bold text-sm group-hover:text-white transition-colors">Ver catálogo</p>
                <p className="text-white/30 text-xs mt-1">+1.600 productos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dot indicators + mobile buttons */}
        <div className="mt-7 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a ${CATEGORIES[i].name}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 h-2 bg-[#ff9900]"
                    : "w-2 h-2 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>

          {/* Mobile prev/next */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={!canPrev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-25 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={!canNext}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-25 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* "Ver todo" link — mobile only */}
        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm font-semibold text-white/40 hover:text-[#ff9900] transition-colors"
          >
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
