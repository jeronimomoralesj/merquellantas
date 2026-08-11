"use client";

import { useState, useMemo, type ReactElement } from "react";
import { CLIENTS, CRM_PRODUCTS, fmtCOP, type TipoLista, type CrmProduct } from "./_data";

/* ── Price type config ──────────────────────────────────── */

const PRICE_TYPES: { key: TipoLista; label: string; sublabel: string }[] = [
  { key: "distribuidor", label: "Flota",         sublabel: "Precio distribuidor" },
  { key: "instalador",   label: "Distribucion",  sublabel: "Precio instalador"   },
  { key: "publico",      label: "Uno a uno",     sublabel: "Precio publico"      },
];

/* ── Types ──────────────────────────────────────────────── */

interface QuoteLine { id: string; product: CrmProduct; qty: number; discount: number; }

interface SavedQuote {
  id: string; clientId: string; clientName: string; tipoLista: TipoLista;
  createdAt: string; lines: QuoteLine[]; total: number;
}

let _lseq = 0;
let _qseq = 0;
const newLid = () => `ql_${++_lseq}`;
const newQid = () => `COT-${Date.now().toString().slice(-6)}-${++_qseq}`;

/* ── Price helpers ──────────────────────────────────────── */

function basePrice(p: CrmProduct, l: TipoLista): number {
  return l === "distribuidor" ? p.precioDistribuidor : l === "instalador" ? p.precioInstalador : p.precioPublico;
}

function finalUnit(p: CrmProduct, l: TipoLista, disc: number): number {
  return Math.round(basePrice(p, l) * (1 - disc / 100));
}

function lineTotal(line: QuoteLine, l: TipoLista): number {
  return finalUnit(line.product, l, line.discount) * line.qty;
}

