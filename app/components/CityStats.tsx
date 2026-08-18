/* No "use client" needed — pure static */

const STATS = [
  { value: "32+",     label: "Años de experiencia"     },
  { value: "1.600+",  label: "Referencias disponibles" },
  { value: "15.000+", label: "Clientes satisfechos"    },
];

export default function CityStats() {
  return (
    <section className="bg-[#111111] text-white py-1 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="font-black text-white tracking-tight leading-[0.9] mb-4"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
        >
          Más de 3 décadas<br />
          <span className="text-[#ff9900]">en la industria.</span>
        </h2>

        <p className="text-white/38 text-sm sm:text-[15px] max-w-xs sm:max-w-sm mx-auto mb-14 leading-relaxed">
          Desde 1992, la red de repuestos automotrices de confianza en Colombia.
        </p>

      </div>
    </section>
  );
}
