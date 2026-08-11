import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const IMAGE_1 =
  "https://mqplatform.blob.core.windows.net/attributeimage/4f823c6b-8cf2-5166-e51b-1d82a196b9af.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T17%3A24%3A13Z&se=2026-07-24T17%3A24%3A13Z&sp=rwdxylacuptfi&sig=Ulu5wtVWbmOF97oSWqSOfmShhWKrbvH5%2BmoqbA0UiPQ%3D";
const IMAGE_2 =
  "https://mqplatform.blob.core.windows.net/attributeimage/042a230a-5f20-f689-ebf0-8660ab30a70c.png?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T17%3A24%3A21Z&se=2026-07-24T17%3A24%3A21Z&sp=rwdxylacuptfi&sig=Yr%2FXlcdyZvIIhTHGOl0mbGxYfRViUCmwW2OrgYp5mA8%3D";

const STATS = [
  { value: "32+", label: "Anos de experiencia" },
  { value: "27", label: "Tiendas a nivel nacional" },
  { value: "8.000+", label: "Clientes satisfechos" },
];

const PILLARS = [
  {
    title: "MISION",
    body: "Merquellantas es una organizacion que provee productos y servicios para vehiculos a nivel nacional. Es un aliado estrategico de negocios rentables, con procesos tecnificados, innovadores y marcas lideres en el mercado, aportando al crecimiento de los grupos de interes.",
    accent: true,
  },
  {
    title: "VISION",
    body: "Unidos alcanzaremos caminos inimaginables, rodemos juntos.",
    accent: false,
  },
  {
    title: "NUESTRO PROPOSITO",
    body: "En Merquellantas impulsamos el crecimiento de interes, hacia un futuro mejor.",
    accent: false,
  },
  {
    title: "NUESTRA PROMESA",
    body: "Vendemos productos de calidad y marcas reconocidas, a precios justos en nuestra red nacional.",
    accent: false,
  },
];

