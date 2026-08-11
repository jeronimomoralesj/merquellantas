"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Star, Check, SlidersHorizontal, X, ChevronDown, ArrowLeft } from "lucide-react";
import { ALL_PRODUCTS, CATEGORY_LABELS, type Product, type ProductCategory } from "../lib/products";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Helpers ─────────────────────────────────────────────────────────── */
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

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "best-seller": { bg: "bg-[#ff9900]",   text: "text-black",  label: "Mas vendido" },
  "flash-deal":  { bg: "bg-rose-500",    text: "text-white",  label: "Oferta limitada" },
  "new":         { bg: "bg-emerald-500", text: "text-white",  label: "Nuevo" },
  "hot":         { bg: "bg-violet-500",  text: "text-white",  label: "Popular" },
};

const ALL_BRANDS = [...new Set(ALL_PRODUCTS.map((p) => p.brand))].sort();

const SORT_OPTIONS = [
  { id: "relevance",   label: "Relevancia" },
  { id: "price-asc",  label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "rating",     label: "Mejor valorados" },
];

/* ── Product card ─────────────────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:border-[#ff9900]/30 hover:shadow-[0_4px_24px_rgba(255,153,0,0.10)] transition-all duration-300 flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="h-80 relative overflow-hidden"
          style={!product.images?.[0] ? { background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` } : {}}>
          {product.images?.[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain bg-gray-50 p-3" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-1">
              <span className="text-3xl font-black text-white/20 tracking-tight select-none">{product.brand}</span>
              <span className="text-xs text-white/25 font-semibold">{product.specs[0]}</span>
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

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] mb-1">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 group-hover:text-[#ff9900] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.slice(0, 2).map((s) => (
            <span key={s} className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{s}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed flex-1">{product.shortDesc}</p>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <div className="text-gray-900 font-black text-xl leading-none">${product.price.toLocaleString("es-CO")}</div>
            {product.originalPrice && (
              <div className="text-gray-300 text-xs line-through mt-0.5">${product.originalPrice.toLocaleString("es-CO")}</div>
            )}
          </div>
          <button
            onClick={() => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
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

/* ── Filter sidebar ───────────────────────────────────────────────────── */
function FilterSidebar({
  category, setCategory,
  brands, setBrands,
  maxPrice, setMaxPrice,
  inStockOnly, setInStockOnly,
}: {
  category: string;
  setCategory: (c: string) => void;
  brands: string[];
  setBrands: (b: string[]) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
}) {
  const toggleBrand = (b: string) =>
    setBrands(brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b]);

  return (
    <aside className="space-y-6">
      {/* Category */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Categoria</p>
        <div className="space-y-1">
          <button
            onClick={() => setCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              category === "all"
                ? "bg-[#ff9900]/10 text-[#ff9900]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Todos
          </button>
          {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                category === c
                  ? "bg-[#ff9900]/10 text-[#ff9900]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Marca</p>
        <div className="space-y-1 max-h-52 overflow-y-auto">
          {ALL_BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group">
              <div
                onClick={() => toggleBrand(b)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  brands.includes(b)
                    ? "bg-[#ff9900] border-[#ff9900]"
                    : "border-gray-300 group-hover:border-[#ff9900]"
                }`}
              >
                {brands.includes(b) && <Check size={10} className="text-black" />}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Precio máximo</p>
        <input
          type="range"
          min={5000}
          max={10000000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#ff9900]"
        />
        <p className="text-sm font-bold text-gray-700 mt-1">${maxPrice.toLocaleString("es-CO")}</p>
      </div>

      {/* In stock */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
            inStockOnly ? "bg-[#ff9900] border-[#ff9900]" : "border-gray-300 hover:border-[#ff9900]"
          }`}
        >
          {inStockOnly && <Check size={12} className="text-black" />}
        </div>
        <span className="text-sm font-semibold text-gray-700">Solo disponibles</span>
      </label>
    </aside>
  );
}

/* ── Main page content ────────────────────────────────────────────────── */
function ProductsContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") ?? "all";
  const initialQ        = searchParams.get("q") ?? "";

  const [category, setCategory]     = useState(initialCategory);
  const [brands, setBrands]         = useState<string[]>([]);
  const [maxPrice, setMaxPrice]     = useState(1000000);
  const [sort, setSort]             = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [searchQ]                   = useState(initialQ);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (brands.length > 0) list = list.filter((p) => brands.includes(p.brand));
    list = list.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [category, brands, maxPrice, sort, inStockOnly, searchQ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-[96px]">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="flex items-center gap-1.5 hover:text-[#ff9900] transition-colors font-medium">
              <ArrowLeft size={14} />
              Inicio
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-semibold">
              {category !== "all" ? CATEGORY_LABELS[category as ProductCategory] : "Todos los productos"}
            </span>
          </div>
        </div>

        {/* Promo banner */}
        <div className="relative h-30 sm:h-52 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.continental.com/fileadmin/__imported/sites/corporate/_international/english/hubpages/60_20company/40_20history/20_20anniversary/05-anniversary_20publication/chapters/chapter_7/cw36-150y-histannivpub7-advert-canvasframe-web-16to9.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {searchQ.trim()
                  ? `Resultados para "${searchQ}"`
                  : category !== "all"
                  ? CATEGORY_LABELS[category as ProductCategory]
                  : "Todos los productos"}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{filtered.length} productos encontrados</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#ff9900] hover:text-[#ff9900] transition-all"
              >
                <SlidersHorizontal size={15} />
                Filtros
                {(brands.length > 0 || inStockOnly) && (
                  <span className="bg-[#ff9900] text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {brands.length + (inStockOnly ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-semibold focus:outline-none focus:border-[#ff9900] bg-white hover:border-[#ff9900]/40 transition-colors"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-52 flex-shrink-0">
              <FilterSidebar
                category={category} setCategory={setCategory}
                brands={brands} setBrands={setBrands}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
              />
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-gray-400 text-lg font-semibold mb-2">Sin resultados</p>
                  <p className="text-gray-300 text-sm mb-5">Prueba ajustando los filtros.</p>
                  <button
                    onClick={() => { setCategory("all"); setBrands([]); setMaxPrice(1000000); setInStockOnly(false); }}
                    className="px-5 py-2.5 bg-[#ff9900] text-black font-bold rounded-xl text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile filter overlay */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFilters(false)} />
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-gray-900">Filtros</span>
              <button onClick={() => setMobileFilters(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-500">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar
              category={category} setCategory={setCategory}
              brands={brands} setBrands={setBrands}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
            />
            <button
              onClick={() => setMobileFilters(false)}
              className="mt-6 w-full py-3 bg-[#ff9900] text-black font-bold rounded-xl"
            >
              Ver {filtered.length} productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
