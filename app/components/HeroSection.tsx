"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Car, Truck } from "lucide-react";
import {
  YEARS,
  MAKES_BY_TYPE,
  MODELS,
  MODELS_CAMIONETA,
  MODELS_CAMION,
  VERSIONS,
  BRANDS,
} from "../lib/mockData";

type FitmentTab = "vehicle" | "size";
type SizeType   = "automovil" | "camioneta" | "camion";

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

/* ── Custom vehicle icons ──────────────────────────────────────────────────── */
function PickupIcon({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.7);
  return (
    <svg width={size} height={h} viewBox="0 0 28 20" fill="none"
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {/* cab body */}
      <path d="M1 13 L3 8 L7 5 L15 5 L15 13" />
      {/* windshield */}
      <path d="M4 13 L7 8 L13 8" />
      {/* bed (open top, shorter) */}
      <path d="M15 13 L15 9 L25 9 L27 13" />
      {/* underside rail */}
      <line x1="1" y1="13" x2="27" y2="13" />
      {/* wheels */}
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="21" cy="16.5" r="2.5" />
    </svg>
  );
}

function HeavyTruckIcon({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.7);
  return (
    <svg width={size} height={h} viewBox="0 0 32 22" fill="none"
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {/* trailer box */}
      <rect x="1" y="7" width="18" height="9" rx="1" />
      {/* cab (cab-over square front) */}
      <rect x="19" y="4" width="11" height="12" rx="1.5" />
      {/* windshield band */}
      <line x1="21" y1="5.5" x2="29" y2="5.5" />
      {/* wheels */}
      <circle cx="5"  cy="18.5" r="2.5" />
      <circle cx="14" cy="18.5" r="2.5" />
      <circle cx="25" cy="18.5" r="2.5" />
    </svg>
  );
}

