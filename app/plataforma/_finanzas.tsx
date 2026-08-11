"use client";

import { useState, type ReactElement } from "react";
import { FINANCE_MONTHS, FINANCE_REVENUE, FINANCE_EXPENSES, FINANCE_EBITDA, fmtCOP } from "./_data";

type FinancialKey = "revenue" | "expenses" | "ebitda";

const DATA_SERIES: { key: FinancialKey; label: string; color: string; data: number[] }[] = [
  { key: "revenue",  label: "Ingresos",  color: "#ff9900", data: FINANCE_REVENUE  },
  { key: "expenses", label: "Egresos",   color: "#ef4444", data: FINANCE_EXPENSES },
  { key: "ebitda",   label: "EBITDA",    color: "#10b981", data: FINANCE_EBITDA   },
];

function BarChart({ subtab }: { subtab: string }): ReactElement {
  const series = subtab === "ingresos"
    ? [DATA_SERIES[0]]
    : subtab === "egresos"
    ? [DATA_SERIES[1]]
    : subtab === "presupuesto"
    ? [DATA_SERIES[0], DATA_SERIES[1]]
    : DATA_SERIES;

  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs font-semibold text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="flex items-end gap-2 sm:gap-3 h-40">
        {FINANCE_MONTHS.map((month, mi) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-32">
              {series.map((s) => {
                const pct = (s.data[mi] / maxVal) * 100;
                return (
                  <div key={s.key} className="flex-1 rounded-t-md transition-all group relative"
                    style={{ height: `${pct}%`, backgroundColor: s.color, opacity: 0.85 }}>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10">
                      {fmtCOP(s.data[mi] * 1_000_000)}
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsGrid({ subtab }: { subtab: string }): ReactElement {
  const lastIdx = FINANCE_REVENUE.length - 1;
  const prevIdx = lastIdx - 1;

  const metrics = subtab === "ingresos"
    ? [
        { label: "Ingresos Jul", value: fmtCOP(FINANCE_REVENUE[lastIdx] * 1_000_000), delta: `+${(((FINANCE_REVENUE[lastIdx] - FINANCE_REVENUE[prevIdx]) / FINANCE_REVENUE[prevIdx]) * 100).toFixed(1)}%`, up: true },
        { label: "Mejor mes (Mar)", value: fmtCOP(Math.max(...FINANCE_REVENUE) * 1_000_000), delta: "record", up: true },
        { label: "Promedio 6M", value: fmtCOP((FINANCE_REVENUE.reduce((a, v) => a + v, 0) / FINANCE_REVENUE.length) * 1_000_000), delta: "ref", up: true },
        { label: "Acumulado", value: fmtCOP(FINANCE_REVENUE.reduce((a, v) => a + v, 0) * 1_000_000), delta: "YTD", up: true },
      ]
    : subtab === "egresos"
    ? [
        { label: "Egresos Jul", value: fmtCOP(FINANCE_EXPENSES[lastIdx] * 1_000_000), delta: `+${(((FINANCE_EXPENSES[lastIdx] - FINANCE_EXPENSES[prevIdx]) / FINANCE_EXPENSES[prevIdx]) * 100).toFixed(1)}%`, up: false },
        { label: "Margen bruto Jul", value: `${Math.round((1 - FINANCE_EXPENSES[lastIdx] / FINANCE_REVENUE[lastIdx]) * 100)}%`, delta: "+1.2pp", up: true },
        { label: "% ingresos", value: `${Math.round((FINANCE_EXPENSES[lastIdx] / FINANCE_REVENUE[lastIdx]) * 100)}%`, delta: "gasto/ingreso", up: false },
        { label: "Acumulado egresos", value: fmtCOP(FINANCE_EXPENSES.reduce((a, v) => a + v, 0) * 1_000_000), delta: "YTD", up: false },
      ]
    : [
        { label: "Ingresos Jul", value: fmtCOP(FINANCE_REVENUE[lastIdx] * 1_000_000), delta: "+9.6%", up: true },
        { label: "Margen bruto", value: "38%", delta: "+1.2pp", up: true },
        { label: "EBITDA Jul", value: fmtCOP(FINANCE_EBITDA[lastIdx] * 1_000_000), delta: "-8.9%", up: false },
        { label: "Gastos operativos", value: fmtCOP(FINANCE_EXPENSES[lastIdx] * 1_000_000), delta: "+9.9%", up: false },
      ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xl font-bold text-gray-900 tabular-nums">{m.value}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">{m.label}</p>
          <p className={`text-[11px] mt-0.5 font-semibold ${m.up ? "text-emerald-600" : "text-red-500"}`}>{m.delta}</p>
        </div>
      ))}
    </div>
  );
}

function MonthlyTable({ subtab }: { subtab: string }): ReactElement {
  const showRev = subtab !== "egresos";
  const showExp = subtab !== "ingresos";
  const showEbi = subtab === "dashboard" || subtab === "";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Detalle mensual (COP millones)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 font-semibold text-gray-400">Mes</th>
              {showRev && <th className="text-right px-5 py-3 font-semibold text-gray-400">Ingresos</th>}
              {showExp && <th className="text-right px-5 py-3 font-semibold text-gray-400">Egresos</th>}
              {showRev && showExp && <th className="text-right px-5 py-3 font-semibold text-gray-400">Margen</th>}
              {showEbi && <th className="text-right px-5 py-3 font-semibold text-gray-400">EBITDA</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {FINANCE_MONTHS.map((month, i) => {
              const margin = Math.round(((FINANCE_REVENUE[i] - FINANCE_EXPENSES[i]) / FINANCE_REVENUE[i]) * 100);
              const isLast = i === FINANCE_MONTHS.length - 1;
              return (
                <tr key={month} className={`hover:bg-gray-50 transition-colors ${isLast ? "bg-gray-50" : ""}`}>
                  <td className="px-5 py-3 font-semibold text-gray-900">{month}{isLast && <span className="ml-1.5 text-[10px] text-gray-400">actual</span>}</td>
                  {showRev && <td className="px-5 py-3 text-right font-mono text-gray-700 tabular-nums">{FINANCE_REVENUE[i].toLocaleString()}</td>}
                  {showExp && <td className="px-5 py-3 text-right font-mono text-red-500 tabular-nums">{FINANCE_EXPENSES[i].toLocaleString()}</td>}
                  {showRev && showExp && (
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold ${margin >= 35 ? "text-emerald-600" : "text-amber-600"}`}>{margin}%</span>
                    </td>
                  )}
                  {showEbi && <td className="px-5 py-3 text-right font-mono text-emerald-600 tabular-nums">{FINANCE_EBITDA[i].toLocaleString()}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FinanzasModule({ subtab }: { subtab: string }): ReactElement {
  return (
    <div className="space-y-5">
      <MetricsGrid subtab={subtab} />
      <BarChart subtab={subtab} />
      <MonthlyTable subtab={subtab} />
    </div>
  );
}
