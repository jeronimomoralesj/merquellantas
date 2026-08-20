"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TIPS_POSTS, MUNDO_POSTS, type BlogPost } from "../lib/blog";

type Mode = "tips" | "mundo";

/* ── Tip card ──────────────────────────────────────────────────────────── */
function TipCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100
        hover:border-[#ff9900]/25 hover:shadow-[0_8px_32px_rgba(255,153,0,0.1)]
        transition-all duration-300 ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Color slab */}
      <div
        className={`relative overflow-hidden ${featured ? "h-56 sm:h-64" : "h-36"}`}
        style={{ background: `linear-gradient(160deg, ${post.color} 0%, #1a0800 100%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />

        {featured && post.merquitoQuote && (
          <div className="absolute top-6 right-6 max-w-[200px]">
            <div className="border-l-2 border-[#ff9900]/50 pl-3">
              <p className="text-sm text-white/65 leading-snug">"{post.merquitoQuote}"</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-5 left-6">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9900] bg-[#ff9900]/15 border border-[#ff9900]/25 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className={`font-black text-gray-900 leading-tight mb-3 group-hover:text-[#ff9900] transition-colors duration-200
            ${featured ? "text-xl sm:text-2xl" : "text-[15px]"}`}
        >
          {post.title}
        </h3>
        <p className={`text-gray-400 leading-relaxed flex-1 line-clamp-2 mb-5 ${featured ? "text-base" : "text-sm"}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-[10px] text-gray-300 tracking-wide">
            {post.date} &middot; {post.readTime}
          </span>
          <span className="text-[10px] font-black text-[#ff9900] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Leer
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Mundo card ────────────────────────────────────────────────────────── */
function MundoCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100
        hover:border-gray-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]
        transition-all duration-300 ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Editorial color header */}
      <div
        className={`relative overflow-hidden ${featured ? "h-44 sm:h-52" : "h-28"}`}
        style={{ background: `linear-gradient(145deg, ${post.color} 0%, #0e0e18 100%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e18]/45" />
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-[10px] text-white/40">{post.date}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className={`font-black text-gray-900 leading-tight mb-3 group-hover:text-[#ff9900] transition-colors duration-200
            ${featured ? "text-xl sm:text-2xl" : "text-[15px]"}`}
        >
          {post.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-2 mb-5">{post.excerpt}</p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-[10px] text-gray-300 tracking-wide">{post.readTime} lectura</span>
          <span className="text-[10px] font-black text-[#ff9900] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Leer
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function BlogPageClient() {
  const [mode, setMode] = useState<Mode>("tips");
  const [fading, setFading] = useState(false);

  const [tipFeatured, ...tipRest]     = TIPS_POSTS;
  const [mundoFeatured, ...mundoRest] = MUNDO_POSTS;

  function switchMode(next: Mode) {
    if (next === mode) return;
    setFading(true);
    setTimeout(() => {
      setMode(next);
      setFading(false);
    }, 280);
  }

  const isTips = mode === "tips";

  return (
    <>
      <Navbar />

      <main
        style={{
          backgroundColor: isTips ? "#fdf8f2" : "#f5f5f7",
          backgroundImage: isTips
            ? "radial-gradient(circle, rgba(255,153,0,0.06) 1px, transparent 1px)"
            : "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(0,0,0,0.02) 47px, rgba(0,0,0,0.02) 48px)",
          backgroundSize: isTips ? "28px 28px" : "100% 48px",
          transition: "background-color 0.55s ease",
        }}
      >
        {/* ── HERO / MODE SWITCHER ───────────────────────────────────── */}
        <div className="pt-[120px] pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <p className="text-[9px] font-black uppercase tracking-[0.38em] text-[#ff9900] mb-8">Blog</p>

            {/* Headline changes with mode */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.93] tracking-tight">
                {isTips ? (
                  <>
                    <span className="block">Aprende.</span>
                    <span className="block text-[#ff9900]">Conduce mejor.</span>
                  </>
                ) : (
                  <>
                    <span className="block">El mundo</span>
                    <span className="block text-[#ff9900]">Merquellantas.</span>
                  </>
                )}
              </h1>
            </div>

            {/* Mode tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Tips tile */}
              <button
                onClick={() => switchMode("tips")}
                className="relative overflow-hidden rounded-2xl text-left p-7 sm:p-9 cursor-pointer transition-all duration-500"
                style={{
                  background: isTips
                    ? "linear-gradient(135deg, #ff9900 0%, #e07800 100%)"
                    : "white",
                  border: isTips ? "none" : "1px solid #e5e7eb",
                  boxShadow: isTips
                    ? "0 0 64px rgba(255,153,0,0.2), 0 4px 24px rgba(255,153,0,0.25), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "0 1px 4px rgba(0,0,0,0.04)",
                  transform: isTips ? "scale(1.005)" : "scale(0.997)",
                }}
              >
                {isTips && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.3em]"
                      style={{ color: isTips ? "rgba(26,8,0,0.5)" : "rgba(255,153,0,0.4)" }}
                    >
                      01
                    </span>
                    {isTips && <span className="block w-2 h-2 rounded-full bg-[#1a0800]/30 animate-pulse" />}
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-black leading-tight mb-2"
                    style={{ color: isTips ? "#1a0800" : "#374151" }}
                  >
                    Tips de Merquito
                  </h2>
                  <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{ color: isTips ? "rgba(26,8,0,0.55)" : "#9ca3af" }}
                  >
                    Guías prácticas para mantener tu vehículo en las mejores condiciones.
                  </p>
                  {!isTips && (
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] mt-5 text-[#ff9900]/60">
                      Entrar
                    </p>
                  )}
                </div>
              </button>

              {/* Mundo tile */}
              <button
                onClick={() => switchMode("mundo")}
                className="relative overflow-hidden rounded-2xl text-left p-7 sm:p-9 cursor-pointer transition-all duration-500"
                style={{
                  background: !isTips ? "#1d1d1f" : "white",
                  border: !isTips ? "none" : "1px solid #e5e7eb",
                  boxShadow: !isTips
                    ? "0 4px 32px rgba(0,0,0,0.18)"
                    : "0 1px 4px rgba(0,0,0,0.04)",
                  transform: !isTips ? "scale(1.005)" : "scale(0.997)",
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.3em]"
                      style={{ color: !isTips ? "#ff9900" : "#d1d5db" }}
                    >
                      02
                    </span>
                    {!isTips && <span className="block w-2 h-2 rounded-full bg-[#ff9900] animate-pulse" />}
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-black leading-tight mb-2"
                    style={{ color: !isTips ? "rgba(255,255,255,0.92)" : "#374151" }}
                  >
                    Mundo Merque
                  </h2>
                  <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{ color: !isTips ? "rgba(255,255,255,0.4)" : "#9ca3af" }}
                  >
                    Noticias, expansiones y alianzas de Merquellantas en Colombia.
                  </p>
                  {isTips && (
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] mt-5 text-gray-300">
                      Entrar
                    </p>
                  )}
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* ── CONTENT (fades on mode switch) ────────────────────────── */}
        <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.28s ease" }}>

          {mode === "tips" ? (

            /* ── Tips de Merquito ──────────────────────────────────── */
            <section>
              {/* Video banner with Merquito */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div
                  className="relative overflow-hidden rounded-3xl"
                  style={{ minHeight: "clamp(300px, 42vw, 480px)" }}
                >
                  {/* Video — shifted right+down to hide watermark in top-left area */}
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: "scale(1.14) translate(6%, 10%)",
                      transformOrigin: "center center",
                    }}
                  >
                    <source src="/merquito-bg.mp4" type="video/mp4" />
                  </video>

                  {/* Overlay — heavier left (text), lighter right (mascot) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(110deg, rgba(13,5,0,0.91) 0%, rgba(13,5,0,0.65) 55%, rgba(13,5,0,0.35) 100%)",
                    }}
                  />

                  {/* Content + mascot row */}
                  <div
                    className="relative z-10 flex items-end justify-between px-8 sm:px-12 lg:px-14 pb-0"
                    style={{ minHeight: "clamp(300px, 42vw, 480px)" }}
                  >
                    {/* Text */}
                    <div className="pb-10 sm:pb-12 max-w-xl">
                      <div className="w-8 h-0.5 bg-[#ff9900] mb-6" />
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                        El experto de las llantas<br />
                        <span className="text-[#ff9900]">te tiene todo resuelto.</span>
                      </h2>
                      <p className="text-white/45 text-base sm:text-lg leading-relaxed">
                        Desde la presión correcta hasta el aceite ideal — consejos directos para que tu vehículo nunca te falle.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Tips grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <TipCard post={tipFeatured} featured />
                  {tipRest.map((post) => (
                    <TipCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </section>

          ) : (

            /* ── Mundo Merque ──────────────────────────────────────── */
            <section>
              {/* Editorial divider */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="flex items-center gap-6">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[9px] font-black uppercase tracking-[0.32em] text-gray-400">
                    Noticias recientes
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              </div>

              {/* Mundo grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <MundoCard post={mundoFeatured} featured />
                  {mundoRest.map((post) => (
                    <MundoCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </section>

          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