function fmtFull(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

/* ── PDF ────────────────────────────────────────────────── */

function openPDF(q: SavedQuote): void {
  const date = new Date(q.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const ptLabel = PRICE_TYPES.find((p) => p.key === q.tipoLista)?.label ?? q.tipoLista;
  const rows = q.lines.map((l) => {
    const u = finalUnit(l.product, q.tipoLista, l.discount);
    return `<tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:13px">${l.product.description}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px">${l.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px">${fmtFull(u)}${l.discount > 0 ? ` (-${l.discount}%)` : ""}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700">${fmtFull(u * l.qty)}</td>
    </tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${q.id}</title>
  <style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:32px;color:#111;max-width:800px;margin:0 auto}
  h1{font-size:26px;font-weight:900;color:#ff9900;margin:0 0 4px}
  table{width:100%;border-collapse:collapse}
  th{background:#f9f9f9;padding:10px 8px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:#666;letter-spacing:.07em}
  @media print{body{padding:16px}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
    <div><h1>Merquellantas</h1><p style="color:#666;font-size:12px;margin:0">No. ${q.id}</p></div>
    <div style="text-align:right">
      <p style="font-size:12px;color:#666;margin:0">${date}</p>
      <p style="font-size:12px;color:#666;margin:3px 0 0">Lista: ${ptLabel}</p>
    </div>
  </div>
  <div style="background:#f9f9f9;border-radius:10px;padding:14px 18px;margin-bottom:20px">
    <p style="margin:0;font-size:14px;font-weight:700">${q.clientName}</p>
  </div>
  <table>
    <thead><tr>
      <th>Producto</th>
      <th style="text-align:center">Cant.</th>
      <th style="text-align:right">P. Unit.</th>
      <th style="text-align:right">Total</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="text-align:right;margin-top:18px;padding-top:18px;border-top:2px solid #ff9900">
    <p style="font-size:20px;font-weight:900;color:#ff9900;margin:0">Total: ${fmtFull(q.total)}</p>
  </div>
  <p style="margin-top:32px;font-size:11px;color:#aaa;text-align:center">
    Valida 5 dias habiles · Merquellantas S.A.S. · www.merquellantas.com
  </p>
  </body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 350);
}

/* ── WhatsApp URL ───────────────────────────────────────── */

function buildWAUrl(q: SavedQuote, phone?: string): string {
  const ptLabel = PRICE_TYPES.find((p) => p.key === q.tipoLista)?.label ?? q.tipoLista;
  const linesText = q.lines.map((l) => {
    const u = finalUnit(l.product, q.tipoLista, l.discount);
    const name = l.product.description.split(" ").slice(0, 5).join(" ");
    return `• ${l.qty}x ${name} — ${fmtCOP(u * l.qty)}`;
  }).join("\n");
  const msg = `Hola ${q.clientName}, aqui la cotizacion Merquellantas (Lista: ${ptLabel}):\n\n${linesText}\n\nTotal: ${fmtCOP(q.total)}\n\nValida 5 dias habiles.`;
  const base = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(msg)}`;
}

/* ── Email mailto ───────────────────────────────────────── */

function buildMailto(q: SavedQuote, email?: string): string {
  const ptLabel = PRICE_TYPES.find((p) => p.key === q.tipoLista)?.label ?? q.tipoLista;
  const linesText = q.lines.map((l) => {
    const u = finalUnit(l.product, q.tipoLista, l.discount);
    return `${l.qty}x ${l.product.description}: ${fmtCOP(u * l.qty)}`;
  }).join(" | ");
  const subject = `Cotizacion Merquellantas — ${q.clientName}`;
  const body = `Cotizacion para ${q.clientName}\nLista de precios: ${ptLabel}\n\n${linesText}\n\nTotal: ${fmtCOP(q.total)}\n\nValida 5 dias habiles.\nMerquellantas S.A.S.`;
  return `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ── Icons ──────────────────────────────────────────────── */

const IcoSearch = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IcoX = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoPlus = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoPDF = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const IcoWA = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
const IcoMail = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IcoSave = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IcoCheck = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoHistory = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 15" />
  </svg>
);
const IcoChevronD = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IcoTruck = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IcoStore = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoPerson = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcoTire = (): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="22" />
    <line x1="2" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="22" y2="12" />
  </svg>
);

const PRICE_TYPE_ICONS: Record<TipoLista, () => ReactElement> = {
  distribuidor: IcoTruck,
  instalador: IcoStore,
  publico: IcoPerson,
};

/* ── ProductPicker ──────────────────────────────────────── */

function ProductPicker({ onPick, onCancel }: { onPick: (p: CrmProduct) => void; onCancel: () => void }): ReactElement {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const s = q.toLowerCase().trim();
    return s
      ? CRM_PRODUCTS.filter((p) =>
          p.description.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.tireSize.includes(s)
        )
      : CRM_PRODUCTS;
  }, [q]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "2px solid #ff9900" }}>
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#ff9900" }}>
        <IcoSearch />
        <input value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Marca, medida, descripcion..."
          className="flex-1 bg-transparent text-sm font-semibold text-white placeholder-orange-100 outline-none"
          autoFocus />
        {q ? (
          <button type="button" onClick={() => setQ("")} className="text-white/70 hover:text-white"><IcoX /></button>
        ) : (
          <button onClick={onCancel} className="text-white/70 hover:text-white"><IcoX /></button>
        )}
      </div>
      <div className="bg-white max-h-52 overflow-y-auto no-scrollbar">
        {results.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">Sin resultados</p>
        ) : (
          results.map((p) => (
            <button key={p.sku} type="button" onClick={() => onPick(p)}
              className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-orange-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-300 group-hover:text-[#ff9900] transition-colors" style={{ backgroundColor: "#f9fafb" }}>
                  <IcoTire />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-gray-900 leading-snug">{p.description}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.brand} · {p.tireSize}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-300 group-hover:text-[#ff9900] transition-colors">Agregar</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* ── LineCard ───────────────────────────────────────────── */

function LineCard({ line, lista, index, canRemove, onChange, onRemove }: {
  line: QuoteLine; lista: TipoLista; index: number; canRemove: boolean;
  onChange: (patch: Partial<QuoteLine>) => void; onRemove: () => void;
}): ReactElement {
  const base = basePrice(line.product, lista);
  const unit = finalUnit(line.product, lista, line.discount);
  const total = unit * line.qty;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
      {/* Dark header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#111111" }}>
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
          style={{ backgroundColor: "#ff9900", color: "#111111" }}>{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight truncate" style={{ color: "#ffffff" }}>{line.product.description}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>{line.product.brand} · {line.product.tireSize}</p>
        </div>
        {canRemove && (
          <button onClick={onRemove}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
            style={{ color: "#6b7280" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#6b7280"; }}>
            <IcoX />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white px-4 py-4 flex flex-wrap items-end gap-4">
        {/* Qty */}
        <div>
          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Cantidad</label>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onChange({ qty: Math.max(1, line.qty - 1) })}
              className="w-9 h-9 rounded-xl text-gray-600 font-bold text-lg leading-none flex items-center justify-center transition-all hover:text-[#ff9900]"
              style={{ border: "2px solid #e5e7eb" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff9900"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
              −
            </button>
            <input type="number" min={1} max={999} value={line.qty}
              onChange={(e) => { const v = parseInt(e.target.value); if (v > 0) onChange({ qty: v }); }}
              className="w-14 h-9 rounded-xl text-center text-sm font-black text-gray-900 bg-white outline-none transition-colors"
              style={{ border: "2px solid #e5e7eb" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#ff9900"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
            <button onClick={() => onChange({ qty: line.qty + 1 })}
              className="w-9 h-9 rounded-xl text-gray-600 font-bold text-lg leading-none flex items-center justify-center transition-all hover:text-[#ff9900]"
              style={{ border: "2px solid #e5e7eb" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff9900"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
              +
            </button>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Descuento <span className="font-normal normal-case tracking-normal">(max 40%)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input type="number" min={0} max={40} value={line.discount}
                onChange={(e) => { const v = Math.max(0, Math.min(40, parseInt(e.target.value) || 0)); onChange({ discount: v }); }}
                className="w-20 h-9 rounded-xl pl-3 pr-6 text-sm font-black text-gray-900 bg-white outline-none transition-colors"
                style={{ border: "2px solid #e5e7eb" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#ff9900"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
              <span className="absolute right-2.5 text-xs font-bold text-gray-400">%</span>
            </div>
            {line.discount > 0 && (
              <span className="text-xs font-black px-2 py-1 rounded-lg" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                -{line.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="ml-auto text-right">
          {line.discount > 0 && (
            <p className="text-[10px] text-gray-400 line-through">{fmtFull(base)} /u</p>
          )}
          <p className="text-[11px] text-gray-400">{fmtFull(unit)} /u</p>
          <p className="text-2xl font-black tabular-nums leading-tight" style={{ color: "#111111" }}>{fmtCOP(total)}</p>
          {line.qty > 1 && <p className="text-[10px] text-gray-400">{line.qty} unidades</p>}
        </div>
      </div>
    </div>
  );
}

/* ── HistoryCard ────────────────────────────────────────── */

function HistoryCard({ quote, clientPhone, clientEmail, onPDF, isNew }: {
  quote: SavedQuote; clientPhone?: string; clientEmail?: string;
  onPDF: () => void; isNew: boolean;
}): ReactElement {
  const ptLabel = PRICE_TYPES.find((p) => p.key === quote.tipoLista)?.label ?? quote.tipoLista;
  const date = new Date(quote.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm transition-all"
      style={{ border: isNew ? "2px solid #ff9900" : "1px solid #e5e7eb" }}>
      <div className="px-4 py-3 flex items-center justify-between gap-3"
        style={{ backgroundColor: isNew ? "#fff7ed" : "#f9fafb" }}>
        <div className="flex items-center gap-2">
          <p className="text-xs font-black text-gray-500">{quote.id}</p>
          {isNew && (
            <span className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#ff9900" }}>NUEVA</span>
          )}
        </div>
        <p className="text-base font-black tabular-nums" style={{ color: "#ff9900" }}>{fmtCOP(quote.total)}</p>
      </div>

      <div className="bg-white px-4 py-3">
        <div className="mb-2">
          <p className="text-sm font-bold text-gray-900">{quote.clientName}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{date} · Lista {ptLabel}</p>
        </div>

        <div className="space-y-1 mb-3">
          {quote.lines.map((l) => {
            const u = finalUnit(l.product, quote.tipoLista, l.discount);
            return (
              <div key={l.id} className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-500 truncate">
                  {l.qty}x {l.product.description.split(" ").slice(0, 5).join(" ")}
                  {l.discount > 0 ? <span className="text-green-600 font-semibold"> (-{l.discount}%)</span> : ""}
                </p>
                <p className="text-xs font-bold text-gray-700 tabular-nums flex-shrink-0">{fmtCOP(u * l.qty)}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
          <button onClick={onPDF}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100">
            <IcoPDF />PDF
          </button>
          {clientPhone && (
            <a href={buildWAUrl(quote, clientPhone)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold transition-colors px-2.5 py-1.5 rounded-lg hover:bg-green-50"
              style={{ color: "#25D366" }}>
              <IcoWA />WhatsApp
            </a>
          )}
          {clientEmail && (
            <a href={buildMailto(quote, clientEmail)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-blue-50">
              <IcoMail />Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main module ────────────────────────────────────────── */

export default function CotizaModule(): ReactElement {
  const [clientId,      setClientId]      = useState("");
  const [tipoLista,     setTipoLista]     = useState<TipoLista>("publico");
  const [lines,         setLines]         = useState<QuoteLine[]>([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [savedQuotes,   setSavedQuotes]   = useState<SavedQuote[]>([]);
  const [newQuoteId,    setNewQuoteId]    = useState<string | null>(null);
  const [showHistory,   setShowHistory]   = useState(false);

  const client = CLIENTS.find((c) => c.id === clientId) ?? null;

  const grandTotal = useMemo(
    () => lines.reduce((acc, l) => acc + lineTotal(l, tipoLista), 0),
    [lines, tipoLista],
  );

  const canSave = lines.length > 0;

  function pickProduct(p: CrmProduct) {
    setLines((prev) => [...prev, { id: newLid(), product: p, qty: 4, discount: 0 }]);
    setAddingProduct(false);
  }

  function updateLine(id: string, patch: Partial<QuoteLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function buildCurrentQuote(): SavedQuote {
    return {
      id: "PREVIEW",
      clientId,
      clientName: client?.name ?? "Sin cliente",
      tipoLista,
      createdAt: new Date().toISOString(),
      lines,
      total: grandTotal,
    };
  }

  function saveQuote() {
    if (!canSave) return;
    const q: SavedQuote = {
      ...buildCurrentQuote(),
      id: newQid(),
    };
    setSavedQuotes((prev) => [q, ...prev]);
    setNewQuoteId(q.id);
    setShowHistory(true);
    setTimeout(() => setNewQuoteId(null), 5000);
    setLines([]);
    setClientId("");
    setTipoLista("publico");
  }

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header strip ─────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #111111 0%, #1f1f1f 100%)" }}>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: "#ff9900" }}>Merquellantas</p>
            <p className="text-xl font-black text-white leading-tight mt-0.5">Nueva cotizacion</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ff9900" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Cliente ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cliente</p>
        </div>
        <div className="p-4">
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}
            className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-gray-900 bg-gray-50 outline-none transition-colors"
            style={{ border: "2px solid #e5e7eb" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#ff9900"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
            <option value="">Sin cliente asignado</option>
            {CLIENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.segment}{c.vehicles[0] ? ` · ${c.vehicles[0].plate}` : ""}
              </option>
            ))}
          </select>

          {client && (
            <div className="flex items-center gap-3 mt-3 p-3 rounded-xl" style={{ backgroundColor: "#fff7ed" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ backgroundColor: "#ff9900", color: "#111111" }}>{client.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 leading-none">{client.name}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {client.city} · {client.phone}
                  {client.vehicles[0] ? ` · ${client.vehicles[0].plate} (${client.vehicles[0].tireSize})` : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tipo de precio ───────────────────────────────────── */}
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1 mb-3">Tipo de precio</p>
        <div className="grid grid-cols-3 gap-3">
          {PRICE_TYPES.map((pt) => {
            const Icon = PRICE_TYPE_ICONS[pt.key];
            const active = tipoLista === pt.key;
            return (
              <button key={pt.key} onClick={() => setTipoLista(pt.key)}
                className="relative flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl transition-all"
                style={{
                  backgroundColor: active ? "#111111" : "#ffffff",
                  border: active ? "2px solid #ff9900" : "2px solid #e5e7eb",
                  boxShadow: active ? "0 0 0 1px #ff9900" : undefined,
                }}>
                {active && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#ff9900" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="round" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
                <span style={{ color: active ? "#ff9900" : "#9ca3af" }}><Icon /></span>
                <div className="text-center">
                  <p className="text-sm font-black leading-none" style={{ color: active ? "#ffffff" : "#111111" }}>{pt.label}</p>
                  <p className="text-[9px] mt-1 font-semibold" style={{ color: "#9ca3af" }}>{pt.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Referencias ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Referencias</p>
          <p className="text-xs font-bold text-gray-400">{lines.length} {lines.length === 1 ? "producto" : "productos"}</p>
        </div>

        {lines.map((line, i) => (
          <LineCard key={line.id} line={line} lista={tipoLista} index={i} canRemove={lines.length > 1}
            onChange={(patch) => updateLine(line.id, patch)}
            onRemove={() => removeLine(line.id)} />
        ))}

        {addingProduct ? (
          <ProductPicker onPick={pickProduct} onCancel={() => setAddingProduct(false)} />
        ) : (
          <button onClick={() => setAddingProduct(true)}
            className="w-full h-14 flex items-center justify-center gap-2.5 rounded-2xl text-sm font-bold transition-all"
            style={{ border: "2px dashed #e5e7eb", color: "#9ca3af", backgroundColor: "#fafafa" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff9900";
              e.currentTarget.style.color = "#ff9900";
              e.currentTarget.style.backgroundColor = "#fff7ed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#9ca3af";
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}>
            <IcoPlus />Agregar referencia
          </button>
        )}
      </div>

      {/* ── Resumen y acciones ───────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "2px solid #111111" }}>
        {/* Dark header with line items */}
        <div className="px-5 py-4" style={{ backgroundColor: "#111111" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#ff9900" }}>Resumen</p>
            {client && <p className="text-[11px] font-semibold" style={{ color: "#6b7280" }}>{client.name}</p>}
          </div>

          {lines.length === 0 ? (
            <p className="text-sm py-2" style={{ color: "#4b5563" }}>Agrega referencias para generar la cotizacion.</p>
          ) : (
            <div className="space-y-2">
              {lines.map((l, i) => {
                const u = finalUnit(l.product, tipoLista, l.discount);
                return (
                  <div key={l.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: "#ff9900", color: "#111111" }}>{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight truncate" style={{ color: "#e5e7eb" }}>
                          {l.product.description.split(" ").slice(0, 5).join(" ")}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>
                          {l.qty} un. · {fmtFull(u)}/u{l.discount > 0 ? ` (-${l.discount}%)` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-black tabular-nums flex-shrink-0" style={{ color: "#ffffff" }}>{fmtCOP(u * l.qty)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orange total bar */}
        {lines.length > 0 && (
          <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: "#ff9900" }}>
            <span className="text-xs font-black" style={{ color: "#111111" }}>
              {lines.reduce((a, l) => a + l.qty, 0)} un. · {PRICE_TYPES.find((p) => p.key === tipoLista)?.label}
            </span>
            <span className="text-xl font-black tabular-nums" style={{ color: "#111111" }}>{fmtCOP(grandTotal)}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="bg-white p-4 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => canSave && openPDF(buildCurrentQuote())}
              disabled={!canSave}
              className="h-11 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
              style={{ border: "1.5px solid #e5e7eb" }}>
              <IcoPDF />PDF
            </button>

            {client?.phone ? (
              <a
                href={canSave ? buildWAUrl(buildCurrentQuote(), client.phone) : "#"}
                target="_blank" rel="noopener noreferrer"
                className={["h-11 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition-all",
                  canSave ? "" : "opacity-30 pointer-events-none"].join(" ")}
                style={{ backgroundColor: "#25D366" }}>
                <IcoWA />WhatsApp
              </a>
            ) : (
              <button disabled
                className="h-11 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white opacity-30 cursor-not-allowed"
                style={{ backgroundColor: "#25D366" }}>
                <IcoWA />WhatsApp
              </button>
            )}

            {client?.email ? (
              <a
                href={canSave ? buildMailto(buildCurrentQuote(), client.email) : "#"}
                className={["h-11 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all",
                  canSave ? "" : "opacity-30 pointer-events-none"].join(" ")}
                style={{ border: "1.5px solid #bfdbfe" }}>
                <IcoMail />Email
              </a>
            ) : (
              <button disabled
                className="h-11 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-gray-400 opacity-30 cursor-not-allowed"
                style={{ border: "1.5px solid #e5e7eb" }}>
                <IcoMail />Email
              </button>
            )}
          </div>

          {/* Guardar — full width, prominent */}
          <button onClick={saveQuote} disabled={!canSave}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: canSave ? "#111111" : "#e5e7eb", color: canSave ? "#ff9900" : "#9ca3af" }}>
            <IcoSave />Guardar cotizacion
          </button>
        </div>
      </div>

      {/* ── Historial ────────────────────────────────────────── */}
      {savedQuotes.length > 0 && (
        <div>
          <button onClick={() => setShowHistory((p) => !p)}
            className="w-full flex items-center justify-between px-1 py-2 group">
            <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
              <IcoHistory />
              <span className="text-sm font-bold">Historial de cotizaciones</span>
              <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ff9900", color: "#111111" }}>
                {savedQuotes.length}
              </span>
            </div>
            <span className={["text-gray-400 transition-transform duration-200", showHistory ? "rotate-180" : ""].join(" ")}>
              <IcoChevronD />
            </span>
          </button>

          {showHistory && (
            <div className="space-y-3 mt-1">
              {savedQuotes.map((q) => {
                const qClient = CLIENTS.find((c) => c.id === q.clientId);
                return (
                  <HistoryCard
                    key={q.id}
                    quote={q}
                    clientPhone={qClient?.phone}
                    clientEmail={qClient?.email}
                    onPDF={() => openPDF(q)}
                    isNew={newQuoteId === q.id}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {newQuoteId && savedQuotes.length > 0 && !showHistory && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: "#22c55e" }}>
            <IcoCheck />
          </span>
          <p className="text-sm font-bold text-green-800">Cotizacion guardada en el historial</p>
          <button onClick={() => setShowHistory(true)}
            className="ml-auto text-xs font-black text-green-700 underline">Ver</button>
        </div>
      )}
    </div>
  );
}
