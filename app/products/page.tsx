"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Star, Check, SlidersHorizontal, X,
  ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, ArrowUpDown,
} from "lucide-react";
import {
  ALL_PRODUCTS, CATEGORY_LABELS,
  type Product, type ProductCategory,
} from "../lib/products";
import { TIRE_WIDTHS, TIRE_PROFILES, RIM_SIZES, BRANDS } from "../lib/mockData";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

// ── Constants ───────────────────────────────────────────────────────────────

const PER_PAGE   = 10;
const ALL_BRANDS = [...new Set(ALL_PRODUCTS.map((p) => p.brand))].sort();

const SORT_OPTIONS = [
  { id: "relevance",   label: "Relevancia" },
  { id: "price-asc",  label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "rating",     label: "Mejor valorados" },
];

const BRAND_CATEGORY_MAP: Record<string, string[]> = {
  llantas:     ["Continental", "Hankook", "Aplus", "CargoPower", "Tab", "Nexen"],
  lubricantes: ["Rubia", "Total", "Mobil"],
  baterias:    ["Willard"],
  rines:       ["Alcoa"],
};

const ALKOSTO_IDS = new Set([
  "continental-sportcontact7-22545r17",
  "continental-crosscontact-23560r18",
  "hankook-ventus-s1evo3-22545r17",
  "mobil1-5w30-4l",
  "willard-600-60ah",
  "willard-800-72ah",
]);

const ALKOSTO_LOGO = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Alkosto_HiperAhorro.png";

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-amber-400",  text: "text-black",  label: "Mas vendido" },
  "flash-deal":  { bg: "bg-rose-500",   text: "text-white",  label: "Oferta" },
  "new":         { bg: "bg-teal-500",   text: "text-white",  label: "Nuevo" },
  "hot":         { bg: "bg-violet-500", text: "text-white",  label: "Popular" },
};

// ── TireRing — lightweight watermark ────────────────────────────────────────

function TireRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      {/* Outer bead */}
      <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="1.5" />
      {/* Tread blocks */}
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="12"
        strokeDasharray="15 7" strokeLinecap="butt" />
      {/* Tread inner edge */}
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
      {/* Sidewall */}
      <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
      {/* Rim edge */}
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" />
      {/* Rim spokes (5) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * 2 * Math.PI;
        return (
          <line key={i}
            x1={100 + 20 * Math.sin(a)} y1={100 - 20 * Math.cos(a)}
            x2={100 + 58 * Math.sin(a)} y2={100 - 58 * Math.cos(a)}
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        );
      })}
      {/* Hub */}
      <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}

// ── TireTrack — decorative tread strip for grid background ──────────────────

function TireTrackStrip({ vertical = true }: { vertical?: boolean }) {
  const blocks = Array.from({ length: 40 });
  return (
    <svg
      viewBox={vertical ? "0 0 18 320" : "0 0 320 18"}
      fill="none"
      preserveAspectRatio="none"
      className={vertical ? "w-[18px] h-full" : "h-[18px] w-full"}
    >
      {/* Two rail lines */}
      {vertical ? (
        <>
          <line x1="2" y1="0" x2="2" y2="320" stroke="currentColor" strokeWidth="1" />
          <line x1="16" y1="0" x2="16" y2="320" stroke="currentColor" strokeWidth="1" />
          {blocks.map((_, i) => (
            <rect key={i} x="2" y={i * 8 + 1} width="14" height="5" rx="1" fill="currentColor" />
          ))}
        </>
      ) : (
        <>
          <line x1="0" y1="2" x2="320" y2="2" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="16" x2="320" y2="16" stroke="currentColor" strokeWidth="1" />
          {blocks.map((_, i) => (
            <rect key={i} x={i * 8 + 1} y="2" width="5" height="14" rx="1" fill="currentColor" />
          ))}
        </>
      )}
    </svg>
  );
}

