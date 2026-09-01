"use client";

import { useState, useRef } from "react";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ALL_PRODUCTS, type Product } from "../lib/products";
import { useCart } from "../context/CartContext";

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-[#ff9900]",   text: "text-black",  label: "Más vendido"     },
  "flash-deal":  { bg: "bg-rose-500",    text: "text-white",  label: "Oferta limitada" },
  "new":         { bg: "bg-emerald-500", text: "text-white",  label: "Nuevo"            },
  "hot":         { bg: "bg-violet-500",  text: "text-white",  label: "Popular"          },
};

const TRUST = [
  {
    label: "Pago 100% seguro",
    sub: "SSL · PSE · Tarjetas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: "Garantía oficial",
    sub: "Marcas certificadas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: "Envío a todo el país",
    sub: "Express disponible",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Devolución fácil",
    sub: "30 días sin preguntas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    ),
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? "text-[#ff9900]" : "text-gray-200"}
          fill={i <= Math.round(rating) ? "#ff9900" : "transparent"}
        />
      ))}
    </div>
  );
}

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
    <div className="flex-none w-[268px] sm:w-[284px] rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-transform duration-400 flex flex-col min-h-[430px] bg-white border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_56px_rgba(255,153,0,0.28)]">

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
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="text-3xl font-black text-white/20 tracking-tight leading-none">
                {product.brand}
              </span>
              <span className="text-xs text-white/30 font-semibold">{product.specs[0]}</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div
              className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${badge.bg} ${badge.text}`}
            >
              {badge.label}
            </div>
          )}

          {/* Discount pill */}
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

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.specs.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-5">
          <Stars rating={product.rating} />
          <span className="text-[12px] font-semibold text-gray-400">{product.rating}</span>
          <span className="text-gray-300 text-xs">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
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

        {/* CTA */}
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold transition-all active:scale-[0.98] ${
            added
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              : "bg-[#ff9900]/95 backdrop-blur-sm text-black hover:bg-[#e68a00] border border-[#ffb84d]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_12px_rgba(255,153,0,0.28)]"
          }`}
        >
          {added ? (
            <><Check size={14} /> Agregado al carrito</>
          ) : (
            <><ShoppingCart size={14} /> Agregar al carrito</>
          )}
        </button>

        {/* Payment logos */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://mythslegendscollection.com/wp-content/uploads/2020/04/visa-mastercard-american-express-png-6.png"
            alt="Visa Mastercard American Express"
            className="h-5 object-contain opacity-60"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://colombiafintech.co/wp-content/uploads/2025/11/Addi-logo-01-1024x717.jpg"
            alt="Addi"
            className="h-5 object-contain opacity-60 rounded"
          />
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: "all",         label: "Todo"        },
  { id: "llantas",     label: "Llantas"     },
  { id: "lubricantes", label: "Lubricantes" },
  { id: "baterias",    label: "Baterías"    },
  { id: "rines",       label: "Rines"       },
  { id: "accesorios",  label: "Accesorios"  },
];

export default function FlashDeals() {
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const products =
    filter === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.category === filter);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  }

  return (
    <section
      id="offers"
      className="pt-16 pb-20"
      style={{ background: "linear-gradient(140deg, #eeeef4 0%, #f5f5f7 50%, #ebebf2 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <h2
              className="font-black text-gray-900 tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Productos<br />destacados.
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-black/[0.07] flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.07)] hover:bg-white/95"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-black/[0.07] flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.07)] hover:bg-white/95"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#ff9900] transition-colors ml-1"
            >
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Filter pills ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-none px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                filter === f.id
                  ? "bg-gray-900/90 backdrop-blur-sm text-white border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                  : "bg-white/80 backdrop-blur-md text-gray-500 hover:text-gray-900 border border-black/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.05)] hover:bg-white/95"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Product carousel ───────────────────────────────────── */}
        {/*
          overflow-x: auto also clips overflow-y in CSS spec.
          paddingTop + negative marginTop extends the scroll container's
          boundary upward so hover-lifted cards don't get clipped.
        */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
          style={{ paddingTop: "16px", marginTop: "-16px" }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}

          {/* See-all card */}
          <Link
            href="/products"
            className="flex-none w-[200px] bg-white rounded-3xl flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-400 cursor-pointer group min-h-[420px] px-6"
          >
            <div className="w-12 h-12 rounded-full bg-[#ff9900]/10 group-hover:bg-[#ff9900] flex items-center justify-center transition-colors duration-300">
              <ArrowRight
                size={18}
                className="text-[#ff9900] group-hover:text-black transition-colors"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-bold text-sm group-hover:text-[#ff9900] transition-colors">
                Ver catálogo completo
              </p>
              <p className="text-gray-400 text-xs mt-1">+1.600 productos</p>
            </div>
          </Link>
        </div>

        {/* ── Trust strip ────────────────────────────────────────── */}
        <div className="mt-14 pt-10 border-t border-black/[0.06] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 text-[#ff9900]">
                {item.icon}
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-gray-900 leading-tight">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
