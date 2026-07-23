"use client";

import { useState } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { CATEGORIES } from "../lib/mockData";

const CATEGORY_BG_COLORS = [
  { bg: "from-zinc-900 via-zinc-800 to-zinc-900", accent: "border-[#ff9900]" },
  { bg: "from-zinc-900 via-zinc-800 to-zinc-900", accent: "border-blue-500/40" },
  { bg: "from-zinc-900 via-zinc-800 to-zinc-900", accent: "border-emerald-500/40" },
  { bg: "from-zinc-900 via-zinc-800 to-zinc-900", accent: "border-purple-500/40" },
];

const CATEGORY_ILLUSTRATIONS = [
  // Llantas - tire tread pattern
  <svg key="llantas" viewBox="0 0 120 120" className="w-full h-full opacity-20" fill="none">
    <circle cx="60" cy="60" r="50" stroke="#ff9900" strokeWidth="8" />
    <circle cx="60" cy="60" r="35" stroke="#ff9900" strokeWidth="4" strokeDasharray="6 4" />
    <circle cx="60" cy="60" r="18" stroke="#ff9900" strokeWidth="6" />
    <circle cx="60" cy="60" r="8" fill="#ff9900" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <rect
        key={i}
        x="57"
        y="14"
        width="6"
        height="14"
        rx="3"
        fill="#ff9900"
        transform={`rotate(${a} 60 60)`}
      />
    ))}
  </svg>,
  // Lubricantes - oil drop
  <svg key="lubricantes" viewBox="0 0 120 120" className="w-full h-full opacity-20" fill="none">
    <path d="M60 10 C60 10 30 50 30 72 C30 88 44 102 60 102 C76 102 90 88 90 72 C90 50 60 10 60 10Z" fill="#ff9900" />
    <path d="M48 75 C48 68 52 63 60 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="90" r="6" fill="white" opacity="0.3" />
  </svg>,
  // Baterías - battery
  <svg key="baterias" viewBox="0 0 120 120" className="w-full h-full opacity-20" fill="none">
    <rect x="15" y="35" width="90" height="55" rx="8" stroke="#ff9900" strokeWidth="6" />
    <rect x="45" y="25" width="12" height="12" rx="3" fill="#ff9900" />
    <rect x="63" y="25" width="12" height="12" rx="3" fill="#ff9900" />
    <path d="M35 62 L50 45 L50 60 L65 45 L65 60 L80 43" stroke="#ff9900" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Rines - wheel
  <svg key="rines" viewBox="0 0 120 120" className="w-full h-full opacity-20" fill="none">
    <circle cx="60" cy="60" r="48" stroke="#ff9900" strokeWidth="5" />
    <circle cx="60" cy="60" r="20" stroke="#ff9900" strokeWidth="5" />
    {[0, 72, 144, 216, 288].map((a, i) => (
      <line
        key={i}
        x1="60"
        y1="60"
        x2={60 + 45 * Math.cos((a * Math.PI) / 180)}
        y2={60 + 45 * Math.sin((a * Math.PI) / 180)}
        stroke="#ff9900"
        strokeWidth="5"
        strokeLinecap="round"
      />
    ))}
    <circle cx="60" cy="60" r="8" fill="#ff9900" />
  </svg>,
];

export default function CategoryMatrix() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="categories" className="py-24 bg-[#0f0f10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers size={16} className="text-[#ff9900]" />
              <span className="text-[#ff9900] text-sm font-semibold uppercase tracking-wider">
                Categorías
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Todo lo que tu
              <br />
              <span className="text-gradient-brand">vehículo necesita.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Más de 1.600 productos de las marcas más reconocidas a nivel mundial,
            con entrega y asesoría especializada.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const isHovered = hovered === cat.id;
            const colors = CATEGORY_BG_COLORS[idx];

            return (
              <div
                key={cat.id}
                id={cat.id}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${
                  isHovered ? colors.accent : "border-white/8"
                }`}
                style={{ minHeight: "360px" }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />

                {/* Illustration bg */}
                <div className="absolute top-4 right-4 w-32 h-32 transition-all duration-500 group-hover:scale-110 group-hover:opacity-30">
                  {CATEGORY_ILLUSTRATIONS[idx]}
                </div>

                {/* Orange glow on hover */}
                <div
                  className={`absolute inset-0 bg-[#ff9900]/5 transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Content */}
                <div className="relative p-6 flex flex-col h-full" style={{ minHeight: "360px" }}>
                  {/* Item count badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 text-zinc-400 text-xs font-medium w-fit mb-auto">
                    <span>{cat.itemCount} productos</span>
                  </div>

                  <div className="mt-auto">
                    {/* Category name */}
                    <h3 className="text-3xl font-black text-white mb-1 group-hover:text-[#ff9900] transition-colors duration-200">
                      {cat.nameEs}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-5">{cat.description}</p>

                    {/* Subcategories — reveal on hover */}
                    <div
                      className={`grid grid-cols-2 gap-1.5 mb-5 transition-all duration-300 ${
                        isHovered
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                      }`}
                    >
                      {cat.subCategories.map((sub) => (
                        <span
                          key={sub}
                          className="text-xs text-zinc-400 px-2 py-1 rounded-lg bg-white/5 hover:bg-[#ff9900]/15 hover:text-[#ff9900] transition-colors cursor-pointer truncate"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isHovered
                          ? "bg-[#ff9900] text-black"
                          : "bg-white/8 text-white hover:bg-white/15"
                      }`}
                    >
                      Ver {cat.nameEs}
                      <ArrowRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