// ── Stars ───────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11}
          className={i <= Math.round(rating) ? "text-[#ff9900]" : "text-gray-200"}
          fill={i <= Math.round(rating) ? "#ff9900" : "transparent"} />
      ))}
    </span>
  );
}

// ── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const badge        = product.badge ? BADGE_STYLES[product.badge] : null;
  const installment  = Math.round(product.price / 4);
  const hasAlkosto   = ALKOSTO_IDS.has(product.id);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    addToCart(product); setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <article className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl
        overflow-hidden
        shadow-[0_1px_4px_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.04)]
        hover:shadow-[0_4px_28px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
        transition-all duration-300">
        <div className="flex flex-col sm:flex-row">

          {/* Image */}
          <div className="sm:w-64 lg:w-76 flex-shrink-0 flex items-center justify-center
            relative overflow-hidden h-56 sm:h-auto min-h-[220px]"
            style={!product.images?.[0]
              ? { background: `linear-gradient(145deg, ${product.bgFrom} 0%, ${product.bgTo} 100%)` }
              : { background: "#f5f5f7" }}>
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name}
                className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-6
                transition-transform duration-500 group-hover:scale-[1.04]">
                <span className="text-4xl font-bold text-white/12 tracking-tighter select-none">{product.brand}</span>
                <span className="text-xs text-white/20 font-medium">{product.specs[0]}</span>
              </div>
            )}
            {badge && (
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full
                text-[10px] font-bold uppercase tracking-wide ${badge.bg} ${badge.text}`}>
                {badge.label}
              </div>
            )}
            {product.discountPct && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg
                bg-rose-50 text-rose-500 text-xs font-bold border border-rose-100">
                -{product.discountPct}%
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px bg-gray-50 flex-shrink-0 self-stretch" />

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff9900]">{product.brand}</span>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-[10px] text-gray-400 font-medium">{CATEGORY_LABELS[product.category]}</span>
            </div>
            <h2 className="text-[#1d1d1f] font-semibold text-xl leading-snug mb-2.5
              group-hover:text-[#ff9900] transition-colors duration-200 line-clamp-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <Stars rating={product.rating} />
              <span className="text-sm font-semibold text-[#1d1d1f]">{product.rating}</span>
              <span className="text-sm text-[#6e6e73]">({product.reviewCount.toLocaleString()} reseñas)</span>
            </div>

            {/* Partner badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* MerqueClub — every product */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                bg-[#ff9900]/[0.08] border border-[#ff9900]/20 text-[10px] font-semibold text-[#c47800]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4.5" fill="#ff9900" />
                  <path d="M3 5.5l1.3 1.3L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Beneficios MerqueClub
              </span>
              {/* Alkosto — selected products */}
              {hasAlkosto && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                  bg-[#e8000b]/[0.06] border border-[#e8000b]/15 text-[10px] font-semibold text-[#b50009]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ALKOSTO_LOGO} alt="Alkosto" className="h-3.5 object-contain" />
                  Recibe con Alkosto
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 mt-4 pt-4 border-t border-gray-50">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-semibold text-[#1d1d1f] leading-none">
                    ${product.price.toLocaleString("es-CO")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-300 line-through font-normal">
                      ${product.originalPrice.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6e6e73] mt-1">
                  o 4 cuotas de ${installment.toLocaleString("es-CO")} sin interés
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.inStock ? "bg-teal-500" : "bg-red-400"}`} />
                  <span className={`text-[11px] font-medium ${product.inStock ? "text-teal-600" : "text-red-500"}`}>
                    {product.inStock ? `En stock · ${product.stockCount} disponibles` : "Agotado"}
                  </span>
                </div>
              </div>
              <button onClick={handleAdd} disabled={!product.inStock}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                  transition-all flex-shrink-0 ${
                    added
                      ? "bg-teal-50 text-teal-600 border border-teal-200"
                      : product.inStock
                      ? "bg-[#ff9900] text-black hover:bg-[#e68a00] active:scale-[0.97] shadow-[0_2px_12px_rgba(255,153,0,0.3)]"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}>
                {added ? <><Check size={15} /> Agregado</> : <><ShoppingCart size={15} /> Agregar al carrito</>}
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="pb-4 mb-4 border-b border-gray-100/80 last:border-0 last:pb-0 last:mb-0">
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3 group/sec">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400
          group-hover/sec:text-gray-600 transition-colors">
          {title}
        </span>
        <ChevronDown size={13}
          className={`text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

// ── DimChips ─────────────────────────────────────────────────────────────────

function DimChips({
  values, selected, onToggle,
}: {
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((v) => (
        <button key={v} onClick={() => onToggle(v)}
          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all ${
            selected.includes(v)
              ? "bg-[#ff9900] text-black shadow-[0_1px_4px_rgba(255,153,0,0.4)]"
              : "bg-gray-100 text-[#6e6e73] hover:bg-gray-200"
          }`}>
          {v}
        </button>
      ))}
    </div>
  );
}

