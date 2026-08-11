"use client";

import { type ReactElement } from "react";
import { STORE_METRICS, fmtCOP } from "./_data";

export default function TiendasModule({ subtab }: { subtab: string }): ReactElement {
  const totalSales = STORE_METRICS.reduce((a, s) => a + s.sales, 0);
  const totalTarget = STORE_METRICS.reduce((a, s) => a + s.target, 0);
  const avgNPS = Math.round(STORE_METRICS.reduce((a, s) => a + s.nps, 0) / STORE_METRICS.length);
  const overTarget = STORE_METRICS.filter((s) => s.sales >= s.target).length;

  if (subtab === "mapa") {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Mapa de cobertura</span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">Integración de mapa próximamente</p>
          <p className="text-xs text-gray-400 max-w-xs">El mapa interactivo de cobertura nacional se habilitará en la siguiente versión del módulo.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
            {STORE_METRICS.map((s) => (
              <div key={s.id} className="bg-gray-50 rounded-xl p-3 text-left">
                <p className="text-xs font-semibold text-gray-900 truncate">{s.name}</p>
                <p className="text-[11px] text-gray-400">{s.city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ventas hoy (red)", value: fmtCOP(totalSales), color: "#ff9900" },
          { label: "vs Meta", value: `${Math.round((totalSales / totalTarget) * 100)}%`, color: totalSales >= totalTarget ? "#10b981" : "#f59e0b" },
          { label: "NPS promedio red", value: String(avgNPS), color: "#3b82f6" },
          { label: "Tiendas sobre meta", value: `${overTarget}/${STORE_METRICS.length}`, color: "#10b981" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Store grid */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Rendimiento por tienda</span>
          <span className="text-xs text-gray-400">{STORE_METRICS.length} tiendas activas</span>
        </div>
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {["Tienda", "Ciudad", "Ventas hoy", "vs Meta", "Progreso", "NPS", "Tickets", "MoM"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STORE_METRICS.map((s) => {
                const pct = Math.round((s.sales / s.target) * 100);
                const over = s.sales >= s.target;
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-900">{s.name}</td>
                    <td className="px-5 py-3 text-gray-500">{s.city}</td>
                    <td className="px-5 py-3 font-bold text-gray-900 tabular-nums">{fmtCOP(s.sales)}</td>
                    <td className={`px-5 py-3 font-bold tabular-nums ${over ? "text-emerald-600" : "text-amber-600"}`}>{pct}%</td>
                    <td className="px-5 py-3">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? "#10b981" : "#ff9900" }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-700 tabular-nums">{s.nps}</td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">{s.tickets}</td>
                    <td className={`px-5 py-3 font-semibold ${s.growth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {s.growth >= 0 ? "+" : ""}{s.growth}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {STORE_METRICS.map((s) => {
            const pct = Math.round((s.sales / s.target) * 100);
            const over = s.sales >= s.target;
            return (
              <div key={s.id} className="px-4 py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.city} · {s.tickets} tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{fmtCOP(s.sales)}</p>
                    <p className={`text-xs font-semibold ${over ? "text-emerald-600" : "text-amber-600"}`}>{pct}% meta</p>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? "#10b981" : "#ff9900" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
