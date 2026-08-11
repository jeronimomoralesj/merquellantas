"use client";

import { type ReactElement } from "react";
import { CAMPAIGNS, fmtCOP } from "./_data";

type CampaignStatus = "active" | "completed" | "draft";

const STATUS_CFG: Record<CampaignStatus, { label: string; bg: string; text: string; dot: string }> = {
  active:    { label: "Activa",     bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  completed: { label: "Completada", bg: "bg-gray-100",   text: "text-gray-500",   dot: "bg-gray-400"    },
  draft:     { label: "Borrador",   bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-400"    },
};

export default function MercadeoModule(): ReactElement {
  const active = CAMPAIGNS.filter((c) => c.status === "active");
  const totalBudget = CAMPAIGNS.reduce((a, c) => a + c.budget, 0);
  const totalSpent = CAMPAIGNS.reduce((a, c) => a + c.spent, 0);
  const totalLeads = CAMPAIGNS.reduce((a, c) => a + c.leads, 0);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Campanas activas", value: String(active.length), color: "#10b981" },
          { label: "Presupuesto total", value: fmtCOP(totalBudget), color: "#ff9900" },
          { label: "Invertido", value: fmtCOP(totalSpent), color: "#3b82f6" },
          { label: "Leads generados", value: totalLeads.toLocaleString(), color: "#a855f7" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-bold tabular-nums" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {CAMPAIGNS.map((camp) => {
          const cfg = STATUS_CFG[camp.status];
          const spendPct = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0;
          const avgCPL = camp.leads > 0 ? Math.round(camp.spent / camp.leads) : 0;

          return (
            <div key={camp.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{camp.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{camp.channel}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Spend bar */}
              {camp.status !== "draft" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-400">Presupuesto ejecutado</span>
                    <span className="text-[11px] font-bold text-gray-700">{spendPct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${spendPct}%`,
                        backgroundColor: spendPct >= 90 ? "#ef4444" : spendPct >= 70 ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{fmtCOP(camp.spent)} invertido</span>
                    <span className="text-[10px] text-gray-400">{fmtCOP(camp.budget)} total</span>
                  </div>
                </div>
              )}
              {camp.status === "draft" && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                  <p className="text-[11px] text-blue-600 font-medium">Pendiente de aprobacion</p>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400">Leads</p>
                  <p className="text-sm font-bold text-gray-900 tabular-nums">{camp.leads.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400">CPL</p>
                  <p className="text-sm font-bold text-gray-900 tabular-nums">
                    {avgCPL > 0 ? fmtCOP(avgCPL) : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