// ── FilterControls ───────────────────────────────────────────────────────────

function FilterControls({
  category, setCategory,
  brands, setBrands,
  maxPrice, setMaxPrice,
  inStockOnly, setInStockOnly,
  selWidths, setSelWidths,
  selProfiles, setSelProfiles,
  selRims, setSelRims,
}: {
  category: string; setCategory: (c: string) => void;
  brands: string[]; setBrands: (b: string[]) => void;
  maxPrice: number; setMaxPrice: (p: number) => void;
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
  selWidths: string[]; setSelWidths: (v: string[]) => void;
  selProfiles: string[]; setSelProfiles: (v: string[]) => void;
  selRims: string[]; setSelRims: (v: string[]) => void;
}) {
  const toggleArr = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const toggleBrand = (b: string) =>
    setBrands(brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]);

  const showDims = category === "all" || category === "llantas";

  return (
    <div>
      {/* Category */}
      <FilterSection title="Categoría">
        <div className="space-y-0.5">
          {["all", ...Object.keys(CATEGORY_LABELS)].map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                category === c
                  ? "bg-[#ff9900]/10 text-[#ff9900] font-semibold"
                  : "text-[#6e6e73] hover:bg-gray-50 font-medium"
              }`}>
              {c === "all" ? "Todos" : CATEGORY_LABELS[c as ProductCategory]}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tire dimensions — only for llantas or all */}
      {showDims && (
        <FilterSection title="Medidas de llanta">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-gray-400 font-medium mb-1.5">Ancho</p>
              <DimChips values={TIRE_WIDTHS} selected={selWidths}
                onToggle={(v) => toggleArr(selWidths, setSelWidths, v)} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium mb-1.5">Perfil</p>
              <DimChips values={TIRE_PROFILES} selected={selProfiles}
                onToggle={(v) => toggleArr(selProfiles, setSelProfiles, v)} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium mb-1.5">Rin</p>
              <DimChips values={RIM_SIZES} selected={selRims}
                onToggle={(v) => toggleArr(selRims, setSelRims, v)} />
            </div>
          </div>
        </FilterSection>
      )}

      {/* Brands */}
      <FilterSection title="Marca">
        <div className="space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
          {ALL_BRANDS.map((b) => (
            <div key={b} onClick={() => toggleBrand(b)}
              className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer
                rounded-lg hover:bg-gray-50 transition-colors group/brand">
              <div className={`w-4 h-4 rounded border flex items-center justify-center
                flex-shrink-0 transition-all ${
                  brands.includes(b)
                    ? "bg-[#ff9900] border-[#ff9900]"
                    : "border-gray-200 group-hover/brand:border-[#ff9900]/40"
                }`}>
                {brands.includes(b) && <Check size={10} className="text-black" />}
              </div>
              <span className="text-sm text-[#6e6e73] group-hover/brand:text-[#1d1d1f]
                transition-colors font-medium">{b}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Precio máximo">
        <div className="px-1">
          <input type="range" min={5000} max={1000000} step={10000}
            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#ff9900]" />
          <p className="text-sm font-semibold text-[#1d1d1f] mt-2">
            ${maxPrice.toLocaleString("es-CO")}
          </p>
        </div>
      </FilterSection>

      {/* In stock */}
      <div onClick={() => setInStockOnly(!inStockOnly)}
        className="flex items-center gap-3 cursor-pointer px-1 rounded-lg
          hover:bg-gray-50 py-1.5 transition-colors">
        <div className={`w-5 h-5 rounded border flex items-center justify-center
          flex-shrink-0 transition-all ${
            inStockOnly ? "bg-[#ff9900] border-[#ff9900]" : "border-gray-200"
          }`}>
          {inStockOnly && <Check size={12} className="text-black" />}
        </div>
        <span className="text-sm font-medium text-[#6e6e73]">Solo con disponibilidad</span>
      </div>
    </div>
  );
}

// ── BottomSheet ──────────────────────────────────────────────────────────────

function BottomSheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <>
      <div className={`fixed inset-0 z-[70] bg-black/25 backdrop-blur-sm
        transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose} />
      <div className={`fixed inset-x-0 bottom-0 z-[80] flex flex-col
        max-h-[88dvh] bg-white/96 backdrop-blur-2xl rounded-t-3xl
        shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-white/80
        transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-6 py-3.5
          border-b border-gray-100 flex-shrink-0">
          <span className="font-semibold text-[#1d1d1f] text-[15px]">{title}</span>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  type PE = number | "...";
  let pages: PE[];
  if (totalPages <= 7) pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  else if (page <= 4)  pages = [1, 2, 3, 4, 5, "...", totalPages];
  else if (page >= totalPages - 3) pages = [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  else pages = [1, "...", page - 1, page, page + 1, "...", totalPages];

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
          page === 1 ? "text-gray-200 cursor-not-allowed" : "text-[#6e6e73] hover:bg-white hover:shadow-sm"
        }`}>
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-300 text-sm select-none">···</span>
        ) : (
          <button key={p} onClick={() => onChange(p as number)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm
              font-semibold transition-all ${
                p === page
                  ? "bg-[#ff9900] text-black shadow-[0_2px_10px_rgba(255,153,0,0.35)]"
                  : "text-[#6e6e73] hover:bg-white hover:shadow-sm"
              }`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
          page === totalPages ? "text-gray-200 cursor-not-allowed" : "text-[#6e6e73] hover:bg-white hover:shadow-sm"
        }`}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── ProductsContent ──────────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") ?? "all";
  const initialQ        = searchParams.get("q") ?? "";

  const [category, setCategory]       = useState(initialCategory);
  const [brands, setBrands]           = useState<string[]>([]);
  const [maxPrice, setMaxPrice]       = useState(1000000);
  const [sort, setSort]               = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selWidths, setSelWidths]     = useState<string[]>([]);
  const [selProfiles, setSelProfiles] = useState<string[]>([]);
  const [selRims, setSelRims]         = useState<string[]>([]);
  const [page, setPage]               = useState(1);
  const [filterSheet, setFilterSheet] = useState(false);
  const [sortSheet, setSortSheet]     = useState(false);

  const searchQ = initialQ;
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  const visibleBrands = useMemo(() => {
    if (category === "all") return BRANDS;
    const allowed = new Set(BRAND_CATEGORY_MAP[category] ?? []);
    if (allowed.size === 0) return BRANDS;
    return BRANDS.filter((b) => allowed.has(b.name));
  }, [category]);

  const filtered = useMemo<Product[]>(() => {
    let list = [...ALL_PRODUCTS];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (brands.length > 0)  list = list.filter((p) => brands.includes(p.brand));
    list = list.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }
    // Tire dimension filters
    if (selWidths.length > 0)   list = list.filter((p) => selWidths.some((w) => p.specs.some((s) => s.startsWith(w + "/"))));
    if (selProfiles.length > 0) list = list.filter((p) => selProfiles.some((pr) => p.specs.some((s) => s.includes("/" + pr + " R"))));
    if (selRims.length > 0)     list = list.filter((p) => selRims.some((r) => p.specs.some((s) => s.includes("R" + r.replace('"', "")))));
    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating")     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, brands, maxPrice, sort, inStockOnly, searchQ, selWidths, selProfiles, selRims]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const safePage   = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const paginated  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function goPage(p: number) { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function setFC(c: string) { setCategory(c); setPage(1); }
  function setFB(b: string[]) { setBrands(b); setPage(1); }
  function setFP(p: number) { setMaxPrice(p); setPage(1); }
  function setFS(v: boolean) { setInStockOnly(v); setPage(1); }
  function setFW(v: string[]) { setSelWidths(v); setPage(1); }
  function setFPr(v: string[]) { setSelProfiles(v); setPage(1); }
  function setFR(v: string[]) { setSelRims(v); setPage(1); }

  function clearFilters() {
    setCategory("all"); setBrands([]); setMaxPrice(1000000); setInStockOnly(false);
    setSelWidths([]); setSelProfiles([]); setSelRims([]); setPage(1);
  }

  const dimCount = selWidths.length + selProfiles.length + selRims.length;
  const activeFilterCount =
    (category !== "all" ? 1 : 0) + brands.length + (inStockOnly ? 1 : 0) + dimCount;

  const pageTitle = searchQ.trim()
    ? `Resultados para "${searchQ}"`
    : category !== "all"
    ? CATEGORY_LABELS[category as ProductCategory]
    : "Todos los productos";

  useEffect(() => {
    document.title = `${pageTitle} — Merquellantas`;
    return () => { document.title = "Merquellantas — Llantas, Lubricantes, Baterías y Rines en Colombia"; };
  }, [pageTitle]);

  const filterProps = {
    category, setCategory: setFC,
    brands, setBrands: setFB,
    maxPrice, setMaxPrice: setFP,
    inStockOnly, setInStockOnly: setFS,
    selWidths, setSelWidths: setFW,
    selProfiles, setSelProfiles: setFPr,
    selRims, setSelRims: setFR,
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      <Navbar />

      <main className="pt-[96px]">

        {/* ── Hero banner ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#1a0500" }}
        >
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          >
            <source src="/products-hero.mp4" type="video/mp4" />
          </video>

          {/* Dark gradient overlay for text legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(160deg, rgba(26,5,0,0.72) 0%, rgba(80,25,0,0.45) 50%, rgba(26,5,0,0.68) 100%)" }}
          />

          {/* Merquito — absolute right */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merquito.png"
            alt="Merquito"
            className="hidden md:block absolute right-0 bottom-0 h-52 lg:h-64 w-auto object-contain pointer-events-none"
            style={{ mixBlendMode: "screen" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/50 mb-6 justify-center">
              <Link href="/"
                className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
                <ArrowLeft size={13} />
                Inicio
              </Link>
              <span className="text-white/25">/</span>
              <span className="text-white/80 font-medium">Productos</span>
              {category !== "all" && (
                <>
                  <span className="text-white/25">/</span>
                  <span className="text-white font-semibold">
                    {CATEGORY_LABELS[category as ProductCategory]}
                  </span>
                </>
              )}
            </div>

            {/* "Buscaste por" pills */}
            {(searchQ.trim() || category !== "all") && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                <span className="text-white/50 text-[11px] font-medium flex-shrink-0">Buscaste por:</span>
                {searchQ.trim() && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full
                    bg-white/25 border border-white/40 text-white text-[11px] font-semibold backdrop-blur-sm">
                    {searchQ}
                  </span>
                )}
                {category !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full
                    bg-black/15 border border-black/10 text-white text-[11px] font-semibold">
                    {CATEGORY_LABELS[category as ProductCategory]}
                  </span>
                )}
              </div>
            )}

            {/* Title — centered, big */}
            <h1
              className="text-white font-black tracking-tight leading-none text-center mb-3"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              {pageTitle}
            </h1>

            {/* Count */}
            <p className="text-white/55 text-sm text-center mb-6">
              <span className="text-white font-semibold">{filtered.length}</span> productos
              {totalPages > 1 && (
                <span className="text-white/30"> · página {safePage} de {totalPages}</span>
              )}
            </p>

            {/* Sort + clear — centered */}
            <div className="flex items-center justify-center gap-3">
              {activeFilterCount > 0 && (
                <button onClick={clearFilters}
                  className="text-[11px] text-white/70 font-medium hover:text-white transition-colors flex items-center gap-1">
                  <X size={11} />
                  Limpiar filtros ({activeFilterCount})
                </button>
              )}
              <div className="relative">
                <select value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="appearance-none pl-4 pr-8 py-2 bg-black/20 border border-black/15 rounded-xl
                    text-sm text-white font-medium cursor-pointer focus:outline-none focus:border-white/30
                    hover:bg-black/25 transition-colors backdrop-blur-sm">
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id} style={{ background: "#5a1500" }}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/60" />
              </div>
            </div>
          </div>

          {/* Fade into page background */}
          <div className="h-8 bg-gradient-to-b from-transparent to-[#f2f2f7]" />
        </div>

        {/* ── Brands carousel ─────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center gap-2 py-4">
              {/* Left arrow */}
              <button
                onClick={() => brandsScrollRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
                className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center
                  justify-center text-gray-400 hover:text-[#ff9900] hover:border-[#ff9900]/40 transition-all shadow-sm z-10"
                aria-label="Anterior"
              >
                <ChevronLeft size={15} />
              </button>

              {/* Scrollable brand chips */}
              <div
                ref={brandsScrollRef}
                className="flex gap-3 overflow-x-auto flex-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* "Todos" chip */}
                <button
                  onClick={() => setFB([])}
                  className={`flex-none px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    brands.length === 0
                      ? "bg-[#ff9900] text-black border-[#ff9900] shadow-[0_2px_8px_rgba(255,153,0,0.3)]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#ff9900]/40 hover:text-[#ff9900]"
                  }`}
                >
                  Todos
                </button>

                {visibleBrands.map((brand) => {
                  const active = brands.includes(brand.name);
                  return (
                    <button
                      key={brand.name}
                      onClick={() => setFB(
                        active
                          ? brands.filter((x) => x !== brand.name)
                          : [...brands, brand.name]
                      )}
                      className={`flex-none flex flex-col items-center gap-3.5 px-6 py-4 rounded-2xl border
                        transition-all duration-200 ${
                        active
                          ? "bg-[#ff9900]/10 border-[#ff9900]/50 shadow-[0_0_0_2px_rgba(255,153,0,0.2)]"
                          : "bg-gray-50 border-gray-200 hover:border-[#ff9900]/30 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brand.url}
                        alt={brand.name}
                        className="h-14 w-36 object-contain mix-blend-multiply"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = "none";
                          const span = document.createElement("span");
                          span.textContent = brand.name;
                          span.style.cssText = "font-size:10px;font-weight:700;color:#6e6e73;";
                          el.parentElement?.appendChild(span);
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => brandsScrollRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
                className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center
                  justify-center text-gray-400 hover:text-[#ff9900] hover:border-[#ff9900]/40 transition-all shadow-sm z-10"
                aria-label="Siguiente"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 pb-32 sm:pb-12">
          <div className="flex gap-7">

            {/* ── Desktop filter sidebar (floating) ──────────────── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-[112px] px-1 pb-6">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/95 rounded-2xl
                  shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]">

                  {/* Sidebar header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-3
                    border-b border-gray-100/70">
                    <span className="font-semibold text-[#1d1d1f] text-sm">Filtros</span>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters}
                        className="text-[10px] text-[#ff9900] font-semibold hover:text-[#e68a00]
                          transition-colors flex items-center gap-0.5">
                        <X size={10} />
                        Limpiar ({activeFilterCount})
                      </button>
                    )}
                  </div>

                  {/* Scrollable body */}
                  <div className="overflow-y-auto no-scrollbar px-5 py-4"
                    style={{ maxHeight: "calc(100vh - 200px)" }}>
                    <FilterControls {...filterProps} />
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Product list ───────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-5">
                    <SlidersHorizontal size={22} className="text-gray-300" />
                  </div>
                  <p className="text-[#1d1d1f] font-semibold mb-1.5">Sin resultados</p>
                  <p className="text-[#6e6e73] text-sm mb-6">Prueba ajustando los filtros.</p>
                  <button onClick={clearFilters}
                    className="px-6 py-2.5 bg-[#ff9900] text-black font-semibold rounded-xl
                      text-sm shadow-[0_2px_12px_rgba(255,153,0,0.3)] hover:bg-[#e68a00] transition-colors">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}

              {totalPages > 1 && paginated.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-200/60">
                  <Pagination page={safePage} total={filtered.length} perPage={PER_PAGE} onChange={goPage} />
                  <p className="text-center text-[11px] text-gray-300 mt-3">
                    {((safePage - 1) * PER_PAGE) + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} de {filtered.length} productos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>

      <WhatsAppButton />

      {/* ── Mobile floating bottom bar ──────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden">
        <div className="mx-3 mb-3 rounded-2xl overflow-hidden
          bg-white/92 backdrop-blur-3xl
          border border-white/80
          shadow-[0_4px_24px_rgba(0,0,0,0.14),0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="flex items-stretch h-[54px] divide-x divide-gray-100/80">
            <button onClick={() => setFilterSheet(true)}
              className="flex-1 flex items-center justify-center gap-2
                text-[13px] font-semibold text-[#1d1d1f]
                hover:bg-gray-50/60 active:bg-gray-100 transition-colors rounded-l-2xl">
              <SlidersHorizontal size={15} className="text-[#6e6e73]" />
              Filtrar
              {activeFilterCount > 0 && (
                <span className="bg-[#ff9900] text-black text-[9px] font-bold
                  rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button onClick={() => setSortSheet(true)}
              className="flex-1 flex items-center justify-center gap-2
                text-[13px] font-semibold text-[#1d1d1f]
                hover:bg-gray-50/60 active:bg-gray-100 transition-colors rounded-r-2xl">
              <ArrowUpDown size={14} className="text-[#6e6e73]" />
              Ordenar
              {sort !== "relevance" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff9900]" />
              )}
            </button>
          </div>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </div>

      {/* Filter sheet */}
      <BottomSheet open={filterSheet} onClose={() => setFilterSheet(false)} title="Filtros">
        <FilterControls {...filterProps} />
        <div className="mt-6 space-y-2.5">
          <button onClick={() => setFilterSheet(false)}
            className="w-full py-3.5 bg-[#ff9900] text-black font-semibold rounded-xl text-sm
              shadow-[0_2px_12px_rgba(255,153,0,0.3)] hover:bg-[#e68a00] transition-colors">
            Ver {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={() => { clearFilters(); setFilterSheet(false); }}
              className="w-full py-3 text-[#6e6e73] text-sm font-medium hover:text-[#1d1d1f] transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      </BottomSheet>

      {/* Sort sheet */}
      <BottomSheet open={sortSheet} onClose={() => setSortSheet(false)} title="Ordenar por">
        <div className="space-y-1">
          {SORT_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => { setSort(o.id); setSortSheet(false); setPage(1); }}
              className={`w-full text-left flex items-center justify-between
                px-4 py-3.5 rounded-xl text-sm transition-colors ${
                  sort === o.id
                    ? "bg-[#ff9900]/10 text-[#ff9900] font-semibold"
                    : "text-[#1d1d1f] font-medium hover:bg-gray-50"
                }`}>
              <span>{o.label}</span>
              {sort === o.id && <Check size={14} className="text-[#ff9900]" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

// ── Page export ──────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
