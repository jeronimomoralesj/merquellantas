"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_THRESHOLD = 500_000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, itemCount, total } = useCart();

  const shipping    = total >= FREE_SHIPPING_THRESHOLD ? 0 : 25_000;
  const grandTotal  = total + shipping;
  const progressPct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining   = FREE_SHIPPING_THRESHOLD - total;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Modal container ──────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl overflow-hidden
            shadow-[0_32px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]
            transition-all duration-300 origin-center
            ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-[0.96] opacity-0 pointer-events-none"}`}
          style={{ maxHeight: "min(88vh, 680px)" }}
        >

          {/* ── LEFT — Merquito panel (desktop only) ─────────────── */}
          <div className="hidden lg:flex lg:w-[300px] xl:w-[340px] flex-shrink-0 flex-col bg-[#0c0c0d] relative overflow-hidden">

            {/* Ambient glow */}
            <div className="absolute -bottom-24 -left-24 w-[340px] h-[340px] rounded-full bg-[#ff9900]/20 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#ff9900]/08 blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={closeCart}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center
                bg-white/10 hover:bg-white/18 border border-white/12 text-white/70 hover:text-white
                transition-all duration-200 backdrop-blur-sm"
              aria-label="Cerrar carrito"
            >
              <X size={15} strokeWidth={2.5} />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full px-7 pt-16 pb-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9900]/60">
                  Merquellantas
                </span>
                <h2 className="mt-2.5 font-black text-[26px] leading-[1.15] text-white italic">
                  Tu carrito<br />
                  <span className="text-[#ff9900]">te espera</span>
                </h2>
                <p className="mt-3 text-[13px] text-white/35 leading-relaxed">
                  {itemCount === 0
                    ? "Agrega productos y nosotros nos encargamos del resto."
                    : `${itemCount} ${itemCount === 1 ? "producto" : "productos"} listos para llevar.`}
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-col gap-2">
                {[
                  { icon: Truck, text: "Envio gratis desde $500.000" },
                  { icon: Check, text: "Garantia certificada incluida" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#ff9900]/15 border border-[#ff9900]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={11} className="text-[#ff9900]" />
                    </div>
                    <span className="text-[11.5px] text-white/40 leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* Merquito — anchored to bottom, bleeds off edge */}
              <div className="flex-1 flex items-end justify-center mt-4 -mx-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/merquito.png"
                  alt="Merquito"
                  className="w-[230px] xl:w-[260px] h-auto object-contain select-none
                    drop-shadow-[0_-4px_32px_rgba(255,153,0,0.18)]"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT — Cart content ──────────────────────────────── */}
          <div className="flex-1 flex flex-col bg-[#f2f2f7] min-h-0 min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0
              bg-white/85 backdrop-blur-2xl border-b border-black/[0.06]
              shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ff9900]/12 flex items-center justify-center border border-[#ff9900]/20">
                  <ShoppingBag size={15} className="text-[#ff9900]" />
                </div>
                <span className="font-bold text-[#1d1d1f] text-[16px] tracking-tight italic">Tu carrito</span>
                {itemCount > 0 && (
                  <span className="bg-[#ff9900] text-black text-[10px] font-bold
                    min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </div>

              {/* Mobile-only close */}
              <button
                onClick={closeCart}
                className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center
                  bg-black/[0.06] hover:bg-black/[0.10] border border-black/[0.06]
                  text-[#6e6e73] hover:text-[#1d1d1f] transition-all"
                aria-label="Cerrar carrito"
              >
                <X size={15} strokeWidth={2.5} />
              </button>

              {/* Desktop-only close (top-right, since left panel has its own) */}
              <button
                onClick={closeCart}
                className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center
                  bg-black/[0.06] hover:bg-black/[0.10] border border-black/[0.06]
                  text-[#6e6e73] hover:text-[#1d1d1f] transition-all"
                aria-label="Cerrar carrito"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-4 pt-3.5 pb-2 flex-shrink-0">
                <div className="bg-white/90 backdrop-blur-xl border border-white/90 rounded-2xl px-4 py-3
                  shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Truck size={11} className={shipping === 0 ? "text-teal-500" : "text-[#6e6e73]"} />
                      <span className="text-[11px] font-medium text-[#6e6e73]">
                        {shipping === 0
                          ? "Tienes envio gratis"
                          : `Faltan $${remaining.toLocaleString("es-CO")} para envio gratis`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                        <Check size={10} />Gratis
                      </span>
                    )}
                  </div>
                  <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        background: shipping === 0
                          ? "linear-gradient(90deg, #14b8a6, #0d9488)"
                          : "linear-gradient(90deg, #ff9900, #ffb733)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Items — scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center py-10">
                  {/* Merquito on mobile empty state */}
                  <div className="lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/merquito.png"
                      alt="Merquito"
                      className="h-28 w-auto object-contain mx-auto mb-2 opacity-70"
                    />
                  </div>
                  {/* Icon on desktop (Merquito is already in left panel) */}
                  <div className="hidden lg:flex w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xl
                    border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] items-center justify-center">
                    <ShoppingBag size={28} className="text-gray-200" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1d1d1f] text-[17px] italic mb-1">Tu carrito esta vacio</p>
                    <p className="text-[#6e6e73] text-[13px] leading-relaxed">Agrega productos para continuar.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-7 py-3 bg-[#ff9900] text-black font-bold rounded-2xl text-[13.5px]
                      hover:bg-[#e68a00] transition-all
                      shadow-[0_4px_20px_rgba(255,153,0,0.30)]"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-2.5">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 flex gap-3.5
                        shadow-[0_1px_4px_rgba(0,0,0,0.04),0_2px_10px_rgba(0,0,0,0.03)]"
                    >
                      {/* Thumbnail */}
                      <div className="w-[64px] h-[64px] rounded-xl flex-shrink-0 overflow-hidden border border-gray-100/80">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain bg-gray-50 p-1"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-end p-2"
                            style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
                          >
                            <span className="text-[8px] font-bold text-white/50 leading-tight">{product.brand}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff9900] leading-none mb-0.5">
                          {product.brand}
                        </p>
                        <p className="text-[13.5px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2">
                          {product.name}
                        </p>
                        {product.specs[0] && (
                          <p className="text-[11px] text-[#6e6e73] mt-0.5">{product.specs[0]}</p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty stepper */}
                          <div className="flex items-center bg-[#f2f2f7] rounded-xl overflow-hidden border border-gray-200/60">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#6e6e73]
                                hover:text-[#ff9900] hover:bg-white/70 transition-all"
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#1d1d1f] border-x border-gray-200/60">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#6e6e73]
                                hover:text-[#ff9900] hover:bg-white/70 transition-all"
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1d1d1f] text-[13.5px]">
                              ${(product.price * quantity).toLocaleString("es-CO")}
                            </span>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center
                                text-gray-300 hover:text-rose-500 hover:bg-rose-50/80 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer — totals + CTA ───────────────────────────── */}
            {items.length > 0 && (
              <div className="flex-shrink-0 px-5 pt-4 pb-5
                bg-white/90 backdrop-blur-2xl border-t border-black/[0.05]
                shadow-[0_-1px_0_rgba(0,0,0,0.04)]">

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6e6e73]">
                      Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"})
                    </span>
                    <span className="text-[13px] font-semibold text-[#1d1d1f]">
                      ${total.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6e6e73]">Envio</span>
                    {shipping === 0 ? (
                      <span className="text-[13px] font-semibold text-teal-600">Gratis</span>
                    ) : (
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">
                        ${shipping.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                    <span className="font-bold text-[#1d1d1f] italic">Total</span>
                    <span className="font-black text-[#1d1d1f] text-[20px] italic tracking-tight">
                      ${grandTotal.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                    bg-[#ff9900] text-black font-bold text-[15px] italic
                    hover:bg-[#e68a00] active:scale-[0.98]
                    shadow-[0_4px_20px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]
                    transition-all duration-200"
                >
                  Pagar ahora
                  <ArrowRight size={16} />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full mt-2 py-2.5 text-[13px] font-medium text-[#6e6e73]
                    hover:text-[#1d1d1f] transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
