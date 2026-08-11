"use client";

import { type ReactElement } from "react";
import { LOGISTICS_ITEMS, type LogStatus } from "./_data";

const STATUS_CFG: Record<LogStatus, { label: string; bg: string; text: string; dot: string }> = {
  en_ruta:    { label: "En ruta",    bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400"    },
  en_bodega:  { label: "En bodega",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  entregado:  { label: "Entregado",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  procesando: { label: "Procesando", bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400"    },
};

function StatusPill({ status }: { status: LogStatus }): ReactElement {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function LogisticaModule(): ReactElement {
  const inTransit = LOGISTICS_ITEMS.filter((i) => i.status === "en_ruta").length;
  const delivered = LOGISTICS_ITEMS.filter((i) => i.status === "entregado").length;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pedidos en tránsito", value: "2.140", color: "#3b82f6" },
          { label: "Entregas hoy", value: "634", color: "#ff9900" },
          { label: "Tiempo promedio", value: "1.4d", color: "#10b981" },
          { label: "On-time delivery", value: "96%", color: "#10b981" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Shipments */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Despachos activos</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{inTransit} en ruta</span>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{delivered} entregados</span>
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {["# Despacho", "Destino", "Cliente", "Productos", "Estado", "ETA", "Transportador"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {LOGISTICS_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-gray-700">{item.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{item.destination}</td>
                  <td className="px-5 py-3 text-gray-600">{item.client}</td>
                  <td className="px-5 py-3 text-gray-600 max-w-[160px] truncate">{item.items}</td>
                  <td className="px-5 py-3"><StatusPill status={item.status} /></td>
                  <td className={`px-5 py-3 font-semibold ${item.status === "entregado" ? "text-emerald-600" : "text-gray-700"}`}>{item.eta}</td>
                  <td className="px-5 py-3 text-gray-500">{item.carrier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {LOGISTICS_ITEMS.map((item) => (
            <div key={item.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{item.client}</p>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{item.items}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-gray-500">{item.id}</p>
                  <p className="text-xs font-semibold text-gray-900 mt-0.5">{item.eta}</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">{item.destination} · {item.carrier}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
