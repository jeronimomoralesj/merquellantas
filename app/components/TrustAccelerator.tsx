"use client";

import { useState } from "react";
import {
  Truck,
  Shield,
  MapPin,
  CreditCard,
  RefreshCw,
  Star,
  Check,
  ArrowRight,
  Zap,
  Award,
} from "lucide-react";
import { TRUST_BADGES, TIER_PRODUCTS } from "../lib/mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  truck: Truck,
  shield: Shield,
  "map-pin": MapPin,
  "credit-card": CreditCard,
  "refresh-cw": RefreshCw,
  star: Star,
};

const TIER_STYLES = {
  good: {
    border: "border-zinc-700",
    activeBorder: "border-zinc-500",
    badge: "bg-zinc-700 text-zinc-200",
    btn: "bg-zinc-700 text-white hover:bg-zinc-600",
  },
  better: {
    border: "border-[#ff9900]/60",
    activeBorder: "border-[#ff9900]",
    badge: "bg-[#ff9900] text-black",
    btn: "bg-[#ff9900] text-black hover:bg-[#e68a00]",
  },
  best: {
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
    badge: "bg-purple-500 text-white",
    btn: "bg-purple-600 text-white hover:bg-purple-500",
  },
};

export default function TrustAccelerator() {
  const [activeTier, setActiveTier] = useState<"good" | "better" | "best">("better");

  return (
    <section className="py-24 bg-[#0f0f10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ── Trust Badges ─────────────────────────────────────── */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield size={16} className="text-[#ff9900]" />
              <span className="text-[#ff9900] text-sm font-semibold uppercase tracking-wider">
                Por qué elegirnos
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Compra con
              <span className="text-gradient-brand"> confianza total.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = ICON_MAP[badge.icon];
              return (
                <div
                  key={badge.label}
                  className="group glass rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-[#ff9900]/30 transition-all duration-300 hover:scale-[1.03] cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#ff9900]/10 border border-[#ff9900]/20 flex items-center justify-center group-hover:bg-[#ff9900]/20 group-hover:border-[#ff9900]/40 transition-all">
                    <Icon size={20} className="text-[#ff9900]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{badge.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{badge.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Logos strip ──────────────────────────────────────── */}
        <div className="border-y border-white/6 py-10">
          <p className="text-center text-zinc-600 text-xs uppercase tracking-widest mb-8">
            Distribuidores Oficiales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {["Michelin", "Continental", "Bridgestone", "Pirelli", "Goodyear", "Bosch", "Mobil", "BBS"].map(
              (brand) => (
                <div
                  key={brand}
                  className="text-zinc-600 font-black text-lg tracking-tight hover:text-zinc-300 transition-colors cursor-default"
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Good / Better / Best ─────────────────────────────── */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award size={16} className="text-[#ff9900]" />
              <span className="text-[#ff9900] text-sm font-semibold uppercase tracking-wider">
                Selector de nivel
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              ¿Cuánto quieres
              <span className="text-gradient-brand"> invertir?</span>
            </h2>
            <p className="text-zinc-500 text-base mt-4 max-w-xl mx-auto">
              Elige el nivel que se adapta a tu presupuesto y necesidades. Todos
              incluyen garantía y asesoría técnica.
            </p>
          </div>

          {/* Tier selector tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-zinc-900 rounded-2xl p-1.5 gap-1 border border-white/8">
              {TIER_PRODUCTS.map((tier) => {
                const styles = TIER_STYLES[tier.tier];
                const isActive = activeTier === tier.tier;
                return (
                  <button
                    key={tier.tier}
                    onClick={() => setActiveTier(tier.tier)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 relative ${
                      isActive ? styles.badge + " scale-[1.02]" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {tier.tier === "better" && !isActive && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-[#ff9900] text-black px-1.5 py-0.5 rounded-full font-black uppercase">
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
              const styles = TIER_STYLES[tier.tier];
              const isActive = activeTier === tier.tier;

              return (
                <div
                  key={tier.tier}
                  onClick={() => setActiveTier(tier.tier)}
                  className={`relative rounded-2xl border-2 p-7 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? `${styles.activeBorder} bg-white/4 scale-[1.02]`
                      : `${styles.border} bg-[#111113] hover:scale-[1.01]`
                  }`}
                >
                  {/* Recommended badge */}
                  {tier.recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff9900] text-black text-xs font-black rounded-full uppercase tracking-wide whitespace-nowrap">
                      <Zap size={10} className="inline mr-1" />
                      Más recomendado
                    </div>
                  )}

                  {/* Tier label */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${styles.badge}`}>
                      {tier.label}
                    </span>
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-[#ff9900] flex items-center justify-center">
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                  </div>

                  {/* Price range */}
                  <div className="mb-2">
                    <div className="text-white font-black text-xl">{tier.priceRange}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">por llanta</div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-5 leading-relaxed">{tier.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <Check
                          size={14}
                          className={
                            tier.tier === "good"
                              ? "text-zinc-400"
                              : tier.tier === "better"
                              ? "text-[#ff9900]"
                              : "text-purple-400"
                          }
                        />
                        <span className="text-zinc-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Brands */}
                  <div className="mb-6">
                    <p className="text-zinc-600 text-xs uppercase tracking-wider mb-2">Marcas incluidas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.brands.map((b) => (
                        <span
                          key={b}
                          className="text-xs text-zinc-400 bg-white/6 border border-white/8 px-2.5 py-1 rounded-lg font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${styles.btn} hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    Explorar {tier.labelEs}s
                    <ArrowRight size={15} />
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
