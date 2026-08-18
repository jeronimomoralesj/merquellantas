"use client";

import { useState, useEffect } from "react";
import { X, Gift, Sparkles, ArrowRight } from "lucide-react";

export default function SignupPopup() {
  const [visible, setVisible]     = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("merq-popup-seen")) {
      setUnmounted(true);
      return;
    }
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("merq-popup-seen", "1");
    setVisible(false);
    setTimeout(() => setUnmounted(true), 450);
  };

  if (unmounted) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Únete a Merquellantas"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-[0.96] pointer-events-none"
      }`}
    >
      <div
        className="relative w-72 sm:w-[295px] rounded-[28px] shadow-[0_12px_50px_rgba(180,60,0,0.4)]"
        style={{ background: "linear-gradient(158deg, #280800 0%, #7a2e00 55%, #1c0700 100%)" }}
      >
        {/* Orange accent bar at top */}
        <div
          className="h-[3px] rounded-t-[28px]"
          style={{ background: "linear-gradient(90deg, #cc7700, #ff9900 50%, #ffbe55)" }}
        />

        {/* Shell-pattern background overlay (subtle texture) */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 6px, rgba(255,153,0,1) 6px, rgba(255,153,0,1) 7px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* ── Content ── */}
        <div className="relative px-5 pt-4 pb-5">

          {/* Top row */}
          <div className="flex items-center justify-between mb-3.5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{ background: "rgba(255,153,0,0.14)", color: "#ffaa33" }}
            >
              <Gift size={9} strokeWidth={2.5} />
              Premio especial
            </span>
            <button
              onClick={dismiss}
              aria-label="Cerrar"
              className="text-white/25 hover:text-white/60 transition-colors p-1 -mr-1"
            >
              <X size={15} />
            </button>
          </div>

          {/* Heading */}
          <h3 className="font-black text-[22px] leading-[1.15] text-white mb-[5px]">
            Únete a{" "}
            <span style={{ color: "#ff9900" }}>Merquellantas</span>
          </h3>
          <p className="text-white/55 text-[13px] leading-snug mb-4">
            Si no tienes cuenta todavía,<br />
            ¡regístrate y llévate algo hoy!
          </p>

          {/* Prize callout */}
          <div
            className="rounded-2xl px-4 py-3 mb-4"
            style={{
              background: "rgba(255,153,0,0.07)",
              border: "1px solid rgba(255,153,0,0.16)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={11} style={{ color: "#ff9900" }} />
              <span className="text-[11px] font-bold" style={{ color: "#ff9900" }}>
                Tu regalo de bienvenida
              </span>
            </div>
            <p className="text-white/50 text-[12px] leading-relaxed">
              Recibe{" "}
              <strong className="text-white/80 font-semibold">10% de descuento</strong>{" "}
              en tu primera compra más instalación gratis en cualquier punto Merquellantas.
            </p>
          </div>

          {/* CTA */}
          <a
            href="#"
            className="flex items-center justify-center gap-2 w-full py-[11px] rounded-2xl font-bold text-[13.5px] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #ff9900, #ffb84d)",
              color: "#1a0500",
            }}
          >
            Crear cuenta gratis
            <ArrowRight size={13} strokeWidth={2.5} />
          </a>

          <button
            onClick={dismiss}
            className="w-full text-center text-[11px] text-white/22 hover:text-white/45 transition-colors mt-2.5 py-0.5"
          >
            Ya tengo cuenta · No, gracias
          </button>
        </div>

        {/* ── Merquito stage — shows mascot from chin up ── */}
        <div
          className="relative overflow-hidden rounded-b-[28px]"
          style={{ height: "106px" }}
        >
          {/* Dark floor so mix-blend-mode:screen works */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #060100 0%, #150400 60%, rgba(26,5,0,0) 100%)",
            }}
          />

          {/* Merquito — top of image visible (head / chin up) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merquito.png"
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 0,
              height: "290px",
              mixBlendMode: "screen",
            }}
          />

          {/* Side vignettes to melt edges into card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,1,0,0.95) 0%, transparent 28%, transparent 72%, rgba(6,1,0,0.95) 100%)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
            style={{ background: "rgba(6,1,0,0.5)" }}
          />
        </div>
      </div>
    </div>
  );
}