const VALUES = [
  {
    name: "Transparencia",
    desc: "Inspiramos honestidad, somos claros en lo acordado. \"Todas las cartas sobre la mesa\".",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: "Cercania",
    desc: "Creamos lazos de confianza y familiaridad, que son dificiles de romper.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Coherencia",
    desc: "Somos fieles entre lo que pensamos, decimos y hacemos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    name: "Pasion",
    desc: "Vibramos y disfrutamos cada momento.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const HISTORY = [
  {
    year: "2013",
    text: "Buscando su Crecimiento continuo, Merquellantas decide unirse a una de las mas grandes llanteras a nivel internacional. CONTINENTAL TYRE, socio estrategico al dia de hoy.",
  },
  {
    year: "2008",
    text: "En Octubre de 2008 se da la apertura de la Zona de los llanos, la cual cuenta con dos sedes: Villavicencio y Yopal.",
  },
  {
    year: "2008",
    text: "En Julio de 2008 iniciamos labores en la ciudad de Valledupar. Esta sede pertenece a la Zona Atlantica.",
  },
  {
    year: "2003",
    text: "En enero de 2003 se adquiere la bodega principal ubicada en la Av. Centenario # 116 - 40. Fontibon (Bogota), en donde actualmente funciona la sede de Bogota y las instalaciones de administracion nacional.",
  },
  {
    year: "2002",
    text: "La compania comercializa la marca Pirelli, lograndola posicionarse como una de las preferidas en el mercado colombiano. La Sede de Bucaramanga inicio labores en enero de 2002.",
  },
  {
    year: "2001",
    text: "En Enero 1 de 2001 se registro como MERQUELLANTAS SA por la vinculacion de mas socios.",
  },
  {
    year: "2000",
    text: "En julio del 2000 abrimos puertas en Barranquilla, con un punto de venta ubicado en la avenida al aeropuerto, desde donde se gestiona el funcionamiento de las Sedes de Cartagena y Santa Marta.",
  },
  {
    year: "1999",
    text: "En El Mes de Junio de 1999 se empezo a comercializar la marca BRIDGESTONE. A partir de esta fecha se posiciona como uno de los mejores distribuidores de Bridgestone-Firestone para Colombia.",
  },
  {
    year: "1999",
    text: "El mercado exigio tener mayor volumen de inventario disponible, por lo que surgio la necesidad de ocupar una bodega mas grande con la prestacion de un servicio mas completo: Alineacion, balanceo y montaje de llantas, por lo cual se traslado a las instalaciones en Fontibon, calle 22 # 127-85.",
  },
  {
    year: "1993",
    text: "El 16 de julio de 1993 abrimos puertas en Ibague casa matriz: las sedes: Girardot, Armenia, Pereira, Neiva y Manizales.",
  },
  {
    year: "1992",
    text: "Se trabajo sobre pedido. Su producto principal era el servicio de reencauche, con el tiempo fue incorporando la llanta nueva. Se logro conseguir la distribucion de llantas FIRESTONE.",
  },
  {
    year: "1992",
    text: "MERCA LLANTAS BOGOTA LTDA nacio en junio de 1992, compuesta por cuatro socios todos con experiencia en el ramo de las llantas. Empezo labores con una bodega de 300 m², un escritorio y dos sillas para atender a los pocos clientes que llegaban.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#0f0f10] pt-[96px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="pb-16 lg:pb-20">
              <span className="inline-block text-[#ff9900] text-xs font-black uppercase tracking-[0.2em] mb-4">
                32 anos de historia
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
                Quienes<br />
                <span className="text-[#ff9900]">Somos</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                Somos todo lo que su vehiculo necesita. Mas de tres decadas
                impulsando a Colombia sobre ruedas de calidad.
              </p>
              <div className="flex gap-8 mt-10">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-black text-[#ff9900]">{s.value}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image 1 */}
            <div className="relative h-72 sm:h-96 lg:h-[480px] rounded-t-2xl overflow-hidden self-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGE_1}
                alt="Merquellantas tienda"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10]/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Who we are ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block text-[#ff9900] text-xs font-black uppercase tracking-[0.2em] mb-3">
                Nuestra historia
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
                Mas de 32 anos al<br />servicio de Colombia
              </h2>
              <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                <p>
                  Somos un comercializador de llantas, servicio de reencauche, baterias,
                  lubricantes y todo lo que su vehiculo necesita, contamos con mas de 32 anos
                  de experiencia en el mercado colombiano, destacandonos como una compania
                  lider en el mercado colombiano.
                </p>
                <p>
                  Contamos con una red de servicio a nivel nacional con 27 tiendas en todo el
                  territorio, que nos permite brindarle una solucion a su medida.
                </p>
                <p>
                  Lo mejor es que tenemos diferentes formas de pago, desde contado hasta
                  plazos superiores a 12 meses.
                </p>
                <p className="font-bold text-gray-800">
                  Visitenos y descubra los mejores productos para su vehiculo con marcas Premium
                  para tu auto, camioneta, volqueta, tracto mula, bus o cualquier vehiculo
                  industrial o agricola.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 bg-[#ff9900] text-black font-black text-sm px-6 py-3 rounded-xl">
                Somos todo lo que su vehiculo necesita
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGE_2}
                alt="Merquellantas productos"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0f0f10]/80 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-white font-black text-sm">Red nacional</p>
                <p className="text-zinc-400 text-xs">27 tiendas en todo el territorio colombiano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision / Purpose / Promise ── */}
      <section className="bg-[#0f0f10] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-[#ff9900] text-xs font-black uppercase tracking-[0.2em] mb-3">
              Nuestros pilares
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Lo que nos mueve
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className={`rounded-2xl p-8 border ${
                  p.accent
                    ? "bg-[#ff9900] border-[#ff9900] text-black"
                    : "bg-[#111113] border-white/[0.06] text-white"
                }`}
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${
                    p.accent ? "text-black/60" : "text-[#ff9900]"
                  }`}
                >
                  {p.title}
                </p>
                <p
                  className={`text-base leading-relaxed font-medium ${
                    p.accent ? "text-black" : "text-zinc-300"
                  }`}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Corporate Values ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-[#ff9900] text-xs font-black uppercase tracking-[0.2em] mb-3">
              ADN Merquellantas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Valores corporativos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.name}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ff9900]/10 flex items-center justify-center text-[#ff9900] mb-5">
                  {v.icon}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{v.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── History Timeline ── */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-[#ff9900] text-xs font-black uppercase tracking-[0.2em] mb-3">
              Desde 1992
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Nuestra linea de tiempo
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2" />

            <div className="space-y-0">
              {HISTORY.map((item, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div
                    key={`${item.year}-${i}`}
                    className={`relative flex items-start gap-6 sm:gap-0 pb-10 ${
                      isRight ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${
                        isRight ? "sm:pr-10 sm:text-right" : "sm:pl-10 sm:text-left"
                      }`}
                    >
                      <div
                        className={`bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-[#ff9900]/20 hover:shadow-sm transition-all ${
                          isRight ? "sm:ml-0" : "sm:mr-0"
                        }`}
                      >
                        <span className="inline-block text-[#ff9900] font-black text-2xl mb-2">
                          {item.year}
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ff9900] border-2 border-white shadow-sm mt-6 flex-shrink-0" />

                    {/* Spacer for opposite side */}
                    <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#0f0f10] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Visitenos y descubra<br />
            <span className="text-[#ff9900]">lo mejor para su vehiculo</span>
          </h2>
          <p className="text-zinc-400 mb-8 text-base">
            27 tiendas en todo Colombia listas para atenderle con productos de calidad y marcas Premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/products"
              className="px-8 py-4 bg-[#ff9900] text-black font-black rounded-xl hover:bg-[#e68a00] transition-colors shadow-[0_4px_16px_rgba(255,153,0,0.3)]"
            >
              Ver productos
            </a>
            <a
              href="/"
              className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:border-white/30 transition-colors"
            >
              Ir al inicio
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