const VEHICLE_TYPES: {
  key: SizeType;
  label: string;
  Icon: (props: { size?: number }) => React.ReactElement;
}[] = [
  { key: "automovil", label: "Automóvil", Icon: ({ size }) => <Car size={size ?? 22} /> },
  { key: "camioneta", label: "4×4 / SUV",  Icon: ({ size }) => <PickupIcon size={size} /> },
  { key: "camion",    label: "Camión",     Icon: ({ size }) => <HeavyTruckIcon size={size} /> },
];

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
  const [tab, setTab]         = useState<FitmentTab>("vehicle");
  const [loaded, setLoaded]   = useState(false);

  /* Shared vehicle type (drives both tabs) */
  const [vehicleType, setVehicleType] = useState<SizeType | "">("automovil");

  /* Vehicle tab */
  const [year, setYear]       = useState("");
  const [make, setMake]       = useState("");
  const [model, setModel]     = useState("");
  const [version, setVersion] = useState("");

  /* Size tab */
  const [width, setWidth]     = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim]         = useState("");

  const handleVehicleTypeChange = (type: SizeType) => {
    if (vehicleType === type) return;
    setVehicleType(type);
    setYear(""); setMake(""); setModel(""); setVersion("");
    setWidth(""); setProfile(""); setRim("");
  };

  const activeSizes  = vehicleType ? SIZES[vehicleType] : null;
  const activeMakes  = vehicleType ? (MAKES_BY_TYPE[vehicleType] ?? []) : [];
  const activeModels: Record<string, string[]> =
    vehicleType === "camioneta" ? MODELS_CAMIONETA :
    vehicleType === "camion"    ? MODELS_CAMION    :
    MODELS;

  const canSearch =
    tab === "vehicle"
      ? !!(vehicleType && year && make && model && version)
      : !!(vehicleType && width && profile && rim);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const searchHref = canSearch
    ? `/products${
        tab === "vehicle"
          ? `?year=${year}&make=${make}&model=${model}&version=${version}&type=${vehicleType}`
          : `?width=${width}&profile=${profile}&rim=${rim}&type=${vehicleType}`
      }`
    : "#";

  const brandLoop = [...BRANDS, ...BRANDS];

  return (
    <section
      className="relative bg-black overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Background video ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          className="w-full h-full object-cover"
          autoPlay muted loop playsInline preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      </div>

      <div className="absolute inset-0 bg-grid-dark pointer-events-none z-0" />
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none z-[1] animate-glow-pulse"
        style={{ background: "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(255,153,0,0.09), transparent)" }}
      />

      {/* ── Hero content ────────────────────────────────────────────── */}
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

        <p className="text-white/45 text-xs sm:text-sm mb-7 animate-hero-reveal-sub tracking-wide">
          +1.600 referencias&nbsp;&nbsp;·&nbsp;&nbsp;Garantía certificada&nbsp;&nbsp;·&nbsp;&nbsp;Envío a todo el país
        </p>

        {/* ── Fitment finder ──────────────────────────────────────── */}
        <div
          className="w-full max-w-[500px] backdrop-blur-2xl bg-white/[0.06] border border-white/[0.13] rounded-3xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.10)] animate-float-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Top shimmer */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/22 to-transparent" />

          {/* Two-column body: left = vehicle type, right = tabs + form */}
          <div className="flex">

            {/* ── LEFT: Vehicle type selector ──────────────────────── */}
            <div className="w-[100px] sm:w-[112px] flex-shrink-0 border-r border-white/[0.08] flex flex-col">
              <div className="px-3 pt-4 pb-2.5">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35 leading-none">
                  Tipo
                </p>
              </div>
              <div className="flex flex-col flex-1 px-2 pb-4 gap-2">
                {VEHICLE_TYPES.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleVehicleTypeChange(key)}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-xl py-3.5 px-1 text-center border transition-all duration-200 ${
                      vehicleType === key
                        ? "bg-[#ff9900]/15 border-[#ff9900]/50 text-[#ff9900]"
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/65"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[9px] font-bold leading-tight text-center px-0.5">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Tabs + form ────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col">

              {/* Tabs */}
              <div className="flex border-b border-white/[0.08] px-5">
                {(["vehicle", "size"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-[14px] text-[12px] font-bold transition-all relative border-b-2 -mb-px ${
                      tab === t
                        ? "text-white border-[#ff9900]"
                        : "text-white/30 border-transparent hover:text-white/60"
                    }`}
                  >
                    {t === "vehicle" ? "Por vehículo" : "Por medida"}
                  </button>
                ))}
              </div>

              {/* Form body */}
              <div className="px-5 py-4 flex flex-col gap-4">

                {!vehicleType && (
                  <p className="text-[11px] text-white/30 text-center py-1">
                    Selecciona el tipo de vehículo
                  </p>
                )}

                {tab === "vehicle" ? (
                  /* ── Por vehículo ─────────────────────────────────── */
                  <>
                    <Select
                      label="Año del vehículo" value={year} options={vehicleType ? YEARS : []}
                      onChange={(v) => { setYear(v); setMake(""); setModel(""); setVersion(""); }}
                      disabled={!vehicleType} step={1}
                    />
                    <Select
                      label="Marca" value={make} options={year ? activeMakes : []}
                      onChange={(v) => { setMake(v); setModel(""); setVersion(""); }}
                      disabled={!year} step={2}
                    />
                    <Select
                      label="Modelo" value={model} options={make ? (activeModels[make] ?? []) : []}
                      onChange={(v) => { setModel(v); setVersion(""); }}
                      disabled={!make} step={3}
                    />
                    <Select
                      label="Versión / Trim" value={version} options={model ? VERSIONS.default : []}
                      onChange={setVersion}
                      disabled={!model} step={4}
                    />
                    <div className="flex items-center gap-1.5">
                      {[year, make, model, version].map((v, i) => (
                        <div key={i} className={`flex-1 h-[2px] rounded-full transition-all duration-300 ${v ? "bg-[#ff9900]" : "bg-white/10"}`} />
                      ))}
                    </div>
                  </>
                ) : (
                  /* ── Por medida ───────────────────────────────────── */
                  <>
                    <Select
                      label="Ancho" value={width} options={activeSizes?.widths ?? []}
                      onChange={setWidth} disabled={!vehicleType}
                    />
                    <Select
                      label="Perfil" value={profile} options={activeSizes?.profiles ?? []}
                      onChange={setProfile} disabled={!vehicleType}
                    />
                    <Select
                      label='Aro"' value={rim} options={activeSizes?.rims ?? []}
                      onChange={setRim} disabled={!vehicleType}
                    />

                    {/* Live size display */}
                    <div className={`rounded-2xl px-4 py-3 text-center border transition-colors duration-300 ${
                      width && profile && rim
                        ? "bg-[#ff9900]/10 border-[#ff9900]/30"
                        : "bg-white/[0.03] border-white/[0.09]"
                    }`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1.5">Tu medida</p>
                      <div
                        className="flex items-baseline justify-center font-black tabular-nums"
                        style={{ fontSize: "clamp(1.4rem, 4vw, 1.9rem)" }}
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
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-5 pt-4 border-t border-white/[0.07]">
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

      {/* ── Brand logo strip ────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-14 flex items-center border-t border-gray-100 bg-white overflow-hidden">
        <div className="flex-1 overflow-hidden min-w-0">
          <div
            className="flex items-center"
            style={{ animation: "marquee 36s linear infinite", width: "max-content" }}
          >
            {brandLoop.map((brand, i) => (
              <div key={i} className="flex-none flex items-center justify-center px-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.url}
                  alt={brand.name}
                  className="max-h-7 max-w-[88px] w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const span = document.createElement("span");
                    span.textContent = brand.name;
                    span.style.cssText =
                      "font-size:9px;font-weight:900;letter-spacing:0.12em;color:rgba(0,0,0,0.35);text-transform:uppercase;white-space:nowrap;";
                    el.parentElement?.appendChild(span);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
