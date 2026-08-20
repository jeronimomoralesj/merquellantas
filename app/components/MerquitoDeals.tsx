"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import Link from "next/link";
import { ALL_PRODUCTS, type Product } from "../lib/products";
import { useCart } from "../context/CartContext";

// All products that have a monthly discount
const DEAL_PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => p.discountPct);

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-[#ff9900]",   text: "text-black",  label: "Más vendido"     },
  "flash-deal":  { bg: "bg-rose-500",    text: "text-white",  label: "Oferta limitada" },
  "new":         { bg: "bg-emerald-500", text: "text-white",  label: "Nuevo"            },
  "hot":         { bg: "bg-violet-500",  text: "text-white",  label: "Popular"          },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTimeUntilMonthEnd() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const diff = Math.max(0, end.getTime() - now.getTime());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function getDaysLeftInMonth() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.floor((end.getTime() - now.getTime()) / 86_400_000);
}

function getMonthName() {
  return new Date().toLocaleDateString("es-CO", { month: "long" });
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11}
          className={i <= Math.round(rating) ? "text-[#ff9900]" : "text-gray-200"}
          fill={i <= Math.round(rating) ? "#ff9900" : "transparent"} />
      ))}
    </div>
  );
}

// ── ProductCard — identical design to FlashDeals ──────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex-none w-[268px] sm:w-[284px] rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-400 flex flex-col min-h-[430px] bg-white/55 backdrop-blur-2xl border border-white/72 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.06)] hover:bg-white/70 hover:shadow-[inset_0_2px_0_rgba(255,255,255,1),0_20px_56px_rgba(255,153,0,0.28)]">

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block flex-shrink-0">
        <div
          className="relative h-[200px] overflow-hidden flex items-center justify-center"
          style={
            !product.images?.[0]
              ? { background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }
              : { background: "rgba(255,255,255,0.60)" }
          }
        >
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name}
              className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="text-3xl font-black text-white/20 tracking-tight leading-none">{product.brand}</span>
              <span className="text-xs text-white/30 font-semibold">{product.specs[0]}</span>
            </div>
          )}

          {badge && (
            <div className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${badge.bg} ${badge.text}`}>
              {badge.label}
            </div>
          )}

          {product.discountPct && (
            <div className="absolute top-3.5 right-3.5 px-2 py-1 rounded-full bg-red-600 text-white text-[11px] font-black shadow-sm">
              -{product.discountPct}%
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-6 pb-6 pt-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] mb-1.5">
          {product.brand}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-gray-900 font-bold text-[14.5px] leading-snug mb-3 group-hover:text-[#ff9900] transition-colors line-clamp-2 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.specs.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-5">
          <Stars rating={product.rating} />
          <span className="text-[12px] font-semibold text-gray-400">{product.rating}</span>
          <span className="text-gray-300 text-xs">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-end justify-between mb-4 mt-auto">
          <div>
            <div className="text-[22px] font-black text-gray-900 leading-none">
              ${product.price.toLocaleString("es-CO")}
            </div>
            {product.originalPrice && (
              <div className="text-gray-500 text-[13px] line-through mt-1 font-medium">
                ${product.originalPrice.toLocaleString("es-CO")}
              </div>
            )}
          </div>
          {product.discountPct && (
            <span className="text-red-600 text-sm font-bold mb-0.5">
              -{product.discountPct}%
            </span>
          )}
        </div>

        <button onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold transition-all active:scale-[0.98] ${
            added
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              : "bg-[#ff9900]/95 backdrop-blur-sm text-black hover:bg-[#e68a00] border border-[#ffb84d]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_12px_rgba(255,153,0,0.28)]"
          }`}>
          {added ? <><Check size={14} /> Agregado al carrito</> : <><ShoppingCart size={14} /> Agregar al carrito</>}
        </button>

        <div className="flex items-center justify-center gap-3 mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://mythslegendscollection.com/wp-content/uploads/2020/04/visa-mastercard-american-express-png-6.png"
            alt="Visa Mastercard American Express" className="h-5 object-contain opacity-60" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://colombiafintech.co/wp-content/uploads/2025/11/Addi-logo-01-1024x717.jpg"
            alt="Addi" className="h-5 object-contain opacity-60 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── MerquitoDeals ─────────────────────────────────────────────────────────────

export default function MerquitoDeals() {
  const [time, setTime] = useState(getTimeUntilMonthEnd());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilMonthEnd()), 1000);
    return () => clearInterval(id);
  }, []);

  const showCountdown = getDaysLeftInMonth() < 15;
  const monthName = getMonthName();

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }

  return (
    <section
      className="pt-16 pb-20 relative overflow-hidden"
      style={{ background: "linear-gradient(140deg, #eeeef4 0%, #f5f5f7 50%, #ebebf2 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        {/*
          lg:pr-[332px] aligns the header with the carousel:
          3 cards (3×284 + 2×16 = 884px) + 332px = 1216px = max-w-7xl minus lg padding.
        */}
        <div className="lg:pr-[332px] mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

            <div>
              <h2
                className="font-black text-gray-900 tracking-tight leading-[0.92]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
              >
                Merquito trajo estos<br />
                <span className="text-[#ff9900]">descuentos</span> para ti!
              </h2>
              <p className="text-gray-400 text-[13px] mt-3 font-medium">
                Solo este mes · {monthName} · mientras dure el stock
              </p>
            </div>

            {/* Countdown strip — inline with title on lg */}
            {showCountdown && (
              <div className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-100
                rounded-xl px-4 py-2.5 shadow-sm self-start lg:self-auto">
                <Clock size={13} className="text-red-500 flex-shrink-0" />
                <span className="text-[11px] text-gray-400 font-medium">Quedan</span>
                <span className="text-[13px] font-bold text-gray-800 tabular-nums">
                  {pad(time.days)}d {pad(time.hours)}h {pad(time.minutes)}m{" "}
                  <span className="text-red-500">{pad(time.seconds)}s</span>
                </span>
              </div>
            )}
          </div>

          {/* Scroll arrows */}
          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => scroll("left")} aria-label="Anterior"
              className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-black/[0.07]
                flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all
                shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.07)] hover:bg-white/95">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll("right")} aria-label="Siguiente"
              className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-black/[0.07]
                flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all
                shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.07)] hover:bg-white/95">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Carousel ── */}
        {/*
          overflow-x: auto lets users scroll through all deal products.
          lg:pr-[332px] constrains visible width to exactly 3 cards on large screens,
          leaving room for Merquito on the right without blocking any card.
          paddingTop + negative marginTop lets hover-lifted cards breathe.
        */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 lg:pr-[332px]"
          style={{ paddingTop: "16px", marginTop: "-16px" }}
        >
          {DEAL_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Merquito — small, anchored bottom-right, pointing at products */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merquito-deals.png"
        alt="Merquito"
        className="hidden lg:block absolute right-0 bottom-0 h-[240px] w-auto
          object-contain pointer-events-none select-none"
      />
    </section>
  );
}
