"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Phone,
  Zap,
} from "lucide-react";
import { ANNOUNCEMENTS } from "../lib/mockData";

const NAV_LINKS = [
  { label: "Llantas", href: "#llantas" },
  { label: "Lubricantes", href: "#lubricantes" },
  { label: "Baterías", href: "#baterias" },
  { label: "Rines", href: "#rines" },
  { label: "Ofertas", href: "#offers", highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(2);
  const [tickerPaused, setTickerPaused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickerContent = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS].join("   ·   ");

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-[#ff9900] text-black text-xs font-semibold overflow-hidden h-8 flex items-center">
        <div
          className="flex whitespace-nowrap animate-ticker"
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
          style={{ animationPlayState: tickerPaused ? "paused" : "running" }}
        >
          <span className="pr-16">{tickerContent}</span>
          <span className="pr-16">{tickerContent}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-black/90 border-b border-white/10 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#ff9900] flex items-center justify-center brand-glow-sm group-hover:scale-105 transition-transform">
                <Zap size={16} className="text-black" fill="black" />
              </div>
              <div>
                <span className="text-white font-black text-lg tracking-tight leading-none">
                  Merque
                </span>
                <span className="text-[#ff9900] font-black text-lg tracking-tight leading-none">
                  llantas
                </span>
              </div>
            </a>

            {/* Center Nav — desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? "text-[#ff9900] hover:bg-[#ff9900]/10 border border-[#ff9900]/30"
                      : "text-zinc-300 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-pulse" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>

              {/* Region */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm">
                <MapPin size={14} className="text-[#ff9900]" />
                <span>Bogotá</span>
                <ChevronDown size={12} />
              </button>

              {/* Phone */}
              <a
                href="tel:+576012345678"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm"
              >
                <Phone size={14} />
                <span>601 234-5678</span>
              </a>

              {/* Cart */}
              <button className="relative flex w-10 h-10 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all group">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#ff9900] text-black text-[10px] font-black rounded-full flex items-center justify-center animate-pulse-brand">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-black/95 backdrop-blur-md px-4 py-3 animate-fade-in">
            <div className="max-w-2xl mx-auto relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar llantas, lubricantes, rines..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9900] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/97 backdrop-blur-lg animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    link.highlight
                      ? "text-[#ff9900] bg-[#ff9900]/10"
                      : "text-zinc-300 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="ml-auto text-xs bg-[#ff9900]/20 text-[#ff9900] px-2 py-0.5 rounded-full">
                      HOT
                    </span>
                  )}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <MapPin size={14} className="text-[#ff9900]" />
                <span className="text-zinc-400 text-sm">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
