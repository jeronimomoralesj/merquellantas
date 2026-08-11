"use client";

import { useState, type ReactElement } from "react";
import { INVENTORY_ITEMS } from "./_data";

export default function InventariosModule(): ReactElement {
  const [search, setSearch] = useState("");
  const filtered = INVENTORY_ITEMS.filter((i) =>
    i.product.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = INVENTORY_ITEMS.filter((i) => i.stock < i.min).length;
  const totalSKUs = INVENTORY_ITEMS.length;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "SKUs activos", value: "4.670", color: "#ff9900" },
          { label: "Bodegas", value: "27", color: "#3b82f6" },
          { label: "Unidades en stock", value: "182K", color: "#10b981" },
          { label: "Con quiebre de stock", value: String(lowStock), color: lowStock > 0 ? "#ef4444" : "#10b981" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Inventory table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-9">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto o SKU..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
          {lowStock > 0 && (
            <span className="flex-shrink-0 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
              {lowStock} quiebre{lowStock !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {["SKU", "Producto", "Stock", "Min.", "Estado", "Bodega", "Rotacion"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const pct = Math.min((item.stock / item.min) * 100, 200);
                const isLow = item.stock < item.min;
                const isOk = item.stock >= item.min * 2;
                return (
                  <tr key={item.sku} className={`hover:bg-gray-50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-3 font-mono text-gray-500 text-[10px]">{item.sku}</td>
                    <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">{item.product}</td>
                    <td className={`px-5 py-3 font-bold tabular-nums ${isLow ? "text-red-600" : "text-gray-900"}`}>
                      {item.stock}
                      {isLow && <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">!</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-500 tabular-nums">{item.min}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: isLow ? "#ef4444" : isOk ? "#10b981" : "#f59e0b",
                          }} />
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isLow ? "bg-red-100 text-red-700" : isOk ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {isLow ? "Quiebre" : isOk ? "OK" : "Bajo"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{item.location}</td>
                    <td className="px-5 py-3 text-gray-600 font-medium">{item.rotDays}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filtered.map((item) => {
            const isLow = item.stock < item.min;
            const pct = Math.min((item.stock / (item.min * 2)) * 100, 100);
            return (
              <div key={item.sku} className={`px-4 py-3.5 ${isLow ? "bg-red-50/30" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{item.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-base font-bold tabular-nums ${isLow ? "text-red-600" : "text-gray-900"}`}>{item.stock}</p>
                    <p className="text-[10px] text-gray-400">min {item.min}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: isLow ? "#ef4444" : "#10b981" }} />
                  </div>
                  <span className="text-[10px] text-gray-400">{item.location} · {item.rotDays}d</span>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">Sin resultados para "{search}"</p>
        )}
      </div>
    </div>
  );
}
