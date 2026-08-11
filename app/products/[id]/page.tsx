"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
  ShoppingCart, Star, Check, ArrowLeft, Shield, Truck, RefreshCw, Plus, Minus, ChevronRight,
} from "lucide-react";
import { getProductById, getRelatedProducts, CATEGORY_LABELS, type Product } from "../../lib/products";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size}
          className={i <= Math.round(rating) ? "text-[#ff9900]" : "text-gray-200"}
          fill={i <= Math.round(rating) ? "#ff9900" : "transparent"}
        />
      ))}
    </div>
  );
}

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-[#ff9900]",   text: "text-black",  label: "Mas vendido" },
  "flash-deal":  { bg: "bg-rose-500",    text: "text-white",  label: "Oferta limitada" },
  "new":         { bg: "bg-emerald-500", text: "text-white",  label: "Nuevo" },
  "hot":         { bg: "bg-violet-500",  text: "text-white",  label: "Popular" },
};

function RelatedCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#ff9900]/30 hover:shadow-[0_4px_20px_rgba(255,153,0,0.10)] transition-all"
    >
      <div
        className="h-36 flex flex-col items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
      >
        <span className="text-2xl font-black text-white/20 select-none">{product.brand}</span>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] mb-0.5">{product.brand}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#ff9900] transition-colors">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="font-black text-gray-900">${product.price.toLocaleString("es-CO")}</span>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="p-2 rounded-lg bg-[#ff9900]/10 text-[#ff9900] hover:bg-[#ff9900] hover:text-black transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const maybeProduct = getProductById(id);
  if (!maybeProduct) notFound();
  const product = maybeProduct!;

  const related = getRelatedProducts(product);
  const { addToCart } = useCart();

  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [activeTab, setTab]     = useState<"specs" | "desc">("specs");
  const [activeImg, setActiveImg] = useState(0);
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;
  const images = product.images ?? [];

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-[96px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#ff9900] transition-colors font-medium flex items-center gap-1.5">
              <ArrowLeft size={13} /> Inicio
            </Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[#ff9900] transition-colors font-medium">Productos</Link>
            <ChevronRight size={12} />
            <Link href={`/products?category=${product.category}`} className="hover:text-[#ff9900] transition-colors font-medium">
              {CATEGORY_LABELS[product.category]}
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-semibold truncate max-w-[180px]">{product.name}</span>
          </div>
        </div>

        {/* Product section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* LEFT: Image gallery */}
              <div className="flex flex-col min-h-[400px] lg:min-h-0">
                {images.length > 0 ? (
                  <>
                    {/* Main image */}
                    <div className="relative flex-1 bg-gray-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={activeImg}
                        src={images[activeImg]}
                        alt={product.name}
                        className="w-full h-full object-contain p-6"
                        style={{ animation: "fadeIn 0.2s ease" }}
                      />
                      {badge && (
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </div>
                      )}
                      {product.discountPct && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white text-rose-500 text-sm font-black border border-rose-100 shadow-sm">
                          -{product.discountPct}%
                        </div>
                      )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-3 border-t border-gray-100 bg-white">
                        {images.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                              activeImg === i
                                ? "border-[#ff9900] shadow-[0_0_0_2px_rgba(255,153,0,0.15)]"
                                : "border-gray-100 hover:border-gray-300"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full h-full object-contain bg-gray-50 p-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Gradient placeholder when no real images */
                  <div
                    className="flex-1 flex flex-col items-center justify-center relative p-10"
                    style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
                  >
                    <div className="text-center">
                      <span className="text-6xl sm:text-7xl font-black text-white/15 tracking-tighter leading-none select-none block">
                        {product.brand}
                      </span>
                      <p className="text-white/30 font-semibold mt-3">{product.specs[0]}</p>
                    </div>
                    {badge && (
                      <div className={`absolute top-5 left-5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </div>
                    )}
                    {product.discountPct && (
                      <div className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-white text-rose-500 text-sm font-black border border-rose-100 shadow-sm">
                        -{product.discountPct}%
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Info */}
              <div className="p-8 lg:p-10 flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] mb-2">
                  {product.brand} · {CATEGORY_LABELS[product.category]}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <Stars rating={product.rating} size={16} />
                  <span className="font-bold text-gray-700">{product.rating}</span>
                  <span className="text-gray-400 text-sm">({product.reviewCount.toLocaleString()} reseñas)</span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.shortDesc}</p>

                {/* Specs chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.specs.map((s) => (
                    <span key={s} className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-gray-900 leading-none">
                    ${product.price.toLocaleString("es-CO")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-300 line-through leading-none mb-0.5">
                      ${product.originalPrice.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                  <span className={`text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                    {product.inStock ? `En stock (${product.stockCount} disponibles)` : "Agotado"}
                  </span>
                </div>

                {/* Qty + CTA */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-black text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))}
                      className="w-8 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-base transition-all ${
                      added
                        ? "bg-emerald-500 text-white"
                        : product.inStock
                        ? "bg-[#ff9900] text-black hover:bg-[#e68a00] active:scale-[0.98] shadow-[0_4px_16px_rgba(255,153,0,0.35)]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {added ? <><Check size={18} /> Agregado al carrito</> : <><ShoppingCart size={18} /> Agregar al carrito</>}
                  </button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                  {[
                    { icon: Shield,     text: "Garantía certificada" },
                    { icon: Truck,      text: "Envío express 24h" },
                    { icon: RefreshCw,  text: "Cambio sin costo" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon size={18} className="text-[#ff9900]" />
                      <span className="text-[11px] text-gray-400 font-medium leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs: specs / description */}
            <div className="border-t border-gray-100">
              <div className="flex border-b border-gray-100">
                {(["specs", "desc"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-8 py-4 text-sm font-bold transition-all relative ${
                      activeTab === t ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t === "specs" ? "Especificaciones" : "Descripcion"}
                    {activeTab === t && <span className="absolute bottom-0 left-6 right-6 h-[3px] bg-[#ff9900] rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="p-8 lg:p-10">
                {activeTab === "specs" ? (
                  <div className="max-w-lg">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-50">
                        {product.specsTable.map((row) => (
                          <tr key={row.key}>
                            <td className="py-3 pr-6 text-gray-400 font-medium w-40">{row.key}</td>
                            <td className="py-3 text-gray-900 font-semibold">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <p className="text-gray-600 leading-relaxed">{product.shortDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff9900] mb-1">
                    Relacionados
                  </p>
                  <h2 className="text-2xl font-black text-gray-900">Tambien te puede interesar</h2>
                </div>
                <Link href={`/products?category=${product.category}`} className="text-sm font-semibold text-gray-400 hover:text-[#ff9900] transition-colors">
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
