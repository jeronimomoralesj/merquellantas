"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_THRESHOLD = 500_000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, itemCount, total } = useCart();

  const shipping     = total >= FREE_SHIPPING_THRESHOLD ? 0 : 25_000;
  const grandTotal   = total + shipping;
  const progressPct  = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining    = FREE_SHIPPING_THRESHOLD - total;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          isOpen ? "bg-black/30 backdrop-blur-[3px] pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[420px] flex flex-col
          transition-transform duration-300 ease-out
          bg-[#f2f2f7]/90 backdrop-blur-3xl
          border-l border-white/50
          shadow-[-20px_0_60px_rgba(0,0,0,0.12)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0
          bg-white/70 backdrop-blur-2xl border-b border-white/80
          shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff9900]/12 flex items-center justify-center
              border border-[#ff9900]/20">
              <ShoppingBag size={16} className="text-[#ff9900]" />
            </div>
            <span className="font-bold text-[#1d1d1f] text-[17px] tracking-tight italic">
              Tu carrito
            </span>
            {itemCount > 0 && (
              <span className="bg-[#ff9900] text-black text-[10px] font-bold
                min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center
              bg-black/[0.06] hover:bg-black/[0.10] border border-black/[0.06]
              text-[#6e6e73] hover:text-[#1d1d1f] transition-all"
            aria-label="Cerrar carrito"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Free shipping bar ──────────────────────────────── */}
        {items.length > 0 && (
          <div className="px-5 pt-4 pb-3 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl px-4 py-3
              shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Truck size={12} className={shipping === 0 ? "text-teal-500" : "text-[#6e6e73]"} />
                  <span className="text-[11px] font-medium text-[#6e6e73]">
                    {shipping === 0
                      ? "Tienes envio gratis"
                      : `Faltan $${remaining.toLocaleString("es-CO")} para envio gratis`}
                  </span>
                </div>
                {shipping === 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                    <Check size={10} />
                    Gratis
                  </span>
                )}
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
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

        {/* ── Items ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl
                border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-200" />
              </div>
              <div>
                <p className="font-semibold text-[#1d1d1f] text-lg italic mb-1">Tu carrito esta vacio</p>
                <p className="text-[#6e6e73] text-sm leading-relaxed">
                  Agrega productos para continuar.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-7 py-3 bg-[#ff9900] text-black font-bold rounded-xl text-sm
                  hover:bg-[#e68a00] transition-colors
                  shadow-[0_4px_16px_rgba(255,153,0,0.30)]"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-2.5">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-4 flex gap-3.5
                    shadow-[0_1px_4px_rgba(0,0,0,0.04),0_2px_10px_rgba(0,0,0,0.03)]"
                >
                  {/* Thumbnail */}
                  <div className="w-[68px] h-[68px] rounded-xl flex-shrink-0 overflow-hidden border border-gray-100/80">
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
                    <p className="text-sm font-semibold text-[#1d1d1f] leading-snug line-clamp-2">{product.name}</p>
                    {product.specs[0] && (
                      <p className="text-[11px] text-[#6e6e73] mt-0.5">{product.specs[0]}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper — iOS segmented control style */}
                      <div className="flex items-center bg-[#f2f2f7] rounded-xl overflow-hidden
                        border border-gray-200/60">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#6e6e73]
                            hover:text-[#ff9900] hover:bg-white/70 transition-all"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1d1d1f] border-x border-gray-200/60">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#6e6e73]
                            hover:text-[#ff9900] hover:bg-white/70 transition-all"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1d1d1f] text-sm">
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

        {/* ── Footer ─────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 pt-4 pb-6
            bg-white/80 backdrop-blur-2xl border-t border-white/80
            shadow-[0_-1px_0_rgba(0,0,0,0.04)]">

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6e6e73]">
                  Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"})
                </span>
                <span className="text-sm font-semibold text-[#1d1d1f]">${total.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6e6e73]">Envio</span>
                {shipping === 0 ? (
                  <span className="text-sm font-semibold text-teal-600">Gratis</span>
                ) : (
                  <span className="text-sm font-semibold text-[#1d1d1f]">${shipping.toLocaleString("es-CO")}</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                <span className="font-bold text-[#1d1d1f] italic">Total</span>
                <span className="font-bold text-[#1d1d1f] text-xl italic">${grandTotal.toLocaleString("es-CO")}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
                bg-[#ff9900] text-black font-bold text-[15px] italic
                hover:bg-[#e68a00] active:scale-[0.98]
                shadow-[0_4px_20px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]
                transition-all"
            >
              Pagar ahora
              <ArrowRight size={17} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-2 py-3 text-sm font-medium text-[#6e6e73]
                hover:text-[#1d1d1f] transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
