"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, CreditCard, Building2, Banknote, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

type Step = "contact" | "delivery" | "payment";
type PayMethod = "card" | "pse" | "cash";

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/10 transition-all"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>("contact");
  const [done, setDone] = useState(false);

  // Contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dept, setDept] = useState("");
  const [notes, setNotes] = useState("");

  // Payment
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const shipping = total >= 500_000 ? 0 : 25_000;
  const grandTotal = total + shipping;

  const steps: { key: Step; label: string }[] = [
    { key: "contact", label: "Contacto" },
    { key: "delivery", label: "Entrega" },
    { key: "payment", label: "Pago" },
  ];

  function handleContinue() {
    if (step === "contact") setStep("delivery");
    else if (step === "delivery") setStep("payment");
    else {
      setDone(true);
      clearCart();
    }
  }

  if (items.length === 0 && !done) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 pt-[96px]">
          <ShoppingBag size={48} className="text-gray-200" />
          <p className="font-black text-xl text-gray-900">Tu carrito esta vacio</p>
          <a
            href="/products"
            className="px-6 py-3 bg-[#ff9900] text-black font-black rounded-xl hover:bg-[#e68a00] transition-colors"
          >
            Ver productos
          </a>
        </div>
        <Footer />
      </>
    );
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 pt-[96px] text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Pedido recibido</h1>
            <p className="text-gray-500 max-w-sm">
              Te enviaremos una confirmacion a <strong>{email}</strong> con los detalles de tu pedido.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/products"
              className="px-6 py-3 bg-[#ff9900] text-black font-black rounded-xl hover:bg-[#e68a00] transition-colors"
            >
              Seguir comprando
            </a>
            <a
              href="/"
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
            >
              Ir al inicio
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-[96px]">
        {/* Top bar */}
        <div className="bg-[#0f0f10] px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-white font-black text-lg tracking-tight">Checkout</span>
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      i <= stepIndex ? "text-[#ff9900]" : "text-white/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                        i < stepIndex
                          ? "bg-[#ff9900] border-[#ff9900] text-black"
                          : i === stepIndex
                          ? "border-[#ff9900] text-[#ff9900]"
                          : "border-white/20 text-white/30"
                      }`}
                    >
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight size={12} className={i < stepIndex ? "text-[#ff9900]" : "text-white/20"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Form panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            {step === "contact" && (
              <div>
                <h2 className="font-black text-xl text-gray-900 mb-6">Informacion de contacto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nombre" placeholder="Juan" value={firstName} onChange={setFirstName} />
                  <Field label="Apellido" placeholder="Garcia" value={lastName} onChange={setLastName} />
                  <div className="sm:col-span-2">
                    <Field label="Correo electronico" type="email" placeholder="juan@correo.com" value={email} onChange={setEmail} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Telefono / Celular" type="tel" placeholder="300 000 0000" value={phone} onChange={setPhone} />
                  </div>
                </div>
              </div>
            )}

            {step === "delivery" && (
              <div>
                <h2 className="font-black text-xl text-gray-900 mb-6">Direccion de entrega</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Direccion" placeholder="Cra 7 # 40-12, Apto 302" value={address} onChange={setAddress} />
                  </div>
                  <Field label="Ciudad" placeholder="Bogota" value={city} onChange={setCity} />
                  <Field label="Departamento" placeholder="Cundinamarca" value={dept} onChange={setDept} />
                  <div className="sm:col-span-2">
                    <Field label="Notas adicionales (opcional)" placeholder="Instrucciones para el domiciliario..." value={notes} onChange={setNotes} required={false} />
                  </div>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div>
                <h2 className="font-black text-xl text-gray-900 mb-6">Metodo de pago</h2>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(
                    [
                      { key: "card" as PayMethod, icon: CreditCard, label: "Tarjeta" },
                      { key: "pse" as PayMethod, icon: Building2, label: "PSE" },
                      { key: "cash" as PayMethod, icon: Banknote, label: "Contra entrega" },
                    ] as { key: PayMethod; icon: typeof CreditCard; label: string }[]
                  ).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setPayMethod(key)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-bold transition-all ${
                        payMethod === key
                          ? "border-[#ff9900] bg-[#fff8ed] text-[#ff9900]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Numero de tarjeta" placeholder="1234 5678 9012 3456" value={cardNum} onChange={setCardNum} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Nombre en la tarjeta" placeholder="JUAN GARCIA" value={cardName} onChange={setCardName} />
                    </div>
                    <Field label="Vencimiento" placeholder="MM/AA" value={cardExp} onChange={setCardExp} />
                    <Field label="CVV" placeholder="123" value={cardCvv} onChange={setCardCvv} />
                  </div>
                )}

                {payMethod === "pse" && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-700">
                    Al continuar seras redirigido al portal PSE para completar tu pago de forma segura.
                  </div>
                )}

                {payMethod === "cash" && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-sm text-gray-600">
                    Paga en efectivo cuando tu pedido llegue. Ten el monto exacto listo para el domiciliario.
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="mt-8 w-full py-4 bg-[#ff9900] text-black font-black rounded-xl hover:bg-[#e68a00] active:scale-[0.98] shadow-[0_4px_16px_rgba(255,153,0,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {step === "payment" ? "Confirmar pedido" : "Continuar"}
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-24">
            <div className="bg-[#0f0f10] px-5 py-4">
              <span className="text-white font-black text-sm tracking-tight">Resumen del pedido</span>
            </div>
            <div className="p-5">
              <ul className="space-y-3 mb-5">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain bg-gray-50 p-1"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ background: `linear-gradient(135deg, ${product.bgFrom}, ${product.bgTo})` }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">x{quantity}</p>
                    </div>
                    <span className="text-xs font-black text-gray-900 flex-shrink-0">
                      ${(product.price * quantity).toLocaleString("es-CO")}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envio</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-semibold">Gratis</span>
                  ) : (
                    <span>${shipping.toLocaleString("es-CO")}</span>
                  )}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-gray-900">${grandTotal.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
