"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ShieldCheck, CreditCard, Lock, ArrowRight, Check } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="#111111" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const FOOTER_LINKS: Record<string, string[]> = {
  "Productos": ["Llantas", "Lubricantes", "Baterías", "Rines", "Accesorios", "Servicios"],
  "Marcas":    ["Michelin", "Continental", "Bridgestone", "Pirelli", "Bosch", "Mobil"],
  "Ayuda":     ["Centro de ayuda", "Mi pedido", "Devoluciones", "Garantías", "Instalación", "Financiamiento"],
  "Empresa":   ["Sobre nosotros", "Trabaja con nosotros", "Prensa", "Terminos de uso", "Privacidad", "Cookies", "Plataforma"],
};

const LINK_HREFS: Record<string, string> = {
  "Sobre nosotros": "/sobre-nosotros",
  "Plataforma": "/plataforma",
};

const PAYMENT_METHODS = ["Visa", "Mastercard", "PSE", "Nequi", "Daviplata", "Efecty"];

export default function Footer() {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer className="bg-[#0c0c0d]">

      {/* Newsletter */}
      <div className="border-b border-white/[0.07] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Ofertas exclusivas <span className="text-[#ff9900]">directo a tu correo.</span>
              </h3>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[420px]">
              {subscribed ? (
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Check size={18} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">Suscripcion exitosa</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Te avisaremos cuando haya nuevas ofertas.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff9900] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 bg-[#ff9900] text-black font-bold text-sm rounded-xl hover:bg-[#e68a00] transition-colors flex-shrink-0"
                  >
                    Suscribirse
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <a href="#" className="flex items-center mb-5 w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.merquellantas.com/assets/images/logo/Logo-Merquellantas.png"
                  alt="Merquellantas"
                  className="h-8 w-auto object-contain brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fb) fb.style.display = "block";
                  }}
                />
                <span className="hidden text-white font-black text-xl">Merquellantas</span>
              </a>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Distribuidor oficial de llantas, lubricantes, baterias y rines en Colombia.
                Calidad certificada, precios justos.
              </p>

              <div className="space-y-2.5 mb-6">
                <a href="tel:+576012345678" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors text-sm">
                  <Phone size={13} className="text-[#ff9900] flex-shrink-0" />
                  601 234-5678
                </a>
                <a href="mailto:ventas@merquellantas.com" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors text-sm">
                  <Mail size={13} className="text-[#ff9900] flex-shrink-0" />
                  ventas@merquellantas.com
                </a>
                <div className="flex items-start gap-2.5 text-zinc-500 text-sm">
                  <MapPin size={13} className="text-[#ff9900] mt-0.5 flex-shrink-0" />
                  Bogota, Medellin y Cali · Colombia
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { Icon: InstagramIcon, label: "Instagram" },
                  { Icon: FacebookIcon,  label: "Facebook" },
                  { Icon: YoutubeIcon,   label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[#ff9900] hover:border-[#ff9900]/30 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
                  {heading}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href={LINK_HREFS[link] ?? "#"} className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs">
              © {new Date().getFullYear()} Merquellantas S.A.S. · NIT 900.123.456-7 · Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                <Lock size={11} className="text-emerald-500" />
                SSL 256-bit
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                <ShieldCheck size={11} className="text-emerald-500" />
                Compra segura
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <CreditCard size={13} className="text-zinc-700" />
              {PAYMENT_METHODS.map((m) => (
                <span key={m} className="text-[10px] text-zinc-600 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
