"use client";

import { useState, useEffect, useRef } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts, CATEGORY_LABELS, type Product } from "../../lib/products";
import { BRANDS } from "../../lib/mockData";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";

const BRAND_LOGO: Record<string, string> = Object.fromEntries(
  BRANDS.map((b) => [b.name, b.url])
);

/* ── Badge config ─────────────────────────────────────────────────────── */
const BADGE: Record<string, { bg: string; color: string; label: string }> = {
  "best-seller": { bg: "#ff9900",  color: "#000", label: "Mas vendido"     },
  "flash-deal":  { bg: "#ef4444",  color: "#fff", label: "Oferta limitada" },
  "new":         { bg: "#10b981",  color: "#fff", label: "Nuevo"           },
  "hot":         { bg: "#000000",  color: "#fff", label: "Popular"         },
};

/* ── Stars ────────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#ff9900" : "none"}
          stroke={i <= Math.round(rating) ? "#ff9900" : "#d1d5db"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ── Countdown ────────────────────────────────────────────────────────── */
function useCountdown() {
  const [secs, setSecs] = useState(4 * 3600 + 37 * 60 + 22);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s] as const;
}

/* ── Related card ─────────────────────────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [cardAdded, setCardAdded] = useState(false);
  const badge = product.badge ? BADGE[product.badge] : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
    setCardAdded(true);
    setTimeout(() => setCardAdded(false), 2000);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col
        hover:border-[#ff9900]/40 hover:shadow-[0_8px_32px_rgba(255,153,0,0.12)]
        transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
          </div>
        )}
        {product.discountPct && (
          <div className="absolute top-2 right-2 z-10">
            <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-1 rounded-lg tabular-nums">
              -{product.discountPct}%
            </span>
          </div>
        )}
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center select-none">
            <span className="text-3xl font-black text-gray-100">{product.brand}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ff9900] mb-1">{product.brand}</p>
        <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 flex-1
          group-hover:text-[#ff9900] transition-colors duration-200">
          {product.name}
        </p>

        {/* Stars + review count */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 24 24"
              fill={i <= Math.round(product.rating) ? "#ff9900" : "none"}
              stroke={i <= Math.round(product.rating) ? "#ff9900" : "#d1d5db"} strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-[10px] text-gray-400 ml-0.5 tabular-nums">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="font-black text-gray-900 text-sm sm:text-base tabular-nums">
            ${product.price.toLocaleString("es-CO")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-300 line-through tabular-nums">
              ${product.originalPrice.toLocaleString("es-CO")}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className={`w-full py-2 rounded-xl text-xs font-black transition-all duration-200 active:scale-95
            ${cardAdded
              ? "bg-emerald-500 text-white"
              : "bg-[#ff9900]/10 text-[#ff9900] hover:bg-[#ff9900] hover:text-black"}`}
        >
          {cardAdded ? "Agregado" : "+ Agregar al carrito"}
        </button>
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

  const [added, setAdded]         = useState(false);
  const [floatAdded, setFloatAdded] = useState(false);
  const [activeTab, setTab]       = useState<"specs" | "desc">("specs");
  const [activeImg, setActiveImg] = useState(0);
  const [storeCity, setStoreCity] = useState("Bogotá");
  const [showFloat, setShowFloat] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setShowFloat(!entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [h, m, s] = useCountdown();

  useEffect(() => {
    document.title = `${product.name} — Merquellantas`;
    return () => { document.title = "Merquellantas — Llantas, Lubricantes, Baterías y Rines en Colombia"; };
  }, [product.name]);

  const badge         = product.badge ? BADGE[product.badge] : null;
  const images        = product.images ?? [];
  const savedAmount   = product.originalPrice ? product.originalPrice - product.price : 0;
  const isLowStock    = product.inStock && product.stockCount <= 5;
  const installment   = Math.round(product.price / 3);
  const soldCount     = Math.floor(product.reviewCount / 4) + 12;

  const STORES: Record<string, { name: string; address: string; stock: "disponible" | "pocas" | "agotado" }[]> = {
    "Bogotá":       [
      { name: "Autopista Norte",  address: "Autopista Norte Km 7, Local 102",     stock: product.stockCount > 15 ? "disponible" : product.stockCount > 5 ? "pocas" : "agotado" },
      { name: "Soacha",           address: "Cra 7 # 40-12, Soacha",               stock: product.stockCount > 10 ? "disponible" : "pocas" },
      { name: "Fontibón",         address: "Av. El Dorado # 96-14, Fontibón",     stock: product.stockCount > 20 ? "disponible" : product.stockCount > 8 ? "pocas" : "agotado" },
    ],
    "Medellín":     [
      { name: "El Poblado",       address: "Cra 43A # 14-109, El Poblado",        stock: product.stockCount > 12 ? "disponible" : "pocas" },
      { name: "Itagüí",           address: "Cra 52 # 38-45, Itagüí",              stock: product.stockCount > 18 ? "disponible" : product.stockCount > 6 ? "pocas" : "agotado" },
    ],
    "Cali":         [
      { name: "Ciudad Jardín",    address: "Av. Roosevelt # 38-14",               stock: product.stockCount > 14 ? "disponible" : "pocas" },
    ],
    "Barranquilla": [
      { name: "Murillo",          address: "Cra 46 # 70-34",                      stock: product.stockCount > 16 ? "disponible" : "pocas" },
    ],
    "Bucaramanga":  [
      { name: "Cabecera",         address: "Cra 35 # 54-18",                      stock: product.stockCount > 10 ? "disponible" : "agotado" },
    ],
    "Cartagena":    [
      { name: "Manga",            address: "Av. El Lago # 12-45, Manga",          stock: product.stockCount > 20 ? "disponible" : "pocas" },
    ],
  };
  const CITIES = Object.keys(STORES);
  const cityStores = STORES[storeCity] ?? [];

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-amber-100">
      <Navbar />

      <main className="pt-[96px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 ">
          {/* ── Two-column product layout ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

            {/* ── LEFT — image panel ──────────────────────────────── */}
            <div>
              {/* Main image card — square aspect ratio, image fills fully */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-square">
                {/* Badge — overlaid on image, top LEFT */}
                {badge && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="text-[15px] font-black uppercase tracking-wider px-3 py-2 rounded-full shadow"
                      style={{ backgroundColor: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </div>
                )}

                {/* Discount pill — overlaid on image, top RIGHT */}
                {product.discountPct && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <span className="bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg tabular-nums">
                      -{product.discountPct}%
                    </span>
                  </div>
                )}

                {/* Product image — fills the card */}
                {images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 sm:p-10 drop-shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                    style={{ animation: "fadeIn 0.2s ease" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center select-none">
                    <p className="font-black text-gray-100 leading-none tracking-tighter text-5xl sm:text-7xl">
                      {product.brand}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnail strip — below the card */}
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 mt-3">
                  {images.map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-[30%] aspect-square rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white transition-all
                        ${activeImg === i
                          ? "border-[#ff9900] shadow-[0_0_0_2px_rgba(255,153,0,0.2)]"
                          : "border-gray-100 hover:border-gray-300"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT — info panel ──────────────────────────────── */}
            <div className="flex flex-col gap-0">

              {/* Countdown — only for discounted products */}
              {product.discountPct && <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-[#ff9900] font-black text-xl sm:text-2xl tabular-nums tracking-wide">
                  {String(h).padStart(3, "0")} : {String(m).padStart(2, "0")} : {String(s).padStart(2, "0")}
                </span>
              </div>}

              {/* Brand logo */}
              <div className="mb-3">
                {BRAND_LOGO[product.brand] ? (
                  <div className="inline-flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] px-5 py-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={BRAND_LOGO[product.brand]}
                      alt={product.brand}
                      className="h-8 w-auto object-contain mix-blend-multiply"
                    />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] px-5 py-2.5">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{product.brand}</span>
                  </div>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={product.rating} />
                <span className="text-sm text-gray-700 font-semibold">{product.rating} Rating</span>
                <span className="text-sm text-gray-400">({product.reviewCount.toLocaleString()} resenas)</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-[48px] sm:text-[58px] font-black text-gray-900 leading-none tabular-nums">
                    ${product.price.toLocaleString("es-CO")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-300 line-through leading-none mb-2 tabular-nums">
                      ${product.originalPrice.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>
                {savedAmount > 0 && (
                  <p className="text-sm font-bold text-emerald-600 mt-1.5">
                    Ahorras ${savedAmount.toLocaleString("es-CO")}
                  </p>
                )}
              </div>


              {/* Addi payment + card logos */}
              <div className="mb-6 p-3 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://colombiafintech.co/wp-content/uploads/2025/11/Addi-logo-01-1024x717.jpg"
                    alt="Addi"
                    className="h-7 w-auto object-contain rounded flex-shrink-0"
                  />
                  <p className="text-sm text-gray-500 leading-snug">
                    3 cuotas sin interes de{" "}
                    <span className="font-bold text-gray-900">${installment.toLocaleString("es-CO")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://mythslegendscollection.com/wp-content/uploads/2020/04/visa-mastercard-american-express-png-6.png"
                    alt="Visa Mastercard Amex"
                    className="h-5 w-auto object-contain"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://datafonos.bold.co/wp-content/uploads/2022/12/Logo-Bold-Principal.png"
                    alt="Bold"
                    className="h-5 w-auto object-contain"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold">Pago 100% seguro</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div ref={ctaRef} className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl border-2 font-bold text-sm sm:text-base transition-all duration-200
                    ${added
                      ? "border-emerald-500 text-emerald-500 bg-emerald-50"
                      : product.inStock
                      ? "border-gray-200 text-gray-700 hover:border-gray-400 bg-white active:scale-95"
                      : "border-gray-100 text-gray-300 cursor-not-allowed bg-white"}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {added ? "Agregado" : "Agregar al carrito"}
                </button>

                <a
                  href={`https://wa.me/573144506620?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-12 sm:h-14 rounded-xl font-bold text-sm sm:text-base
                    bg-[#ff9900] text-white hover:bg-[#e68a00] active:scale-95 transition-all duration-200
                    shadow-[0_4px_20px_rgba(255,153,0,0.35)]"
                >
                  Comprar ahora
                </a>
              </div>

              {/* Wishlist + WhatsApp links */}
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9900] transition-colors font-semibold uppercase tracking-wide underline underline-offset-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Agregar a favoritos
                </button>
                <a
                  href={`https://wa.me/573144506620?text=Consulta%20sobre%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#25d366] transition-colors font-semibold uppercase tracking-wide underline underline-offset-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Category circles + sold count */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {product.specs.slice(0, 3).map((spec, i) => {
                    const colors = [
                      { bg: "#f3e8ff", border: "#d8b4fe", text: "#7c3aed" },
                      { bg: "#fff7ed", border: "#fdba74", text: "#ea580c" },
                      { bg: "#eff6ff", border: "#93c5fd", text: "#2563eb" },
                    ];
                    const c = colors[i % colors.length];
                    return (
                      <div key={spec}
                        className="w-9 h-9 rounded-full flex items-center justify-center border text-[9px] font-black"
                        style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
                        title={spec}
                      >
                        {spec.slice(0, 2).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  <span className="text-sm font-bold text-gray-700">
                    {soldCount} vendidos en las ultimas 24h
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="text-sm text-gray-500 mb-3 space-y-1">
                <p>
                  <span className="font-bold text-gray-700">Categorias:</span>{" "}
                  {[product.brand, CATEGORY_LABELS[product.category], ...product.tags.slice(0, 2)].map((tag, i, arr) => (
                    <span key={tag}>
                      <Link href={`/products?category=${product.category}`}
                        className="hover:text-[#ff9900] transition-colors underline underline-offset-2">
                        {tag}
                      </Link>
                      {i < arr.length - 1 && <span className="text-gray-300">, </span>}
                    </span>
                  ))}
                </p>
              </div>

              {/* Short description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.shortDesc}</p>

              {/* Buscar en tiendas */}
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden mb-4">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-sm font-bold text-gray-800">Buscar en tiendas</span>
                </div>

                {/* City tabs */}
                <div className="flex gap-1 px-3 pt-3 pb-2 overflow-x-auto no-scrollbar">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setStoreCity(city)}
                      className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-150
                        ${storeCity === city
                          ? "bg-[#ff9900] text-black"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Store rows */}
                <div className="divide-y divide-gray-50 px-1 pb-1">
                  {cityStores.map((store) => {
                    const stockMap = {
                      disponible: { dot: "bg-emerald-500", label: "Disponible",     text: "text-emerald-700",  bg: "bg-emerald-50" },
                      pocas:      { dot: "bg-amber-400",   label: "Pocas unidades", text: "text-amber-700",    bg: "bg-amber-50" },
                      agotado:    { dot: "bg-red-400",     label: "Sin stock",      text: "text-red-600",      bg: "bg-red-50" },
                    };
                    const s = stockMap[store.stock];
                    return (
                      <div key={store.name} className="flex items-center justify-between gap-3 px-3 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">Merquellantas {store.name}</p>
                          <p className="text-xs text-gray-400 truncate">{store.address}</p>
                        </div>
                        <span className={`flex-shrink-0 flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ── Tabs (specs + desc) ───────────────────────────────── */}
          <div className="mt-8 bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(["specs", "desc"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-8 py-4 text-sm font-bold transition-colors relative
                    ${activeTab === t ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {t === "specs" ? "Especificaciones" : "Descripcion"}
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
                          <td className="py-3 px-4 text-gray-400 font-semibold w-44 rounded-l-lg">{row.key}</td>
                          <td className="py-3 px-4 text-gray-900 font-bold rounded-r-lg">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed text-base max-w-2xl">{product.shortDesc}</p>
              )}
            </div>
          </div>

          {/* ── Related products ──────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-10 pb-8">
              {/* Section header */}
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9900] mb-1.5">
                    Tambien te puede interesar
                  </p>
                  <h2 className="text-2xl font-black text-gray-900">Productos relacionados</h2>
                </div>
                <Link
                  href={`/products?category=${product.category}`}
                  className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#ff9900] transition-colors"
                >
                  Ver todos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Mobile: horizontal scroll */}
              <div className="sm:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                {related.map((p) => (
                  <div key={p.id} className="w-52 flex-shrink-0">
                    <RelatedCard product={p} />
                  </div>
                ))}
              </div>

              {/* Tablet+: grid */}
              <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map((p) => <RelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Floating buy bar ─────────────────────────────────────── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300
        ${showFloat ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_32px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            {/* Product mini info */}
            <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
              {images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0]} alt={product.name}
                  className="w-10 h-10 object-contain flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{product.name}</p>
                <p className="text-sm font-black text-gray-900">${product.price.toLocaleString("es-CO")}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => { addToCart(product); setFloatAdded(true); setTimeout(() => setFloatAdded(false), 2500); }}
                disabled={!product.inStock}
                className={`flex-1 sm:w-44 flex items-center justify-center gap-2 h-11 rounded-xl border-2 font-bold text-sm transition-all duration-200
                  ${floatAdded
                    ? "border-emerald-500 text-emerald-500 bg-emerald-50"
                    : product.inStock
                    ? "border-gray-200 text-gray-700 hover:border-gray-400 bg-white active:scale-95"
                    : "border-gray-100 text-gray-300 cursor-not-allowed"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {floatAdded ? "Agregado" : "Agregar al carrito"}
              </button>

              <a
                href={`https://wa.me/573144506620?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:w-44 flex items-center justify-center h-11 rounded-xl font-bold text-sm
                  bg-[#ff9900] text-white hover:bg-[#e68a00] active:scale-95 transition-all duration-200
                  shadow-[0_4px_16px_rgba(255,153,0,0.35)]"
              >
                Comprar ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
