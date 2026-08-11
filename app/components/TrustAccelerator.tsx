"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { TIER_PRODUCTS } from "../lib/mockData";

const KEY_STATS = [
  { value: "15.000+", label: "Clientes satisfechos",    sub: "Calificación promedio 4.9 / 5" },
  { value: "1.600+",  label: "Referencias disponibles", sub: "Marcas líderes a nivel mundial" },
  { value: "120+",    label: "Centros de instalación",  sub: "Red aliada en todo Colombia" },
  { value: "24 h",    label: "Entrega en Bogotá",       sub: "Envío nacional express" },
];

const BRAND_LOGOS = ["Michelin", "Continental", "Bridgestone", "Pirelli", "Goodyear", "Bosch", "Mobil", "BBS"];

const TIER_CONFIG = {
  good:   { border: "border-gray-200",   activeBorder: "border-gray-400",    pill: "bg-gray-100 text-gray-700",   btn: "bg-gray-900 text-white hover:bg-gray-800" },
  better: { border: "border-[#ff9900]",  activeBorder: "border-[#ff9900]",   pill: "bg-[#ff9900] text-black",     btn: "bg-[#ff9900] text-black hover:bg-[#e68a00]" },
  best:   { border: "border-gray-200",   activeBorder: "border-violet-400",  pill: "bg-violet-100 text-violet-700", btn: "bg-violet-600 text-white hover:bg-violet-700" },
} as const;

export default function TrustAccelerator() {
  const [activeTier, setActiveTier] = useState<"good" | "better" | "best">("better");

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ── Key numbers ──────────────────────────────────────────── */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-100 rounded-2xl overflow-hidden">
            {KEY_STATS.map((s, i) => (
              <div
                key={s.label}
                className={`p-8 flex flex-col gap-1 ${
                  i < KEY_STATS.length - 1 ? "border-r border-gray-100" : ""
                } ${i < 2 ? "border-b border-gray-100 lg:border-b-0" : ""}`}
              >
                <div className="text-3xl font-black text-gray-900">{s.value}</div>
                <div className="text-sm font-semibold text-gray-700">{s.label}</div>
                <div className="text-xs text-gray-400 leading-snug">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Brand logos strip ─────────────────────────────────────── */}
        <div className="border-y border-gray-100 py-10">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-8">
            Distribuidores Oficiales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {BRAND_LOGOS.map((brand) => (
              <span
                key={brand}
                className="text-gray-300 font-black text-base tracking-tight hover:text-gray-500 transition-colors cursor-default select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* ── Good / Better / Best ─────────────────────────────────── */}
        <div>
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff9900] mb-3">
              Selector de nivel
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Elige según tu
              <br />
              presupuesto.
            </h2>
            <p className="text-gray-400 text-base mt-4 max-w-lg mx-auto">
              Todos los niveles incluyen garantía oficial, asesoría técnica y
              disponibilidad para instalación inmediata.
            </p>
          </div>

          {/* Tier tab switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
              {TIER_PRODUCTS.map((tier) => {
                const cfg = TIER_CONFIG[tier.tier];
                const active = activeTier === tier.tier;
                return (
                  <button
                    key={tier.tier}
                    onClick={() => setActiveTier(tier.tier)}
                    className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      active
                        ? cfg.pill + " shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tier.tier === "better" && !active && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#ff9900] text-black px-1.5 py-0.5 rounded-full font-black uppercase whitespace-nowrap leading-none">
                        Popular
                      </span>
                    )}
                    {tier.labelEs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIER_PRODUCTS.map((tier) => {
              const cfg    = TIER_CONFIG[tier.tier];
              const active = activeTier === tier.tier;

              return (
                <div
                  key={tier.tier}
                  onClick={() => setActiveTier(tier.tier)}
                  className={`relative border-2 rounded-2xl p-7 cursor-pointer transition-all duration-200 ${
                    active
                      ? cfg.activeBorder + " bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] scale-[1.01]"
                      : cfg.border + " bg-white hover:shadow-sm"
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff9900] text-black text-[10px] font-black rounded-full uppercase tracking-wide whitespace-nowrap">
                      Mas recomendado
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${cfg.pill}`}>
                      {tier.label}
                    </span>
                    {active && (
                      <div className="w-5 h-5 rounded-full bg-[#ff9900] flex items-center justify-center">
                        <Check size={11} className="text-black" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-black text-gray-900">{tier.priceRange}</div>
                    <div className="text-xs text-gray-400 mt-0.5">por llanta</div>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{tier.description}</p>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Check
                          size={13}
                          className={
                            tier.tier === "best"
                              ? "text-violet-500"
                              : tier.tier === "better"
                              ? "text-[#ff9900]"
                              : "text-gray-400"
                          }
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2">
                      Marcas incluidas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.brands.map((b) => (
                        <span
                          key={b}
                          className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${cfg.btn} hover:scale-[1.01] active:scale-[0.98]`}
                  >
                    Explorar {tier.labelEs}s
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
