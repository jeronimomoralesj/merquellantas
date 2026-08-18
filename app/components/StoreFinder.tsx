"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, ChevronDown, ArrowRight } from "lucide-react";

interface Store {
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
}

const STORES: Record<string, Store[]> = {
  Bogotá: [
    { name: "Merquellantas Autopista Norte", address: "Autopista Norte Km 7, Local 102", phone: "601 234-5678", hours: "Lun–Sáb 7:00–19:00 · Dom 8:00–15:00", services: ["Venta", "Instalacion", "Balanceo", "Alineacion"] },
    { name: "Merquellantas Soacha",           address: "Cra 7 # 40-12, Soacha",          phone: "601 345-6789", hours: "Lun–Sáb 7:30–18:30 · Dom 9:00–14:00", services: ["Venta", "Instalacion", "Balanceo"] },
    { name: "Merquellantas Fontibon",         address: "Av. El Dorado # 96-14, Fontibon", phone: "601 456-7890", hours: "Lun–Vie 8:00–18:00 · Sáb 8:00–16:00", services: ["Venta", "Instalacion", "Rines", "Baterias"] },
  ],
  Medellín: [
    { name: "Merquellantas El Poblado", address: "Cra 43A # 14-109, El Poblado", phone: "604 234-5678", hours: "Lun–Sáb 8:00–18:30 · Dom 9:00–14:00", services: ["Venta", "Instalacion", "Balanceo", "Lubricantes"] },
    { name: "Merquellantas Itagüí",     address: "Cra 52 # 38-45, Itagui",      phone: "604 345-6789", hours: "Lun–Sáb 7:30–18:00",                    services: ["Venta", "Instalacion", "Alineacion"] },
  ],
  Cali: [
    { name: "Merquellantas Ciudad Jardin", address: "Av. Roosevelt # 38-14", phone: "602 234-5678", hours: "Lun–Sáb 8:00–18:30 · Dom 9:00–14:00", services: ["Venta", "Instalacion", "Balanceo"] },
  ],
  Barranquilla: [
    { name: "Merquellantas Murillo", address: "Cra 46 # 70-34", phone: "605 234-5678", hours: "Lun–Sáb 8:00–18:00 · Dom 9:00–13:00", services: ["Venta", "Instalacion", "Lubricantes"] },
  ],
  Bucaramanga: [
    { name: "Merquellantas Cabecera", address: "Cra 35 # 54-18", phone: "607 234-5678", hours: "Lun–Sáb 8:00–18:00", services: ["Venta", "Instalacion", "Balanceo"] },
  ],
  Cartagena: [
    { name: "Merquellantas Manga", address: "Av. El Lago # 12-45, Manga", phone: "605 345-6789", hours: "Lun–Sáb 8:00–18:00 · Dom 9:00–13:00", services: ["Venta", "Instalacion", "Rines"] },
  ],
};

const CITIES = Object.keys(STORES);

export default function StoreFinder() {
  const [city, setCity] = useState("Bogotá");
  const stores = STORES[city] ?? [];

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Merquito */}
        <div className="relative mb-8 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0500 0%, #7a2e00 100%)" }}>
          <div className="flex items-end justify-between gap-4 px-8 pt-8 pb-0">
            <div className="pb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff9900] mb-2">
                Red de tiendas
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Encuentra tu tienda<br />mas cercana
              </h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merquito.png"
              alt="Merquito"
              className="h-44 sm:h-52 w-auto object-contain flex-shrink-0 self-end"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
        </div>

        {/* City selector */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                city === c
                  ? "bg-[#ff9900] text-black border-[#ff9900]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#ff9900]/40 hover:text-[#ff9900]"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 font-semibold focus:outline-none focus:border-[#ff9900] bg-white hover:border-[#ff9900]/40 transition-colors"
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        {/* Store cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div
              key={store.name}
              className="border border-gray-100 rounded-2xl p-6 hover:border-[#ff9900]/30 hover:shadow-[0_4px_20px_rgba(255,153,0,0.08)] transition-all group"
            >
              {/* Orange left accent on hover */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-[3px] self-stretch bg-[#ff9900] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#ff9900] transition-colors">
                  {store.name}
                </h3>
              </div>

              <ul className="space-y-2.5 mb-5 ml-[7px]">
                <li className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-[#ff9900] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 leading-snug">{store.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={13} className="text-[#ff9900] flex-shrink-0" />
                  <a href={`tel:+57${store.phone.replace(/\s/g, "")}`} className="text-sm text-gray-600 hover:text-[#ff9900] transition-colors">
                    {store.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={13} className="text-[#ff9900] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500 leading-snug">{store.hours}</span>
                </li>
              </ul>

              <div className="flex flex-wrap gap-1.5 mb-4 ml-[7px]">
                {store.services.map((s) => (
                  <span key={s} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 group-hover:border-[#ff9900]/20 group-hover:bg-[#ff9900]/5 group-hover:text-[#ff9900] px-2 py-0.5 rounded font-medium transition-colors">
                    {s}
                  </span>
                ))}
              </div>

              <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 group-hover:text-[#ff9900] transition-colors ml-[7px]">
                <MapPin size={13} />
                Ver en mapa
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
