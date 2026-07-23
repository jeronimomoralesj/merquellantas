"use client";

import { useState } from "react";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
} from "lucide-react";

const FOOTER_LINKS = {
  "Productos": ["Llantas", "Lubricantes", "Baterías", "Rines", "Accesorios", "Servicios"],
  "Marcas": ["Michelin", "Continental", "Bridgestone", "Pirelli", "Bosch", "Mobil"],
  "Ayuda": ["Centro de ayuda", "Mi pedido", "Devoluciones", "Garantías", "Instalación", "Financiamiento"],
  "Empresa": ["Sobre nosotros", "Trabaja con nosotros", "Prensa", "Términos de uso", "Privacidad", "Cookies"],
};

const PAYMENT_METHODS = ["Visa", "Mastercard", "PSE", "Nequi", "Daviplata", "Efecty"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#070708] border-t border-white/8">
      {/* Newsletter strip */}
      <div className="border-b border-white/8 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Ofertas exclusivas directo
                <span className="text-gradient-brand"> a tu correo.</span>
              </h3>
              <p className="text-zinc-500 text-sm">
                Únete a +8.000 suscriptores y recibe alertas de ofertas flash antes que nadie.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              {subscribed ? (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                  <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">¡Suscripción exitosa!</p>
                    <p className="text-zinc-500 text-xs">Recibirás nuestras mejores ofertas pronto.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff9900] transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3.5 bg-[#ff9900] text-black font-bold text-sm rounded-xl hover:bg-[#e68a00] transition-all hover:scale-[1.03] active:scale-[0.97] flex-shrink-0"
                  >
                    Suscribirse
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              {/* Logo */}
              <a href="#" className="flex items-center gap-2 mb-5 group w-fit">
                <div className="w-8 h-8 rounded-lg bg-[#ff9900] flex items-center justify-center">
                  <Zap size={16} className="text-black" fill="black" />
                </div>
                <div>
                  <span className="text-white font-black text-lg tracking-tight">Merque</span>
                  <span className="text-[#ff9900] font-black text-lg tracking-tight">llantas</span>
                </div>
              </a>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Tu destino de confianza para llantas, lubricantes, baterías y rines en Colombia. Calidad certificada, precios justos.
              </p>

              {/* Contact */}
              <div className="space-y-2.5 mb-6">
                <a href="tel:+576012345678" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors text-sm">
                  <Phone size={14} className="text-[#ff9900]" />
                  601 234-5678
                </a>
                <a href="mailto:ventas@merquellantas.com" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors text-sm">
                  <Mail size={14} className="text-[#ff9900]" />
                  ventas@merquellantas.com
                </a>
                <div className="flex items-start gap-2.5 text-zinc-500 text-sm">
                  <MapPin size={14} className="text-[#ff9900] mt-0.5 flex-shrink-0" />
                  Bogotá, Medellín, Cali · Colombia
                </div>
              </div>

              {/* Social */}
              <div className="flex items-center gap-2">
                {[
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Youtube, href: "#", label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-[#ff9900] hover:border-[#ff9900]/40 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-zinc-500 hover:text-zinc-200 transition-colors text-sm"
                      >
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
      <div className="border-t border-white/6 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-zinc-600 text-xs">
              © {new Date().getFullYear()} Merquellantas S.A.S. · NIT 900.123.456-7 · Todos los derechos reservados.
            </p>

            {/* Trust signals */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                <Lock size={12} className="text-emerald-500" />
                <span>Pago 256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Compra segura</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <CreditCard size={14} className="text-zinc-600" />
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="text-[10px] text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
