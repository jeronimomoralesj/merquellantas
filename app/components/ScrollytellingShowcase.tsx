"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Zap, Award, Truck } from "lucide-react";

const FEATURES = [
  {
    Icon: Shield,
    title: "Durabilidad certificada",
    description:
      "Cada producto supera los estándares UTQG y las pruebas de homologación internacionales antes de llegar a tu vehículo.",
    metric: "40.000",
    metricUnit: "km",
    metricLabel: "vida útil garantizada",
    color: "from-blue-500/10",
  },
  {
    Icon: Zap,
    title: "Frenado superior",
    description:
      "Reducción de distancia de frenado en mojado hasta un 30 % frente a marcas básicas. Seguridad que se siente.",
    metric: "30",
    metricUnit: "%",
    metricLabel: "mejor frenado en mojado",
    color: "from-amber-500/10",
  },
  {
    Icon: Award,
    title: "Marcas líderes",
    description:
      "Distribuidores oficiales de Michelin, Continental, Bridgestone, Pirelli y más. Originales, no copias.",
    metric: "15",
    metricUnit: "+",
    metricLabel: "marcas premium certificadas",
    color: "from-purple-500/10",
  },
  {
    Icon: Truck,
    title: "Red de instalación",
    description:
      "Más de 30 puntos de instalación certificada en 26 ciudades de Colombia. Montaje profesional incluido.",
    metric: "30",
    metricUnit: "+",
    metricLabel: "puntos de instalación",
    color: "from-emerald-500/10",
  },
];

export default function ScrollytellingShowcase() {
  const [visible, setVisible] = useState<boolean[]>(Array(FEATURES.length).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="bg-black py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff9900] mb-4">
            Por qué elegirnos
          </p>
          <h2
            className="font-black text-white tracking-tight leading-[0.92]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            Ultra-rendimiento<br />
            <span className="text-[#ff9900]">en cada kilómetro.</span>
          </h2>
          <p className="text-white/35 text-base mt-5 max-w-xl mx-auto">
            32 años distribuyendo las mejores marcas del mundo en Colombia. Calidad que no negocia.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`feature-card-${visible[i] ? "visible" : "hidden"} group relative bg-[#0d0d0d] border border-white/8 rounded-3xl p-8 lg:p-10 overflow-hidden`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Radial glow background */}
              <div
                className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${feat.color} to-transparent`}
              />

              {/* Top accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff9900] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl" />

              <div className="relative flex flex-col gap-6">
                {/* Icon + metric row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#ff9900]/10 border border-white/8 group-hover:border-[#ff9900]/20 flex items-center justify-center transition-all duration-400 flex-shrink-0">
                    <feat.Icon size={20} className="text-white/50 group-hover:text-[#ff9900] transition-colors duration-400" />
                  </div>

                  {/* Metric */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-white leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                      <span className="text-[#ff9900]">{feat.metric}</span>
                      <span className="text-[#ff9900]/60 text-2xl">{feat.metricUnit}</span>
                    </div>
                    <div className="text-white/25 text-xs mt-1 max-w-[130px] text-right leading-tight">
                      {feat.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Title + description */}
                <div>
                  <h3 className="text-white font-black text-lg mb-2 group-hover:text-white transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom separator line */}
                <div className="h-[1px] bg-white/6 group-hover:bg-[#ff9900]/15 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 lg:gap-12">
          {[
            { value: "32+",     label: "Años de experiencia" },
            { value: "26",      label: "Ciudades con presencia" },
            { value: "15.000+", label: "Clientes satisfechos" },
            { value: "1.600+",  label: "Referencias disponibles" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#ff9900]">{s.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
