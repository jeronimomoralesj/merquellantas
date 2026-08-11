"use client";

import { useState, type ReactElement } from "react";
import dynamic from "next/dynamic";

/* ── Module components (lazy-loaded) ──────────────────── */

const CRMModule          = dynamic(() => import("./_crm"),          { ssr: false });
const CotizaModule       = dynamic(() => import("./_cotiza"),       { ssr: false });
const LubricentrosModule = dynamic(() => import("./_lubricentros"), { ssr: false });
const FinanzasModule     = dynamic(() => import("./_finanzas"),     { ssr: false });
const TiendasModule      = dynamic(() => import("./_tiendas"),      { ssr: false });
const InventariosModule  = dynamic(() => import("./_inventarios"),  { ssr: false });
const LogisticaModule    = dynamic(() => import("./_logistica"),    { ssr: false });
const MercadeoModule     = dynamic(() => import("./_mercadeo"),     { ssr: false });
const EquipoModule       = dynamic(() => import("./_equipo"),       { ssr: false });

/* ══════════════════════════════════════════════════════════
   SIDEBAR ICONS
══════════════════════════════════════════════════════════ */

function IconCRM(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconMercadeo(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconCuida(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconLubricentros(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconCotiza(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4M7 8h2M7 12h4M13 8l2 4 2-4" />
    </svg>
  );
}
function IconInventarios(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}
function IconLogistica(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function IconVacaciones(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFinanzas(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconTiendas(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconMenu(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}
function IconClose(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconChevronRight(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconArrowLeft(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   TYPES & DATA
══════════════════════════════════════════════════════════ */

type TabKey =
  | "crm" | "cotiza" | "mercadeo" | "tiendas"
  | "lubricentros" | "inventarios" | "logistica"
  | "finanzas" | "cuida" | "vacaciones";

interface SubTab  { key: string; label: string; }
interface Tab     {
  key: TabKey; label: string; sublabel: string; Icon: () => ReactElement;
  color: string; description: string; subtabs?: SubTab[];
}
interface NavGroup { label: string; keys: TabKey[]; }

const TABS: Tab[] = [
  {
    key: "crm", label: "CRM", sublabel: "Clientes", Icon: IconCRM, color: "#ff9900",
    description: "Gestion centralizada de clientes, oportunidades y seguimiento de ventas para toda la red nacional.",
    subtabs: [
      { key: "dashboard", label: "Dashboard" },
      { key: "clientes", label: "Clientes" },
      { key: "cotizaciones", label: "Cotizaciones" },
      { key: "llamadas", label: "Llamadas" },
      { key: "pipeline", label: "Pipeline" },
      { key: "oportunidades", label: "Oportunidades" },
      { key: "reportes", label: "Reportes" },
    ],
  },
  {
    key: "cotiza", label: "Cotiza", sublabel: "Cotizaciones", Icon: IconCotiza, color: "#f59e0b",
    description: "Motor de cotizacion en tiempo real. Construye propuestas Good/Better/Best y genera el enlace en un toque.",
  },
  {
    key: "mercadeo", label: "Mercadeo", sublabel: "Marketing", Icon: IconMercadeo, color: "#a855f7",
    description: "Campanas digitales, seguimiento de KPIs y coordinacion de activaciones de marca en tiendas.",
  },
  {
    key: "tiendas", label: "Tiendas", sublabel: "Red comercial", Icon: IconTiendas, color: "#0ea5e9",
    description: "Gestion de la red de puntos de venta: desempeno, indicadores por tienda y seguimiento regional.",
    subtabs: [
      { key: "red", label: "Red de tiendas" },
      { key: "desempeno", label: "Desempeno" },
      { key: "mapa", label: "Mapa de cobertura" },
    ],
  },
  {
    key: "lubricentros", label: "Lubricentros", sublabel: "Servicios", Icon: IconLubricentros, color: "#3b82f6",
    description: "Control de servicios de lubricacion, historial de vehiculos, programacion de mantenimientos y alertas predictivas.",
  },
  {
    key: "inventarios", label: "Inventarios", sublabel: "Stock", Icon: IconInventarios, color: "#06b6d4",
    description: "Visibilidad en tiempo real del stock en todas las bodegas, alertas de quiebre y rotacion.",
  },
  {
    key: "logistica", label: "Logistica", sublabel: "Despachos", Icon: IconLogistica, color: "#f43f5e",
    description: "Seguimiento de despachos, rutas de entrega, coordinacion con transportadores y control de ultima milla.",
  },
  {
    key: "finanzas", label: "Finanzas", sublabel: "Finance", Icon: IconFinanzas, color: "#10b981",
    description: "Vision financiera consolidada de la red: ingresos, egresos, presupuesto y analisis de rentabilidad.",
    subtabs: [
      { key: "dashboard", label: "Dashboard" },
      { key: "ingresos", label: "Ingresos" },
      { key: "egresos", label: "Egresos" },
      { key: "presupuesto", label: "Presupuesto" },
    ],
  },
  {
    key: "cuida", label: "Merque Te Cuida", sublabel: "Bienestar", Icon: IconCuida, color: "#22c55e",
    description: "Programa de bienestar para colaboradores: seguros, convenios medicos, capacitaciones y beneficios exclusivos.",
  },
  {
    key: "vacaciones", label: "Vacaciones", sublabel: "Permisos", Icon: IconVacaciones, color: "#8b5cf6",
    description: "Solicitud y seguimiento de dias de vacaciones. Aprobacion en linea por el jefe directo.",
  },
];

const NAV_GROUPS: NavGroup[] = [
  { label: "Ventas",      keys: ["crm", "cotiza", "mercadeo"] },
  { label: "Operaciones", keys: ["tiendas", "lubricentros", "inventarios", "logistica"] },
  { label: "Finanzas",    keys: ["finanzas"] },
  { label: "Equipo",      keys: ["cuida", "vacaciones"] },
];

/* ══════════════════════════════════════════════════════════
   NAV ITEM
══════════════════════════════════════════════════════════ */

function NavItem({
  tab, isCurrentModule, isExpanded, activeSubtabKey,
  onTabClick, onSubtabClick,
}: {
  tab: Tab; isCurrentModule: boolean; isExpanded: boolean; activeSubtabKey: string;
  onTabClick: () => void; onSubtabClick: (key: string) => void;
}): ReactElement {
  const hasSubtabs = !!tab.subtabs?.length;
  const active = isCurrentModule && (!hasSubtabs || !isExpanded);

  return (
    <div>
      <button
        onClick={onTabClick}
        className={[
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left group transition-all",
          active ? "bg-orange-50 text-gray-900" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
        ].join(" ")}
      >
        <span className="flex-shrink-0 transition-all" style={active ? { color: tab.color } : { color: "#9ca3af" }}>
          <tab.Icon />
        </span>
        <div className="flex-1 min-w-0">
          <p className={["text-[13px] font-medium leading-none truncate", active ? "text-gray-900" : "text-gray-600"].join(" ")}>
            {tab.label}
          </p>
          <p className="text-[10px] leading-none mt-0.5 truncate text-gray-400">{tab.sublabel}</p>
        </div>
        {hasSubtabs ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={["w-3 h-3 flex-shrink-0 text-gray-400 transition-transform duration-200", isExpanded ? "rotate-90" : ""].join(" ")}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
        )}
      </button>

      {hasSubtabs && (
        <div className={["overflow-hidden transition-all duration-200", isExpanded ? "max-h-56 opacity-100" : "max-h-0 opacity-0"].join(" ")}>
          <div className="pl-[38px] pr-2 pt-0.5 pb-1 space-y-0.5">
            {tab.subtabs!.map((st) => {
              const isActiveSub = isCurrentModule && activeSubtabKey === st.key;
              return (
                <button key={st.key} onClick={() => onSubtabClick(st.key)}
                  className={["w-full text-left px-3 py-1.5 rounded-md text-xs transition-all",
                    isActiveSub ? "text-gray-900 font-semibold bg-orange-50" : "text-gray-400 hover:text-gray-700"].join(" ")}>
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MODULE CONTENT ROUTER
══════════════════════════════════════════════════════════ */

function ModuleContent({ tabKey, subtab }: { tabKey: TabKey; subtab: string }): ReactElement {
  switch (tabKey) {
    case "crm":
      return <CRMModule subtab={subtab} />;
    case "cotiza":
      return <CotizaModule />;
    case "lubricentros":
      return <LubricentrosModule />;
    case "finanzas":
      return <FinanzasModule subtab={subtab} />;
    case "tiendas":
      return <TiendasModule subtab={subtab} />;
    case "inventarios":
      return <InventariosModule />;
    case "logistica":
      return <LogisticaModule />;
    case "mercadeo":
      return <MercadeoModule />;
    case "cuida":
      return <EquipoModule moduleKey="cuida" />;
    case "vacaciones":
      return <EquipoModule moduleKey="vacaciones" />;
    default:
      return <></>;
  }
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

export default function PlataformaPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("crm");
  const [activeSubtabKey, setActiveSubtabKey] = useState<string>("");
  const [expandedTabs, setExpandedTabs] = useState<Set<TabKey>>(new Set<TabKey>());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tab = TABS.find((t) => t.key === activeTab)!;
  const activeSubtab = tab.subtabs?.find((s) => s.key === activeSubtabKey) ?? null;

  function handleTabClick(key: TabKey) {
    const target = TABS.find((t) => t.key === key)!;
    setActiveTab(key);
    if (target.subtabs?.length) {
      setExpandedTabs((prev) => {
        const next = new Set(prev);
        if (next.has(key)) { next.delete(key); }
        else {
          next.add(key);
          if (activeTab !== key) setActiveSubtabKey(target.subtabs![0].key);
        }
        return next;
      });
      if (activeTab !== key) setActiveSubtabKey(target.subtabs[0].key);
    } else {
      setActiveSubtabKey("");
      setDrawerOpen(false);
    }
  }

  function handleSubtabClick(tabKey: TabKey, subtabKey: string) {
    setActiveTab(tabKey);
    setActiveSubtabKey(subtabKey);
    setDrawerOpen(false);
  }

  /* Sidebar inner content */
  const sidebarInner = (
    <>
      <div className="flex items-center justify-between px-4 h-[58px] border-b border-gray-100 flex-shrink-0">
        <a href="/" className="flex items-center gap-2 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.merquellantas.com/assets/images/logo/Logo-Merquellantas.png" alt="Merquellantas"
            className="h-5 w-auto flex-shrink-0 opacity-90"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const span = document.createElement("span");
              span.className = "text-gray-900 text-sm font-black tracking-tight";
              span.textContent = "Merquellantas";
              e.currentTarget.parentNode?.appendChild(span);
            }} />
        </a>
        <button onClick={() => setDrawerOpen(false)}
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          aria-label="Cerrar menu">
          <IconClose />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-2.5 no-scrollbar" style={{ gap: 0 }}>
        {NAV_GROUPS.map((group) => {
          const items = group.keys.map((k) => TABS.find((t) => t.key === k)!);
          return (
            <div key={group.label} className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-1.5 text-gray-400">{group.label}</p>
              <div className="space-y-0.5">
                {items.map((t) => (
                  <NavItem
                    key={t.key} tab={t}
                    isCurrentModule={activeTab === t.key}
                    isExpanded={expandedTabs.has(t.key)}
                    activeSubtabKey={activeSubtabKey}
                    onTabClick={() => handleTabClick(t.key)}
                    onSubtabClick={(subKey) => handleSubtabClick(t.key, subKey)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-gray-100">
            <span className="text-[11px] font-black text-gray-700 leading-none">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-xs font-medium leading-none truncate">Andrea S.</p>
            <p className="text-[10px] leading-none mt-0.5 truncate text-gray-400">BOG Norte</p>
          </div>
        </div>
        <a href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors">
          <IconArrowLeft /> Volver al sitio
        </a>
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "#f4f4f5" }}>
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Sidebar — dark */}
      <aside className={[
        "fixed inset-y-0 left-0 lg:relative lg:inset-auto z-50 lg:z-auto",
        "w-[232px] flex-shrink-0 flex flex-col",
        "transition-transform duration-300 ease-in-out",
        drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")} style={{ backgroundColor: "#ffffff", borderRight: "1px solid #e5e7eb" }}>
        {sidebarInner}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-[58px] flex items-center bg-white border-b border-gray-100 px-4 lg:px-6 gap-3">
          <button onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all flex-shrink-0"
            aria-label="Abrir menu">
            <IconMenu />
          </button>

          <a href="/" className="lg:hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.merquellantas.com/assets/images/logo/Logo-Merquellantas.png" alt="Merquellantas"
              className="h-5 w-auto" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </a>

          <div className="hidden lg:flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs text-gray-400">Plataforma</span>
            <span className="text-gray-300 text-xs"><IconChevronRight /></span>
            {activeSubtab ? (
              <>
                <span className="text-xs text-gray-400">{tab.label}</span>
                <span className="text-gray-300 text-xs"><IconChevronRight /></span>
                <span className="text-xs font-semibold text-gray-800 truncate">{activeSubtab.label}</span>
              </>
            ) : (
              <span className="text-xs font-semibold text-gray-800 truncate">{tab.label}</span>
            )}
          </div>

          <span className="lg:hidden flex-1 text-gray-900 text-sm font-semibold truncate">
            {activeSubtab ? `${tab.label} — ${activeSubtab.label}` : tab.label}
          </span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-gray-400 text-xs hidden sm:block">En linea</span>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6 lg:p-8 max-w-5xl">

            {/* Page header — typography only, no icon box */}
            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5" style={{ color: tab.color }}>
                {tab.sublabel}
              </p>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-none">
                {activeSubtab ? activeSubtab.label : tab.label}
              </h1>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xl">{tab.description}</p>
            </div>

            <ModuleContent tabKey={activeTab} subtab={activeSubtabKey} />

          </div>
        </main>
      </div>
    </div>
  );
}
