/* No "use client" needed — pure static */

const STATS = [
  { value: "32+",    label: "Años de experiencia",     sub: "Desde 1992 sirviendo a Colombia" },
  { value: "26",     label: "Ciudades con presencia",  sub: "De Barranquilla a Pasto" },
  { value: "15.000+", label: "Clientes satisfechos",   sub: "Calificación 4.9 / 5" },
  { value: "1.600+", label: "Referencias disponibles", sub: "Marcas líderes mundiales" },
];

const CITIES = [
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena",
  "Cúcuta", "Ibagué", "Pereira", "Manizales", "Santa Marta", "Villavicencio",
  "Pasto", "Montería", "Neiva", "Armenia", "Popayán", "Sincelejo",
  "Tunja", "Valledupar", "Riohacha", "Quibdó", "Florencia", "Mocoa",
  "Arauca", "Yopal",
];

export default function CityStats() {
  return (
    <section className="bg-[#111111] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff9900] mb-3">
              Presencia nacional
            </p>
            <h2 className="text-3xl sm:text-5xl font-black leading-tight">
              Mas de tres décadas
              <br />
              <span className="text-[#ff9900]">al servicio de Colombia.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Lo que comenzó como un pequeño local en Bogotá hoy es la red de
            repuestos automotrices mas extensa del pais, con presencia activa en
            26 ciudades y alianzas con los principales distribuidores globales.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10 rounded-2xl overflow-hidden mb-14">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`p-8 flex flex-col gap-1 ${
                i < STATS.length - 1 ? "border-r border-white/10" : ""
              } ${i < 2 ? "border-b border-white/10 lg:border-b-0" : ""}`}
            >
              <div className="text-4xl font-black text-[#ff9900]">{s.value}</div>
              <div className="text-sm font-bold text-white mt-1">{s.label}</div>
              <div className="text-xs text-gray-500 leading-snug">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Cities tag cloud */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-5">
            Ciudades con presencia
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <span
                key={city}
                className="text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-full hover:border-[#ff9900]/40 hover:text-[#ff9900] transition-colors cursor-default"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
