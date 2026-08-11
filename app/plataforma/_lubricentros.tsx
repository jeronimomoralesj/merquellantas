"use client";

import { useMemo, useState, type ReactElement } from "react";
import { CLIENTS, computeAlerts, fmtCOP, type VehicleAlert } from "./_data";

/* ── Icons ─────────────────────────────────────────────── */

function IcoOil({ color }: { color: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" fill={color} stroke="none" />
    </svg>
  );
}
function IcoBattery({ color }: { color: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <rect x="2" y="7" width="18" height="11" rx="2" />
      <path d="M22 11v3" strokeWidth="3" />
      <path d="M7 11v3M12 11v3" />
    </svg>
  );
}
function IcoTire({ color }: { color: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round" />
      <line x1="2" y1="12" x2="4" y2="12" strokeLinecap="round" />
      <line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round" />
    </svg>
  );
}
function IcoPhone(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IcoWA(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

/* ── Alert card ─────────────────────────────────────────── */

function AlertCard({ alert, onDismiss }: { alert: VehicleAlert; onDismiss: () => void }): ReactElement {
  const isCritical = alert.urgency === "critical";
  const color = isCritical ? "#ef4444" : "#f59e0b";
  const IconCmp = alert.type === "oil" ? IcoOil : alert.type === "battery" ? IcoBattery : IcoTire;
  const waNum = alert.phone.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hola ${alert.clientName.split(" ")[0]}, le contactamos de Merquellantas respecto al vehiculo ${alert.plate} (${alert.vehicleLabel}).`
  );

  return (
    <div className={`border rounded-2xl p-4 ${isCritical ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCritical ? "bg-red-100" : "bg-amber-100"}`}>
          <IconCmp color={color} />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-bold text-gray-900">{alert.clientName}</span>
            <span className="text-xs font-mono text-gray-500 bg-white/60 px-1.5 py-0.5 rounded-md border border-white/40">{alert.plate}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isCritical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
              {isCritical ? "Critico" : "Aviso"}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{alert.message}</p>
          <p className="text-[11px] text-gray-400 mt-1">{alert.vehicleLabel}</p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-white/60">
        <a href={`tel:${alert.phone}`}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
          <IcoPhone /> Llamar
        </a>
        <a href={`https://wa.me/${waNum}?text=${waMsg}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-white text-xs font-semibold transition-all"
          style={{ backgroundColor: "#25D366" }}>
          <IcoWA /> WhatsApp
        </a>
        <button onClick={onDismiss}
          className="ml-auto flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-gray-200 text-gray-400 text-xs hover:text-gray-700 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Posponer
        </button>
      </div>
    </div>
  );
}

/* ── Vehicle health summary table ───────────────────────── */

function VehicleTable(): ReactElement {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Historial de vehiculos</span>
        <span className="text-xs text-gray-400">{CLIENTS.reduce((a, c) => a + c.vehicles.length, 0)} registros</span>
      </div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              {["Placa", "Vehiculo", "Propietario", "Km actuales", "Aceite (resta)", "Bateria", "Llantas"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-semibold text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {CLIENTS.flatMap((client) =>
              client.vehicles.map((v) => {
                const oilLeft = v.oilChangeIntervalKm - (v.currentKm - v.lastOilChangeKm);
                const tireWear = Math.round((v.tireKmSinceInstall / v.tireLifespanKm) * 100);
                const oilAlert = oilLeft < 1000;
                const batAlert = v.batteryMonths >= 22;
                const tireAlert = tireWear >= 75;
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-gray-900">{v.plate}</td>
                    <td className="px-5 py-3 text-gray-700">{v.make} {v.model} {v.year}</td>
                    <td className="px-5 py-3 text-gray-600">{client.name}</td>
                    <td className="px-5 py-3 font-mono text-gray-700">{v.currentKm.toLocaleString()}</td>
                    <td className={`px-5 py-3 font-semibold ${oilAlert ? "text-red-600" : "text-gray-700"}`}>
                      {oilLeft.toLocaleString()} km
                      {oilAlert && <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">!</span>}
                    </td>
                    <td className={`px-5 py-3 font-semibold ${batAlert ? "text-amber-600" : "text-gray-700"}`}>
                      {v.batteryMonths} meses
                      {batAlert && <span className="ml-1 text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">!</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${tireWear}%`,
                              backgroundColor: tireWear >= 90 ? "#ef4444" : tireWear >= 75 ? "#f59e0b" : "#10b981",
                            }}
                          />
                        </div>
                        <span className={`font-semibold ${tireAlert ? "text-amber-600" : "text-gray-700"}`}>{tireWear}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-100">
        {CLIENTS.flatMap((client) =>
          client.vehicles.map((v) => {
            const oilLeft = v.oilChangeIntervalKm - (v.currentKm - v.lastOilChangeKm);
            const tireWear = Math.round((v.tireKmSinceInstall / v.tireLifespanKm) * 100);
            return (
              <div key={v.id} className="px-4 py-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{v.make} {v.model} {v.year}</p>
                    <p className="text-xs text-gray-400 font-mono">{v.plate} · {client.name}</p>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                    {v.currentKm.toLocaleString()} km
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Aceite", value: `${oilLeft.toLocaleString()}km`, alert: oilLeft < 1000 },
                    { label: "Bateria", value: `${v.batteryMonths}m`, alert: v.batteryMonths >= 22 },
                    { label: "Llantas", value: `${tireWear}%`, alert: tireWear >= 75 },
                  ].map(({ label, value, alert }) => (
                    <div key={label} className={`rounded-lg px-2.5 py-2 ${alert ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
                      <p className="text-[10px] text-gray-400">{label}</p>
                      <p className={`text-xs font-bold ${alert ? "text-amber-700" : "text-gray-900"}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */

export default function LubricentrosModule(): ReactElement {
  const allAlerts = useMemo(() => computeAlerts(CLIENTS), []);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = allAlerts.filter((a) => !dismissed.has(a.id));
  const critical = visible.filter((a) => a.urgency === "critical");
  const warnings = visible.filter((a) => a.urgency === "warning");

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      {visible.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Alertas criticas", value: String(critical.length), color: "#ef4444" },
            { label: "Avisos preventivos", value: String(warnings.length), color: "#f59e0b" },
            { label: "Vehiculos en zona verde", value: String(CLIENTS.reduce((a, c) => a + c.vehicles.length, 0) - visible.length), color: "#10b981" },
            { label: "Total vehiculos", value: String(CLIENTS.reduce((a, c) => a + c.vehicles.length, 0)), color: "#3b82f6" },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Critical alerts first */}
      {critical.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 mb-2.5">Accion inmediata requerida</p>
          <div className="space-y-3">
            {critical.map((a) => (
              <AlertCard key={a.id} alert={a} onDismiss={() => setDismissed((p) => new Set([...p, a.id]))} />
            ))}
          </div>
        </div>
      )}

      {/* Warning alerts */}
      {warnings.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500 mb-2.5">Seguimiento preventivo</p>
          <div className="space-y-3">
            {warnings.map((a) => (
              <AlertCard key={a.id} alert={a} onDismiss={() => setDismissed((p) => new Set([...p, a.id]))} />
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-5 h-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm font-bold text-emerald-800">Todo en orden</p>
          <p className="text-xs text-emerald-600 mt-1">No hay alertas predictivas en este momento.</p>
        </div>
      )}

      {/* Full vehicle health table */}
      <VehicleTable />
    </div>
  );
}
