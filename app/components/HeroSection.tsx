"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { YEARS, MAKES, MODELS, VERSIONS, BRANDS } from "../lib/mockData";

type FitmentTab = "vehicle" | "size";
type SizeType   = "automovil" | "camioneta" | "camion";

const SLIDES = [
  { src: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--6c8d35d0-2423-43f7-9ce4-575277fc9302/continental-cst-keyvisual-2025.png?preferwebp=true&quality=85" },
  { src: "https://s37629.pcdn.co/wp-content/uploads/2024/12/Hankook-iON-Race-Formula-E-1400.jpg" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/ca259746058331.5847e64731213.jpg" },
];

const SIZES: Record<SizeType, { widths: string[]; profiles: string[]; rims: string[] }> = {
  automovil: {
    widths:   ["155","165","175","185","195","205","215","225","235","245","255"],
    profiles: ["35","40","45","50","55","60","65","70","75"],
    rims:     ['13"','14"','15"','16"','17"','18"','19"','20"'],
  },
  camioneta: {
    widths:   ["215","225","235","245","255","265","275","285","295"],
    profiles: ["55","60","65","70","75","80"],
    rims:     ['15"','16"','17"','18"','20"','22"'],
  },
  camion: {
    widths:   ["215","225","235","245","255","265","275","285","295","305","315","325","385"],
    profiles: ["55","60","65","70","75","80","85"],
    rims:     ['17.5"','19.5"','22.5"'],
  },
};

const SIZE_TYPE_LABELS: Record<SizeType, string> = {
  automovil: "Automóvil",
  camioneta: "Camioneta",
  camion:    "Camión",
};

/* ── Step indicator ─────────────────────────────────────────────────────── */
function StepCircle({ step, done }: { step: number; done: boolean }) {
  return (
    <div
      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black transition-all ${
        done ? "bg-[#ff9900] text-black" : "border border-white/20 text-white/30"
      }`}
    >
      {done ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : step}
    </div>
  );
}

/* ── Glassmorphic select ────────────────────────────────────────────────── */
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
      <div className="flex-1 min-w-0">
        <label
          className={`block text-[10px] font-bold uppercase tracking-widest mb-1 leading-none transition-colors ${
            value ? "text-[#ff9900]" : "text-white/40"
          }`}
        >
          {label}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full appearance-none rounded-xl px-3 py-2.5 text-sm pr-8 focus:outline-none transition-all border ${
              disabled
                ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                : value
                ? "bg-[#ff9900]/10 border-[#ff9900]/40 text-white focus:ring-2 focus:ring-[#ff9900]/20"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 focus:border-[#ff9900]/50 focus:ring-2 focus:ring-[#ff9900]/10"
            }`}
          >
            <option value="" className="bg-[#111] text-white/60">Seleccionar</option>
            {options.map((o) => (
              <option key={o} value={o} className="bg-[#111] text-white">{o}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              disabled ? "text-white/10" : value ? "text-[#ff9900]" : "text-white/30"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [tab, setTab]         = useState<FitmentTab>("vehicle");
  const [loaded, setLoaded]   = useState(false);

  /* Vehicle tab */
  const [year, setYear]       = useState("");
  const [make, setMake]       = useState("");
  const [model, setModel]     = useState("");
  const [version, setVersion] = useState("");

  /* Size tab */
  const [sizeType, setSizeType] = useState<SizeType | "">("");
  const [width, setWidth]       = useState("");
  const [profile, setProfile]   = useState("");
  const [rim, setRim]           = useState("");

  const activeSizes = sizeType ? SIZES[sizeType] : null;

  const canSearch =
    tab === "vehicle"
      ? !!(year && make && model && version)
      : !!(sizeType && width && profile && rim);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next]);

  const searchHref = canSearch
    ? `/products${
        tab === "vehicle"
          ? `?year=${year}&make=${make}&model=${model}&version=${version}`
          : `?width=${width}&profile=${profile}&rim=${rim}&type=${sizeType}`
      }`
    : "#";

  /* duplicate brands for seamless marquee */
  const brandLoop = [...BRANDS, ...BRANDS];

  return (
    <section
      className="relative bg-black overflow-hidden"
      style={{ minHeight: "100svh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Full-bleed background slides ──────────────────────────── */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black/68" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </div>
      ))}

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-dark pointer-events-none z-0" />

      {/* Orange ambient glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none z-[1] animate-glow-pulse"
        style={{ background: "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(255,153,0,0.09), transparent)" }}
      />

      {/* ── Centred hero content ────────────────────────────────────── */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-4 sm:px-6 pt-[96px] pb-20 text-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Headline */}
        <h1
          className="font-black text-white leading-[0.9] tracking-[-0.02em] mb-3 animate-hero-reveal"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          Encuentra tu llanta{" "}
          <span className="text-[#ff9900]">ideal</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/45 text-xs sm:text-sm mb-7 animate-hero-reveal-sub tracking-wide">
          +1.600 referencias&nbsp;&nbsp;·&nbsp;&nbsp;Garantía certificada&nbsp;&nbsp;·&nbsp;&nbsp;Envío a todo el país
        </p>

        {/* ── Liquid-glass fitment finder ──────────────────────────── */}
        <div
          className="w-full max-w-[440px] backdrop-blur-2xl bg-white/[0.06] border border-white/[0.13] rounded-3xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.10)] animate-float-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Top shimmer */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/22 to-transparent" />

          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] px-6">
            {(["vehicle", "size"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-bold transition-all relative border-b-2 -mb-px ${
                  tab === t ? "text-white border-[#ff9900]" : "text-white/30 border-transparent hover:text-white/60"
                }`}
              >
                {t === "vehicle" ? "Por vehículo" : "Por medida"}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="px-6 py-5 flex flex-col gap-4">

            {tab === "vehicle" ? (
              /* ── Vehicle tab ──────────────────────────────────────── */
              <>
                <Select label="Año del vehículo" value={year} options={YEARS}
                  onChange={(v) => { setYear(v); setMake(""); setModel(""); setVersion(""); }} step={1} />
                <Select label="Marca del vehículo" value={make} options={year ? MAKES.default : []}
                  onChange={(v) => { setMake(v); setModel(""); setVersion(""); }} disabled={!year} step={2} />
                <Select label="Modelo" value={model} options={make ? (MODELS[make] ?? []) : []}
                  onChange={(v) => { setModel(v); setVersion(""); }} disabled={!make} step={3} />
                <Select label="Versión / Trim" value={version} options={model ? VERSIONS.default : []}
                  onChange={setVersion} disabled={!model} step={4} />
                <div className="flex items-center gap-1.5">
                  {[year, make, model, version].map((v, i) => (
                    <div key={i} className={`flex-1 h-[2px] rounded-full transition-all duration-300 ${v ? "bg-[#ff9900]" : "bg-white/10"}`} />
                  ))}
                </div>
              </>
            ) : (
              /* ── Size tab ─────────────────────────────────────────── */
              <>
                {/* Step 1 — vehicle type */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    Tipo de vehículo
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["automovil","camioneta","camion"] as SizeType[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSizeType(key); setWidth(""); setProfile(""); setRim(""); }}
                        className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                          sizeType === key
                            ? "bg-[#ff9900]/15 border-[#ff9900]/50 text-[#ff9900]"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60"
                        }`}
                      >
                        {SIZE_TYPE_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 — selectors + sidewall image side by side */}
                <div className="flex gap-4 items-start">

                  {/* Stacked selectors */}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <Select label="Ancho"  value={width}   options={activeSizes?.widths   ?? []} onChange={setWidth}   disabled={!sizeType} />
                    <Select label="Perfil" value={profile} options={activeSizes?.profiles ?? []} onChange={setProfile} disabled={!sizeType} />
                    <Select label='Aro"'   value={rim}     options={activeSizes?.rims     ?? []} onChange={setRim}     disabled={!sizeType} />
                  </div>

                  {/* Sidewall reference — bigger, shown once type is chosen */}
                  <div className="flex-shrink-0 w-[108px] flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://cdn.create.vista.com/api/media/small/721848372/stock-photo-tire-sidewall-marking-numbers-letters-tire-meaning-car-tire-isolated"
                      alt="Cómo leer la medida de tu llanta"
                      className={`w-full h-auto rounded-xl transition-opacity duration-300 ${sizeType ? "opacity-85" : "opacity-25"}`}
                      loading="lazy"
                    />
                    <p className="text-[9px] text-white/30 text-center leading-relaxed">
                      {sizeType
                        ? <>La medida está<br />en el flanco<br />lateral de la llanta</>
                        : <>Selecciona el<br />tipo de vehículo</>
                      }
                    </p>
                  </div>
                </div>

                {/* Live size display */}
                <div className={`rounded-2xl px-5 py-3 text-center border transition-colors duration-300 ${
                  width && profile && rim
                    ? "bg-[#ff9900]/10 border-[#ff9900]/30"
                    : "bg-white/[0.03] border-white/[0.09]"
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1.5">Tu medida</p>
                  <div
                    className="flex items-baseline justify-center font-black tabular-nums"
                    style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                  >
                    <span className={`transition-colors duration-200 ${width   ? "text-[#ff9900]" : "text-white/12"}`}>{width   || "—"}</span>
                    <span className="text-white/15 mx-[3px] text-base">/</span>
                    <span className={`transition-colors duration-200 ${profile ? "text-[#ff9900]" : "text-white/12"}`}>{profile || "—"}</span>
                    <span className="text-white/15 mx-[3px] text-base"> R</span>
                    <span className={`transition-colors duration-200 ${rim     ? "text-[#ff9900]" : "text-white/12"}`}>{rim ? rim.replace('"', "") : "—"}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 pt-4 border-t border-white/[0.07]">
            <a
              href={searchHref}
              onClick={(e) => { if (!canSearch) e.preventDefault(); }}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all ${
                canSearch
                  ? "bg-[#ff9900]/95 backdrop-blur-sm text-black hover:bg-[#e68a00] active:scale-[0.98] border border-[#ffb84d]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_20px_rgba(255,153,0,0.30)]"
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/8"
              }`}
            >
              <Search size={16} />
              {canSearch ? "Ver llantas compatibles" : "Completa los campos"}
            </a>
          </div>
        </div>
      </div>

      {/* ── Brand logo strip — anchored at hero bottom ─────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-14 flex items-center border-t border-white/[0.08] backdrop-blur-sm bg-black/25 overflow-hidden">

        {/* Scrolling logos */}
        <div className="flex-1 overflow-hidden min-w-0">
          <div
            className="flex items-center"
            style={{ animation: "marquee 36s linear infinite", width: "max-content" }}
          >
            {brandLoop.map((brand, i) => (
              <div
                key={i}
                className="flex-none flex items-center justify-center px-7"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.url}
                  alt={brand.name}
                  className="max-h-7 max-w-[88px] w-auto object-contain opacity-55 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const span = document.createElement("span");
                    span.textContent = brand.name;
                    span.style.cssText =
                      "font-size:9px;font-weight:900;letter-spacing:0.12em;color:rgba(255,255,255,0.22);text-transform:uppercase;white-space:nowrap;";
                    el.parentElement?.appendChild(span);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots — right side of strip */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pr-5 pl-3 border-l border-white/[0.07]">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all rounded-full ${
                i === current ? "w-5 h-1.5 bg-[#ff9900]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.25)]"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={17} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.25)]"
        aria-label="Siguiente slide"
      >
        <ChevronRight size={17} />
      </button>
    </section>
  );
}
