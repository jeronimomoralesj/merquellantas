"use client";

import { useState, useRef } from "react";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Check,
} from "lucide-react";
import { PRODUCTS, type Product } from "../lib/mockData";

const BADGE_STYLES: Record<string, string> = {
  "best-seller": "bg-[#ff9900] text-black",
  "flash-deal": "bg-red-500 text-white",
  new: "bg-emerald-500 text-white",
  hot: "bg-purple-500 text-white",
};

const CATEGORY_ICONS: Record<string, string> = {
  llantas: "○",
  lubricantes: "◈",
  baterias: "◰",
  rines: "◎",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? "text-[#ff9900]" : "text-zinc-700"}
          fill={i <= Math.round(rating) ? "#ff9900" : "transparent"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex-none w-72 sm:w-80 bg-[#111113] border border-white/8 rounded-2xl overflow-hidden group hover:border-[#ff9900]/30 transition-all duration-300 hover:scale-[1.02]">
      {/* Image container */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)` }}
      >
        {/* Simulated product visual */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-8 border-zinc-700 opacity-60"
            style={{ borderColor: product.imageColor }}
          />
          <div className="absolute inset-4 rounded-full border-4 border-zinc-600 opacity-40" />
          <div className="absolute inset-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-3xl opacity-60">{CATEGORY_ICONS[product.category]}</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-600" />
        </div>

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
              BADGE_STYLES[product.badge]
            }`}
          >
            {product.badge === "flash-deal" && <Zap size={10} className="inline mr-1" />}
            {product.badgeLabel}
          </div>
        )}

        {/* Discount */}
        {product.discountPct && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/80 text-[#ff9900] text-xs font-black border border-[#ff9900]/30">
            -{product.discountPct}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#ff9900]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand + category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#ff9900] text-xs font-bold uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="text-zinc-600 text-xs capitalize">{product.category}</span>
        </div>

        {/* Name */}
        <h3 className="text-white font-bold text-sm mb-2 leading-tight group-hover:text-[#ff9900] transition-colors">
          {product.name}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.map((spec) => (
            <span
              key={spec}
              className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-md"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={product.rating} />
          <span className="text-zinc-400 text-xs font-medium">{product.rating}</span>
          <span className="text-zinc-600 text-xs">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-white font-black text-lg">
              ${product.price.toLocaleString("es-CO")}
            </div>
            {product.originalPrice && (
              <div className="text-zinc-600 text-xs line-through">
                ${product.originalPrice.toLocaleString("es-CO")}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex-shrink-0 ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-[#ff9900] text-black hover:bg-[#e68a00] hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            {added ? (
              <>
                <Check size={15} /> Agregado
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { id: "all", label: "Todo" },
  { id: "llantas", label: "Llantas" },
  { id: "lubricantes", label: "Lubricantes" },
  { id: "baterias", label: "Baterías" },
  { id: "rines", label: "Rines" },
];

export default function FlashDeals() {
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  // Countdown mock
  const countdown = "02:47:13";

  return (
    <section id="offers" className="py-24 bg-[#0a0a0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
                <Zap size={14} className="text-red-400" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                  Flash Deals
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                <Clock size={14} className="text-[#ff9900]" />
                <span className="font-mono text-[#ff9900] font-bold">{countdown}</span>
                <span className="text-zinc-600 text-xs">restante</span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Mejores ventas
              <br />
              <span className="text-gradient-brand">y ofertas hoy.</span>
            </h2>
          </div>

          {/* Scroll controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-[#ff9900] hover:text-[#ff9900] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-[#ff9900] hover:text-[#ff9900] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-none px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === tab.id
                  ? "bg-[#ff9900] text-black"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* See all card */}
          <div className="flex-none w-64 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#ff9900]/30 transition-colors cursor-pointer group min-h-[360px]">
            <div className="w-12 h-12 rounded-full bg-[#ff9900]/10 border border-[#ff9900]/30 flex items-center justify-center group-hover:bg-[#ff9900]/20 transition-colors">
              <ChevronRight size={20} className="text-[#ff9900]" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">Ver todo el catálogo</p>
              <p className="text-zinc-500 text-xs mt-1">+1.600 productos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
