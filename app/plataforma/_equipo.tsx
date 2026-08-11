"use client";

import { useState, type ReactElement } from "react";
import { WELFARE_ITEMS, VACATION_REQUESTS } from "./_data";

/* ── Cuida (welfare) module ─────────────────────────────── */

function CuidaModule(): ReactElement {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Colaboradores inscritos", value: "1.240", color: "#22c55e" },
          { label: "Convenios activos", value: "28", color: "#ff9900" },
          { label: "Solicitudes este mes", value: "143", color: "#3b82f6" },
          { label: "Satisfaccion", value: "91%", color: "#10b981" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Convenios y beneficios</span>
          <span className="text-xs text-gray-400">{WELFARE_ITEMS.length} programas</span>
        </div>
        <div className="divide-y divide-gray-100">
          {WELFARE_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#22c55e18" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400">{item.provider}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900 tabular-nums">{item.beneficiaries.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">beneficiarios</p>
              </div>
              <span className="flex-shrink-0 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Activo</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Vacaciones module ──────────────────────────────────── */

const REQ_STATUS_CFG = {
  pending:  { label: "Pendiente", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  approved: { label: "Aprobada",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Rechazada", bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
};

function VacacionesModule(): ReactElement {
  const [requests, setRequests] = useState(VACATION_REQUESTS);

  function approve(id: string) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" as const } : r));
  }
  function reject(id: string) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" as const } : r));
  }

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Solicitudes pendientes", value: String(pending), color: pending > 0 ? "#f59e0b" : "#10b981" },
          { label: "Aprobadas este mes", value: String(requests.filter(r => r.status === "approved").length), color: "#10b981" },
          { label: "Dias promedio", value: "12", color: "#8b5cf6" },
          { label: "Colaboradores activos", value: "1.240", color: "#3b82f6" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Solicitudes de vacaciones</span>
          {pending > 0 && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {pending} pendiente{pending !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {requests.map((req) => {
            const cfg = REQ_STATUS_CFG[req.status];
            return (
              <div key={req.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[11px] font-bold" style={{ backgroundColor: "#8b5cf618", color: "#8b5cf6" }}>
                  {req.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{req.name}</p>
                  <p className="text-xs text-gray-400">{req.store} · {req.from} – {req.to} · {req.days}d</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} flex-shrink-0`}>
                  {cfg.label}
                </span>
                {req.status === "pending" && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => approve(req.id)}
                      className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all"
                      title="Aprobar"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => reject(req.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100 transition-all"
                      title="Rechazar"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main export — detects which equipo subtool ────────── */

export default function EquipoModule({ moduleKey }: { moduleKey: "cuida" | "vacaciones" }): ReactElement {
  return moduleKey === "cuida" ? <CuidaModule /> : <VacacionesModule />;
}
