"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, MapPin, Menu, X, ChevronDown, Phone, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ALL_PRODUCTS, CATEGORY_LABELS } from "../lib/products";

const NAV_LINKS = [
  { label: "Llantas",     href: "/products?category=llantas" },
  { label: "Lubricantes", href: "products?category=lubricantes" },
  { label: "Baterías",    href: "products?category=baterias" },
  { label: "Rines",       href: "products?category=rines" },
  { label: "Ofertas",     href: "#offers" },
];

const ANNOUNCEMENT = "Mas de 30 puntos de instalación en todo el país";

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const { itemCount, openCart }     = useCart();
  const router    = useRouter();
  const inputRef  = useRef<HTMLInputElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close search when clicking outside */
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQ("");
      }
    }
    if (searchOpen) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [searchOpen]);

  const suggestions = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (q.length < 1) return [];
    return ALL_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.specs.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQ]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQ.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQ("");
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  function handleSuggestionClick() {
    setSearchOpen(false);
    setSearchQ("");
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* ── Announcement bar ──────────────────────────────────── */}
      <div className="bg-[#ff9900] text-black text-[11px] font-semibold tracking-wide text-center px-4 py-2 leading-none">
        {ANNOUNCEMENT}
      </div>

      {/* ── Main navbar ───────────────────────────────────────── */}
      <header
        className={`bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.merquellantas.com/assets/images/logo/Logo-Merquellantas.png"
                alt="Merquellantas"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  const fallback = t.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden items-center gap-1">
                <span className="font-black text-[#111] text-xl tracking-tight">Merque</span>
                <span className="font-black text-[#ff9900] text-xl tracking-tight">llantas</span>
              </div>
            </a>

            {/* Center nav — desktop */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative group ${
                    link.label === "Ofertas"
                      ? "text-[#ff9900] font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-1">
              <a
                href="tel:+576012345678"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Phone size={14} />
                601 234-5678
              </a>

              <button className="hidden md:flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <MapPin size={14} className="text-[#ff9900]" />
                Bogotá
                <ChevronDown size={12} />
              </button>

              <button
                onClick={() => { setSearchOpen((s) => !s); setSearchQ(""); }}
                className="w-9 h-9 hidden sm:flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>

              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                <ShoppingCart size={19} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#ff9900] text-black text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all ml-1"
              >
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search panel with live suggestions ─────────────── */}
        {searchOpen && (
          <div ref={wrapRef} className="border-t border-gray-100 bg-white animate-fade-in">
            <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Buscar llantas, lubricantes, rines, baterías..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-24 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff9900] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#ff9900] text-black text-xs font-black rounded-lg hover:bg-[#e68a00] transition-colors"
                >
                  Buscar
                </button>
              </form>

              {/* Live suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-1 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 px-1 py-2">
                    Sugerencias
                  </p>
                  <ul>
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.id}`}
                          onClick={handleSuggestionClick}
                          className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          {/* Mini image or color swatch */}
                          <div
                            className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                            style={!p.images?.[0] ? { background: `linear-gradient(135deg, ${p.bgFrom}, ${p.bgTo})` } : {}}
                          >
                            {p.images?.[0] ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={p.images[0]} alt="" className="w-full h-full object-contain bg-gray-50 p-0.5" />
                            ) : (
                              <span className="text-[9px] font-black text-white/40 leading-tight text-center px-0.5">{p.brand}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#ff9900] transition-colors">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {p.brand} · {CATEGORY_LABELS[p.category]} · {p.specs[0]}
                            </p>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-black text-gray-900">${p.price.toLocaleString("es-CO")}</p>
                          </div>

                          <ArrowRight size={14} className="text-gray-200 group-hover:text-[#ff9900] transition-colors flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* "See all" footer */}
                  <button
                    onClick={() => { handleSearch({ preventDefault: () => {} } as React.FormEvent); }}
                    className="w-full mt-1 py-2 text-xs font-bold text-[#ff9900] hover:text-[#e68a00] transition-colors text-center"
                  >
                    Ver todos los resultados para &ldquo;{searchQ}&rdquo;
                  </button>
                </div>
              )}

              {/* No results state */}
              {searchQ.trim().length >= 1 && suggestions.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-400 pb-3">
                  Sin resultados para &ldquo;{searchQ}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    link.label === "Ofertas"
                      ? "text-[#ff9900]"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {/* Mobile search */}
              <form
                onSubmit={handleSearch}
                className="pt-3 mt-1 border-t border-gray-100"
              >
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#ff9900] transition-all"
                  />
                </div>
              </form>
              <div className="pt-3 mt-1 border-t border-gray-100 flex items-center gap-2 px-3">
                <MapPin size={13} className="text-[#ff9900]" />
                <span className="text-sm text-gray-500">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
