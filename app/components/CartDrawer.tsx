"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_THRESHOLD = 500_000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, itemCount, total } = useCart();

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 25_000;
  const grandTotal = total + shipping;
  const progressPct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[440px] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#f8f8f8" }}
      >
        {/* Header — dark */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ backgroundColor: "#0f0f10" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-white" />
            <span className="font-black text-white text-lg tracking-tight">Tu carrito</span>
            {itemCount > 0 && (
              <span className="bg-[#ff9900] text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shipping progress bar */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck size={13} className={shipping === 0 ? "text-green-500" : "text-gray-400"} />
                <span className="text-xs font-semibold text-gray-500">
                  {shipping === 0
                    ? "Tienes envio gratis"
                    : `Agrega $${remaining.toLocaleString("es-CO")} mas para envio gratis`}
                </span>
              </div>
              {shipping === 0 && (
                <span className="text-xs font-black text-green-500">Gratis</span>
              )}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: shipping === 0 ? "#22c55e" : "#ff9900",
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <ShoppingBag size={28} className="text-gray-200" />
              </div>
              <div>
                <p className="font-black text-gray-900 mb-1">Tu carrito esta vacio</p>
                <p className="text-gray-400 text-sm">Agrega productos para continuar.</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-3 bg-[#ff9900] text-black font-black rounded-xl text-sm hover:bg-[#e68a00] transition-colors shadow-[0_4px_16px_rgba(255,153,0,0.3)]"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
                >
                  {/* Product image / color swatch */}
                  <div className="w-[72px] h-[72px] rounded-xl flex-shrink-0 overflow-hidden">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain bg-gray-50 p-1"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-end p-1.5"
                        style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
                      >
                        <span className="text-[8px] font-black text-white/60 leading-tight">{product.brand}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#ff9900] leading-none mb-0.5">
                      {product.brand}
                    </p>
                    <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</p>
                    {product.specs[0] && (
                      <p className="text-xs text-gray-400 mt-0.5">{product.specs[0]}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper */}
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#ff9900] transition-colors border-r border-gray-100"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-gray-900">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#ff9900] transition-colors border-l border-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">
                          ${(product.price * quantity).toLocaleString("es-CO")}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-100 px-6 pt-4 pb-6 flex-shrink-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"})</span>
                <span className="font-semibold text-gray-900">${total.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envio</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-green-500">Gratis</span>
                ) : (
                  <span className="font-semibold text-gray-900">${shipping.toLocaleString("es-CO")}</span>
                )}
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-gray-900 text-lg">${grandTotal.toLocaleString("es-CO")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff9900] text-black font-black text-base hover:bg-[#e68a00] active:scale-[0.98] shadow-[0_4px_16px_rgba(255,153,0,0.35)] transition-all"
            >
              Pagar ahora
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-2.5 py-3 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
