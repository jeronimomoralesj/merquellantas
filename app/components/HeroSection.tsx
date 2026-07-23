"use client";

import { useState } from "react";
import { Search, Truck, ShieldCheck, Star, ChevronRight, ChevronDown } from "lucide-react";
import { YEARS, MAKES, MODELS, VERSIONS, TIRE_WIDTHS, TIRE_PROFILES, RIM_SIZES } from "../lib/mockData";

type FitmentTab = "vehicle" | "size";

const FEATURES = [
  { icon: Truck, text: "Envío Express 24h en Bogotá" },
  { icon: ShieldCheck, text: "Garantía Certificada hasta 3 años" },
  { icon: Star, text: "+15.000 clientes satisfechos" },
];

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}

function StyledSelect({ label, value, options, onChange, disabled }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff9900] transition-all cursor-pointer pr-10 ${
          disabled
            ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
            : value
            ? "border-[#ff9900]/50 bg-zinc-900"
            : "border-zinc-700 hover:border-zinc-500"
        }`}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
          disabled ? "text-zinc-700" : "text-zinc-400"
        }`}
      />
    </div>
  );
}

export default function HeroSection() {
  const [tab, setTab] = useState<FitmentTab>("vehicle");

  // Vehicle tab state
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [version, setVersion] = useState("");

  // Size tab state
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim] = useState("");

  const vehicleComplete = year && make && model && version;
  const sizeComplete = width && profile && rim;
  const canSearch = tab === "vehicle" ? !!vehicleComplete : !!sizeComplete;

  const makeOptions = MAKES.default;
  const modelOptions = make ? (MODELS[make] ?? []) : [];
  const versionOptions = model ? VERSIONS.default : [];

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[#0f0f10]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff9900]/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff9900]/3 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/3 pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Column 1 — Value proposition */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff9900]/30 bg-[#ff9900]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-pulse" />
              <span className="text-[#ff9900] text-xs font-semibold tracking-wider uppercase">
                Distribuidores Oficiales · Colombia
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6">
              <span className="text-gradient block">Rendimiento</span>
              <span className="text-gradient block">Redefinido.</span>
              <span className="text-gradient-brand block mt-2">El Ajuste</span>
              <span className="text-gradient-brand block">Perfecto.</span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
              Encuentra las llantas, lubricantes, baterías y rines exactos para
              tu vehículo. Envío express, instalación certificada y garantía
              real.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ff9900]/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#ff9900]" />
                  </div>
                  <span className="text-zinc-300 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {[
                { value: "1.600+", label: "Marcas" },
                { value: "15K+", label: "Clientes" },
                { value: "99%", label: "Satisfacción" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-zinc-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 — Fitment Finder Widget */}
          <div className="glass rounded-2xl p-1 brand-glow">
            <div className="bg-[#111113] rounded-xl overflow-hidden">
              {/* Widget header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/8">
                <div className="flex items-center gap-2 mb-1">
                  <Search size={18} className="text-[#ff9900]" />
                  <h2 className="text-white font-bold text-lg">
                    Encuentra tu ajuste perfecto
                  </h2>
                </div>
                <p className="text-zinc-500 text-sm">
                  Busca por vehículo o por medida directa
                </p>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4">
                <div className="grid grid-cols-2 gap-1 bg-zinc-900 rounded-xl p-1">
                  {(["vehicle", "size"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        tab === t
                          ? "bg-[#ff9900] text-black shadow-lg"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {t === "vehicle" ? "Por Vehículo" : "Por Medida"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form body */}
              <div className="p-6 space-y-3">
                {tab === "vehicle" ? (
                  <>
                    <StyledSelect
                      label="Año del vehículo"
                      value={year}
                      options={YEARS}
                      onChange={(v) => { setYear(v); setMake(""); setModel(""); setVersion(""); }}
                    />
                    <StyledSelect
                      label="Marca del vehículo"
                      value={make}
                      options={year ? makeOptions : []}
                      onChange={(v) => { setMake(v); setModel(""); setVersion(""); }}
                      disabled={!year}
                    />
                    <StyledSelect
                      label="Modelo"
                      value={model}
                      options={modelOptions}
                      onChange={(v) => { setModel(v); setVersion(""); }}
                      disabled={!make}
                    />
                    <StyledSelect
                      label="Versión / Trim"
                      value={version}
                      options={versionOptions}
                      onChange={setVersion}
                      disabled={!model}
                    />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <StyledSelect
                        label="Ancho"
                        value={width}
                        options={TIRE_WIDTHS}
                        onChange={setWidth}
                      />
                      <StyledSelect
                        label="Perfil"
                        value={profile}
                        options={TIRE_PROFILES}
                        onChange={setProfile}
                      />
                      <StyledSelect
                        label='Rin"'
                        value={rim}
                        options={RIM_SIZES}
                        onChange={setRim}
                      />
                    </div>
                    {width && profile && rim && (
                      <div className="glass rounded-xl px-4 py-3 text-center animate-fade-in">
                        <span className="text-[#ff9900] font-bold text-lg">
                          {width}/{profile} R{rim.replace('"', "")}
                        </span>
                        <p className="text-zinc-500 text-xs mt-0.5">Medida seleccionada</p>
                      </div>
                    )}
                    {!(width || profile || rim) && (
                      <div className="border border-dashed border-zinc-800 rounded-xl px-4 py-3 text-center">
                        <span className="text-zinc-600 text-sm">
                          Ejemplo: <span className="text-zinc-400">205/55 R16</span>
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* CTA */}
                <button
                  disabled={!canSearch}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                    canSearch
                      ? "bg-[#ff9900] text-black hover:bg-[#e68a00] brand-glow-sm hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  <Search size={18} />
                  Encontrar compatibles
                  {canSearch && <ChevronRight size={18} />}
                </button>

                {/* Small print */}
                <p className="text-zinc-600 text-xs text-center">
                  {tab === "vehicle"
                    ? "Resultados filtrados para compatibilidad exacta con tu vehículo"
                    : "Mostrará todos los productos disponibles en esta medida"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <a
            href="#categories"
            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <span className="text-xs uppercase tracking-wider">Explorar</span>
            <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-[#ff9900] rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
