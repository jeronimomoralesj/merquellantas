"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ALL_PRODUCTS, CATEGORY_LABELS } from "../lib/products";

const NAV_LINKS = [
  { label: "Llantas",     href: "/products?category=llantas" },
  { label: "Lubricantes", href: "/products?category=lubricantes" },
  { label: "Baterías",    href: "/products?category=baterias" },
  { label: "Rines",       href: "/products?category=rines" },
  { label: "Ofertas",     href: "#offers" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const { itemCount, openCart }     = useCart();
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

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

  /* Close mobile drawer on escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setMobileOpen(false); setSearchOpen(false); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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

      {/* ── Announcement bar — slides away when scrolled ──────── */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{ maxHeight: scrolled ? 0 : "36px", opacity: scrolled ? 0 : 1 }}
      >
        <div className="bg-[#ff9900] text-black text-[11px] font-semibold tracking-wide text-center px-4 py-2.5 leading-none">
          Más de 30 puntos de instalación en todo el país
        </div>
      </div>

      {/* ── Main navbar ───────────────────────────────────────── */}
      <header
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-white/75 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.merquellantas.com/assets/images/logo/Logo-Merquellantas.png"
                alt="Merquellantas"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  const fallback = t.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden items-center gap-0.5">
                <span className="font-black text-[#111] text-[17px] tracking-tight">Merque</span>
                <span className="font-black text-[#ff9900] text-[17px] tracking-tight">llantas</span>
              </div>
            </a>

            {/* Center nav — desktop */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13.5px] font-medium text-black/55 hover:text-black transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-0.5">

              {/* Search button */}
              <button
                onClick={() => { setSearchOpen((s) => !s); setSearchQ(""); }}
                className="w-9 h-9 flex items-center justify-center text-black/50 hover:text-black rounded-full transition-all bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] hover:border-black/[0.10] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                aria-label="Buscar"
              >
                <Search size={17} strokeWidth={2} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                aria-label="Carrito"
                className={`relative flex items-center justify-center gap-1.5 transition-all duration-200
                  bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] hover:border-black/[0.10]
                  backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
                  text-black/50 hover:text-black
                  ${itemCount > 0
                    ? "rounded-full pl-3.5 pr-2.5 h-9"
                    : "rounded-full w-9 h-9"
                  }`}
              >
                <ShoppingCart size={17} strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="bg-[#ff9900] text-black text-[10px] font-bold
                    min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-black/50 hover:text-black rounded-full transition-all ml-0.5 bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] hover:border-black/[0.10] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileOpen ? <X size={17} strokeWidth={2} /> : <Menu size={17} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search spotlight ────────────────────────────────── */}
        {searchOpen && (
          <div
            ref={wrapRef}
            className="border-t border-black/[0.06] bg-white/95 backdrop-blur-xl animate-fade-in"
          >
            <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  size={15}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Buscar llantas, lubricantes, rines, baterías…"
                  className="w-full bg-black/[0.04] border border-black/[0.08] rounded-2xl pl-10 pr-24 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-[#ff9900] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#ff9900]/95 backdrop-blur-sm text-black text-xs font-bold rounded-xl hover:bg-[#e68a00] transition-all border border-[#ffb84d]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.20)]"
                >
                  Buscar
                </button>
              </form>

              {/* Live suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-1 pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-black/25 px-1 py-2">
                    Sugerencias
                  </p>
                  <ul>
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.id}`}
                          onClick={handleSuggestionClick}
                          className="flex items-center gap-3 px-2 py-2.5 rounded-2xl hover:bg-black/[0.04] transition-colors group"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                            style={!p.images?.[0] ? { background: `linear-gradient(135deg, ${p.bgFrom}, ${p.bgTo})` } : {}}
                          >
                            {p.images?.[0] ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={p.images[0]} alt="" className="w-full h-full object-contain bg-gray-50 p-0.5" />
                            ) : (
                              <span className="text-[8px] font-black text-white/40 text-center px-0.5">{p.brand}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-medium text-black truncate group-hover:text-[#ff9900] transition-colors">
                              {p.name}
                            </p>
                            <p className="text-xs text-black/35">
                              {p.brand} · {CATEGORY_LABELS[p.category]} · {p.specs[0]}
                            </p>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <p className="text-[13.5px] font-bold text-black">${p.price.toLocaleString("es-CO")}</p>
                          </div>

                          <ArrowRight size={13} className="text-black/15 group-hover:text-[#ff9900] transition-colors flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
                    className="w-full mt-1 py-2 text-xs font-semibold text-[#ff9900] hover:text-[#e68a00] transition-colors text-center"
                  >
                    Ver todos los resultados para &ldquo;{searchQ}&rdquo;
                  </button>
                </div>
              )}

              {searchQ.trim().length >= 1 && suggestions.length === 0 && (
                <div className="py-4 text-center text-sm text-black/30 pb-3">
                  Sin resultados para &ldquo;{searchQ}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Mobile nav sheet ───────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl animate-fade-in">
            <nav className="px-4 py-4">
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-3.5 rounded-xl text-[15px] font-medium text-black/70 hover:text-black hover:bg-black/[0.04] transition-colors"
                    >
                      {link.label}
                      <ArrowRight size={14} className="text-black/20" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mt-4 pt-4 border-t border-black/[0.06]">
                <div className="relative">
                  <Search size={14} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Buscar productos…"
                    className="w-full bg-black/[0.04] border border-black/[0.08] rounded-2xl pl-9 pr-4 py-3 text-sm text-black placeholder-black/30 focus:outline-none focus:border-[#ff9900] transition-all"
                  />
                </div>
              </form>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
