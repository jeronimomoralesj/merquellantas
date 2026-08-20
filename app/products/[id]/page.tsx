"use client";

import { useState } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts, CATEGORY_LABELS, type Product } from "../../lib/products";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";

/* ── Badge config ─────────────────────────────────────────────────────── */
const BADGE: Record<string, { bg: string; color: string; label: string }> = {
  "best-seller": { bg: "#ff9900",  color: "#000", label: "Más vendido"      },
  "flash-deal":  { bg: "#ef4444",  color: "#fff", label: "Oferta limitada"  },
  "new":         { bg: "#10b981",  color: "#fff", label: "Nuevo"            },
  "hot":         { bg: "#8b5cf6",  color: "#fff", label: "Popular"          },
};

/* ── Stars (inline SVG, no lucide) ───────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#ff9900" : "none"}
          stroke={i <= Math.round(rating) ? "#ff9900" : "#d1d5db"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ── Related card ─────────────────────────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100
        hover:border-[#ff9900]/30 hover:shadow-[0_4px_24px_rgba(255,153,0,0.1)]
        transition-all duration-300"
    >
      <div
        className="h-32 sm:h-36 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
      >
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-contain p-3" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-black text-white/10 select-none tracking-tighter">
              {product.brand}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ff9900] mb-1">{product.brand}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2
          group-hover:text-[#ff9900] transition-colors duration-200">
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-black text-gray-900">${product.price.toLocaleString("es-CO")}</span>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="text-[11px] font-black px-3 py-1.5 rounded-lg bg-[#ff9900]/10 text-[#ff9900]
              hover:bg-[#ff9900] hover:text-black transition-all duration-200"
          >
            + Carrito
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const maybeProduct = getProductById(id);
  if (!maybeProduct) notFound();
  const product = maybeProduct!;

  const related = getRelatedProducts(product);
  const { addToCart } = useCart();

  const [qty, setQty]             = useState(1);
  const [added, setAdded]         = useState(false);
  const [activeTab, setTab]       = useState<"specs" | "desc">("specs");
  const [activeImg, setActiveImg] = useState(0);

  const badge       = product.badge ? BADGE[product.badge] : null;
  const images      = product.images ?? [];
  const savedAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const isLowStock  = product.inStock && product.stockCount <= 5;

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <main className="pt-[96px]">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <div className="bg-white/85 backdrop-blur-sm border-b border-gray-100 sticky top-[96px] z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#ff9900] transition-colors font-semibold">Inicio</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#ff9900] transition-colors font-semibold">Productos</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`}
              className="hover:text-[#ff9900] transition-colors font-semibold">
              {CATEGORY_LABELS[product.category]}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold truncate max-w-[180px]">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

          {/* ── Main product card ────────────────────────────────── */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_32px_rgba(0,0,0,0.07)]">
            <div className="grid grid-cols-1 lg:grid-cols-[52%_48%]">

              {/* LEFT — dark image panel */}
              <div
                className="relative flex flex-col"
                style={{
                  background: `linear-gradient(145deg, ${product.bgFrom} 0%, ${product.bgTo} 100%)`,
                  minHeight: "clamp(320px, 48vw, 580px)",
                }}
              >
                {/* Subtle center glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,153,0,0.07) 0%, transparent 65%)" }} />

                {/* Discount pill — top left */}
                {product.discountPct && (
                  <div className="absolute top-5 left-5 z-10">
                    <span className="bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg tabular-nums">
                      -{product.discountPct}%
                    </span>
                  </div>
                )}

                {/* Badge — top right */}
                {badge && (
                  <div className="absolute top-5 right-5 z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md"
                      style={{ backgroundColor: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </div>
                )}

                {/* Product image */}
                <div className="flex-1 flex items-center justify-center p-8 sm:p-14">
                  {images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={activeImg}
                      src={images[activeImg]}
                      alt={product.name}
                      className="max-h-[260px] sm:max-h-[340px] w-auto max-w-full object-contain
                        drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                      style={{ animation: "fadeIn 0.2s ease" }}
                    />
                  ) : (
                    <div className="text-center select-none">
                      <p className="font-black text-white/[0.07] leading-none tracking-tighter"
                        style={{ fontSize: "clamp(48px, 8vw, 90px)" }}>
                        {product.brand}
                      </p>
                      <p className="font-black text-white/20 mt-3 text-2xl sm:text-3xl tracking-tight">
                        {product.specs[0]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Merquito "recomienda" glass card */}
                {product.rating >= 4.5 && (
                  <div className="absolute bottom-[70px] left-5" style={{ zIndex: 10 }}>
                    <div className="flex items-center gap-3 rounded-2xl pl-2 pr-4 py-2.5"
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/merquito.png" alt="Merquito"
                        className="w-10 h-10 object-contain flex-shrink-0"
                        style={{ mixBlendMode: "screen" }} />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ff9900] leading-none mb-1">
                          Merquito recomienda
                        </p>
                        <p className="text-white text-xs font-bold">
                          {product.rating} &middot; {product.reviewCount.toLocaleString()} reseñas
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 border-t border-white/[0.07] bg-black/15">
                    {images.map((src, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all
                          ${activeImg === i
                            ? "border-[#ff9900] shadow-[0_0_0_2px_rgba(255,153,0,0.2)]"
                            : "border-white/20 hover:border-white/40"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-full h-full object-contain bg-white/5 p-1" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom spacer when no thumbnails so merquito card doesn't clip */}
                {images.length <= 1 && <div className="h-16" />}
              </div>

              {/* RIGHT — info panel */}
              <div className="flex flex-col p-7 sm:p-9 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-100">

                {/* Brand + category */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9900]">
                    {product.brand}
                  </span>
                  <span className="text-gray-200">&middot;</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-5">
                  <Stars rating={product.rating} />
                  <span className="font-black text-gray-800 text-sm">{product.rating}</span>
                  <span className="text-gray-400 text-sm">
                    ({product.reviewCount.toLocaleString()} reseñas)
                  </span>
                </div>

                {/* Short desc */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.shortDesc}</p>

                {/* Spec chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.specs.map((s) => (
                    <span key={s}
                      className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mb-6" />

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-[42px] sm:text-[52px] font-black text-gray-900 leading-none tabular-nums">
                      ${product.price.toLocaleString("es-CO")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-300 line-through leading-none mb-1 tabular-nums">
                        ${product.originalPrice.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                  {savedAmount > 0 && (
                    <p className="text-sm font-bold text-emerald-600 mt-2">
                      Ahorras ${savedAmount.toLocaleString("es-CO")} con esta oferta
                    </p>
                  )}
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0
                    ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                  <span className={`text-sm font-bold
                    ${product.inStock ? "text-gray-700" : "text-red-500"}`}>
                    {product.inStock
                      ? isLowStock
                        ? `¡Solo ${product.stockCount} disponibles!`
                        : `En stock · ${product.stockCount} disponibles`
                      : "Agotado"}
                  </span>
                  {isLowStock && (
                    <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                      Quedan pocos
                    </span>
                  )}
                </div>

                <div className="h-px bg-gray-100 mb-6" />

                {/* Qty + CTA */}
                <div className="flex items-stretch gap-3 mb-3">
                  {/* Qty counter */}
                  <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-12 text-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))}
                      className="w-11 h-12 text-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className={`flex-1 h-12 rounded-xl font-black text-[15px] transition-all duration-200
                      ${added
                        ? "bg-emerald-500 text-white"
                        : product.inStock
                        ? "bg-[#ff9900] text-black hover:bg-[#e68a00] active:scale-[0.97] shadow-[0_4px_24px_rgba(255,153,0,0.38)]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
                  >
                    {added ? "Agregado al carrito" : "Agregar al carrito"}
                  </button>
                </div>

                {/* WhatsApp secondary CTA */}
                <a
                  href={`https://wa.me/573144506620?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 h-12 rounded-xl border-2 border-gray-100
                    text-gray-500 font-bold text-sm hover:border-[#25d366] hover:text-[#25d366] hover:bg-[#25d366]/5
                    transition-all duration-200 mb-7"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-2 pt-5 border-t border-gray-100">
                  {[
                    { value: "24h",     label: "Envío express" },
                    { value: "30 días", label: "Garantía"      },
                    { value: "100%",    label: "Original"      },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center text-center py-2 gap-1">
                      <span className="text-base font-black text-gray-900">{value}</span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* ── Merquito guarantee strip ─────────────────────────── */}
          <div
            className="mt-5 rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(130deg, #150700 0%, #2a1100 55%, #0d0400 100%)" }}
          >
            <div className="flex items-end gap-4 sm:gap-10 px-7 sm:px-12 pt-6">
              {/* Merquito mascot */}
              <div className="flex-shrink-0 self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/merquito.png"
                  alt="Merquito"
                  className="h-24 sm:h-36 lg:h-44 w-auto object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>

              {/* Guarantee text */}
              <div className="pb-8 sm:pb-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ff9900] mb-3">
                  Merquito garantiza
                </p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-3">
                  Si no es lo que necesitas,<br />
                  <span className="text-[#ff9900]">lo resolvemos sin preguntas.</span>
                </h2>
                <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-lg">
                  30 días de garantía de devolución. Asesoría técnica gratuita en todos nuestros puntos.
                  Merquito siempre tiene la solución.
                </p>
              </div>
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────────── */}
          <div className="mt-5 bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(["specs", "desc"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-8 py-4 text-sm font-bold transition-colors relative
                    ${activeTab === t ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {t === "specs" ? "Especificaciones" : "Descripción"}
                  {activeTab === t && (
                    <span className="absolute bottom-0 left-6 right-6 h-[3px] bg-[#ff9900] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-7 sm:p-10">
              {activeTab === "specs" ? (
                <div className="max-w-lg">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specsTable.map((row, i) => (
                        <tr key={row.key} className={i % 2 === 0 ? "bg-gray-50/70" : ""}>
                          <td className="py-3 px-4 text-gray-400 font-semibold w-44 rounded-l-lg">
                            {row.key}
                          </td>
                          <td className="py-3 px-4 text-gray-900 font-bold rounded-r-lg">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed text-base max-w-2xl">
                  {product.shortDesc}
                </p>
              )}
            </div>
          </div>

          {/* ── Related products ──────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-10 pb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9900] mb-1.5">
                    También te puede interesar
                  </p>
                  <h2 className="text-2xl font-black text-gray-900">Productos relacionados</h2>
                </div>
                <Link
                  href={`/products?category=${product.category}`}
                  className="text-sm font-bold text-gray-400 hover:text-[#ff9900] transition-colors"
                >
                  Ver todos
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map((p) => <RelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
