"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { YEARS, MAKES, MODELS, VERSIONS, TIRE_WIDTHS, TIRE_PROFILES, RIM_SIZES } from "../lib/mockData";

type FitmentTab = "vehicle" | "size";

/* ── Slide data — swap src for real images ─────────────────────────────── */
const SLIDES = [
  {
    src: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--6c8d35d0-2423-43f7-9ce4-575277fc9302/continental-cst-keyvisual-2025.png?preferwebp=true&quality=85",
    label: "Nueva temporada",
    headline: "Alto rendimiento\npara cada ruta.",
  },
  {
    src: "https://s37629.pcdn.co/wp-content/uploads/2024/12/Hankook-iON-Race-Formula-E-1400.jpg",
    label: "Lubricantes premium",
    headline: "El motor que te protege\nkilómetro a kilómetro.",
  },
  {
    src: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/ca259746058331.5847e64731213.jpg",
    label: "Rines y baterías",
    headline: "Potencia, estilo\ny confiabilidad garantizada.",
  },
];

const PLACEHOLDER_GRADIENTS = [
  "from-zinc-800 to-zinc-900",
  "from-neutral-800 to-stone-900",
];

/* ── Step indicator circle ─────────────────────────────────────────────── */
function StepCircle({ step, done }: { step: number; done: boolean }) {
  return (
    <div
      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black transition-all ${
        done
          ? "bg-[#ff9900] text-black"
          : "border-2 border-gray-200 text-gray-300"
      }`}
    >
      {done ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        step
      )}
    </div>
  );
}

/* ── Select field ──────────────────────────────────────────────────────── */
interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  step?: number;
}

function Select({ label, value, options, onChange, disabled, step }: SelectProps) {
  return (
    <div className="flex items-center gap-3">
      {step !== undefined && <StepCircle step={step} done={!!value} />}
      <div className="flex-1">
        <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1 leading-none transition-colors ${value ? "text-[#ff9900]" : "text-gray-400"}`}>
          {label}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full appearance-none rounded-lg px-3 py-2.5 text-sm pr-8 focus:outline-none transition-all border ${
              disabled
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                : value
                ? "bg-[#fff8ed] border-[#ff9900] text-gray-900 focus:ring-2 focus:ring-[#ff9900]/20"
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
            }`}
          >
            <option value="">Seleccionar</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              disabled ? "text-gray-200" : value ? "text-[#ff9900]" : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [tab, setTab]         = useState<FitmentTab>("vehicle");

  const [year, setYear]       = useState("");
  const [make, setMake]       = useState("");
  const [model, setModel]     = useState("");
  const [version, setVersion] = useState("");
  const [width, setWidth]     = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim]         = useState("");

  const canSearch =
    tab === "vehicle"
      ? !!(year && make && model && version)
      : !!(width && profile && rim);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = SLIDES[current];
  const phBg  = PLACEHOLDER_GRADIENTS[current % PLACEHOLDER_GRADIENTS.length];

  return (
    /* pt-[96px] = 32px bar + 64px navbar */
    <section className="pt-[96px] flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 96px)" }}>

      {/* ── LEFT: Image slider ───────────────────────────────────── */}
      <div
        className="relative flex-1 min-h-[52vw] lg:min-h-0 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {s.src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.src} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${phBg}`} />
            )}
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current ? "w-5 h-2 bg-[#ff9900]" : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT: Fitment finder ────────────────────────────────── */}
      <div className="w-full lg:w-[400px] xl:w-[540px] flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.06)] p-6 bg-[#ff9900]">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-0 flex-shrink-0 rounded-t">
          <h2 className="text-gray-900 font-black text-xl leading-tight mb-4 ">
            Encuentra tu llanta <span className="text-[#ff9900]">ideal</span>
          </h2>

          {/* Tabs */}
          <div className="flex gap-0 ">
            {(["vehicle", "size"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-sm font-bold transition-all relative border-b-2 ${
                  tab === t
                    ? "text-gray-900 border-[#ff9900]"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {t === "vehicle" ? "Por vehículo" : "Por medida"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white flex-1 flex flex-col px-7 py-6 gap-4 overflow-y-auto rounded-s">
          {tab === "vehicle" ? (
            <>
              <Select
                label="Año del vehículo"
                value={year}
                options={YEARS}
                onChange={(v) => { setYear(v); setMake(""); setModel(""); setVersion(""); }}
                step={1}
              />
              <Select
                label="Marca del vehículo"
                value={make}
                options={year ? MAKES.default : []}
                onChange={(v) => { setMake(v); setModel(""); setVersion(""); }}
                disabled={!year}
                step={2}
              />
              <Select
                label="Modelo"
                value={model}
                options={make ? (MODELS[make] ?? []) : []}
                onChange={(v) => { setModel(v); setVersion(""); }}
                disabled={!make}
                step={3}
              />
              <Select
                label="Version / Trim"
                value={version}
                options={model ? VERSIONS.default : []}
                onChange={setVersion}
                disabled={!model}
                step={4}
              />

              {/* Progress bar */}
              <div className="flex items-center gap-1.5 mt-1">
                {[year, make, model, version].map((v, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      v ? "bg-[#ff9900]" : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 -mb-1 rounded-s">
                Ingresa la medida que aparece en el flanco de tu llanta actual.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Select label="Ancho"  value={width}   options={TIRE_WIDTHS}   onChange={setWidth} />
                <Select label="Perfil" value={profile} options={TIRE_PROFILES} onChange={setProfile} />
                <Select label='Aro"'   value={rim}     options={RIM_SIZES}     onChange={setRim} />
              </div>
              {width && profile && rim ? (
                <div className="bg-[#fff8ed] border border-[#ff9900]/30 rounded-xl px-4 py-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff9900] mb-1">Medida seleccionada</p>
                  <span className="text-[#ff9900] font-black text-2xl">
                    {width}/{profile} R{rim.replace('"', "")}
                  </span>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Ejemplo</p>
                  <span className="text-gray-400 font-black text-xl">205/55 R16</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="bg-white border-t border-gray-100 px-30 py-5 flex-shrink-0 rounded">
          <a
            href={canSearch ? `/products${tab === "vehicle" ? `?year=${year}&make=${make}&model=${model}&version=${version}` : `?width=${width}&profile=${profile}&rim=${rim}`}` : "#"}
            onClick={(e) => { if (!canSearch) e.preventDefault(); }}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base transition-all ${
              canSearch
                ? "bg-[#ff9900] text-black hover:bg-[#e68a00] active:scale-[0.98] shadow-[0_4px_16px_rgba(255,153,0,0.35)]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed pointer-events-none"
            }`}
          >
            <Search size={18} />
            {canSearch ? "Ver llantas compatibles" : "Completa los campos"}
          </a>
          {canSearch && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Resultados filtrados exactamente para tu vehiculo
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
