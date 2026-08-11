"use client";

import { useState, useRef } from "react";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ALL_PRODUCTS, type Product } from "../lib/products";
import { useCart } from "../context/CartContext";

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-[#ff9900]",   text: "text-black",  label: "Mas vendido" },
  "flash-deal":  { bg: "bg-rose-500",    text: "text-white",  label: "Oferta limitada" },
  "new":         { bg: "bg-emerald-500", text: "text-white",  label: "Nuevo" },
  "hot":         { bg: "bg-violet-500",  text: "text-white",  label: "Popular" },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11}
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
    <div className="flex-none w-[272px] sm:w-72 bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:border-[#ff9900]/30 hover:shadow-[0_4px_24px_rgba(255,153,0,0.10)] transition-all duration-300">

      {/* Image area */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-44 overflow-hidden cursor-pointer"
          style={!product.images?.[0] ? { background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` } : {}}>
          {product.images?.[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain bg-gray-50 p-3" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-1.5">
              <span className="text-3xl font-black text-white/20 tracking-tight select-none leading-none">{product.brand}</span>
              <span className="text-xs text-white/30 font-semibold">{product.specs[0]}</span>
            </div>
          )}
          {badge && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${badge.bg} ${badge.text}`}>
              {badge.label}
            </div>
          )}
          {product.discountPct && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white text-rose-500 text-xs font-black border border-rose-100">
              -{product.discountPct}%
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      </Link>

      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] mb-1">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 group-hover:text-[#ff9900] transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Stars rating={product.rating} />
          <span className="text-gray-500 text-xs">{product.rating}</span>
          <span className="text-gray-300 text-xs">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-gray-900 font-black text-lg leading-none">
              ${product.price.toLocaleString("es-CO")}
            </div>
            {product.originalPrice && (
              <div className="text-gray-300 text-xs line-through mt-0.5">
                ${product.originalPrice.toLocaleString("es-CO")}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              added
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-[#ff9900] text-black hover:bg-[#e68a00] active:scale-[0.97] shadow-[0_2px_8px_rgba(255,153,0,0.3)]"
            }`}
          >
            {added ? <><Check size={13} /> Agregado</> : <><ShoppingCart size={13} /> Agregar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: "all",         label: "Todo" },
  { id: "llantas",     label: "Llantas" },
  { id: "lubricantes", label: "Lubricantes" },
  { id: "baterias",    label: "Baterias" },
  { id: "rines",       label: "Rines" },
  { id: "accesorios",  label: "Accesorios" },
];

export default function FlashDeals() {
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = filter === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.category === filter);
  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <section id="offers" className="bg-white pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Productos destacados
              <br />
              y ofertas activas.
            </h2>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={() => scroll("left")}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#ff9900] hover:text-[#ff9900] transition-all">
              <ChevronLeft size={17} />
            </button>
            <button onClick={() => scroll("right")}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#ff9900] hover:text-[#ff9900] transition-all">
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-7 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                filter === f.id
                  ? "bg-[#ff9900] text-black border-[#ff9900]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#ff9900]/40 hover:text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          <Link
            href="/products"
            className="flex-none w-52 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#ff9900]/40 transition-colors cursor-pointer group min-h-[380px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#ff9900]/10 flex items-center justify-center group-hover:bg-[#ff9900]/20 transition-colors">
              <ArrowRight size={18} className="text-[#ff9900]" />
            </div>
            <div className="text-center px-4">
              <p className="text-gray-700 font-bold text-sm">Ver catalogo</p>
              <p className="text-gray-400 text-xs mt-0.5">+1.600 productos</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
