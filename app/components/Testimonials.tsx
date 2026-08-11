/* No "use client" needed — static data */

import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Carlos Ramírez",
    city: "Bogotá",
    rating: 5,
    product: "Michelin Primacy 4 · 205/55 R16",
    comment:
      "Excelente atención desde el primer momento. Me asesoraron muy bien sobre qué llanta se ajustaba a mi Mazda3 y el precio fue justo. La instalación tomó menos de una hora y salí con todo calibrado perfectamente.",
    initials: "CR",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Valentina Torres",
    city: "Medellín",
    rating: 5,
    product: "Batería Bosch S4 · 60Ah",
    comment:
      "Llevaba semanas con el carro fallando y nadie me daba un diagnóstico claro. En Merquellantas me revisaron la batería en minutos, me explicaron el problema y en 30 minutos ya estaba resuelto. Muy profesionales.",
    initials: "VT",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Andrés Castaño",
    city: "Cali",
    rating: 5,
    product: "Bridgestone Dueler A/T · 265/70 R16",
    comment:
      "Tengo una camioneta 4x4 y siempre es complicado encontrar la referencia exacta. Aquí la tenían en stock, me hicieron el montaje con balanceo incluido y quedó impecable. Definitivamente mi lugar de confianza.",
    initials: "AC",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Laura Jiménez",
    city: "Barranquilla",
    rating: 5,
    product: "Mobil 1 Sintético 5W-30 · 4L",
    comment:
      "Compré el aceite y me hicieron el cambio en el mismo punto. Súper rápido, limpio y con garantía. Los precios son competitivos y el servicio es mucho mejor que en cualquier concesionario.",
    initials: "LJ",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Miguel Ospina",
    city: "Bucaramanga",
    rating: 5,
    product: "Continental SportContact 7 · 225/45 R17",
    comment:
      "Pedí las llantas por WhatsApp y llegaron a mi ciudad en 48 horas. El empaque estaba perfecto y la referencia era exactamente la que necesitaba para mi Golf. Compra fácil y sin sorpresas.",
    initials: "MO",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Diana Morales",
    city: "Cartagena",
    rating: 5,
    product: "Rines BBS CH-R 17\" · 5x114.3",
    comment:
      "Quería unos rines específicos y pensé que iba a ser imposible encontrarlos en Colombia. Los tenían disponibles y me asesoraron sobre la compatibilidad con mi carro. Llegaron antes de lo prometido.",
    initials: "DM",
    color: "bg-sky-100 text-sky-700",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className="text-[#ff9900]"
          fill="#ff9900"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff9900] mb-3">
            Opiniones verificadas
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Que dicen de nosotros.
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Mas de 15.000 clientes han confiado en nosotros. Calificación promedio 4.9 / 5.
          </p>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all"
            >
              {/* Stars + product */}
              <div className="flex items-start justify-between gap-3">
                <Stars count={r.rating} />
                <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded font-medium text-right leading-tight max-w-[140px]">
                  {r.product}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${r.color}`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Star size={10} className="text-[#ff9900]" fill="#ff9900" />
                    {r.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium border border-gray-200 px-5 py-2.5 rounded-lg hover:border-gray-300"
          >
            Ver todas las opiniones
          </a>
        </div>
      </div>
    </section>
  );
}
