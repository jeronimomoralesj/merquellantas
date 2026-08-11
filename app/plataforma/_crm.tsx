"use client";

import React, { useState, useMemo, useEffect, useRef, type ReactElement, type ReactNode } from "react";
import {
  CLIENTS, DEALS, WAREHOUSES, CRM_PRODUCTS, computeAlerts, fmtCOP, CURRENT_USER, INIT_COTIZACIONES,
  type Client, type Vehicle, type Deal, type DealStage, type VehicleAlert,
  type LeadSource, type PaymentMethod, type Plazo, type TipoLista,
  type Cotizacion, type CrmProduct,
} from "./_data";

/* ══════════════════════════════════════════════════════════
   SERVICE HISTORY
══════════════════════════════════════════════════════════ */

interface ServiceRecord {
  id: string;
  createdAt: string;
  date: string;
  type: "oil" | "tires" | "battery" | "alignment" | "inspection" | "retread";
  description: string;
  plate: string;
  amount: number;
  store: string;
  loggedBy: string;
}

const INIT_HISTORY: Record<string, ServiceRecord[]> = {
  c1: [
    { id: "h1",  createdAt: "2026-07-15T10:32:00Z", date: "15 Jul 2026", type: "oil",       description: "Cambio aceite 5W-30 Mobil Full Synthetic + filtro", plate: "ABC-123", amount: 118000,  store: "BOG Norte",  loggedBy: "Miguel R."  },
    { id: "h2",  createdAt: "2026-05-10T09:15:00Z", date: "10 May 2026", type: "tires",     description: "4x Continental CrossContact AT 265/65R17",           plate: "ABC-123", amount: 3200000, store: "BOG Norte",  loggedBy: "Miguel R."  },
    { id: "h3",  createdAt: "2026-01-22T14:00:00Z", date: "22 Ene 2026", type: "alignment", description: "Alineacion computarizada y balanceo dinamico",        plate: "ABC-123", amount: 85000,   store: "BOG Norte",  loggedBy: "Miguel R."  },
  ],
  c2: [
    { id: "h4",  createdAt: "2026-07-20T08:45:00Z", date: "20 Jul 2026", type: "oil",       description: "Aceite Mobil Diesel 15W-40 x4L",                     plate: "TRK-007", amount: 280000,  store: "MED Itague", loggedBy: "Andrea S."  },
    { id: "h5",  createdAt: "2026-07-01T11:20:00Z", date: "1 Jul 2026",  type: "alignment", description: "Alineacion y balanceo + inspeccion de frenos",        plate: "TRK-012", amount: 95000,   store: "MED Itague", loggedBy: "Andrea S."  },
    { id: "h6",  createdAt: "2026-06-15T14:30:00Z", date: "15 Jun 2026", type: "tires",     description: "4x Bridgestone R164 7.50R16",                         plate: "TRK-007", amount: 4400000, store: "MED Itague", loggedBy: "Andrea S."  },
    { id: "h7",  createdAt: "2026-03-03T10:00:00Z", date: "3 Mar 2026",  type: "inspection",description: "Inspeccion tecnica flota x2 vehiculos",               plate: "TRK-007", amount: 180000,  store: "MED Itague", loggedBy: "Andrea S."  },
  ],
  c3: [
    { id: "h8",  createdAt: "2026-06-02T09:30:00Z", date: "2 Jun 2026",  type: "oil",       description: "Cambio aceite 10W-40 Valvoline + filtro de aceite",   plate: "XYZ-456", amount: 95000,   store: "CAL Norte",  loggedBy: "Carlos T."  },
    { id: "h9",  createdAt: "2026-01-15T13:00:00Z", date: "15 Ene 2026", type: "tires",     description: "2x Goodyear Assurance ComfortDrive 205/55R16",        plate: "XYZ-456", amount: 840000,  store: "CAL Norte",  loggedBy: "Carlos T."  },
  ],
  c4: [
    { id: "h10", createdAt: "2026-07-20T07:55:00Z", date: "20 Jul 2026", type: "oil",       description: "Aceite 5W-30 Mazda Original 6L + filtro",             plate: "SUV-901", amount: 420000,  store: "BOG Norte",  loggedBy: "Miguel R."  },
    { id: "h11", createdAt: "2026-05-05T10:10:00Z", date: "5 May 2026",  type: "alignment", description: "Alineacion computarizada 4 ruedas",                   plate: "SUV-901", amount: 75000,   store: "BOG Norte",  loggedBy: "Miguel R."  },
    { id: "h12", createdAt: "2026-03-08T09:00:00Z", date: "8 Mar 2026",  type: "tires",     description: "4x Kumho Road Venture AT51 225/65R17",                plate: "SUV-901", amount: 2160000, store: "BOG Norte",  loggedBy: "Miguel R."  },
  ],
  c5: [
    { id: "h13", createdAt: "2026-03-12T11:45:00Z", date: "12 Mar 2026", type: "oil",       description: "Cambio aceite 20W-50 Valvoline Max Life",              plate: "RIO-345", amount: 85000,   store: "BAQ",        loggedBy: "Carlos T."  },
    { id: "h14", createdAt: "2025-11-10T14:20:00Z", date: "10 Nov 2025", type: "tires",     description: "2x Fate Tiger 185/65R15 + instalacion",               plate: "RIO-345", amount: 420000,  store: "BAQ",        loggedBy: "Carlos T."  },
  ],
  c6: [
    { id: "h15", createdAt: "2026-07-21T08:10:00Z", date: "21 Jul 2026", type: "oil",       description: "Aceite Castrol Diesel 15W-40 x6L",                    plate: "FLT-201", amount: 560000,  store: "BOG Sur",    loggedBy: "Andrea S."  },
    { id: "h16", createdAt: "2026-06-10T10:30:00Z", date: "10 Jun 2026", type: "tires",     description: "4x Goodyear Fleet HSD LT235/85R16",                   plate: "FLT-201", amount: 5200000, store: "BOG Sur",    loggedBy: "Andrea S."  },
    { id: "h17", createdAt: "2026-04-01T09:00:00Z", date: "1 Abr 2026",  type: "inspection",description: "Revision general + diagnostico electronico",           plate: "FLT-201", amount: 240000,  store: "BOG Sur",    loggedBy: "Andrea S."  },
  ],
  c7: [
    { id: "h18", createdAt: "2026-07-19T15:00:00Z", date: "19 Jul 2026", type: "tires",     description: "4x Kumho Solus HA31 215/65R16 + balanceo",            plate: "DUS-888", amount: 1800000, store: "BOG Norte",  loggedBy: "Carlos T."  },
    { id: "h19", createdAt: "2026-06-02T10:00:00Z", date: "2 Jun 2026",  type: "oil",       description: "Aceite 5W-30 Renault Original + filtro",              plate: "DUS-888", amount: 210000,  store: "BOG Norte",  loggedBy: "Carlos T."  },
  ],
  c8: [
    { id: "h20", createdAt: "2026-06-05T11:30:00Z", date: "5 Jun 2026",  type: "oil",       description: "Cambio aceite 0W-20 Full Synthetic + filtro",         plate: "KOR-777", amount: 380000,  store: "CAL Norte",  loggedBy: "Andrea S."  },
    { id: "h21", createdAt: "2026-02-20T09:45:00Z", date: "20 Feb 2026", type: "tires",     description: "2x Pirelli Scorpion STR 235/55R18",                   plate: "KOR-777", amount: 1780000, store: "CAL Norte",  loggedBy: "Andrea S."  },
  ],
};

/* ══════════════════════════════════════════════════════════
   ACTIVITY RECORDS
══════════════════════════════════════════════════════════ */

interface ActivityRecord {
  id: string;
  createdAt: string;
  type: "call" | "visit" | "note" | "appointment";
  title: string;
  notes: string;
  scheduledAt?: string;
  location?: string;
  duration?: number;
  outcome?: "completed" | "no-answer" | "rescheduled" | "pending";
  loggedBy: string;
}

const INIT_ACTIVITIES: Record<string, ActivityRecord[]> = {
  c1: [
    { id: "a1c1", createdAt: "2026-07-18T14:30:00Z", type: "call",        title: "Seguimiento cambio de llantas",    notes: "Carlos confirma que los Continental funcionan bien. Consulto por un segundo vehiculo.",   outcome: "completed",  duration: 8,  loggedBy: "Miguel R." },
    { id: "a2c1", createdAt: "2026-07-10T10:00:00Z", type: "note",        title: "Preferencia de marca",             notes: "Cliente prefiere Continental y Bridgestone. Precio no es la principal barrera.",                                                             loggedBy: "Miguel R." },
  ],
  c2: [
    { id: "a1c2", createdAt: "2026-07-22T09:00:00Z", type: "appointment", title: "Reunion revision contrato anual",  notes: "Presentar propuesta de llantas para la flota 2027. Traer cotizacion por escrito.",          scheduledAt: "2026-07-28T14:00:00Z", location: "Oficinas TruckPrime - Piso 3", loggedBy: "Andrea S." },
    { id: "a2c2", createdAt: "2026-07-20T08:30:00Z", type: "visit",       title: "Visita deposito de flota",        notes: "Se revisaron 2 tractomulas. Estado de llantas es critico en TRK-007. Cotizacion enviada.",  location: "Deposito TruckPrime - Cra 65 #12-30, Medellin",                          loggedBy: "Andrea S." },
    { id: "a3c2", createdAt: "2026-07-15T16:00:00Z", type: "call",        title: "Llamada seguimiento presupuesto", notes: "Juan esta a la espera de aprobacion del comite de compras. Llama de nuevo la proxima semana.", outcome: "completed",  duration: 12, loggedBy: "Andrea S." },
    { id: "a4c2", createdAt: "2026-07-01T11:15:00Z", type: "call",        title: "Intento contacto inicial",        notes: "No contesto. Deje mensaje de voz.",                                                           outcome: "no-answer",  duration: 1,  loggedBy: "Andrea S." },
  ],
  c3: [
    { id: "a1c3", createdAt: "2026-06-10T10:00:00Z", type: "note",        title: "Interesada en plan de mantenimiento preventivo", notes: "Laura pregunto si manejamos planes de mantenimiento por km. Posible oportunidad de contrato de servicio.", loggedBy: "Carlos T." },
  ],
  c4: [
    { id: "a1c4", createdAt: "2026-07-22T08:00:00Z", type: "appointment", title: "Cita cambio de aceite y revision general", notes: "Andres trae el SUV-901. Revisar frenos y estado de la bateria tambien.",                scheduledAt: "2026-07-25T10:00:00Z", location: "BOG Norte - Taller", loggedBy: "Miguel R." },
    { id: "a2c4", createdAt: "2026-07-19T15:30:00Z", type: "call",        title: "Coordinacion de cita",                   notes: "Andres confirmo disponibilidad para el viernes. Agendado en el sistema.",                outcome: "completed",  duration: 5, loggedBy: "Miguel R." },
  ],
  c5: [
    { id: "a1c5", createdAt: "2026-04-05T09:00:00Z", type: "visit",       title: "Visita en tienda BAQ",           notes: "Maria llego a comprar un par de llantas para su Spark. Quedo muy satisfecha con el servicio.",    location: "Tienda Barranquilla - Cra 45 #70-20",                                    loggedBy: "Carlos T." },
  ],
  c6: [
    { id: "a1c6", createdAt: "2026-07-21T09:30:00Z", type: "call",        title: "Confirmacion renovacion contrato flota", notes: "Roberto confirmo que renovaran contrato. Solicita ajuste en precio por volumen. Revisando con gerencia.", outcome: "completed", duration: 18, loggedBy: "Andrea S." },
    { id: "a2c6", createdAt: "2026-07-15T11:00:00Z", type: "visit",       title: "Inspeccion flota FLT",           notes: "Inspeccionados 3 vehiculos de la flota. FLT-201 necesita 4 llantas urgente — ya cotizado.",       location: "Sede Central Expreso Bolivar - Bogota Sur",                              loggedBy: "Andrea S." },
    { id: "a3c6", createdAt: "2026-07-08T16:00:00Z", type: "appointment", title: "Reunion propuesta contrato 2H",  notes: "Presentar el plan de mantenimiento preventivo para el segundo semestre.",                         scheduledAt: "2026-07-10T09:00:00Z", location: "Oficinas cliente",             loggedBy: "Andrea S." },
  ],
  c7: [
    { id: "a1c7", createdAt: "2026-07-20T13:00:00Z", type: "note",        title: "Nota post-servicio",             notes: "Sofia quedo muy satisfecha con la instalacion de Kumho. Potencial recomendadora. Pedirle review.", loggedBy: "Carlos T." },
  ],
  c8: [
    { id: "a1c8", createdAt: "2026-06-20T10:00:00Z", type: "call",        title: "Seguimiento post-compra llantas", notes: "Diego confirma que las Pirelli estan funcionando perfecto. Sin novedad.",                         outcome: "completed", duration: 6,  loggedBy: "Andrea S." },
    { id: "a2c8", createdAt: "2026-05-28T14:30:00Z", type: "note",        title: "Perfil comprador exigente",       notes: "Diego investiga mucho antes de comprar. Prefiere marcas premium. Siempre pide factura detallada.", loggedBy: "Andrea S." },
  ],
};

/* ══════════════════════════════════════════════════════════
   CALL RECORDS
══════════════════════════════════════════════════════════ */

interface CallFollowUp {
  type: "call" | "visit" | "appointment";
  scheduledAt: string;
  notes: string;
  done: boolean;
}

interface CallRecord {
  id: string;
  clientId?: string;
  clientName: string;
  phone: string;
  direction: "inbound" | "outbound";
  status: "completed" | "missed" | "voicemail" | "no-answer";
  duration?: number;
  startedAt: string;
  hasRecording: boolean;
  notes?: string;
  loggedBy: string;
  followUp?: CallFollowUp;
}

const INIT_CALLS: CallRecord[] = [
  { id: "call1",  clientId: "c1", clientName: "Carlos Mendoza",    phone: "+573001234567", direction: "outbound", status: "completed",  duration: 183, startedAt: "2026-07-27T09:15:00Z", hasRecording: true,  notes: "Seguimiento cambio de llantas. Confirmo cita para la proxima semana.", loggedBy: "Andrea S."  },
  { id: "call2",  clientId: "c2", clientName: "TruckPrime S.A.S",  phone: "+573109876543", direction: "inbound",  status: "completed",  duration: 425, startedAt: "2026-07-27T08:30:00Z", hasRecording: true,  notes: "Juan pregunta por el estado de la cotizacion de renovacion de flota.",  loggedBy: "Andrea S."  },
  { id: "call3",  clientId: "c4", clientName: "Andres Herrera",    phone: "+573124445678", direction: "outbound", status: "missed",                    startedAt: "2026-07-27T08:00:00Z", hasRecording: false, loggedBy: "Andrea S."  },
  { id: "call4",  clientId: "c6", clientName: "Expreso Bolivar",   phone: "+573001112233", direction: "inbound",  status: "completed",  duration: 312, startedAt: "2026-07-26T16:45:00Z", hasRecording: true,  notes: "Roberto confirma condiciones del contrato renovado.",                   loggedBy: "Miguel R."  },
  { id: "call5",  clientId: "c3", clientName: "Laura Jimenez",     phone: "+573215556789", direction: "outbound", status: "no-answer",               startedAt: "2026-07-26T14:20:00Z", hasRecording: false, loggedBy: "Andrea S."  },
  { id: "call6",  clientId: "c7", clientName: "Sofia Ramirez",     phone: "+573156789012", direction: "outbound", status: "completed",  duration: 97,  startedAt: "2026-07-26T11:00:00Z", hasRecording: false, notes: "Solicito informacion sobre plan de mantenimiento.",                     loggedBy: "Carlos T."  },
  { id: "call7",  clientId: "c5", clientName: "Maria Castellanos", phone: "+573187654321", direction: "inbound",  status: "voicemail",               startedAt: "2026-07-25T10:30:00Z", hasRecording: true,  loggedBy: "Carlos T."  },
  { id: "call8",  clientId: "c8", clientName: "Diego Vargas",      phone: "+573048765432", direction: "outbound", status: "completed",  duration: 241, startedAt: "2026-07-25T09:15:00Z", hasRecording: true,  notes: "Consulta disponibilidad Pirelli Scorpion para el fin de semana.",      loggedBy: "Andrea S."  },
  { id: "call9",  clientId: "c2", clientName: "TruckPrime S.A.S",  phone: "+573109876543", direction: "outbound", status: "completed",  duration: 558, startedAt: "2026-07-24T15:00:00Z", hasRecording: true,  notes: "Negociacion precio por volumen. Acuerdo 8% descuento para orden de 20 llantas.", loggedBy: "Andrea S." },
  { id: "call10", clientId: "c1", clientName: "Carlos Mendoza",    phone: "+573001234567", direction: "inbound",  status: "missed",                   startedAt: "2026-07-24T11:45:00Z", hasRecording: false, loggedBy: "Miguel R."  },
];

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

/* ══════════════════════════════════════════════════════════
   MODAL STATE
══════════════════════════════════════════════════════════ */

type ModalState =
  | { kind: "none" }
  | { kind: "create-prospecto" }
  | { kind: "post-save"; clientId: string; clientName: string }
  | { kind: "cotizacion"; clientId: string; clientName: string }
  | { kind: "create-client" }
  | { kind: "edit-client"; client: Client }
  | { kind: "add-vehicle"; clientId: string }
  | { kind: "edit-vehicle"; clientId: string; vehicle: Vehicle }
  | { kind: "add-service"; clientId: string; plates: string[] }
  | { kind: "add-activity"; clientId: string; initialType?: ActivityFD["type"] };

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */

const IcoPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IcoWA = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 flex-shrink-0">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoChevronR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-300">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IcoPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcoDrop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const IcoBattery = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
    <rect x="2" y="7" width="18" height="11" rx="2" /><path d="M22 11v3" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const IcoTire = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3.5" />
    <line x1="12" y1="2" x2="12" y2="4.5" strokeLinecap="round" />
    <line x1="12" y1="19.5" x2="12" y2="22" strokeLinecap="round" />
    <line x1="2" y1="12" x2="4.5" y2="12" strokeLinecap="round" />
    <line x1="19.5" y1="12" x2="22" y2="12" strokeLinecap="round" />
  </svg>
);
const IcoTool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IcoQuote = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4M7 8h2M7 12h4M13 8l2 4 2-4" />
  </svg>
);
const IcoAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/* ── Tab-bar icons (CRM module + detail panel) ────────── */

const IcoTabUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoTabCotizacion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IcoTabPipeline = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="3" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="8" rx="1" />
  </svg>
);
const IcoTabTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IcoTabChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IcoTabCar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v7a2 2 0 0 1-2 2h-2" />
    <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    <path d="M9 11h6" />
  </svg>
);
const IcoTabActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IcoTabHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 15" />
  </svg>
);
const IcoTabBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" />
  </svg>
);
const IcoTabUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IcoMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoPhoneCall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    <polyline points="16 2 16 8 22 8" />
    <line x1="22" y1="2" x2="16" y2="8" />
  </svg>
);
const IcoFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const IcoPhoneIn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    <polyline points="16 8 22 2" /><polyline points="17 2 22 2 22 7" />
  </svg>
);
const IcoPhoneOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    <polyline points="22 8 16 2" /><polyline points="21 2 16 2 16 7" />
  </svg>
);
const IcoPhoneOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);
const IcoSaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IcoMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IcoMicOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IcoPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IcoPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const IcoTabPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════
   FORM PRIMITIVES
══════════════════════════════════════════════════════════ */

function FLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FInput({ label, value, onChange, type = "text", required = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <FLabel required={required}>{label}</FLabel>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-300" />
    </div>
  );
}

function FSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <FLabel>{label}</FLabel>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FSep({ label }: { label: string }) {
  return <p className="text-xs font-semibold text-gray-400 col-span-2 pt-3 pb-0.5 border-t border-gray-100 mt-1">{label}</p>;
}

/* ══════════════════════════════════════════════════════════
   MODAL WRAPPER
══════════════════════════════════════════════════════════ */

function Modal({ title, subtitle, onClose, children, wide = false }: {
  title: string; subtitle?: string; onClose: () => void; children: ReactNode; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={["relative bg-white rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col w-full overflow-hidden max-h-[92dvh]", wide ? "sm:max-w-2xl" : "sm:max-w-lg"].join(" ")}>
        <div className="flex items-start justify-between px-5 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
            <IcoX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}

function FormFooter({ onCancel, label, disabled }: { onCancel: () => void; label: string; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
      <button type="button" onClick={onCancel}
        className="h-9 px-4 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
        Cancelar
      </button>
      <button type="submit" disabled={disabled}
        className="h-9 px-5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        style={{ backgroundColor: "#ff9900" }}>
        {label}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROSPECTO FORM
══════════════════════════════════════════════════════════ */

const LEAD_SOURCES: { key: LeadSource; label: string }[] = [
  { key: "referido", label: "Referido" },
  { key: "toma",     label: "Toma"     },
  { key: "carpa",    label: "Carpa"    },
  { key: "feria",    label: "Feria"    },
  { key: "otro",     label: "+ Otro"   },
];

interface ProspectoFD { name: string; phone: string; email: string; leadSource: LeadSource; otherSource: string; }

function ProspectoForm({ onSubmit, onCancel }: {
  onSubmit: (d: ProspectoFD) => void; onCancel: () => void;
}): ReactElement {
  const [f, setF] = useState<ProspectoFD>({ name: "", phone: "", email: "", leadSource: "referido", otherSource: "" });
  const set = (k: keyof ProspectoFD) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.name.trim() && (f.phone.trim() || f.email.trim());
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(f); }} className="flex flex-col">
      <div className="p-5 space-y-4">
        <FInput label="Nombre completo" value={f.name} onChange={set("name")} required placeholder="Ej: Carlos Mendoza" />
        <div className="grid grid-cols-2 gap-3">
          <FInput label="Celular" value={f.phone} onChange={set("phone")} type="tel" placeholder="+57 300 000 0000" />
          <FInput label="Correo" value={f.email} onChange={set("email")} type="email" placeholder="correo@email.com" />
        </div>
        {!f.phone.trim() && !f.email.trim() && (
          <p className="text-[11px] text-amber-600 -mt-2">Ingresa celular o correo (al menos uno)</p>
        )}
        <div>
          <FLabel>Como llego el prospecto</FLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {LEAD_SOURCES.map((s) => (
              <button key={s.key} type="button" onClick={() => setF((p) => ({ ...p, leadSource: s.key }))}
                className={["h-11 px-5 rounded-xl text-sm font-bold border-2 transition-all",
                  f.leadSource === s.key ? "border-[#ff9900] bg-orange-50 text-[#ff9900]" : "border-gray-200 text-gray-600",
                ].join(" ")}>
                {s.label}
              </button>
            ))}
          </div>
          {f.leadSource === "otro" && (
            <div className="mt-2">
              <FInput label="Especifica el origen" value={f.otherSource} onChange={set("otherSource")} placeholder="De donde viene este prospecto?" />
            </div>
          )}
        </div>
      </div>
      <FormFooter onCancel={onCancel} label="Guardar prospecto" disabled={!valid} />
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   POST-SAVE ACTION SHEET
══════════════════════════════════════════════════════════ */

function PostSaveSheet({ clientName, onNew, onActivity, onData, onCotiza, onClose }: {
  clientName: string; onNew: () => void; onActivity: () => void;
  onData: () => void; onCotiza: () => void; onClose: () => void;
}): ReactElement {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <p className="text-base font-bold text-gray-900">Prospecto guardado</p>
          </div>
          <p className="text-sm text-gray-500 ml-10">{clientName}</p>
        </div>
        <div className="p-5 space-y-3">
          <button onClick={onCotiza}
            className="w-full h-16 flex items-center gap-4 px-5 rounded-2xl text-left"
            style={{ backgroundColor: "#ff990010", border: "2px solid #ff9900" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: "#ff9900" }}>
              <IcoQuote />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#ff9900" }}>Crear cotizacion</p>
              <p className="text-xs text-gray-400 mt-0.5">Generar propuesta de venta</p>
            </div>
          </button>
          <button onClick={onActivity}
            className="w-full h-16 flex items-center gap-4 px-5 rounded-2xl bg-gray-50 border-2 border-gray-100 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
              <IcoTabActivity />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Registrar actividad</p>
              <p className="text-xs text-gray-400 mt-0.5">Llamada, visita, nota o cita</p>
            </div>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onData}
              className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-gray-50 border-2 border-gray-100 text-sm font-semibold text-gray-600 py-3.5">
              <IcoPencil />Mas datos
            </button>
            <button onClick={onNew}
              className="h-13 flex items-center justify-center gap-2 rounded-2xl bg-gray-50 border-2 border-gray-100 text-sm font-semibold text-gray-600 py-3.5">
              <IcoPlus />Nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENT FORM
══════════════════════════════════════════════════════════ */

interface ClientFD { name: string; phone: string; city: string; segment: string; status: string; nps: string; }

function ClientForm({ initial, onSubmit, onCancel, mode }: {
  initial?: Partial<ClientFD>; onSubmit: (d: ClientFD) => void; onCancel: () => void; mode: "create" | "edit";
}): ReactElement {
  const [f, setF] = useState<ClientFD>({
    name: initial?.name ?? "", phone: initial?.phone ?? "", city: initial?.city ?? "",
    segment: initial?.segment ?? "B2C", status: initial?.status ?? "active", nps: initial?.nps ?? "75",
  });
  const set = (k: keyof ClientFD) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.phone.trim() && f.city.trim();

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(f); }} className="flex flex-col">
      <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <div className="col-span-2">
          <FInput label="Nombre completo" value={f.name} onChange={set("name")} required placeholder="Ej: Carlos Mendoza" />
        </div>
        <FInput label="Telefono" value={f.phone} onChange={set("phone")} type="tel" required placeholder="+57 300 000 0000" />
        <FInput label="Ciudad" value={f.city} onChange={set("city")} required placeholder="Bogota, Medellin..." />
        <FSelect label="Segmento" value={f.segment} onChange={set("segment")} options={[
          { value: "B2C", label: "B2C — Particular" },
          { value: "B2B", label: "B2B — Empresa" },
          { value: "Fleet", label: "Fleet — Flota" },
        ]} />
        <FSelect label="Estado" value={f.status} onChange={set("status")} options={[
          { value: "active",   label: "Activo"     },
          { value: "at-risk",  label: "En riesgo"  },
          { value: "dormant",  label: "Inactivo"   },
        ]} />
        {mode === "edit" && (
          <FInput label="NPS (0–100)" value={f.nps} onChange={set("nps")} type="number" placeholder="75" />
        )}
      </div>
      <FormFooter onCancel={onCancel} label={mode === "create" ? "Crear cliente" : "Guardar cambios"} disabled={!valid} />
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   VEHICLE FORM
══════════════════════════════════════════════════════════ */

interface VehicleFD {
  plate: string; vin: string; make: string; model: string; year: string;
  currentKm: string; weeklyKm: string; lastOilChangeKm: string; oilChangeIntervalKm: string;
  batteryMonths: string; tireSize: string; tireKmSinceInstall: string; tireLifespanKm: string;
}

function VehicleForm({ initial, onSubmit, onCancel, mode }: {
  initial?: Partial<VehicleFD>; onSubmit: (d: VehicleFD) => void; onCancel: () => void; mode: "add" | "edit";
}): ReactElement {
  const [f, setF] = useState<VehicleFD>({
    plate: initial?.plate ?? "", vin: initial?.vin ?? "",
    make: initial?.make ?? "", model: initial?.model ?? "",
    year: initial?.year ?? String(new Date().getFullYear()),
    currentKm: initial?.currentKm ?? "0", weeklyKm: initial?.weeklyKm ?? "200",
    lastOilChangeKm: initial?.lastOilChangeKm ?? "0", oilChangeIntervalKm: initial?.oilChangeIntervalKm ?? "10000",
    batteryMonths: initial?.batteryMonths ?? "0", tireSize: initial?.tireSize ?? "",
    tireKmSinceInstall: initial?.tireKmSinceInstall ?? "0", tireLifespanKm: initial?.tireLifespanKm ?? "50000",
  });
  const set = (k: keyof VehicleFD) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.plate.trim() && f.make.trim() && f.model.trim() && f.tireSize.trim();

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(f); }} className="flex flex-col">
      <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <FSep label="Datos del vehiculo" />
        <FInput label="Placa" value={f.plate} onChange={set("plate")} required placeholder="ABC-123" />
        <FInput label="Año" value={f.year} onChange={set("year")} type="number" required placeholder="2022" />
        <FInput label="Marca" value={f.make} onChange={set("make")} required placeholder="Toyota, Chevrolet..." />
        <FInput label="Modelo" value={f.model} onChange={set("model")} required placeholder="Hilux, NPR..." />
        <div className="col-span-2">
          <FInput label="VIN (opcional)" value={f.vin} onChange={set("vin")} placeholder="17 caracteres" />
        </div>

        <FSep label="Kilometraje y aceite" />
        <FInput label="Km actuales" value={f.currentKm} onChange={set("currentKm")} type="number" required placeholder="45000" />
        <FInput label="Km/semana prom." value={f.weeklyKm} onChange={set("weeklyKm")} type="number" required placeholder="300" />
        <FInput label="Km ultimo cambio aceite" value={f.lastOilChangeKm} onChange={set("lastOilChangeKm")} type="number" required placeholder="40000" />
        <FInput label="Intervalo cambio (km)" value={f.oilChangeIntervalKm} onChange={set("oilChangeIntervalKm")} type="number" required placeholder="5000" />

        <FSep label="Bateria y llantas" />
        <FInput label="Meses de bateria" value={f.batteryMonths} onChange={set("batteryMonths")} type="number" required placeholder="12" />
        <FInput label="Medida de llanta" value={f.tireSize} onChange={set("tireSize")} required placeholder="205/55R16" />
        <FInput label="Km desde instalacion llantas" value={f.tireKmSinceInstall} onChange={set("tireKmSinceInstall")} type="number" required placeholder="8000" />
        <FInput label="Vida util llanta (km)" value={f.tireLifespanKm} onChange={set("tireLifespanKm")} type="number" required placeholder="50000" />
      </div>
      <FormFooter onCancel={onCancel} label={mode === "add" ? "Agregar vehiculo" : "Guardar vehiculo"} disabled={!valid} />
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICE RECORD FORM
══════════════════════════════════════════════════════════ */

interface ServiceFD { type: string; plate: string; description: string; amount: string; store: string; date: string; }

function ServiceForm({ plates, onSubmit, onCancel }: {
  plates: string[]; onSubmit: (d: ServiceFD) => void; onCancel: () => void;
}): ReactElement {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState<ServiceFD>({ type: "oil", plate: plates[0] ?? "", description: "", amount: "", store: "", date: today });
  const set = (k: keyof ServiceFD) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.description.trim() && f.amount.trim() && f.store.trim() && f.plate.trim();

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(f); }} className="flex flex-col">
      <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <FSelect label="Tipo de servicio" value={f.type} onChange={set("type")} options={[
          { value: "oil",        label: "Cambio de aceite"       },
          { value: "tires",      label: "Llantas"                },
          { value: "battery",    label: "Bateria"                },
          { value: "alignment",  label: "Alineacion y balanceo"  },
          { value: "inspection", label: "Inspeccion / diagnostico"},
          { value: "retread",    label: "Reencauche"             },
        ]} />
        <FSelect label="Placa" value={f.plate} onChange={set("plate")}
          options={plates.map((p) => ({ value: p, label: p }))} />
        <div className="col-span-2">
          <FInput label="Descripcion del servicio" value={f.description} onChange={set("description")} required placeholder="Ej: Cambio aceite 5W-30 Mobil + filtro" />
        </div>
        <FInput label="Valor (COP)" value={f.amount} onChange={set("amount")} type="number" required placeholder="120000" />
        <FInput label="Tienda" value={f.store} onChange={set("store")} required placeholder="BOG Norte, MED Itague..." />
        <div className="col-span-2">
          <FInput label="Fecha del servicio" value={f.date} onChange={set("date")} type="date" required />
        </div>
      </div>
      <FormFooter onCancel={onCancel} label="Registrar servicio" disabled={!valid} />
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   ACTIVITY FORM
══════════════════════════════════════════════════════════ */

interface ActivityFD {
  type: "call" | "visit" | "note" | "appointment";
  title: string;
  notes: string;
  outcome: string;
  duration: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
}

const ACT_TYPES: { key: ActivityFD["type"]; label: string; icon: ReactElement; color: string }[] = [
  { key: "call",        label: "Llamada", icon: <IcoPhoneCall />, color: "#3b82f6" },
  { key: "visit",       label: "Visita",  icon: <IcoMapPin />,    color: "#10b981" },
  { key: "note",        label: "Nota",    icon: <IcoFileText />,  color: "#8b5cf6" },
  { key: "appointment", label: "Cita",    icon: <IcoCalendar />,  color: "#ff9900" },
];

function ActivityForm({ onSubmit, onCancel, initialType = "call" }: {
  onSubmit: (d: ActivityFD) => void; onCancel: () => void; initialType?: ActivityFD["type"];
}): ReactElement {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState<ActivityFD>({
    type: initialType, title: "", notes: "", outcome: "completed",
    duration: "", location: "", scheduledDate: today, scheduledTime: "09:00",
  });
  const set = (k: keyof ActivityFD) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.notes.trim().length > 0;

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(f); }} className="flex flex-col">
      <div className="p-5 space-y-4">
        {/* Type selector */}
        <div>
          <FLabel>Tipo de actividad</FLabel>
          <div className="grid grid-cols-4 gap-2">
            {ACT_TYPES.map((t) => (
              <button key={t.key} type="button" onClick={() => setF((p) => ({ ...p, type: t.key }))}
                className={["flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-center", f.type === t.key ? "border-current" : "border-gray-200 hover:border-gray-300"].join(" ")}
                style={f.type === t.key ? { borderColor: t.color, backgroundColor: `${t.color}0d`, color: t.color } : { color: "#9ca3af" }}>
                {t.icon}
                <span className="text-[10px] font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <FInput label="Titulo (opcional)" value={f.title} onChange={set("title")} placeholder={
          f.type === "call" ? "Ej: Llamada seguimiento propuesta" :
          f.type === "visit" ? "Ej: Visita bodega cliente" :
          f.type === "note" ? "Ej: Nota sobre preferencias" : "Ej: Reunion revision contrato"
        } />

        {/* Notes */}
        <div>
          <FLabel required>Notas</FLabel>
          <textarea value={f.notes} onChange={(e) => set("notes")(e.target.value)} required rows={3}
            placeholder="Descripcion detallada de la actividad..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300 resize-none" />
        </div>

        {/* Conditional fields */}
        {f.type === "call" && (
          <div className="grid grid-cols-2 gap-4">
            <FSelect label="Resultado" value={f.outcome} onChange={set("outcome")} options={[
              { value: "completed",  label: "Completada"   },
              { value: "no-answer",  label: "Sin respuesta"},
              { value: "rescheduled",label: "Reagendada"   },
              { value: "pending",    label: "Pendiente"    },
            ]} />
            <FInput label="Duracion (min)" value={f.duration} onChange={set("duration")} type="number" placeholder="10" />
          </div>
        )}

        {f.type === "visit" && (
          <FInput label="Ubicacion" value={f.location} onChange={set("location")} placeholder="Ej: Bodega principal - Cra 30 #15-40" />
        )}

        {f.type === "appointment" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FInput label="Fecha de la cita" value={f.scheduledDate} onChange={set("scheduledDate")} type="date" />
              <FInput label="Hora" value={f.scheduledTime} onChange={set("scheduledTime")} type="time" />
            </div>
            <FInput label="Lugar (opcional)" value={f.location} onChange={set("location")} placeholder="Ej: Oficina cliente - Piso 3" />
          </>
        )}
      </div>
      <FormFooter onCancel={onCancel} label={
        f.type === "call" ? "Registrar llamada" : f.type === "visit" ? "Registrar visita" :
        f.type === "note" ? "Guardar nota" : "Agendar cita"
      } disabled={!valid} />
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   COTIZACION WIZARD
══════════════════════════════════════════════════════════ */

type WizStep = "pago" | "plazo" | "productos" | "inventario" | "resumen";

interface WizLine {
  product: CrmProduct; qty: number; tipoLista: TipoLista;
  discount: number; warehouseAlloc: Record<string, number>;
}

const PM_OPTIONS: { key: PaymentMethod; label: string; desc: string }[] = [
  { key: "contado",        label: "Contado",        desc: "Pago inmediato"      },
  { key: "addi",           label: "Addi",           desc: "Credito digital"     },
  { key: "creditodirecto", label: "Cred. Directo",  desc: "Financiacion propia" },
  { key: "mf",             label: "MF",             desc: "Merquellantas Fin."  },
];

const PLAZO_OPTIONS: { key: Plazo; label: string }[] = [
  { key: "0-30",   label: "0 – 30 dias"   },
  { key: "30-60",  label: "30 – 60 dias"  },
  { key: "60-90",  label: "60 – 90 dias"  },
  { key: "90-120", label: "90 – 120 dias" },
];

const LISTA_LABELS: Record<TipoLista, string> = { distribuidor: "Distribuidor", instalador: "Instalador", publico: "Publico" };

function lineUnitPrice(product: CrmProduct, lista: TipoLista): number {
  if (lista === "distribuidor") return product.precioDistribuidor;
  if (lista === "instalador")   return product.precioInstalador;
  return product.precioPublico;
}

function fmtCOPFull(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function wizStepList(pm: PaymentMethod | null): WizStep[] {
  const base: WizStep[] = ["pago", "productos", "inventario", "resumen"];
  if (pm && pm !== "contado") return ["pago", "plazo", "productos", "inventario", "resumen"];
  return base;
}

function generatePDF(cot: Cotizacion, clientName: string) {
  const date = new Date(cot.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const pmLabel = PM_OPTIONS.find((p) => p.key === cot.paymentMethod)?.label ?? cot.paymentMethod;
  const rows = cot.lines.map((l) => `<tr>
    <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:13px">${l.productName}</td>
    <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px">${l.qty}</td>
    <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px">${fmtCOPFull(l.finalUnit)}</td>
    <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700">${fmtCOPFull(l.subtotal)}</td>
  </tr>`).join("");
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Cotizacion ${cot.id}</title>
  <style>body{font-family:-apple-system,sans-serif;margin:0;padding:32px;color:#111;max-width:800px;margin:0 auto}
  h1{font-size:28px;font-weight:900;color:#ff9900;margin:0 0 4px}table{width:100%;border-collapse:collapse}
  th{background:#f9f9f9;padding:10px 8px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:#666;letter-spacing:.08em}
  @media print{body{padding:16px}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
    <div><h1>Merquellantas</h1><p style="color:#666;font-size:13px;margin:0">Cotizacion No. ${cot.id}</p></div>
    <div style="text-align:right"><p style="font-size:13px;color:#666;margin:0">${date}</p><p style="font-size:13px;color:#666;margin:4px 0 0">Asesor: ${cot.rep}</p></div>
  </div>
  <div style="background:#f9f9f9;border-radius:12px;padding:16px 20px;margin-bottom:24px">
    <p style="margin:0 0 4px;font-size:14px;font-weight:700">${clientName}</p>
    <p style="margin:0;font-size:13px;color:#666">Pago: ${pmLabel}${cot.plazo ? " · Plazo: " + cot.plazo + " dias" : ""}</p>
  </div>
  <table><thead><tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Total</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <div style="text-align:right;margin-top:20px;padding-top:20px;border-top:2px solid #ff9900">
    <p style="font-size:22px;font-weight:900;color:#ff9900;margin:0">Total: ${fmtCOPFull(cot.total)}</p>
  </div>
  <p style="margin-top:40px;font-size:11px;color:#999;text-align:center">Cotizacion valida por 5 dias habiles · Merquellantas S.A.S. · www.merquellantas.com</p>
  </body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

function CotizacionWizard({ clientId, clientName, onClose, onSave }: {
  clientId: string; clientName: string; onClose: () => void; onSave: (c: Cotizacion) => void;
}): ReactElement {
  const [pm, setPm] = useState<PaymentMethod | null>(null);
  const [plazo, setPlazo] = useState<Plazo | null>(null);
  const [step, setStep] = useState<WizStep>("pago");
  const [lines, setLines] = useState<WizLine[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [pendingProduct, setPendingProduct] = useState<CrmProduct | null>(null);
  const [pendingQty, setPendingQty] = useState("1");
  const [pendingLista, setPendingLista] = useState<TipoLista>("instalador");
  const [pendingDiscount, setPendingDiscount] = useState("0");

  const steps = useMemo(() => wizStepList(pm), [pm]);
  const stepIdx = steps.indexOf(step);

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    return q ? CRM_PRODUCTS.filter((p) => p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tireSize.toLowerCase().includes(q)) : CRM_PRODUCTS;
  }, [productSearch]);

  function addLine() {
    if (!pendingProduct) return;
    const unitPrice = lineUnitPrice(pendingProduct, pendingLista);
    const disc = Math.max(0, Math.min(40, parseInt(pendingDiscount) || 0));
    const qty = Math.max(1, parseInt(pendingQty) || 1);
    setLines((p) => [...p, { product: pendingProduct!, qty, tipoLista: pendingLista, discount: disc, warehouseAlloc: {} }]);
    setPendingProduct(null); setProductSearch(""); setPendingQty("1"); setPendingDiscount("0");
  }

  function setAlloc(lineIdx: number, warehouseId: string, qty: number) {
    setLines((p) => p.map((l, i) => {
      if (i !== lineIdx) return l;
      const alloc = { ...l.warehouseAlloc, [warehouseId]: Math.max(0, qty) };
      if (!alloc[warehouseId]) delete alloc[warehouseId];
      return { ...l, warehouseAlloc: alloc };
    }));
  }

  function lineAllocated(l: WizLine) { return Object.values(l.warehouseAlloc).reduce((a, b) => a + b, 0); }

  function buildCotizacion(): Cotizacion {
    const cotLines = lines.map((l) => {
      const unitPrice = lineUnitPrice(l.product, l.tipoLista);
      const finalUnit = Math.round(unitPrice * (1 - l.discount / 100));
      return {
        productSku: l.product.sku, productName: l.product.description,
        qty: l.qty, tipoLista: l.tipoLista, unitPrice, discount: l.discount,
        finalUnit, subtotal: finalUnit * l.qty,
        warehouseAlloc: Object.entries(l.warehouseAlloc).map(([wid, wqty]) => ({
          warehouseId: wid,
          warehouseName: WAREHOUSES.find((w) => w.id === wid)?.name ?? wid,
          qty: wqty,
        })),
      };
    });
    return {
      id: `COT-${Date.now().toString().slice(-6)}`,
      clientId, clientName, createdAt: new Date().toISOString(),
      rep: CURRENT_USER.name, paymentMethod: pm!, plazo: plazo ?? undefined,
      lines: cotLines, total: cotLines.reduce((a, l) => a + l.subtotal, 0), status: "borrador",
    };
  }

  function goNext() { const i = steps.indexOf(step); if (i < steps.length - 1) setStep(steps[i + 1]); }
  function goBack() { const i = steps.indexOf(step); if (i > 0) setStep(steps[i - 1]); }

  const canGoNext =
    (step === "pago"       && pm !== null) ||
    (step === "plazo"      && plazo !== null) ||
    (step === "productos"  && lines.length > 0) ||
    (step === "inventario" && lines.every((l) => lineAllocated(l) >= l.qty)) ||
    step === "resumen";

  const STEP_LABELS: Record<WizStep, string> = { pago: "Pago", plazo: "Plazo", productos: "Productos", inventario: "Bodegas", resumen: "Resumen" };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col w-full sm:max-w-xl overflow-hidden max-h-[94dvh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900">Nueva cotizacion</p>
            <p className="text-sm text-gray-400 mt-0.5">{clientName}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"><IcoX /></button>
        </div>
        {/* Progress */}
        <div className="flex items-center px-5 py-3 border-b border-gray-100 flex-shrink-0 overflow-x-auto no-scrollbar gap-1">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={["flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold",
                step === s ? "text-[#ff9900] bg-orange-50" : stepIdx > i ? "text-emerald-600" : "text-gray-300"].join(" ")}>
                <span className={["w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black",
                  step === s ? "bg-[#ff9900] text-white" : stepIdx > i ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"].join(" ")}>{i + 1}</span>
                {STEP_LABELS[s]}
              </div>
              {i < steps.length - 1 && <span className="text-gray-300 mx-0.5">›</span>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">

          {/* STEP: PAGO */}
          {step === "pago" && (
            <div className="p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Metodo de pago</p>
              <div className="grid grid-cols-2 gap-3">
                {PM_OPTIONS.map((opt) => (
                  <button key={opt.key} type="button"
                    onClick={() => { setPm(opt.key); if (opt.key === "contado") setPlazo(null); }}
                    className={["h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all",
                      pm === opt.key ? "border-[#ff9900] bg-orange-50" : "border-gray-200"].join(" ")}>
                    <span className={`text-lg font-black ${pm === opt.key ? "text-[#ff9900]" : "text-gray-800"}`}>{opt.label}</span>
                    <span className="text-xs text-gray-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: PLAZO */}
          {step === "plazo" && (
            <div className="p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Plazo de pago</p>
              <div className="grid grid-cols-2 gap-3">
                {PLAZO_OPTIONS.map((opt) => (
                  <button key={opt.key} type="button" onClick={() => setPlazo(opt.key)}
                    className={["h-20 flex items-center justify-center rounded-2xl border-2 transition-all",
                      plazo === opt.key ? "border-[#ff9900] bg-orange-50" : "border-gray-200"].join(" ")}>
                    <span className={`text-base font-bold ${plazo === opt.key ? "text-[#ff9900]" : "text-gray-800"}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: PRODUCTOS */}
          {step === "productos" && (
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agregar producto</p>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10">
                  <IcoSearch />
                  <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Buscar marca, medida..."
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none" />
                  {productSearch && <button type="button" onClick={() => setProductSearch("")} className="text-gray-400 hover:text-gray-700"><IcoX /></button>}
                </div>
                {!pendingProduct && (
                  <div className="max-h-44 overflow-y-auto no-scrollbar space-y-0.5">
                    {filteredProducts.slice(0, 10).map((p) => (
                      <button key={p.sku} type="button"
                        onClick={() => { setPendingProduct(p); setProductSearch(""); }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all">
                        <p className="text-[12px] font-semibold text-gray-900 leading-snug">{p.description}</p>
                        <p className="text-[10px] text-gray-400">{p.brand} · {p.tireSize}</p>
                      </button>
                    ))}
                  </div>
                )}
                {pendingProduct && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-[12px] font-bold text-gray-900 leading-snug">{pendingProduct.description}</p>
                      <button type="button" onClick={() => setPendingProduct(null)} className="text-gray-400 hover:text-gray-700 flex-shrink-0 mt-0.5"><IcoX /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <FLabel>Cant.</FLabel>
                        <input type="number" min="1" value={pendingQty} onChange={(e) => setPendingQty(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-center font-bold text-gray-900 bg-white focus:outline-none focus:border-gray-400" />
                      </div>
                      <div className="col-span-2">
                        <FLabel>Lista de precios</FLabel>
                        <div className="flex gap-1.5">
                          {(["distribuidor","instalador","publico"] as TipoLista[]).map((l) => (
                            <button key={l} type="button" onClick={() => setPendingLista(l)}
                              className={["flex-1 h-10 rounded-xl border-2 text-[11px] font-bold transition-all",
                                pendingLista === l ? "border-[#ff9900] bg-orange-50 text-[#ff9900]" : "border-gray-200 text-gray-500"].join(" ")}>
                              {l === "distribuidor" ? "Dist." : l === "instalador" ? "Inst." : "Pub."}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <FLabel>Descuento % (max 40)</FLabel>
                      <input type="number" min="0" max="40" value={pendingDiscount} onChange={(e) => setPendingDiscount(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-[10px] text-gray-400">Precio por unidad</p>
                        <p className="text-sm font-bold text-gray-900">{fmtCOPFull(Math.round(lineUnitPrice(pendingProduct, pendingLista) * (1 - (parseInt(pendingDiscount) || 0) / 100)))}</p>
                      </div>
                      <button type="button" onClick={addLine}
                        className="h-10 px-5 rounded-xl text-sm font-bold text-white flex items-center gap-1.5" style={{ backgroundColor: "#ff9900" }}>
                        <IcoPlus />Agregar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {lines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lineas agregadas ({lines.length})</p>
                  {lines.map((l, i) => {
                    const finalUnit = Math.round(lineUnitPrice(l.product, l.tipoLista) * (1 - l.discount / 100));
                    return (
                      <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-gray-900 truncate">{l.product.description}</p>
                          <p className="text-[10px] text-gray-400">{l.qty} u · {LISTA_LABELS[l.tipoLista]}{l.discount > 0 ? ` · -${l.discount}%` : ""} · {fmtCOPFull(finalUnit * l.qty)}</p>
                        </div>
                        <button type="button" onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"><IcoX /></button>
                      </div>
                    );
                  })}
                  <div className="text-right pt-1">
                    <p className="text-xs text-gray-400">Subtotal estimado</p>
                    <p className="text-lg font-black" style={{ color: "#ff9900" }}>
                      {fmtCOPFull(lines.reduce((acc, l) => acc + Math.round(lineUnitPrice(l.product, l.tipoLista) * (1 - l.discount / 100)) * l.qty, 0))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP: INVENTARIO */}
          {step === "inventario" && (
            <div className="p-5 space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asignar bodegas — toca varias si es necesario</p>
              {lines.map((l, lineIdx) => {
                const allocated = lineAllocated(l);
                const done = allocated >= l.qty;
                return (
                  <div key={lineIdx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${done ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-900 truncate">{l.product.description}</p>
                        <p className="text-[11px] text-gray-500">Necesita: {l.qty} u</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ml-3 flex-shrink-0 ${done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {allocated}/{l.qty}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {WAREHOUSES.map((wh) => {
                        const stock = l.product.stock[wh.id] ?? 0;
                        const val = l.warehouseAlloc[wh.id] ?? 0;
                        return (
                          <div key={wh.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-gray-900">{wh.name}</p>
                              <p className={`text-[10px] ${stock > 0 ? "text-gray-400" : "text-red-400 font-semibold"}`}>{stock > 0 ? `Stock: ${stock} u` : "Sin stock"}</p>
                            </div>
                            <input type="number" min="0" max={stock} value={val || ""} placeholder="0"
                              onChange={(e) => setAlloc(lineIdx, wh.id, parseInt(e.target.value) || 0)}
                              disabled={stock === 0}
                              className="w-16 h-9 text-center text-sm font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ff9900] disabled:opacity-30 disabled:bg-gray-50" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP: RESUMEN */}
          {step === "resumen" && (() => {
            const cot = buildCotizacion();
            return (
              <div className="p-5 space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <p className="text-sm font-bold text-gray-900">{clientName}</p>
                    <p className="text-xs text-gray-400">
                      {PM_OPTIONS.find((p) => p.key === pm)?.label}
                      {plazo ? ` · ${plazo} dias` : ""}
                    </p>
                  </div>
                  {cot.lines.map((l, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-gray-900 leading-snug">{l.productName}</p>
                        <p className="text-[10px] text-gray-400">{l.qty} u · {LISTA_LABELS[l.tipoLista]}{l.discount > 0 ? ` · -${l.discount}%` : ""}</p>
                        {l.warehouseAlloc.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{l.warehouseAlloc.map((a) => `${a.warehouseName}: ${a.qty}u`).join(" · ")}</p>
                        )}
                      </div>
                      <p className="text-[12px] font-bold text-gray-900 flex-shrink-0">{fmtCOPFull(l.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-gray-500">Total</p>
                  <p className="text-2xl font-black" style={{ color: "#ff9900" }}>{fmtCOPFull(cot.total)}</p>
                </div>
                {pm === "contado" && (
                  <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <span className="text-emerald-600 font-bold text-sm">Promo contado:</span>
                    <span className="text-sm text-emerald-700">Descuento adicional aplicable — validar con gerencia</span>
                  </div>
                )}
                {lines.some((l) => l.qty >= 4) && (
                  <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <span className="text-blue-600 font-bold text-sm">Promo volumen:</span>
                    <span className="text-sm text-blue-700">Compra de 4+ unidades — verificar beneficio adicional</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button type="button" onClick={() => generatePDF(cot, clientName)}
                    className="h-12 rounded-2xl border-2 border-gray-300 text-sm font-bold text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                    <IcoFileText />PDF / Imprimir
                  </button>
                  <button type="button" onClick={() => { onSave(cot); onClose(); }}
                    className="h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center" style={{ backgroundColor: "#ff9900" }}>
                    Guardar
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer nav */}
        {step !== "resumen" && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button type="button" onClick={goBack} disabled={stepIdx === 0}
              className="h-12 px-5 rounded-2xl text-sm font-semibold text-gray-500 disabled:opacity-30">
              Atras
            </button>
            <button type="button" onClick={goNext} disabled={!canGoNext}
              className="h-12 px-8 rounded-2xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: "#ff9900" }}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */

type ClientTypeFilter = "all" | "flota" | "uno-a-uno" | "distribucion";
type ProductFilter    = "all" | "tires" | "oil" | "battery";
type SortKey          = "revenue" | "nps" | "alerts" | "recent";

interface AlertSummary { critical: number; warning: number; list: VehicleAlert[] }

function buildAlertMap(clients: Client[]): Record<string, AlertSummary> {
  const map: Record<string, AlertSummary> = {};
  for (const a of computeAlerts(clients)) {
    const c = clients.find((cl) => cl.name === a.clientName);
    if (!c) continue;
    if (!map[c.id]) map[c.id] = { critical: 0, warning: 0, list: [] };
    if (a.urgency === "critical") map[c.id].critical++;
    else map[c.id].warning++;
    map[c.id].list.push(a);
  }
  return map;
}

function vehicleHealth(v: Vehicle) {
  const oilPct  = Math.min(Math.round(((v.currentKm - v.lastOilChangeKm) / v.oilChangeIntervalKm) * 100), 100);
  const tirePct = Math.min(Math.round((v.tireKmSinceInstall / v.tireLifespanKm) * 100), 100);
  return {
    oil:     { pct: oilPct,  alert: oilPct  >= 88, critical: oilPct  >= 97 },
    tire:    { pct: tirePct, alert: tirePct >= 75, critical: tirePct >= 90 },
    battery: { months: v.batteryMonths, alert: v.batteryMonths >= 22, critical: v.batteryMonths >= 30 },
  };
}

function hColor(pct: number) { return pct >= 90 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#10b981"; }

function svcIcon(type: ServiceRecord["type"]): ReactElement {
  const color: Record<string, string> = { oil:"#f59e0b", tires:"#3b82f6", battery:"#10b981", alignment:"#8b5cf6", inspection:"#6b7280", retread:"#ef4444" };
  const icon: Record<string, ReactElement> = { oil:<IcoDrop />, tires:<IcoTire />, battery:<IcoBattery />, alignment:<IcoTool />, inspection:<IcoTool />, retread:<IcoTire /> };
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color[type]}18`, color: color[type] }}>
      {icon[type]}
    </div>
  );
}

function activityIcon(type: ActivityRecord["type"]): ReactElement {
  const cfg: Record<ActivityRecord["type"], { color: string; icon: ReactElement }> = {
    call:        { color: "#3b82f6", icon: <IcoPhoneCall /> },
    visit:       { color: "#10b981", icon: <IcoMapPin />    },
    note:        { color: "#8b5cf6", icon: <IcoFileText />  },
    appointment: { color: "#ff9900", icon: <IcoCalendar />  },
  };
  const { color, icon } = cfg[type];
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18`, color }}>
      {icon}
    </div>
  );
}

function fmtTs(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function makeInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function newId(prefix: string) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

function fmtDateInput(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

/* ══════════════════════════════════════════════════════════
   STATUS CONFIG
══════════════════════════════════════════════════════════ */

const STATUS_RING: Record<Client["status"], string> = {
  active: "ring-2 ring-emerald-400", "at-risk": "ring-2 ring-amber-400", dormant: "ring-2 ring-gray-300",
};
const STATUS_LABEL: Record<Client["status"], { label: string; cls: string }> = {
  active:    { label: "Activo",    cls: "bg-emerald-50 text-emerald-700" },
  "at-risk": { label: "En riesgo", cls: "bg-amber-50  text-amber-700"   },
  dormant:   { label: "Inactivo",  cls: "bg-gray-100  text-gray-500"    },
};
const SEG_STYLE: Record<string, string> = {
  B2C: "bg-sky-50 text-sky-700", B2B: "bg-violet-50 text-violet-700", Fleet: "bg-orange-50 text-orange-700",
};

/* ══════════════════════════════════════════════════════════
   CLIENT ROW (list view)
══════════════════════════════════════════════════════════ */

function ClientRow({ client, alerts, selected, onSelect, canEdit }: {
  client: Client; alerts?: AlertSummary; selected: boolean; onSelect: () => void; canEdit: boolean;
}): ReactElement {
  const v0 = client.vehicles[0];
  const hasCritical = (alerts?.critical ?? 0) > 0;
  const hasWarning  = (alerts?.warning  ?? 0) > 0;
  const waNum = client.phone.replace(/\D/g, "");

  return (
    <div className={["flex items-stretch border-l-2 transition-all", selected ? "bg-[#fafafa] border-[#ff9900]" : "border-transparent hover:bg-gray-50/60"].join(" ")}>
      <button onClick={onSelect} className="flex items-center gap-4 flex-1 min-w-0 px-5 py-4 text-left">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black ${STATUS_RING[client.status]}`}
          style={{ backgroundColor: "#f0f0f1", color: "#444" }}>
          {client.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{client.name}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${SEG_STYLE[client.segment]}`}>{client.segment}</span>
            {canEdit && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: "#ff9900" }}>Mio</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            {v0 && <span className="font-mono font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">{v0.plate}</span>}
            {v0 && <span className="truncate">{v0.make} {v0.model} {v0.year}</span>}
            {!v0 && <span className="italic">{client.city}</span>}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center gap-1 flex-shrink-0 w-[90px]">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_LABEL[client.status].cls}`}>{STATUS_LABEL[client.status].label}</span>
          {hasCritical && <span className="flex items-center gap-1 text-[11px] font-bold text-red-600"><IcoAlert />{alerts!.critical} crít.</span>}
          {!hasCritical && hasWarning && <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600"><IcoAlert />{alerts!.warning} aviso</span>}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 w-24">
          <span className="text-sm font-black text-gray-900 tabular-nums">{fmtCOP(client.totalRevenue)}</span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-10 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${client.nps}%`, backgroundColor: client.nps >= 70 ? "#10b981" : client.nps >= 50 ? "#f59e0b" : "#ef4444" }} />
            </div>
            <span className={`text-[11px] font-semibold tabular-nums ${client.nps >= 70 ? "text-emerald-600" : client.nps >= 50 ? "text-amber-600" : "text-red-500"}`}>{client.nps}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-0.5 flex-shrink-0 w-[68px]">
          <span className="text-xs text-gray-400 text-right leading-tight">{client.lastContact}</span>
          <span className="text-[10px] text-gray-300">{client.city}</span>
        </div>

        <IcoChevronR />
      </button>

      <div className="hidden lg:flex items-center gap-1.5 pr-4 pl-2 flex-shrink-0 border-l border-gray-100">
        <a href={`tel:${client.phone}`} onClick={(e) => e.stopPropagation()}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors" title="Llamar">
          <IcoPhone />
        </a>
        <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors" style={{ backgroundColor: "#25D366" }} title="WhatsApp">
          <IcoWA />
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENT CARD (grid view)
══════════════════════════════════════════════════════════ */

function ClientCard({ client, alerts, selected, onSelect, canEdit }: {
  client: Client; alerts?: AlertSummary; selected: boolean; onSelect: () => void; canEdit: boolean;
}): ReactElement {
  const v0 = client.vehicles[0];
  const hasCritical = (alerts?.critical ?? 0) > 0;
  const hasWarning  = (alerts?.warning  ?? 0) > 0;
  const waNum = client.phone.replace(/\D/g, "");

  return (
    <div onClick={onSelect} className={[
      "relative flex flex-col rounded-xl border overflow-hidden cursor-pointer transition-all select-none bg-white",
      selected ? "border-[#ff9900] shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
    ].join(" ")}>
      <div className="h-1 flex-shrink-0" style={{
        backgroundColor: client.status === "active" ? "#10b981" : client.status === "at-risk" ? "#f59e0b" : "#d1d5db",
      }} />

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black ${STATUS_RING[client.status]}`}
            style={{ backgroundColor: "#f0f0f1", color: "#444" }}>
            {client.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-1 flex-wrap">
              <p className="text-sm font-bold text-gray-900 leading-tight">{client.name}</p>
              {canEdit && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white mt-0.5 flex-shrink-0" style={{ backgroundColor: "#ff9900" }}>Mio</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${SEG_STYLE[client.segment]}`}>{client.segment}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_LABEL[client.status].cls}`}>{STATUS_LABEL[client.status].label}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-sm font-black text-gray-900 leading-none">{fmtCOP(client.totalRevenue)}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">ingresos</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-sm font-black leading-none" style={{ color: client.nps >= 70 ? "#10b981" : client.nps >= 50 ? "#f59e0b" : "#ef4444" }}>{client.nps}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">NPS</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-sm font-black text-gray-900 leading-none">{client.vehicles.length}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">veh.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {v0 ? (
            <>
              <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">{v0.plate}</span>
              <span className="text-xs text-gray-500 truncate">{v0.make} {v0.model}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Sin vehiculos</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {hasCritical ? (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600">
              <IcoAlert />{alerts!.critical} crít.
            </span>
          ) : hasWarning ? (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600">
              <IcoAlert />{alerts!.warning} aviso
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Sin alertas</span>
          )}
          <span className="text-xs text-gray-400">{client.lastContact}</span>
        </div>
      </div>

      <div className="flex border-t border-gray-100 flex-shrink-0">
        <a href={`tel:${client.phone}`} onClick={(e) => e.stopPropagation()}
          className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100">
          <IcoPhone />Llamar
        </a>
        <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors border-r border-gray-100" style={{ color: "#25D366" }}>
          <IcoWA />WA
        </a>
        <button onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex-1 h-10 flex items-center justify-center gap-1 text-xs font-bold transition-colors hover:bg-orange-50" style={{ color: "#ff9900" }}>
          Ver <IcoChevronR />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HEALTH BAR
══════════════════════════════════════════════════════════ */

function HealthBar({ label, pct, icon, detail, alert, critical }: {
  label: string; pct: number; icon: ReactElement; detail: string; alert: boolean; critical: boolean;
}): ReactElement {
  const color = hColor(pct);
  const bg  = critical ? "bg-red-50 border-red-100"   : alert ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100";
  const lbl = critical ? "text-red-700"                : alert ? "text-amber-700"               : "text-gray-600";
  return (
    <div className={`border rounded-2xl p-4 ${bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span style={{ color }}>{icon}</span><span className="text-sm font-semibold text-gray-700">{label}</span></div>
        <span className={`text-sm font-bold tabular-nums ${lbl}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-white/80 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className={`text-xs leading-snug ${lbl}`}>{detail}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VEHICLE CARD
══════════════════════════════════════════════════════════ */

function VehicleCard({ v, clientAlerts, canEdit, onEdit }: {
  v: Vehicle; clientAlerts: VehicleAlert[]; canEdit: boolean; onEdit: () => void;
}): ReactElement {
  const h = vehicleHealth(v);
  const vAlerts = clientAlerts.filter((a) => a.plate === v.plate);
  const oilLeft = v.oilChangeIntervalKm - (v.currentKm - v.lastOilChangeKm);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{v.make} {v.model} <span className="font-normal text-gray-500">{v.year}</span></p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">{v.plate}</span>
              <span className="text-xs text-gray-400">{v.tireSize}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-lg font-black text-gray-900 tabular-nums leading-none">{v.currentKm.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">km actuales</p>
            </div>
            {canEdit && (
              <button onClick={onEdit}
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500"
                title="Editar vehiculo"><IcoPencil /></button>
            )}
          </div>
        </div>
        {vAlerts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {vAlerts.map((a) => (
              <span key={a.id} className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${a.urgency === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                <IcoAlert />{a.urgency === "critical" ? "Accion requerida" : "Aviso preventivo"}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 grid grid-cols-1 gap-3">
        <HealthBar label="Aceite de motor" pct={h.oil.pct} icon={<IcoDrop />}
          detail={h.oil.critical ? `Cambio urgente — ${oilLeft.toLocaleString()} km restantes` : h.oil.alert ? `Agendar pronto — ${oilLeft.toLocaleString()} km restantes` : `${oilLeft.toLocaleString()} km hasta el proximo cambio`}
          alert={h.oil.alert} critical={h.oil.critical} />
        <HealthBar label="Desgaste de llantas" pct={h.tire.pct} icon={<IcoTire />}
          detail={h.tire.critical ? `Reemplazo urgente — ${v.tireSize} en ${h.tire.pct}% de vida` : h.tire.alert ? `Planificar reemplazo — ${100 - h.tire.pct}% restante` : `${100 - h.tire.pct}% de vida util restante en ${v.tireSize}`}
          alert={h.tire.alert} critical={h.tire.critical} />

        <div className={`border rounded-2xl p-4 ${h.battery.critical ? "bg-red-50 border-red-100" : h.battery.alert ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-100"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span style={{ color: h.battery.critical ? "#ef4444" : h.battery.alert ? "#f59e0b" : "#10b981" }}><IcoBattery /></span>
              <span className="text-sm font-semibold text-gray-700">Bateria</span>
            </div>
            <span className={`text-sm font-bold tabular-nums ${h.battery.critical ? "text-red-700" : h.battery.alert ? "text-amber-700" : "text-gray-600"}`}>{v.batteryMonths}m</span>
          </div>
          <div className="h-2 bg-white/80 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full" style={{ width: `${Math.min((v.batteryMonths / 36) * 100, 100)}%`, backgroundColor: h.battery.critical ? "#ef4444" : h.battery.alert ? "#f59e0b" : "#10b981" }} />
          </div>
          <p className={`text-xs ${h.battery.critical ? "text-red-700" : h.battery.alert ? "text-amber-700" : "text-gray-500"}`}>
            {h.battery.critical ? `Mes ${v.batteryMonths} — reemplazo inmediato` : h.battery.alert ? `Mes ${v.batteryMonths} — diagnostico recomendado` : `Mes ${v.batteryMonths} — estado normal`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">VIN (ultimos 8)</p>
            <p className="text-sm font-mono font-semibold text-gray-700">{v.vin ? v.vin.slice(-8) : "—"}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Prom. semanal</p>
            <p className="text-sm font-semibold text-gray-700">{v.weeklyKm.toLocaleString()} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DETAIL TABS
══════════════════════════════════════════════════════════ */

function GarageTab({ client, alerts, canEdit, onAddVehicle, onEditVehicle }: {
  client: Client; alerts: VehicleAlert[]; canEdit: boolean;
  onAddVehicle: () => void; onEditVehicle: (v: Vehicle) => void;
}): ReactElement {
  const vehicles = client.vehicles;
  const criticalCount = alerts.filter((a) => a.urgency === "critical").length;
  const warningCount  = alerts.filter((a) => a.urgency === "warning").length;

  // Aggregate stats across all vehicles
  const avgKm = vehicles.length
    ? Math.round(vehicles.reduce((a, v) => a + v.currentKm, 0) / vehicles.length)
    : 0;
  const worstTire = vehicles.length
    ? Math.max(...vehicles.map((v) => Math.round((v.tireKmSinceInstall / v.tireLifespanKm) * 100)))
    : 0;
  const worstOil = vehicles.length
    ? Math.max(...vehicles.map((v) => Math.round(((v.currentKm - v.lastOilChangeKm) / v.oilChangeIntervalKm) * 100)))
    : 0;

  return (
    <div className="px-5 pb-5 space-y-4">

      {/* ── Summary ─────────────────────────────── */}
      {vehicles.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-gray-900">{vehicles.length}</span>
              <span className="text-sm font-semibold text-gray-500">{vehicles.length === 1 ? "vehiculo" : "vehiculos"}</span>
              {criticalCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                  <IcoAlert />{criticalCount} alerta{criticalCount !== 1 ? "s" : ""}
                </span>
              )}
              {criticalCount === 0 && warningCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  <IcoAlert />{warningCount} aviso{warningCount !== 1 ? "s" : ""}
                </span>
              )}
              {criticalCount === 0 && warningCount === 0 && (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Todo bien</span>
              )}
            </div>
            {canEdit && (
              <button onClick={onAddVehicle}
                className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-sm font-bold border-2 border-[#ff9900] text-[#ff9900] flex-shrink-0">
                <IcoPlus />Agregar
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
            <div className="px-4 py-3.5 text-center">
              <p className="text-lg font-black text-gray-900 tabular-nums">{avgKm.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">km prom.</p>
            </div>
            <div className="px-4 py-3.5 text-center">
              <p className={`text-lg font-black tabular-nums ${worstTire >= 90 ? "text-red-600" : worstTire >= 75 ? "text-amber-600" : "text-emerald-600"}`}>{worstTire}%</p>
              <p className="text-xs text-gray-400 mt-0.5">desgaste</p>
            </div>
            <div className="px-4 py-3.5 text-center">
              <p className={`text-lg font-black tabular-nums ${worstOil >= 97 ? "text-red-600" : worstOil >= 88 ? "text-amber-600" : "text-emerald-600"}`}>{Math.min(worstOil, 100)}%</p>
              <p className="text-xs text-gray-400 mt-0.5">aceite</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────── */}
      {vehicles.length === 0 && canEdit && (
        <button onClick={onAddVehicle}
          className="w-full h-16 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-semibold">
          <IcoPlus />Agregar primer vehiculo
        </button>
      )}
      {vehicles.length === 0 && !canEdit && (
        <p className="text-sm text-gray-400 text-center py-8">Sin vehiculos registrados.</p>
      )}

      {/* ── Vehicle cards ─────────────────────────────── */}
      {vehicles.map((v) => (
        <VehicleCard key={v.id} v={v} clientAlerts={alerts} canEdit={canEdit} onEdit={() => onEditVehicle(v)} />
      ))}
    </div>
  );
}

function HistorialTab({ records, canEdit, onAddService }: {
  records: ServiceRecord[]; canEdit: boolean; onAddService: () => void;
}): ReactElement {
  const total = records.reduce((a, r) => a + r.amount, 0);
  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400">{records.length} registros · {fmtCOP(total)} total</p>
        {canEdit && (
          <button onClick={onAddService}
            className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-sm font-bold border-2 border-[#ff9900] text-[#ff9900]">
            <IcoPlus />Registrar
          </button>
        )}
      </div>
      {records.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">Sin historial de servicio.</p>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="flex items-start gap-4 py-1">
              {svcIcon(r.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{r.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{r.plate}</span>
                      <span className="text-xs text-gray-400">{r.store}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900 tabular-nums">{fmtCOP(r.amount)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const OUTCOME_CFG: Record<string, { label: string; cls: string }> = {
  completed:   { label: "Completada",    cls: "bg-emerald-50 text-emerald-700" },
  "no-answer": { label: "Sin respuesta", cls: "bg-gray-100 text-gray-500"      },
  rescheduled: { label: "Reagendada",    cls: "bg-amber-50 text-amber-700"     },
  pending:     { label: "Pendiente",     cls: "bg-blue-50 text-blue-700"       },
};

const ACT_LABEL: Record<ActivityRecord["type"], string> = {
  call: "Llamada", visit: "Visita", note: "Nota", appointment: "Cita",
};

function ActividadTab({ activities, canEdit, onAddActivity }: {
  activities: ActivityRecord[]; canEdit: boolean; onAddActivity: () => void;
}): ReactElement {
  const [filter, setFilter] = useState<"all" | ActivityRecord["type"]>("all");

  const visible = activities.filter((a) => filter === "all" || a.type === filter);

  const FILTERS: { key: "all" | ActivityRecord["type"]; label: string }[] = [
    { key: "all",         label: "Todas"    },
    { key: "call",        label: "Llamadas" },
    { key: "visit",       label: "Visitas"  },
    { key: "note",        label: "Notas"    },
    { key: "appointment", label: "Citas"    },
  ];

  return (
    <div className="px-5 pb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={["flex-shrink-0 h-9 px-4 rounded-xl text-xs font-bold transition-all", filter === f.key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"].join(" ")}>
              {f.label}
            </button>
          ))}
        </div>
        {canEdit && (
          <button onClick={onAddActivity}
            className="flex-shrink-0 h-10 px-4 rounded-xl flex items-center gap-1.5 text-sm font-bold border-2 border-[#ff9900] text-[#ff9900] ml-2">
            <IcoPlus />Registrar
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400">{filter === "all" ? "Sin actividades registradas." : `Sin ${filter === "call" ? "llamadas" : filter === "visit" ? "visitas" : filter === "note" ? "notas" : "citas"}.`}</p>
          {canEdit && filter === "all" && (
            <button onClick={onAddActivity}
              className="mt-4 h-11 px-5 rounded-2xl text-sm font-semibold border-2 border-dashed border-gray-300 text-gray-400">
              + Primera actividad
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((a) => {
            const outcomeCfg = a.outcome ? OUTCOME_CFG[a.outcome] : null;
            return (
              <div key={a.id} className="flex items-start gap-4">
                {activityIcon(a.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{ACT_LABEL[a.type]}</span>
                      {outcomeCfg && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${outcomeCfg.cls}`}>{outcomeCfg.label}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 flex-shrink-0 mt-0.5">{fmtTs(a.createdAt)}</span>
                  </div>
                  {a.title && <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{a.title}</p>}
                  <p className="text-sm text-gray-600 leading-relaxed">{a.notes}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {a.duration !== undefined && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400"><IcoClock />{a.duration} min</span>
                    )}
                    {a.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400"><IcoMapPin />{a.location}</span>
                    )}
                    {a.scheduledAt && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#ff9900" }}>
                        <IcoCalendar />{fmtTs(a.scheduledAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const COTIZACION_STATUS_CFG: Record<Cotizacion["status"], { label: string; cls: string }> = {
  borrador:  { label: "Borrador",  cls: "bg-gray-100 text-gray-500"     },
  enviada:   { label: "Enviada",   cls: "bg-blue-50 text-blue-700"      },
  aceptada:  { label: "Aceptada",  cls: "bg-emerald-50 text-emerald-700"},
  rechazada: { label: "Rechazada", cls: "bg-red-50 text-red-600"        },
};

function NegociosTab({ client, cotizaciones, onCotizar }: {
  client: Client; cotizaciones: Cotizacion[]; onCotizar: () => void;
}): ReactElement {
  const STAGE_CFG: Record<DealStage, { label: string; color: string }> = {
    prospecto: { label: "Prospecto", color: "#ff9900" }, cotizado: { label: "Cotizado", color: "#f59e0b" },
    negociacion: { label: "Negociacion", color: "#3b82f6" }, cerrado: { label: "Cerrado", color: "#10b981" },
  };
  const clientDeals = DEALS.filter((d) => d.clientName.toLowerCase().includes(client.name.split(" ")[0].toLowerCase()));
  const hasCots = cotizaciones.length > 0;
  const hasDeals = clientDeals.length > 0;

  return (
    <div className="px-5 pb-5 space-y-5">
      <button onClick={onCotizar}
        className="w-full h-13 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#ff9900] text-[#ff9900] text-sm font-bold py-3.5">
        <IcoPlus />Nueva cotizacion
      </button>

      {/* Cotizaciones */}
      {hasCots && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Cotizaciones ({cotizaciones.length})</p>
          <div className="space-y-3">
            {cotizaciones.map((c) => {
              const scfg = COTIZACION_STATUS_CFG[c.status];
              const pmLabel = PM_OPTIONS.find((p) => p.key === c.paymentMethod)?.label ?? c.paymentMethod;
              return (
                <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500">{c.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString("es-CO", { day:"numeric", month:"short", year:"numeric" })} · {pmLabel}{c.plazo ? ` · ${c.plazo}d` : ""}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${scfg.cls}`}>{scfg.label}</span>
                  </div>
                  <div className="space-y-1">
                    {c.lines.map((l, i) => (
                      <p key={i} className="text-xs text-gray-600">{l.qty}x {l.productName.split(" ").slice(0,4).join(" ")} — {fmtCOP(l.subtotal)}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-base font-black text-gray-900">{fmtCOP(c.total)}</span>
                    <button type="button" onClick={() => generatePDF(c, client.name)}
                      className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#ff9900" }}>
                      <IcoFileText />Ver PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pipeline deals */}
      {hasDeals && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pipeline</p>
          <div className="space-y-3">
            {clientDeals.map((d) => {
              const cfg = STAGE_CFG[d.stage];
              return (
                <div key={d.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900 flex-1 leading-snug">{d.product}</p>
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{fmtCOP(d.value)}</span>
                    <span className="text-xs text-gray-400">{d.daysInStage > 0 ? `${d.daysInStage}d en etapa` : "Cerrado"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasCots && !hasDeals && (
        <div className="text-center py-10">
          <p className="text-sm text-gray-400">Sin cotizaciones ni negocios registrados.</p>
        </div>
      )}
    </div>
  );
}

function PerfilTab({ client, canEdit, onEdit }: { client: Client; canEdit: boolean; onEdit: () => void; }): ReactElement {
  const rows = [
    { label: "Telefono",         value: client.phone },
    { label: "Ciudad",           value: client.city  },
    { label: "Segmento",         value: client.segment },
    { label: "Estado",           value: STATUS_LABEL[client.status].label },
    { label: "Asignado a",       value: client.rep },
    { label: "Vehiculos",        value: `${client.vehicles.length} registrado${client.vehicles.length !== 1 ? "s" : ""}` },
    { label: "Ultimo contacto",  value: client.lastContact },
    { label: "Ingresos totales", value: fmtCOP(client.totalRevenue) },
    { label: "NPS",              value: String(client.nps) },
    { label: "Cliente desde",    value: fmtTs(client.createdAt) },
    { label: "Actualizado",      value: fmtTs(client.updatedAt) },
  ];
  return (
    <div className="px-5 pb-5">
      {canEdit && (
        <div className="mb-4">
          <button onClick={onEdit}
            className="h-11 px-5 rounded-2xl flex items-center gap-2 text-sm font-bold border-2 border-gray-200 text-gray-600">
            <IcoPencil />Editar perfil
          </button>
        </div>
      )}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <span className="text-sm text-gray-400">{r.label}</span>
            <span className="text-sm font-semibold text-gray-900 text-right ml-4 max-w-[60%]">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENT DETAIL PANEL
══════════════════════════════════════════════════════════ */

const DETAIL_TABS: { key: string; label: string; icon: ReactElement }[] = [
  { key: "garage",    label: "Garage",    icon: <IcoTabCar />       },
  { key: "actividad", label: "Actividad", icon: <IcoTabActivity />  },
  { key: "historial", label: "Historial", icon: <IcoTabHistory />   },
  { key: "negocios",  label: "Negocios",  icon: <IcoTabBriefcase /> },
  { key: "perfil",    label: "Perfil",    icon: <IcoTabUser />      },
];

function ClientDetail({ client, alerts, records, activities, cotizaciones, canEdit, activeTab, onTabChange, onClose, onEditClient, onAddVehicle, onEditVehicle, onAddService, onAddActivity, onAddNote, onCotizar }: {
  client: Client; alerts: VehicleAlert[]; records: ServiceRecord[]; activities: ActivityRecord[]; cotizaciones: Cotizacion[]; canEdit: boolean;
  activeTab: string; onTabChange: (t: string) => void; onClose: () => void;
  onEditClient: () => void; onAddVehicle: () => void; onEditVehicle: (v: Vehicle) => void; onAddService: () => void; onAddActivity: () => void; onAddNote: () => void; onCotizar: () => void;
}): ReactElement {
  const waNum = client.phone.replace(/\D/g, "");
  const hasCritical = alerts.some((a) => a.urgency === "critical");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="lg:hidden flex justify-center pt-2.5 pb-0 flex-shrink-0">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-black ${STATUS_RING[client.status]}`}
              style={{ backgroundColor: "#f0f0f1", color: "#555" }}>{client.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-base font-bold text-gray-900">{client.name}</h2>
                {hasCritical && <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><IcoAlert /> Alerta</span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_LABEL[client.status].cls}`}>{STATUS_LABEL[client.status].label}</span>
                <span className="text-xs text-gray-400">{client.city}</span>
                <span className="text-xs font-semibold" style={{ color: "#ff9900" }}>{client.rep}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"><IcoX /></button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm font-bold text-gray-900 tabular-nums">{fmtCOP(client.totalRevenue)}</p>
            <p className="text-xs text-gray-400 mt-0.5">ingresos</p>
          </div>
          <div className="bg-gray-50 rounded-2xl px-3 py-3 text-center">
            <p className={`text-sm font-bold tabular-nums ${client.nps >= 70 ? "text-emerald-600" : client.nps >= 50 ? "text-amber-600" : "text-red-500"}`}>{client.nps}</p>
            <p className="text-xs text-gray-400 mt-0.5">NPS</p>
          </div>
          <div className="bg-gray-50 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm font-bold text-gray-900">{client.vehicles.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">veh.</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <a href={`tel:${client.phone}`}
            className="h-12 flex flex-col items-center justify-center gap-1 rounded-2xl bg-gray-900 text-white">
            <IcoPhone /><span className="text-xs font-semibold">Llamar</span>
          </a>
          <a href={`https://wa.me/${waNum}?text=Hola%20${encodeURIComponent(client.name.split(" ")[0])}%2C%20somos%20Merquellantas.`}
            target="_blank" rel="noopener noreferrer"
            className="h-12 flex flex-col items-center justify-center gap-1 rounded-2xl text-white" style={{ backgroundColor: "#25D366" }}>
            <IcoWA /><span className="text-xs font-semibold">WhatsApp</span>
          </a>
          <button onClick={onCotizar} className="h-12 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-[#ff9900] text-[#ff9900]">
            <IcoQuote /><span className="text-xs font-semibold">Cotizar</span>
          </button>
          <button onClick={onAddNote} className="h-12 flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
            <IcoFileText /><span className="text-xs font-semibold">Nota</span>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 -mx-5">
          {DETAIL_TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => onTabChange(t.key)}
                className={["flex-shrink-0 flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 -mb-px transition-all whitespace-nowrap",
                  isActive ? "border-[#ff9900] text-gray-900" : "border-transparent text-gray-400"].join(" ")}>
                <span style={isActive ? { color: "#ff9900" } : { opacity: 0.5 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-4">
        {activeTab === "garage"    && <GarageTab     client={client} alerts={alerts} canEdit={canEdit} onAddVehicle={onAddVehicle} onEditVehicle={onEditVehicle} />}
        {activeTab === "actividad" && <ActividadTab  activities={activities} canEdit={canEdit} onAddActivity={onAddActivity} />}
        {activeTab === "historial" && <HistorialTab  records={records} canEdit={canEdit} onAddService={onAddService} />}
        {activeTab === "negocios"  && <NegociosTab   client={client} cotizaciones={cotizaciones} onCotizar={onCotizar} />}
        {activeTab === "perfil"    && <PerfilTab     client={client} canEdit={canEdit} onEdit={onEditClient} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENTS TAB
══════════════════════════════════════════════════════════ */

function ClientsTab({ clients, setClients, history, setHistory, activities, setActivities, cotizaciones, setCotizaciones, initialSelectedId }: {
  clients: Client[]; setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  history: Record<string, ServiceRecord[]>; setHistory: React.Dispatch<React.SetStateAction<Record<string, ServiceRecord[]>>>;
  activities: Record<string, ActivityRecord[]>; setActivities: React.Dispatch<React.SetStateAction<Record<string, ActivityRecord[]>>>;
  cotizaciones: Record<string, Cotizacion[]>; setCotizaciones: React.Dispatch<React.SetStateAction<Record<string, Cotizacion[]>>>;
  initialSelectedId?: string | null;
}): ReactElement {
  const [search,        setSearch]        = useState("");
  const [clientType,    setClientType]    = useState<ClientTypeFilter>("all");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [brandFilter,   setBrandFilter]   = useState("all");
  const [sizeFilter,    setSizeFilter]    = useState("all");
  const [sort,          setSort]          = useState<SortKey>("revenue");
  const [viewMode,     setViewMode]     = useState<"list" | "grid">("list");
  const [page,         setPage]         = useState(1);
  const [selectedId,   setSelectedId]   = useState<string | null>(initialSelectedId ?? null);
  const [detailTab,    setDetailTab]    = useState("garage");
  const [modal,        setModal]        = useState<ModalState>({ kind: "none" });
  const PAGE_SIZE = 8;

  const alertMap = useMemo(() => buildAlertMap(clients), [clients]);
  const selected = useMemo(() => clients.find((c) => c.id === selectedId) ?? null, [clients, selectedId]);

  const isOwn = (c: Client) => c.rep === CURRENT_USER.name;

  /* ── Mutations ──────────────────────────────────────── */

  function createProspecto(d: ProspectoFD) {
    const now = new Date().toISOString();
    const nc: Client = {
      id: newId("c"), initials: makeInitials(d.name),
      name: d.name, phone: d.phone, email: d.email || undefined, city: "",
      segment: "B2C", status: "active", lastContact: "Hoy", nps: 75, totalRevenue: 0,
      vehicles: [], rep: CURRENT_USER.name,
      leadSource: d.leadSource, leadSourceOther: d.otherSource || undefined,
      createdAt: now, updatedAt: now,
    };
    setClients((p) => [nc, ...p]);
    setHistory((p) => ({ ...p, [nc.id]: [] }));
    setActivities((p) => ({ ...p, [nc.id]: [] }));
    setSelectedId(nc.id);
    setModal({ kind: "post-save", clientId: nc.id, clientName: nc.name });
  }

  function saveCotizacion(cot: Cotizacion) {
    setCotizaciones((p) => ({ ...p, [cot.clientId]: [cot, ...(p[cot.clientId] ?? [])] }));
    setSelectedId(cot.clientId);
    setDetailTab("negocios");
  }

  function createClient(d: ClientFD) {
    const now = new Date().toISOString();
    const nc: Client = {
      id: newId("c"), initials: makeInitials(d.name),
      name: d.name, phone: d.phone, city: d.city,
      segment: d.segment as Client["segment"], status: d.status as Client["status"],
      nps: parseInt(d.nps) || 75, totalRevenue: 0, lastContact: "Hoy",
      vehicles: [], rep: CURRENT_USER.name, createdAt: now, updatedAt: now,
    };
    setClients((p) => [nc, ...p]);
    setHistory((p) => ({ ...p, [nc.id]: [] }));
    setSelectedId(nc.id);
    setDetailTab("garage");
    setModal({ kind: "none" });
  }

  function saveClient(d: ClientFD) {
    if (!selected) return;
    setClients((p) => p.map((c) => c.id !== selected.id ? c : {
      ...c, name: d.name, initials: makeInitials(d.name),
      phone: d.phone, city: d.city,
      segment: d.segment as Client["segment"], status: d.status as Client["status"],
      nps: parseInt(d.nps) || c.nps, updatedAt: new Date().toISOString(),
    }));
    setModal({ kind: "none" });
  }

  function saveVehicle(clientId: string, d: VehicleFD, vehicleId?: string) {
    const toVehicle = (base: Partial<Vehicle>): Vehicle => ({
      id: base.id ?? newId("v"), plate: d.plate.toUpperCase(), vin: d.vin,
      make: d.make, model: d.model, year: parseInt(d.year),
      currentKm: parseInt(d.currentKm) || 0, weeklyKm: parseInt(d.weeklyKm) || 200,
      lastOilChangeKm: parseInt(d.lastOilChangeKm) || 0,
      oilChangeIntervalKm: parseInt(d.oilChangeIntervalKm) || 10000,
      batteryMonths: parseInt(d.batteryMonths) || 0,
      tireSize: d.tireSize,
      tireKmSinceInstall: parseInt(d.tireKmSinceInstall) || 0,
      tireLifespanKm: parseInt(d.tireLifespanKm) || 50000,
    });
    setClients((p) => p.map((c) => {
      if (c.id !== clientId) return c;
      const vehicles = vehicleId
        ? c.vehicles.map((v) => v.id === vehicleId ? toVehicle(v) : v)
        : [...c.vehicles, toVehicle({})];
      return { ...c, vehicles, updatedAt: new Date().toISOString() };
    }));
    setModal({ kind: "none" });
  }

  function addActivity(clientId: string, d: ActivityFD) {
    const now = new Date().toISOString();
    const title = d.title.trim() || (
      d.type === "call" ? "Llamada registrada" : d.type === "visit" ? "Visita al cliente" :
      d.type === "note" ? "Nota" : "Cita agendada"
    );
    let scheduledAt: string | undefined;
    if (d.type === "appointment" && d.scheduledDate) {
      scheduledAt = new Date(`${d.scheduledDate}T${d.scheduledTime || "09:00"}`).toISOString();
    }
    const rec: ActivityRecord = {
      id: newId("act"), createdAt: now, type: d.type, title, notes: d.notes,
      loggedBy: CURRENT_USER.name,
      outcome: d.type === "call" ? d.outcome as ActivityRecord["outcome"] : undefined,
      duration: d.type === "call" && d.duration ? parseInt(d.duration) : undefined,
      location: (d.type === "visit" || d.type === "appointment") && d.location ? d.location : undefined,
      scheduledAt,
    };
    setActivities((p) => ({ ...p, [clientId]: [rec, ...(p[clientId] ?? [])] }));
    setModal({ kind: "none" });
  }

  function addServiceRecord(clientId: string, d: ServiceFD) {
    const now = new Date().toISOString();
    const rec: ServiceRecord = {
      id: newId("sr"), createdAt: now, date: fmtDateInput(d.date),
      type: d.type as ServiceRecord["type"], description: d.description,
      plate: d.plate, amount: parseInt(d.amount) || 0,
      store: d.store, loggedBy: CURRENT_USER.name,
    };
    setHistory((p) => ({ ...p, [clientId]: [rec, ...(p[clientId] ?? [])] }));
    setModal({ kind: "none" });
  }

  /* ── Derived filter options from real data ───────────── */

  const TIRE_BRANDS = useMemo(() => {
    const known = ["Continental", "Bridgestone", "Goodyear", "Kumho", "Pirelli", "Michelin", "Hankook", "Fate", "Maxxis", "Nankang", "Uniroyal"];
    const found = new Set<string>();
    for (const recs of Object.values(history)) {
      for (const r of recs) {
        if (r.type === "tires") {
          for (const b of known) { if (r.description.includes(b)) found.add(b); }
        }
      }
    }
    return [...found].sort();
  }, [history]);

  const OIL_BRANDS = useMemo(() => {
    const known = ["Mobil", "Valvoline", "Castrol", "Pennzoil", "Shell", "Total", "Havoline"];
    const found = new Set<string>();
    for (const recs of Object.values(history)) {
      for (const r of recs) {
        if (r.type === "oil") {
          for (const b of known) { if (r.description.includes(b)) found.add(b); }
        }
      }
    }
    return [...found].sort();
  }, [history]);

  const TIRE_SIZES = useMemo(() => {
    const found = new Set<string>();
    for (const c of clients) { for (const v of c.vehicles) { if (v.tireSize) found.add(v.tireSize); } }
    return [...found].sort();
  }, [clients]);

  /* ── Filtering ──────────────────────────────────────── */

  const SEGMENT_MAP: Record<ClientTypeFilter, Client["segment"] | null> = {
    "all": null, "flota": "Fleet", "uno-a-uno": "B2C", "distribucion": "B2B",
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...clients]
      .filter((c) => {
        if (q && !c.name.toLowerCase().includes(q) &&
          !c.vehicles.some((v) => v.plate.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) &&
          !c.city.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
        const seg = SEGMENT_MAP[clientType];
        if (seg && c.segment !== seg) return false;
        const recs = history[c.id] ?? [];
        if (productFilter !== "all" && !recs.some((r) => r.type === productFilter)) return false;
        if (sizeFilter !== "all" && !c.vehicles.some((v) => v.tireSize === sizeFilter)) return false;
        if (brandFilter !== "all") {
          const tireBrands = new Set(["Continental","Bridgestone","Goodyear","Kumho","Pirelli","Michelin","Hankook","Fate","Maxxis","Nankang","Uniroyal"]);
          const oilBrands  = new Set(["Mobil","Valvoline","Castrol","Pennzoil","Shell","Total","Havoline"]);
          const allRecs = tireBrands.has(brandFilter)
            ? recs.filter((r) => r.type === "tires" && r.description.includes(brandFilter))
            : oilBrands.has(brandFilter)
            ? recs.filter((r) => r.type === "oil"   && r.description.includes(brandFilter))
            : [];
          if (allRecs.length === 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "revenue") return b.totalRevenue - a.totalRevenue;
        if (sort === "nps")     return b.nps - a.nps;
        if (sort === "alerts")  return ((alertMap[b.id]?.critical ?? 0) - (alertMap[a.id]?.critical ?? 0)) || ((alertMap[b.id]?.warning ?? 0) - (alertMap[a.id]?.warning ?? 0));
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [clients, history, search, clientType, productFilter, brandFilter, sizeFilter, sort, alertMap]);

  const totalRevenue  = filtered.reduce((a, c) => a + c.totalRevenue, 0);
  const avgNps        = filtered.length ? Math.round(filtered.reduce((a, c) => a + c.nps, 0) / filtered.length) : 0;
  const alertCount    = Object.values(alertMap).reduce((a, m) => a + m.critical + m.warning, 0);
  const criticalCount = Object.values(alertMap).reduce((a, m) => a + m.critical, 0);
  const totalPages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage      = Math.min(page, totalPages);
  const paginated     = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* ── Detail callbacks (only reached when selected exists) */

  const detailProps = selected ? {
    onEditClient:  () => setModal({ kind: "edit-client",  client: selected }),
    onAddVehicle:  () => setModal({ kind: "add-vehicle",  clientId: selected.id }),
    onEditVehicle: (v: Vehicle) => setModal({ kind: "edit-vehicle", clientId: selected.id, vehicle: v }),
    onAddService:  () => setModal({ kind: "add-service",  clientId: selected.id, plates: selected.vehicles.map((v) => v.plate) }),
    onAddActivity: () => setModal({ kind: "add-activity", clientId: selected.id }),
    onAddNote:     () => setModal({ kind: "add-activity", clientId: selected.id, initialType: "note" }),
    onCotizar:     () => setModal({ kind: "cotizacion",   clientId: selected.id, clientName: selected.name }),
  } : null;

  return (
    <>
      {/* ── Modals ──────────────────────────────────────── */}
      {modal.kind === "create-prospecto" && (
        <Modal title="Nuevo prospecto" subtitle={`Asignado a ${CURRENT_USER.name}`} onClose={() => setModal({ kind: "none" })}>
          <ProspectoForm onSubmit={createProspecto} onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "post-save" && (
        <PostSaveSheet
          clientName={modal.clientName}
          onClose={() => setModal({ kind: "none" })}
          onNew={() => setModal({ kind: "create-prospecto" })}
          onActivity={() => setModal({ kind: "add-activity", clientId: modal.clientId })}
          onData={() => {
            const c = clients.find((cl) => cl.id === modal.clientId);
            if (c) setModal({ kind: "edit-client", client: c });
          }}
          onCotiza={() => setModal({ kind: "cotizacion", clientId: modal.clientId, clientName: modal.clientName })}
        />
      )}
      {modal.kind === "cotizacion" && (
        <CotizacionWizard
          clientId={modal.clientId} clientName={modal.clientName}
          onClose={() => setModal({ kind: "none" })}
          onSave={saveCotizacion}
        />
      )}
      {modal.kind === "create-client" && (
        <Modal title="Nuevo cliente" subtitle={`Asignado a ${CURRENT_USER.name}`} onClose={() => setModal({ kind: "none" })}>
          <ClientForm mode="create" onSubmit={createClient} onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "edit-client" && (
        <Modal title="Editar cliente" subtitle={modal.client.name} onClose={() => setModal({ kind: "none" })}>
          <ClientForm mode="edit"
            initial={{ name: modal.client.name, phone: modal.client.phone, city: modal.client.city, segment: modal.client.segment, status: modal.client.status, nps: String(modal.client.nps) }}
            onSubmit={saveClient} onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "add-vehicle" && (
        <Modal title="Agregar vehiculo" wide onClose={() => setModal({ kind: "none" })}>
          <VehicleForm mode="add" onSubmit={(d) => saveVehicle(modal.clientId, d)} onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "edit-vehicle" && (
        <Modal title="Editar vehiculo" subtitle={modal.vehicle.plate} wide onClose={() => setModal({ kind: "none" })}>
          <VehicleForm mode="edit"
            initial={{
              plate: modal.vehicle.plate, vin: modal.vehicle.vin, make: modal.vehicle.make, model: modal.vehicle.model, year: String(modal.vehicle.year),
              currentKm: String(modal.vehicle.currentKm), weeklyKm: String(modal.vehicle.weeklyKm),
              lastOilChangeKm: String(modal.vehicle.lastOilChangeKm), oilChangeIntervalKm: String(modal.vehicle.oilChangeIntervalKm),
              batteryMonths: String(modal.vehicle.batteryMonths), tireSize: modal.vehicle.tireSize,
              tireKmSinceInstall: String(modal.vehicle.tireKmSinceInstall), tireLifespanKm: String(modal.vehicle.tireLifespanKm),
            }}
            onSubmit={(d) => saveVehicle(modal.clientId, d, modal.vehicle.id)}
            onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "add-service" && (
        <Modal title="Registrar servicio" onClose={() => setModal({ kind: "none" })}>
          <ServiceForm plates={modal.plates}
            onSubmit={(d) => addServiceRecord(selectedId!, d)}
            onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}
      {modal.kind === "add-activity" && (
        <Modal title={modal.initialType === "note" ? "Agregar nota" : "Registrar actividad"} subtitle={selected?.name} onClose={() => setModal({ kind: "none" })}>
          <ActivityForm
            initialType={modal.initialType}
            onSubmit={(d) => addActivity(modal.clientId, d)}
            onCancel={() => setModal({ kind: "none" })} />
        </Modal>
      )}

      {/* ── Main layout ─────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* LEFT: list */}
        <div className={selected ? "hidden lg:flex lg:flex-col lg:w-[46%] min-w-0" : "flex-1 flex flex-col min-w-0"}>

          {/* Summary — inline KPI row */}
          <div className="flex items-center gap-6 sm:gap-10 mb-7 pb-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
            <div className="flex-shrink-0">
              <p className="text-[32px] font-black tabular-nums leading-none" style={{ color: "#ff9900" }}>{filtered.length}</p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">clientes</p>
            </div>
            <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
            <div className="flex-shrink-0">
              <p className="text-[32px] font-black tabular-nums text-gray-900 leading-none">{fmtCOP(totalRevenue)}</p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">ingresos totales</p>
            </div>
            <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
            <div className="flex-shrink-0">
              <p className="text-[32px] font-black tabular-nums leading-none" style={{ color: avgNps >= 70 ? "#10b981" : avgNps >= 50 ? "#f59e0b" : "#ef4444" }}>{avgNps}</p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">NPS prom.</p>
            </div>
            <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
            <div className="flex-shrink-0">
              <p className={`text-[32px] font-black tabular-nums leading-none ${criticalCount > 0 ? "text-red-600" : alertCount > 0 ? "text-amber-500" : "text-emerald-500"}`}>{alertCount}</p>
              <p className={`text-[11px] mt-1 font-medium uppercase tracking-wide ${criticalCount > 0 ? "text-red-400" : alertCount > 0 ? "text-amber-400" : "text-gray-400"}`}>alertas</p>
            </div>
          </div>

          {/* Search + view toggle + new button */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 h-12 focus-within:border-gray-400 transition-colors">
              <IcoSearch />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar nombre, placa, ciudad..."
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none" />
              {search && <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400"><IcoX /></button>}
            </div>
            <div className="flex h-12 bg-white border border-gray-200 rounded-2xl overflow-hidden flex-shrink-0">
              <button onClick={() => setViewMode("list")} title="Vista lista"
                className={["w-12 h-full flex items-center justify-center transition-all", viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"].join(" ")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                  <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </button>
              <button onClick={() => setViewMode("grid")} title="Vista tarjetas"
                className={["w-12 h-full flex items-center justify-center transition-all border-l border-gray-200", viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"].join(" ")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
                </svg>
              </button>
            </div>
            <button onClick={() => setModal({ kind: "create-prospecto" })}
              className="h-12 px-5 rounded-2xl text-white text-sm font-bold whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: "#ff9900" }}>
              + Prospecto
            </button>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col gap-2 mb-4">
            {/* Row 1: client type */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0 w-14">Tipo</span>
              {([
                { key: "all",          label: "Todos"        },
                { key: "flota",        label: "Flota"        },
                { key: "uno-a-uno",    label: "Uno a uno"    },
                { key: "distribucion", label: "Distribucion" },
              ] as { key: ClientTypeFilter; label: string }[]).map((o) => (
                <button key={o.key} onClick={() => { setClientType(o.key); setPage(1); }}
                  className={["flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all",
                    clientType === o.key ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
                  {o.label}
                </button>
              ))}
              <div className="flex-1" />
              {([{ key: "revenue", label: "Ingresos" }, { key: "nps", label: "NPS" }, { key: "alerts", label: "Alertas" }, { key: "recent", label: "Recientes" }] as { key: SortKey; label: string }[]).map((o) => (
                <button key={o.key} onClick={() => setSort(o.key)}
                  className={["flex-shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-all",
                    sort === o.key ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600"].join(" ")}>
                  {o.label}
                </button>
              ))}
            </div>
            {/* Row 2: buying patterns */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0 w-14">Patron</span>
              {([
                { key: "all",     label: "Todos"    },
                { key: "tires",   label: "Llantas"  },
                { key: "oil",     label: "Aceite"   },
                { key: "battery", label: "Bateria"  },
              ] as { key: ProductFilter; label: string }[]).map((o) => (
                <button key={o.key} onClick={() => { setProductFilter(o.key); setBrandFilter("all"); setPage(1); }}
                  className={["flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all",
                    productFilter === o.key && brandFilter === "all" && sizeFilter === "all"
                      ? "bg-gray-900 text-white"
                      : productFilter === o.key && o.key !== "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
                  {o.label}
                </button>
              ))}
              {(productFilter === "tires" || productFilter === "all") && TIRE_SIZES.length > 0 && (
                <>
                  <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
                  {TIRE_SIZES.map((sz) => (
                    <button key={sz} onClick={() => { setSizeFilter(sizeFilter === sz ? "all" : sz); setPage(1); }}
                      className={["flex-shrink-0 h-8 px-3 rounded-lg text-xs font-mono font-semibold transition-all",
                        sizeFilter === sz ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
                      {sz}
                    </button>
                  ))}
                </>
              )}
              {(productFilter === "tires" || productFilter === "all") && TIRE_BRANDS.length > 0 && (
                <>
                  <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
                  {TIRE_BRANDS.map((b) => (
                    <button key={b} onClick={() => { setBrandFilter(brandFilter === b ? "all" : b); setProductFilter("tires"); setPage(1); }}
                      className={["flex-shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-all",
                        brandFilter === b ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
                      {b}
                    </button>
                  ))}
                </>
              )}
              {productFilter === "oil" && OIL_BRANDS.length > 0 && (
                <>
                  <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
                  {OIL_BRANDS.map((b) => (
                    <button key={b} onClick={() => { setBrandFilter(brandFilter === b ? "all" : b); setPage(1); }}
                      className={["flex-shrink-0 h-8 px-3 rounded-lg text-xs font-semibold transition-all",
                        brandFilter === b ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
                      {b}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Client list or grid */}
          {viewMode === "list" ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 border-b border-gray-100 bg-gray-50">
                <span className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</span>
                <span className="w-[90px] text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Estado</span>
                <span className="w-24 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Ingresos / NPS</span>
                <span className="w-[68px] text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Ult. contacto</span>
                <span className="w-[78px] text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</span>
                <span className="w-4" />
              </div>
              {paginated.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-gray-400">Sin clientes que coincidan</p>
                  <button onClick={() => { setSearch(""); setClientType("all"); setProductFilter("all"); setBrandFilter("all"); setSizeFilter("all"); setPage(1); }}
                    className="mt-3 text-sm font-semibold" style={{ color: "#ff9900" }}>Limpiar filtros</button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {paginated.map((c) => (
                    <ClientRow key={c.id} client={c} alerts={alertMap[c.id]} selected={selectedId === c.id} canEdit={isOwn(c)} onSelect={() => {
                      if (selectedId === c.id) { setSelectedId(null); return; }
                      setSelectedId(c.id); setDetailTab("garage");
                    }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            paginated.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
                <p className="text-sm font-semibold text-gray-400">Sin clientes que coincidan</p>
                <button onClick={() => { setSearch(""); setClientType("all"); setProductFilter("all"); setBrandFilter("all"); setSizeFilter("all"); setPage(1); }}
                  className="mt-3 text-sm font-semibold" style={{ color: "#ff9900" }}>Limpiar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paginated.map((c) => (
                  <ClientCard key={c.id} client={c} alerts={alertMap[c.id]} selected={selectedId === c.id} canEdit={isOwn(c)} onSelect={() => {
                    if (selectedId === c.id) { setSelectedId(null); return; }
                    setSelectedId(c.id); setDetailTab("garage");
                  }} />
                ))}
              </div>
            )
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-400">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length} clientes
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={["w-9 h-9 rounded-xl text-sm font-bold transition-all", safePage === p ? "text-white" : "text-gray-600 hover:bg-gray-50 border border-gray-200"].join(" ")}
                    style={safePage === p ? { backgroundColor: "#ff9900" } : {}}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: desktop */}
        {selected && detailProps && (
          <div className="hidden lg:flex flex-col flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            style={{ minHeight: "600px", maxHeight: "calc(100vh - 160px)" }}>
            <ClientDetail client={selected} alerts={alertMap[selected.id]?.list ?? []} records={history[selected.id] ?? []}
              activities={activities[selected.id] ?? []} cotizaciones={cotizaciones[selected.id] ?? []}
              canEdit={isOwn(selected)} activeTab={detailTab} onTabChange={setDetailTab} onClose={() => setSelectedId(null)}
              {...detailProps} />
          </div>
        )}

        {/* MOBILE: bottom sheet */}
        {selected && detailProps && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={() => setSelectedId(null)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl" style={{ maxHeight: "91dvh", display: "flex", flexDirection: "column" }}>
              <ClientDetail client={selected} alerts={alertMap[selected.id]?.list ?? []} records={history[selected.id] ?? []}
                activities={activities[selected.id] ?? []} cotizaciones={cotizaciones[selected.id] ?? []}
                canEdit={isOwn(selected)} activeTab={detailTab} onTabChange={setDetailTab} onClose={() => setSelectedId(null)}
                {...detailProps} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   PIPELINE / OPORTUNIDADES / REPORTES
══════════════════════════════════════════════════════════ */

const STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: "prospecto",   label: "Prospecto",   color: "#ff9900" },
  { key: "cotizado",    label: "Cotizado",    color: "#f59e0b" },
  { key: "negociacion", label: "Negociacion", color: "#3b82f6" },
  { key: "cerrado",     label: "Cerrado",     color: "#10b981" },
];

function PipelineTab({ deals, setDeals }: { deals: Deal[]; setDeals: React.Dispatch<React.SetStateAction<Deal[]>> }): ReactElement {
  function advance(id: string) {
    setDeals((p) => p.map((d) => {
      if (d.id !== id || d.stage === "cerrado") return d;
      const idx = STAGES.findIndex((s) => s.key === d.stage);
      return { ...d, stage: STAGES[idx + 1]?.key ?? d.stage, daysInStage: 0 };
    }));
  }
  const pipeline = deals.filter((d) => d.stage !== "cerrado").reduce((a, d) => a + d.value, 0);
  const closed   = deals.filter((d) => d.stage === "cerrado").reduce((a, d)  => a + d.value, 0);
  return (
    <div>
      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <div>
          <p className="text-xs text-gray-400">Pipeline activo</p>
          <p className="text-lg font-black text-gray-900">{fmtCOP(pipeline)}</p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <p className="text-xs text-gray-400">Cerrado este mes</p>
          <p className="text-lg font-black text-emerald-600">{fmtCOP(closed)}</p>
        </div>
      </div>
      <div className="overflow-x-auto -mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 pb-4 no-scrollbar">
        <div className="flex gap-4 min-w-max">
          {STAGES.map((stage) => {
            const col = deals.filter((d) => d.stage === stage.key);
            const colTotal = col.reduce((a, d) => a + d.value, 0);
            return (
              <div key={stage.key} className="w-[260px] flex-shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-sm font-bold text-gray-800">{stage.label}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{col.length}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{fmtCOP(colTotal)}</span>
                </div>
                <div className="space-y-3">
                  {col.map((deal) => (
                    <div key={deal.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                      <p className="text-sm font-bold text-gray-900 truncate">{deal.clientName}</p>
                      <p className="text-xs text-gray-400 mt-1 mb-3 line-clamp-2">{deal.product}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{fmtCOP(deal.value)}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{deal.rep}</span>
                      </div>
                      {deal.stage !== "cerrado" && (
                        <button onClick={() => advance(deal.id)} className="w-full mt-3 pt-3 border-t border-gray-100 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors text-left">
                          Avanzar etapa →
                        </button>
                      )}
                      {deal.stage === "cerrado" && (
                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs text-emerald-600 font-semibold">Ganado</span>
                        </div>
                      )}
                      {deal.daysInStage > 5 && deal.stage !== "cerrado" && (
                        <p className="mt-1 text-xs text-amber-500 font-medium">{deal.daysInStage}d sin avance</p>
                      )}
                    </div>
                  ))}
                  {col.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl h-24 flex items-center justify-center">
                      <span className="text-sm text-gray-300">Vacio</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface OportunidadesTabProps {
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  clients: Client[];
  onSelectClient: (id: string) => void;
  onCotizarForDeal: (deal: Deal) => void;
  onLogCallForDeal: (deal: Deal) => void;
  onAddActivityForDeal: (deal: Deal) => void;
}

function OportunidadesTab({
  deals,
  setDeals,
  clients,
  onSelectClient,
  onCotizarForDeal,
  onLogCallForDeal,
  onAddActivityForDeal,
}: OportunidadesTabProps): ReactElement {
  const [filterOwner, setFilterOwner] = useState<"all" | "unassigned" | "mine">("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  function handleClaimDeal(dealId: string) {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, rep: CURRENT_USER.name } : d))
    );
    const deal = deals.find((d) => d.id === dealId);
    showToast(`⚡ ¡Oportunidad "${deal?.clientName}" asignada a ${CURRENT_USER.name}!`);
  }

  function handleAdvanceStage(dealId: string) {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId || d.stage === "cerrado") return d;
        const idx = STAGES.findIndex((s) => s.key === d.stage);
        const nextStage = STAGES[idx + 1]?.key ?? d.stage;
        return { ...d, stage: nextStage, daysInStage: 0 };
      })
    );
    showToast("Etapa actualizada exitosamente.");
  }

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const isUnassigned = d.rep === "Sin asignar" || d.rep === "Unassigned" || !d.rep;
      const isMine = d.rep === CURRENT_USER.name;

      if (filterOwner === "unassigned" && !isUnassigned) return false;
      if (filterOwner === "mine" && !isMine) return false;
      if (filterStage !== "all" && d.stage !== filterStage) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const mName = d.clientName.toLowerCase().includes(q);
        const mProd = d.product.toLowerCase().includes(q);
        const mCity = d.city?.toLowerCase().includes(q);
        const mPhone = d.phone?.includes(q);
        const mRep = d.rep.toLowerCase().includes(q);
        if (!mName && !mProd && !mCity && !mPhone && !mRep) return false;
      }

      return true;
    });
  }, [deals, filterOwner, filterStage, search]);

  const metrics = useMemo(() => {
    const active = deals.filter((d) => d.stage !== "cerrado");
    const unassigned = active.filter((d) => d.rep === "Sin asignar" || d.rep === "Unassigned" || !d.rep);
    const mine = active.filter((d) => d.rep === CURRENT_USER.name);
    const totalVal = active.reduce((acc, d) => acc + d.value, 0);
    const unassignedVal = unassigned.reduce((acc, d) => acc + d.value, 0);

    return {
      activeCount: active.length,
      unassignedCount: unassigned.length,
      unassignedVal,
      mineCount: mine.length,
      totalVal,
    };
  }, [deals]);

  const [newClientName, setNewClientName] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Bogotá");
  const [newAssignSelf, setNewAssignSelf] = useState(false);

  function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientName || !newProduct) return;

    const newDeal: Deal = {
      id: `d${Date.now()}`,
      clientName: newClientName,
      product: newProduct,
      value: parseInt(newValue) || 1500000,
      stage: "prospecto",
      daysInStage: 0,
      rep: newAssignSelf ? CURRENT_USER.name : "Sin asignar",
      phone: newPhone || "+573000000000",
      city: newCity,
    };

    setDeals((prev) => [newDeal, ...prev]);
    setShowNewDealModal(false);
    setNewClientName("");
    setNewProduct("");
    setNewValue("");
    setNewPhone("");
    showToast(
      newAssignSelf
        ? `Oportunidad creada y asignada a ${CURRENT_USER.name}`
        : "Oportunidad libre creada en la bolsa de prospectos."
    );
  }

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[100] bg-gray-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-orange-500/50">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900">Oportunidades & Prospectos</h2>
            <span className="bg-gray-100 text-black-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              {metrics.unassignedCount} 
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gestión activa de leads volando sin asesor asignado y oportunidades comerciales en proceso.
          </p>
        </div>

        <button
          onClick={() => setShowNewDealModal(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-orange-400">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Oportunidad
        </button>
      </div>

      {/* KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Prospectos Libres ("Volando")</p>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-1">{metrics.unassignedCount}</p>
          <p className="text-xs text-purple-700 font-semibold mt-1">
            {fmtCOP(metrics.unassignedVal)} sin asesor asignado
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-100 bg-orange-50/20 shadow-sm">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Mis Oportunidades</p>
          <p className="text-2xl font-black text-orange-900 mt-1">{metrics.mineCount}</p>
          <p className="text-xs text-orange-600 font-semibold mt-1">En seguimiento directo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Oportunidades Activas</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{metrics.activeCount}</p>
          <p className="text-xs text-gray-500 mt-1">En todas las etapas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monto en Juego</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{fmtCOP(metrics.totalVal)}</p>
          <p className="text-xs text-gray-500 mt-1">Valor potencial de ventas</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterOwner("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterOwner === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Todas ({deals.length})
            </button>

            <button
              onClick={() => setFilterOwner("unassigned")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                filterOwner === "unassigned" ? "bg-purple-600 text-white shadow-sm" : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              ⚡ Libres / Volando ({metrics.unassignedCount})
            </button>

            <button
              onClick={() => setFilterOwner("mine")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterOwner === "mine" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👤 Mis Oportunidades ({metrics.mineCount})
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: "all", label: "Todas las etapas" },
              { id: "prospecto", label: "Prospecto" },
              { id: "cotizado", label: "Cotizado" },
              { id: "negociacion", label: "Negociación" },
              { id: "cerrado", label: "Cerrado" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStage(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStage === st.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por prospecto, producto, ciudad, teléfono o asesor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs">
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeals.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3 text-lg font-black">
              ⚡
            </div>
            <p className="text-base font-bold text-gray-900">No hay oportunidades que coincidan</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Prueba cambiando el filtro de asesor o buscando otro término.
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const isUnassigned = deal.rep === "Sin asignar" || deal.rep === "Unassigned" || !deal.rep;
            const isMine = deal.rep === CURRENT_USER.name;
            const stageCfg = STAGES.find((s) => s.key === deal.stage) ?? STAGES[0];

            return (
              <div
                key={deal.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isUnassigned
                    ? "border-purple-200 bg-gradient-to-br from-white via-purple-50/10 to-white"
                    : isMine
                    ? "border-orange-200 bg-gradient-to-br from-white via-orange-50/10 to-white"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    {isUnassigned ? (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-purple-200 animate-pulse">
                        ⚡ Prospecto Volando (Sin asignar)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isMine ? "bg-orange-100 text-orange-800 border border-orange-200" : "bg-gray-100 text-gray-600"
                      }`}>
                        👤 Asesor: {deal.rep}
                      </span>
                    )}

                    <span
                      className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${stageCfg.color}18`, color: stageCfg.color }}
                    >
                      {stageCfg.label}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-black text-gray-900">{deal.clientName}</h3>
                      <span className="text-base font-black text-gray-900 tabular-nums">
                        {fmtCOP(deal.value)}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-600 mt-0.5">{deal.product}</p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                      {deal.city && <span>📍 {deal.city}</span>}
                      {deal.phone && <span>📞 {deal.phone}</span>}
                      {deal.daysInStage > 0 && <span>⏱️ {deal.daysInStage}d en etapa</span>}
                    </div>

                    {deal.notes && (
                      <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg mt-2.5 border border-gray-100 italic">
                        "{deal.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2 mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      onClick={() => onLogCallForDeal(deal)}
                      className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold py-2 px-2 rounded-xl transition-all border border-emerald-200"
                      title="Llamar directamente a este prospecto"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.62 1.14h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 7.54 7.54l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Llamar
                    </button>

                    {isUnassigned ? (
                      <button
                        onClick={() => handleClaimDeal(deal.id)}
                        className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-extrabold py-2 px-2 rounded-xl transition-all shadow-sm"
                        title="Tomar esta oportunidad para mi gestión"
                      >
                        ⚡ Tomar
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddActivityForDeal(deal)}
                        className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] font-bold py-2 px-2 rounded-xl transition-all border border-gray-200"
                        title="Agendar seguimiento o visita"
                      >
                        📅 Agendar
                      </button>
                    )}

                    <button
                      onClick={() => onCotizarForDeal(deal)}
                      className="flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold py-2 px-2 rounded-xl transition-all border border-amber-200"
                      title="Emitir cotización para este cliente"
                    >
                      📄 Cotizar
                    </button>

                    {deal.stage !== "cerrado" ? (
                      <button
                        onClick={() => handleAdvanceStage(deal.id)}
                        className="flex items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold py-2 px-2 rounded-xl transition-all"
                        title="Avanzar a la siguiente etapa"
                      >
                        Avanzar &rarr;
                      </button>
                    ) : (
                      <span className="flex items-center justify-center text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-xl py-2 px-2">
                        ✓ Cerrado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewDealModal && (
        <Modal
          title="Nueva Oportunidad / Prospecto"
          subtitle="Registra un nuevo prospecto volando o asignado a tu cartera"
          onClose={() => setShowNewDealModal(false)}
        >
          <form onSubmit={handleCreateDeal} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre del Prospecto / Empresa *</label>
              <input
                type="text"
                required
                placeholder="Ej. Distribuidora del Valle SAS"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Teléfono de contacto</label>
                <input
                  type="text"
                  placeholder="+573001234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Producto o Servicio de Interés *</label>
              <input
                type="text"
                required
                placeholder="Ej. 10x Llantas Goodyear Fleet LT235/85R16"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Valor estimado (COP)</label>
              <input
                type="number"
                placeholder="5000000"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="assignSelf"
                checked={newAssignSelf}
                onChange={(e) => setNewAssignSelf(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <label htmlFor="assignSelf" className="font-semibold text-gray-800 cursor-pointer">
                Asignar directamente a mí ({CURRENT_USER.name}) (Si no, quedará como prospecto libre "volando")
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowNewDealModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800"
              >
                Guardar Oportunidad
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function ReportesTab(): ReactElement {
  const byRep: Record<string, { count: number; value: number }> = {};
  for (const d of DEALS.filter((d) => d.stage === "cerrado")) {
    if (!byRep[d.rep]) byRep[d.rep] = { count: 0, value: 0 };
    byRep[d.rep].count++; byRep[d.rep].value += d.value;
  }
  const max = Math.max(...Object.values(byRep).map((r) => r.value), 1);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Tasa de cierre", value: "34%", color: "#10b981" },
          { label: "Tiempo prom. cierre", value: "8.4d", color: "#ff9900" },
          { label: "Ticket promedio", value: fmtCOP(Math.round(DEALS.reduce((a, d) => a + d.value, 0) / DEALS.length)), color: "#3b82f6" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-2xl font-black tabular-nums leading-none" style={{ color: m.color }}>{m.value}</p>
            <p className="text-sm text-gray-600 mt-2">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-base font-bold text-gray-900">Rendimiento por asesor</span>
        </div>
        <div className="divide-y divide-gray-100">
          {Object.entries(byRep).map(([rep, data]) => (
            <div key={rep} className="px-5 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ backgroundColor: "#f0f0f1", color: "#555" }}>{rep.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{rep}</span>
                  <span className="text-sm font-bold text-gray-900">{fmtCOP(data.value)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(data.value / max) * 100}%`, backgroundColor: "#ff9900" }} />
                </div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{data.count} cierre{data.count !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD TAB
══════════════════════════════════════════════════════════ */

type PeriodFilter = "hoy" | "semana" | "mes";

const IcoDash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

type QuickModal =
  | "none"
  | "prospecto"
  | "post-prospecto"
  | "pick-client-apt"
  | "pick-client-call"
  | "do-activity";

function DashboardTab({ clients, activities, cotizaciones, onSelectClient, onCreateProspecto, onCreateActivity, onGoClientes }: {
  clients: Client[]; activities: Record<string, ActivityRecord[]>;
  cotizaciones: Record<string, Cotizacion[]>; onSelectClient: (id: string) => void;
  onCreateProspecto: (d: ProspectoFD) => string;
  onCreateActivity: (clientId: string, d: ActivityFD) => void;
  onGoClientes: () => void;
}): ReactElement {
  const [period, setPeriod] = useState<PeriodFilter>("hoy");
  const [quickModal, setQuickModal] = useState<QuickModal>("none");
  const [quickClient, setQuickClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [savedProspect, setSavedProspect] = useState<{ id: string; name: string } | null>(null);
  const [pendingActType, setPendingActType] = useState<ActivityFD["type"]>("appointment");
  const TODAY = new Date().toISOString().slice(0, 10);

  function inPeriod(iso: string): boolean {
    const d = new Date(iso);
    const now = new Date();
    if (period === "hoy") return iso.slice(0, 10) === TODAY;
    if (period === "semana") {
      const dow = now.getDay(); // 0=Sun
      const diffToMon = (dow === 0 ? -6 : 1 - dow);
      const monday = new Date(now); monday.setDate(now.getDate() + diffToMon); monday.setHours(0,0,0,0);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23,59,59,999);
      return d >= monday && d <= sunday;
    }
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  const allCots = useMemo(() => Object.values(cotizaciones).flat(), [cotizaciones]);
  const closedCots = allCots.filter((c) => c.status === "aceptada" && inPeriod(c.createdAt));
  const seedDeals = DEALS.filter((d) => d.stage === "cerrado" && d.closedAt && inPeriod(d.closedAt));
  const ventasTotal = closedCots.reduce((a, c) => a + c.total, 0) + seedDeals.reduce((a, d) => a + d.value, 0);
  const numCots = allCots.filter((c) => inPeriod(c.createdAt)).length;

  const todayActivities: { clientId: string; clientName: string; act: ActivityRecord }[] = useMemo(() => {
    const arr: { clientId: string; clientName: string; act: ActivityRecord }[] = [];
    for (const [cid, acts] of Object.entries(activities)) {
      const cl = clients.find((c) => c.id === cid);
      if (!cl) continue;
      for (const act of acts) {
        if (act.type === "appointment" && act.scheduledAt && act.scheduledAt.slice(0, 10) === TODAY) {
          arr.push({ clientId: cid, clientName: cl.name, act });
        }
      }
    }
    return arr.sort((a, b) => (a.act.scheduledAt ?? "").localeCompare(b.act.scheduledAt ?? ""));
  }, [activities, clients]);

  const noActivity = clients.filter((c) => !(activities[c.id]?.length));
  const atRisk     = clients.filter((c) => c.status === "at-risk" || c.status === "dormant");

  const PERIODS: { key: PeriodFilter; label: string }[] = [
    { key: "hoy", label: "Hoy" }, { key: "semana", label: "Esta semana" }, { key: "mes", label: "Este mes" },
  ];

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [clients, clientSearch]);

  function closeQuick() {
    setQuickModal("none");
    setQuickClient(null);
    setClientSearch("");
  }

  /* ── Quick action button design ──────────────────────── */
  const QA_ITEMS: { label: string; sub: string; icon: ReactElement; color: string; onClick: () => void }[] = [
    {
      label: "Nuevo prospecto", sub: "Registrar lead",
      icon: <IcoPlus />, color: "#ff9900",
      onClick: () => setQuickModal("prospecto"),
    },
    {
      label: "Agendar cita", sub: "Para hoy o manana",
      icon: <IcoCalendar />, color: "#3b82f6",
      onClick: () => { setClientSearch(""); setPendingActType("appointment"); setQuickModal("pick-client-apt"); },
    },
    {
      label: "Registrar llamada", sub: "Con cliente",
      icon: <IcoPhoneCall />, color: "#10b981",
      onClick: () => { setClientSearch(""); setPendingActType("call"); setQuickModal("pick-client-call"); },
    },
    {
      label: "Cotizar", sub: "Nueva propuesta",
      icon: <IcoQuote />, color: "#8b5cf6",
      onClick: onGoClientes,
    },
  ];

  return (
    <>
      {/* ── Quick action modals ───────────────────────── */}

      {/* Nuevo prospecto */}
      {quickModal === "prospecto" && (
        <Modal title="Nuevo prospecto" subtitle={`Asignado a ${CURRENT_USER.name}`} onClose={closeQuick}>
          <ProspectoForm
            onSubmit={(d) => {
              const id = onCreateProspecto(d);
              setSavedProspect({ id, name: d.name });
              setQuickModal("post-prospecto");
            }}
            onCancel={closeQuick}
          />
        </Modal>
      )}

      {/* Post-save sheet after prospecto */}
      {quickModal === "post-prospecto" && savedProspect && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={closeQuick} />
          <div className="relative bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm overflow-hidden">
            <div className="px-5 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <p className="text-base font-bold text-gray-900">Prospecto guardado</p>
              </div>
              <p className="text-sm text-gray-400 ml-10">{savedProspect.name}</p>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={() => { onSelectClient(savedProspect.id); closeQuick(); }}
                className="w-full h-12 flex items-center gap-3 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors text-left">
                <IcoTabUsers />Ver perfil del prospecto
              </button>
              <button onClick={() => { setQuickClient(null); setClientSearch(""); setQuickModal("prospecto"); setSavedProspect(null); }}
                className="w-full h-12 flex items-center gap-3 px-4 rounded-lg bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors text-left">
                <IcoPlus />Registrar otro prospecto
              </button>
              <button onClick={closeQuick}
                className="w-full h-10 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client picker for cita / llamada */}
      {(quickModal === "pick-client-apt" || quickModal === "pick-client-call") && (
        <Modal
          title={quickModal === "pick-client-apt" ? "Agendar cita" : "Registrar llamada"}
          subtitle="Selecciona el cliente"
          onClose={closeQuick}>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 h-10">
              <IcoSearch />
              <input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Buscar por nombre o telefono..."
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                autoFocus
              />
              {clientSearch && <button onClick={() => setClientSearch("")} className="text-gray-400"><IcoX /></button>}
            </div>
            <div className="max-h-64 overflow-y-auto no-scrollbar divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
              {filteredClients.slice(0, 12).map((c) => (
                <button key={c.id} onClick={() => { setQuickClient(c); setQuickModal("do-activity"); /* pendingActType already set */ }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ backgroundColor: "#f0f0f1", color: "#444" }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.phone} · {c.city}</p>
                  </div>
                  <IcoChevronR />
                </button>
              ))}
              {filteredClients.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">Sin resultados</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Activity form after picking client */}
      {quickModal === "do-activity" && quickClient && (
        <Modal
          title={pendingActType === "appointment" ? "Agendar cita" : "Registrar llamada"}
          subtitle={quickClient.name}
          onClose={closeQuick}>
          <ActivityForm
            initialType={pendingActType}
            onSubmit={(d) => { onCreateActivity(quickClient.id, d); closeQuick(); }}
            onCancel={closeQuick}
          />
        </Modal>
      )}

    <div className="space-y-6">

      {/* ── Quick actions ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {QA_ITEMS.map((qa) => (
          <button key={qa.label} onClick={qa.onClick}
            className="flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left group">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ backgroundColor: `${qa.color}12`, color: qa.color }}>
              {qa.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{qa.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{qa.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Period filter ──────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            className={["h-8 px-4 rounded-lg text-xs font-semibold transition-all", period === p.key ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Ventas</p>
          <p className="text-2xl font-black tabular-nums leading-none" style={{ color: "#ff9900" }}>{fmtCOP(ventasTotal)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Cotizaciones</p>
          <p className="text-2xl font-black text-gray-900 leading-none">{numCots}</p>
        </div>
        <div className={`border rounded-xl p-4 ${noActivity.length > 0 ? "bg-amber-50 border-amber-100" : "bg-white border-gray-100"}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wide mb-2 ${noActivity.length > 0 ? "text-amber-500" : "text-gray-400"}`}>Sin actividad</p>
          <p className={`text-2xl font-black leading-none ${noActivity.length > 0 ? "text-amber-600" : "text-gray-900"}`}>{noActivity.length}</p>
        </div>
      </div>

      {/* Today's agenda */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-gray-900">
            <IcoCalendar />Agenda de hoy
          </div>
          <span className="text-sm text-gray-400">{todayActivities.length} {todayActivities.length === 1 ? "cita" : "citas"}</span>
        </div>
        {todayActivities.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Sin citas programadas para hoy</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {todayActivities.map(({ clientId, clientName, act }) => (
              <button key={act.id} onClick={() => onSelectClient(clientId)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#f0f0f1", color: "#555" }}>
                  <IcoCalendar />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{act.title || "Cita"}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{clientName}</p>
                </div>
                {act.scheduledAt && (
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: "#ff9900" }}>
                    {new Date(act.scheduledAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
                <IcoChevronR />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sin actividad */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-900 flex-1">Prospectos por activar</span>
            <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{noActivity.length}</span>
          </div>
          {noActivity.length === 0 ? (
            <div className="px-5 py-8 text-center"><p className="text-sm text-emerald-600 font-semibold">Todos activos</p></div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto no-scrollbar">
              {noActivity.slice(0, 8).map((c) => (
                <button key={c.id} onClick={() => onSelectClient(c.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ backgroundColor: "#f0f0f1", color: "#555" }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.city || "Prospecto"}</p>
                  </div>
                  <IcoChevronR />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* A atender */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-900 flex-1">Clientes a atender</span>
            <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{atRisk.length}</span>
          </div>
          {atRisk.length === 0 ? (
            <div className="px-5 py-8 text-center"><p className="text-sm text-emerald-600 font-semibold">Sin clientes en riesgo</p></div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto no-scrollbar">
              {atRisk.map((c) => (
                <button key={c.id} onClick={() => onSelectClient(c.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ backgroundColor: "#f0f0f1", color: "#555" }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${c.status === "at-risk" ? "text-amber-600" : "text-gray-400"}`}>
                      {c.status === "at-risk" ? "En riesgo" : "Inactivo"} · {c.lastContact}
                    </p>
                  </div>
                  <IcoChevronR />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   CALLS TAB
══════════════════════════════════════════════════════════ */

type CallDirFilter    = "all" | "inbound" | "outbound";
type CallStatusFilter = "all" | "completed" | "missed" | "voicemail";

function CallsTab({ calls, clients, onUpdateCall }: {
  calls: CallRecord[];
  clients: Client[];
  onUpdateCall: (id: string, patch: Partial<CallRecord>) => void;
}): ReactElement {
  const [dirFilter,       setDirFilter]       = useState<CallDirFilter>("all");
  const [statusFilter,    setStatusFilter]    = useState<CallStatusFilter>("all");
  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [playingId,       setPlayingId]       = useState<string | null>(null);
  const [editingNoteId,   setEditingNoteId]   = useState<string | null>(null);
  const [noteDraft,       setNoteDraft]       = useState("");
  const [addingFollowUpId,setAddingFollowUpId]= useState<string | null>(null);
  const [fuType,          setFuType]          = useState<CallFollowUp["type"]>("call");
  const [fuDate,          setFuDate]          = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [fuTime,          setFuTime]          = useState("09:00");
  const [fuNotes,         setFuNotes]         = useState("");

  function startEditNote(call: CallRecord) {
    setEditingNoteId(call.id);
    setNoteDraft(call.notes ?? "");
  }
  function saveNote(id: string) {
    onUpdateCall(id, { notes: noteDraft.trim() || undefined });
    setEditingNoteId(null);
  }
  function saveFollowUp(call: CallRecord) {
    const fu: CallFollowUp = {
      type: fuType,
      scheduledAt: `${fuDate}T${fuTime}:00`,
      notes: fuNotes.trim(),
      done: false,
    };
    onUpdateCall(call.id, { followUp: fu });
    setAddingFollowUpId(null);
    setFuNotes("");
    setFuType("call");
    setFuDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setFuTime("09:00");
  }

  const filtered = useMemo(() => calls.filter((c) => {
    if (dirFilter    !== "all" && c.direction !== dirFilter)    return false;
    if (statusFilter !== "all" && c.status    !== statusFilter) return false;
    return true;
  }), [calls, dirFilter, statusFilter]);

  const answered   = calls.filter((c) => c.status === "completed").length;
  const missed     = calls.filter((c) => c.status === "missed" || c.status === "no-answer").length;
  const recordings = calls.filter((c) => c.hasRecording).length;
  const avgDur     = useMemo(() => {
    const d = calls.filter((c) => c.duration);
    return d.length ? Math.round(d.reduce((a, c) => a + (c.duration ?? 0), 0) / d.length) : 0;
  }, [calls]);

  const STATUS_META: Record<CallRecord["status"], { label: string; cls: string }> = {
    completed:   { label: "Completada",   cls: "bg-emerald-50 text-emerald-700" },
    missed:      { label: "Perdida",      cls: "bg-red-50 text-red-600"         },
    voicemail:   { label: "Buzon de voz", cls: "bg-purple-50 text-purple-700"   },
    "no-answer": { label: "Sin respuesta",cls: "bg-gray-100 text-gray-500"      },
  };

  function fmtTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="flex items-center gap-6 sm:gap-10 pb-5 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex-shrink-0">
          <p className="text-[30px] font-black tabular-nums leading-none text-gray-900">{calls.length}</p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Total</p>
        </div>
        <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-[30px] font-black tabular-nums leading-none text-emerald-500">{answered}</p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Atendidas</p>
        </div>
        <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-[30px] font-black tabular-nums leading-none text-red-500">{missed}</p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Perdidas</p>
        </div>
        <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-[30px] font-black tabular-nums leading-none text-gray-900">{fmtDuration(avgDur)}</p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Duracion media</p>
        </div>
        <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-[30px] font-black tabular-nums leading-none" style={{ color: "#ff9900" }}>{recordings}</p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Grabaciones</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0 w-14">Tipo</span>
          {([
            { key: "all",      label: "Todas"     },
            { key: "inbound",  label: "Entrantes" },
            { key: "outbound", label: "Salientes" },
          ] as { key: CallDirFilter; label: string }[]).map((o) => (
            <button key={o.key} onClick={() => setDirFilter(o.key)}
              className={["flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all",
                dirFilter === o.key ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
              {o.label}
            </button>
          ))}
          <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />
          {([
            { key: "all",       label: "Todas"        },
            { key: "completed", label: "Completadas"  },
            { key: "missed",    label: "Perdidas"     },
            { key: "voicemail", label: "Buzon de voz" },
          ] as { key: CallStatusFilter; label: string }[]).map((o) => (
            <button key={o.key} onClick={() => setStatusFilter(o.key)}
              className={["flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all",
                statusFilter === o.key ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"].join(" ")}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Call list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {filtered.length === 0 && (
          <div className="py-16 text-center"><p className="text-sm text-gray-400">Sin llamadas</p></div>
        )}
        {filtered.map((call) => {
          const meta    = STATUS_META[call.status];
          const isOpen  = expandedId === call.id;
          const playing = playingId  === call.id;
          return (
            <div key={call.id}>
              <button onClick={() => setExpandedId(isOpen ? null : call.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <div className={["w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  call.direction === "inbound" ? "bg-blue-50 text-blue-500" : "bg-gray-50 text-gray-500"].join(" ")}>
                  {call.direction === "inbound" ? <IcoPhoneIn /> : <IcoPhoneOut />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{call.clientName}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{call.phone}</p>
                </div>
                <span className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-1 rounded-md flex-shrink-0 ${meta.cls}`}>
                  {meta.label}
                </span>
                <span className="text-xs font-bold tabular-nums text-gray-400 flex-shrink-0 w-10 text-right">
                  {call.duration ? fmtDuration(call.duration) : "—"}
                </span>
                <span className="hidden md:block text-xs text-gray-400 flex-shrink-0 w-28 text-right">
                  {fmtTime(call.startedAt)}
                </span>
                {call.hasRecording
                  ? <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#ff990015", color: "#ff9900" }}><IcoMic /></span>
                  : <span className="w-7 flex-shrink-0" />}
                <IcoChevronR />
              </button>

              {isOpen && (() => {
                const linkedClient = call.clientId ? clients.find((c) => c.id === call.clientId) : null;
                const isEditingNote = editingNoteId === call.id;
                const isAddingFU    = addingFollowUpId === call.id;

                const FU_TYPE_OPTS: { key: CallFollowUp["type"]; label: string }[] = [
                  { key: "call",        label: "Llamada"  },
                  { key: "visit",       label: "Visita"   },
                  { key: "appointment", label: "Cita"     },
                ];

                return (
                  <div className="px-4 pb-4 pt-3 bg-[#fafafa] border-t border-gray-100 space-y-4">

                    {/* Row 1: client badge + recording */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {linkedClient && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            {linkedClient.name}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {call.loggedBy} · {fmtTime(call.startedAt)}
                          {call.duration && ` · ${fmtDuration(call.duration)}`}
                        </span>
                      </div>
                      {call.hasRecording && (
                        <button onClick={() => setPlayingId(playing ? null : call.id)}
                          className={["flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-semibold transition-all flex-shrink-0",
                            playing ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"].join(" ")}>
                          {playing ? <><IcoPause />Reproduciendo</> : <><IcoPlay />Escuchar grabacion</>}
                        </button>
                      )}
                    </div>

                    {/* Waveform */}
                    {playing && (
                      <div className="flex items-center gap-[3px] h-8">
                        {Array.from({ length: 44 }).map((_, i) => {
                          const h = 3 + Math.round(Math.abs(Math.sin(i * 0.9 + 1.2) * 18 + Math.cos(i * 0.5) * 7));
                          const done = i < 16;
                          return <div key={i} className="rounded-full flex-shrink-0" style={{ width: 3, height: `${h}px`, backgroundColor: done ? "#ff9900" : "#e5e7eb" }} />;
                        })}
                        <span className="text-[11px] text-gray-400 ml-2 tabular-nums flex-shrink-0">
                          {call.duration ? `0:${String(Math.round(call.duration * 0.36)).padStart(2,"0")} / ${fmtDuration(call.duration)}` : ""}
                        </span>
                      </div>
                    )}

                    {/* Notes section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notas de la llamada</p>
                        {!isEditingNote && (
                          <button onClick={() => startEditNote(call)}
                            className="text-[10px] font-bold text-[#ff9900] hover:underline flex-shrink-0">
                            {call.notes ? "Editar" : "+ Agregar nota"}
                          </button>
                        )}
                      </div>
                      <div className="px-3 py-3">
                        {isEditingNote ? (
                          <div className="space-y-2">
                            <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                              rows={3} autoFocus
                              placeholder="Describe lo que se habló, acuerdos, proximos pasos..."
                              className="w-full text-sm text-gray-900 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 resize-none leading-relaxed" />
                            <div className="flex items-center gap-2 justify-end">
                              <button onClick={() => setEditingNoteId(null)}
                                className="h-8 px-3 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-lg">
                                Cancelar
                              </button>
                              <button onClick={() => saveNote(call.id)}
                                className="h-8 px-4 text-xs font-bold text-white rounded-lg"
                                style={{ backgroundColor: "#ff9900" }}>
                                Guardar
                              </button>
                            </div>
                          </div>
                        ) : call.notes ? (
                          <p className="text-sm text-gray-700 leading-relaxed">{call.notes}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-1">Sin notas — agrega contexto sobre esta llamada.</p>
                        )}
                      </div>
                    </div>

                    {/* Follow-up section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seguimiento</p>
                        {!call.followUp && !isAddingFU && (
                          <button onClick={() => setAddingFollowUpId(call.id)}
                            className="text-[10px] font-bold text-[#ff9900] hover:underline flex-shrink-0">
                            + Agendar seguimiento
                          </button>
                        )}
                        {call.followUp && !call.followUp.done && (
                          <button onClick={() => onUpdateCall(call.id, { followUp: { ...call.followUp!, done: true } })}
                            className="text-[10px] font-bold text-emerald-600 hover:underline flex-shrink-0">
                            Marcar como hecho
                          </button>
                        )}
                      </div>

                      <div className="px-3 py-3">
                        {isAddingFU ? (
                          <div className="space-y-3">
                            {/* Type */}
                            <div className="flex items-center gap-2">
                              {FU_TYPE_OPTS.map((o) => (
                                <button key={o.key} type="button" onClick={() => setFuType(o.key)}
                                  className={["flex-1 h-8 rounded-lg text-xs font-bold border-2 transition-all",
                                    fuType === o.key ? "border-[#ff9900] bg-orange-50 text-[#ff9900]" : "border-gray-200 text-gray-500"].join(" ")}>
                                  {o.label}
                                </button>
                              ))}
                            </div>
                            {/* Date + time */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                                <input type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)}
                                  className="w-full h-9 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:border-[#ff9900]" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hora</p>
                                <input type="time" value={fuTime} onChange={(e) => setFuTime(e.target.value)}
                                  className="w-full h-9 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:border-[#ff9900]" />
                              </div>
                            </div>
                            {/* Notes */}
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Descripcion</p>
                              <textarea value={fuNotes} onChange={(e) => setFuNotes(e.target.value)}
                                rows={2} placeholder="Que se debe hacer en este seguimiento..."
                                className="w-full text-sm text-gray-900 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 resize-none" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <button onClick={() => setAddingFollowUpId(null)}
                                className="h-8 px-3 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-lg">
                                Cancelar
                              </button>
                              <button onClick={() => saveFollowUp(call)}
                                className="h-8 px-4 text-xs font-bold text-white rounded-lg"
                                style={{ backgroundColor: "#111111" }}>
                                Guardar seguimiento
                              </button>
                            </div>
                          </div>
                        ) : call.followUp ? (
                          <div className={["flex items-start gap-3 rounded-lg p-3", call.followUp.done ? "bg-gray-50" : "bg-amber-50"].join(" ")}>
                            <div className={["w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                              call.followUp.done ? "border-emerald-400 bg-emerald-400" : "border-amber-400"].join(" ")}>
                              {call.followUp.done && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" className="w-3 h-3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={["text-xs font-bold capitalize", call.followUp.done ? "text-gray-400 line-through" : "text-gray-900"].join(" ")}>
                                {call.followUp.type === "call" ? "Llamada de seguimiento" : call.followUp.type === "visit" ? "Visita" : "Cita agendada"}
                              </p>
                              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                                {new Date(call.followUp.scheduledAt).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </p>
                              {call.followUp.notes && (
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{call.followUp.notes}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-1">Sin seguimiento agendado.</p>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING DIALER
══════════════════════════════════════════════════════════ */

type DialerState = "closed" | "open" | "dialing" | "active";

function FloatingDialer({ clients, activities, history, cotizaciones, onCallSaved, onSaveCotizacion, onAddActivity }: {
  clients: Client[];
  activities: Record<string, ActivityRecord[]>;
  history: Record<string, ServiceRecord[]>;
  cotizaciones: Record<string, Cotizacion[]>;
  onCallSaved: (c: CallRecord) => void;
  onSaveCotizacion?: (clientId: string, cot: Cotizacion) => void;
  onAddActivity?: (clientId: string, act: ActivityRecord) => void;
}): ReactElement {
  const [dialerState,    setDialerState]    = useState<DialerState>("closed");
  const [search,         setSearch]         = useState("");
  const [dialNumber,     setDialNumber]     = useState("");
  const [isMuted,        setIsMuted]        = useState(false);
  const [isRecording,    setIsRecording]    = useState(false);
  const [seconds,        setSeconds]        = useState(0);
  const [activeCall,     setActiveCall]     = useState<{ clientName: string; phone: string; clientId?: string } | null>(null);
  const [preCallClient,  setPreCallClient]  = useState<Client | null>(null);
  const [liveNote,       setLiveNote]       = useState("");
  const [showLiveNote,   setShowLiveNote]   = useState(false);
  const [postCallData,   setPostCallData]   = useState<{ call: Omit<CallRecord, "notes" | "followUp">; draftSeconds: number; liveNote: string; hadScheduledActivity: boolean } | null>(null);
  const [pcNotes,        setPcNotes]        = useState("");
  const [pcStatus,       setPcStatus]       = useState<CallRecord["status"]>("completed");
  const [pcAddFu,        setPcAddFu]        = useState(false);
  const [pcFuType,       setPcFuType]       = useState<CallFollowUp["type"]>("call");
  const [pcFuDate,       setPcFuDate]       = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [pcFuTime,       setPcFuTime]       = useState("09:00");
  const [pcFuNotes,      setPcFuNotes]      = useState("");

  // Brief tabs
  const [briefTab,       setBriefTab]       = useState<"resumen" | "cotizar" | "agendar" | "nota">("resumen");

  // Mini cotizar state
  type BriefLine = { product: CrmProduct; qty: number; lista: TipoLista; discount: number };
  const [bqSearch,    setBqSearch]    = useState("");
  const [bqLista,     setBqLista]     = useState<TipoLista>("instalador");
  const [bqLines,     setBqLines]     = useState<BriefLine[]>([]);
  const [bqSaved,     setBqSaved]     = useState(false);

  // Agenda state
  const [agType,              setAgType]              = useState<ActivityRecord["type"]>("appointment");
  const [agDate,              setAgDate]              = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [agTime,              setAgTime]              = useState("10:00");
  const [agTitle,             setAgTitle]             = useState("");
  const [agNotes,             setAgNotes]             = useState("");
  const [agSaved,             setAgSaved]             = useState(false);
  const [agendedDuringCall,   setAgendedDuringCall]   = useState(false);

  // Saved cotización for share actions
  const [bqSavedCot,          setBqSavedCot]          = useState<Cotizacion | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (dialerState === "active") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setSeconds(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [dialerState]);

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients.slice(0, 8);
    return clients.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 8);
  }, [clients, search]);

  function startCall(name: string, phone: string, clientId?: string) {
    setActiveCall({ clientName: name, phone, clientId });
    setDialerState("dialing");
    setIsMuted(false); setIsRecording(false);
    setTimeout(() => setDialerState("active"), 1800);
  }

  function hangUp() {
    if (!activeCall) return;
    const partial: Omit<CallRecord, "notes" | "followUp"> = {
      id: `call${Date.now()}`,
      clientId:    activeCall.clientId,
      clientName:  activeCall.clientName,
      phone:       activeCall.phone,
      direction:   "outbound",
      status:      seconds > 5 ? "completed" : "no-answer",
      duration:    seconds > 5 ? seconds : undefined,
      startedAt:   new Date(Date.now() - seconds * 1000).toISOString(),
      hasRecording: isRecording,
      loggedBy:    CURRENT_USER.name,
    };
    setPostCallData({ call: partial, draftSeconds: seconds, liveNote, hadScheduledActivity: agendedDuringCall });
    setPcStatus(seconds > 5 ? "completed" : "no-answer");
    setPcNotes(liveNote); setPcAddFu(false); setPcFuNotes("");
    setLiveNote(""); setShowLiveNote(false);
    setAgendedDuringCall(false);
    setBriefTab("resumen");
    setDialerState("closed");
    setActiveCall(null);
    setSearch(""); setDialNumber("");
  }

  function savePostCall() {
    if (!postCallData) return;
    const fu: CallFollowUp | undefined = pcAddFu ? {
      type: pcFuType,
      scheduledAt: `${pcFuDate}T${pcFuTime}:00`,
      notes: pcFuNotes.trim(),
      done: false,
    } : undefined;
    const rec: CallRecord = {
      ...postCallData.call,
      status: pcStatus,
      duration: pcStatus === "completed" ? postCallData.call.duration : undefined,
      notes: pcNotes.trim() || undefined,
      followUp: fu,
    };
    onCallSaved(rec);
    setPostCallData(null);
    setPreCallClient(null);
    setBqSavedCot(null);
  }

  /* ── Post-call summary modal ─────────────────────── */
  if (postCallData) {
    const FU_TYPE_OPTS: { key: CallFollowUp["type"]; label: string }[] = [
      { key: "call", label: "Llamada" }, { key: "visit", label: "Visita" }, { key: "appointment", label: "Cita" },
    ];
    const STATUS_OPTS: { key: CallRecord["status"]; label: string }[] = [
      { key: "completed", label: "Completada" }, { key: "no-answer", label: "Sin respuesta" },
      { key: "voicemail", label: "Buzon de voz" }, { key: "missed", label: "Perdida" },
    ];
    return (
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden max-h-[90dvh] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0" style={{ backgroundColor: "#111111" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#ff9900" }}>
              <IcoPhoneOff />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white leading-tight">{postCallData.call.clientName}</p>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: "#9ca3af" }}>{postCallData.call.phone}</p>
            </div>
            {postCallData.draftSeconds > 0 && (
              <span className="text-xs font-black flex-shrink-0 px-2 py-1 rounded-lg" style={{ backgroundColor: "#ff9900", color: "#111111" }}>
                {fmtDuration(postCallData.draftSeconds)}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            {/* Outcome */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Resultado</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTS.map((o) => (
                  <button key={o.key} type="button" onClick={() => setPcStatus(o.key)}
                    className={["h-10 rounded-xl text-xs font-bold border-2 transition-all",
                      pcStatus === o.key ? "border-[#ff9900] bg-orange-50 text-[#ff9900]" : "border-gray-200 text-gray-600"].join(" ")}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Notas de la llamada</p>
              <textarea value={pcNotes} onChange={(e) => setPcNotes(e.target.value)}
                rows={3} autoFocus
                placeholder="Que se habló, acuerdos, próximos pasos..."
                className="w-full text-sm text-gray-900 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-400 resize-none leading-relaxed" />
            </div>

            {/* Follow-up section */}
            <div>
              {postCallData.hadScheduledActivity ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-700">Seguimiento ya agendado durante la llamada</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Puedes verlo en la pestaña Actividades del cliente</p>
                  </div>
                  <button onClick={() => setPcAddFu((v) => !v)}
                    className="text-[10px] font-bold text-emerald-500 hover:text-emerald-700 flex-shrink-0 transition-colors">
                    {pcAddFu ? "Cancelar" : "+ Otro"}
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setPcAddFu((v) => !v)}
                  className="flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all"
                  style={{ borderColor: pcAddFu ? "#ff9900" : "#e5e7eb", backgroundColor: pcAddFu ? "#fff7ed" : "#fafafa" }}>
                  <div className="flex items-center gap-2.5 text-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="w-4 h-4 flex-shrink-0" style={{ color: pcAddFu ? "#ff9900" : "#9ca3af" }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold" style={{ color: pcAddFu ? "#ff9900" : "#374151" }}>Agendar seguimiento</p>
                      <p className="text-[10px] text-gray-400">Crea una tarea de seguimiento para este cliente</p>
                    </div>
                  </div>
                  <div className={["w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    pcAddFu ? "border-[#ff9900] bg-[#ff9900]" : "border-gray-300"].join(" ")}>
                    {pcAddFu && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              )}

              {pcAddFu && (
                <div className="mt-3 space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    {FU_TYPE_OPTS.map((o) => (
                      <button key={o.key} type="button" onClick={() => setPcFuType(o.key)}
                        className={["flex-1 h-9 rounded-lg text-[11px] font-bold border-2 transition-all",
                          pcFuType === o.key ? "border-[#ff9900] bg-white text-[#ff9900]" : "border-transparent bg-white text-gray-500"].join(" ")}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={pcFuDate} onChange={(e) => setPcFuDate(e.target.value)}
                      className="h-9 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:border-[#ff9900]" />
                    <input type="time" value={pcFuTime} onChange={(e) => setPcFuTime(e.target.value)}
                      className="h-9 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-900 bg-white focus:outline-none focus:border-[#ff9900]" />
                  </div>
                  <textarea value={pcFuNotes} onChange={(e) => setPcFuNotes(e.target.value)}
                    rows={2} placeholder="Que debes hacer en este seguimiento..."
                    className="w-full text-xs text-gray-900 placeholder-gray-300 bg-white border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 resize-none" />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={savePostCall}
              className="w-full h-12 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: "#111111" }}>
              <IcoSaveIcon />Guardar y cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Active call HUD (only when brief is closed) ──── */
  if ((dialerState === "active" || dialerState === "dialing") && !preCallClient) {
    return (
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-2">
        {/* Live note field */}
        {dialerState === "active" && showLiveNote && (
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 w-72">
            <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "#ff9900" }}>
              Notas durante la llamada
            </p>
            <textarea value={liveNote} onChange={(e) => setLiveNote(e.target.value)}
              rows={3} autoFocus placeholder="Escribe lo que van hablando..."
              className="w-full bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 outline-none resize-none placeholder-gray-600 leading-relaxed border border-gray-700 focus:border-gray-500" />
          </div>
        )}
        {/* Call bar */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-2.5" style={{ minWidth: 280 }}>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold leading-tight truncate">{activeCall?.clientName ?? "..."}</p>
            {dialerState === "dialing"
              ? <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#ff9900" }}>Marcando...</p>
              : <p className="text-[11px] font-mono font-semibold text-emerald-400 mt-0.5">{fmtDuration(seconds)}</p>}
          </div>
          {dialerState === "active" && (
            <>
              {activeCall?.clientId && (
                <button
                  onClick={() => { const c = clients.find((x) => x.id === activeCall.clientId); if (c) setPreCallClient(c); }}
                  title="Ver brief del cliente"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all bg-white/10 text-white hover:bg-white/20">
                  <IcoFileText />
                </button>
              )}
              <button onClick={() => setIsMuted((m) => !m)}
                title={isMuted ? "Activar microfono" : "Silenciar"}
                className={["w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                  isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"].join(" ")}>
                {isMuted ? <IcoMicOff /> : <IcoMic />}
              </button>
              <button onClick={() => setIsRecording((r) => !r)}
                title={isRecording ? "Detener grabacion" : "Grabar llamada"}
                className={["w-9 h-9 rounded-lg flex items-center justify-center transition-all relative",
                  isRecording ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"].join(" ")}>
                <svg viewBox="0 0 24 24" fill={isRecording ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="5" />
                </svg>
                {isRecording && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-300 border-2 border-gray-900" style={{ animation: "pulse 1.2s infinite" }} />}
              </button>
            </>
          )}
          <button onClick={hangUp} title="Colgar"
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors text-white"
            style={{ backgroundColor: "#ef4444" }}>
            <IcoPhoneOff />
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-call brief ───────────────────────────────── */
  if (preCallClient) {
    const pc = preCallClient;
    const pcActivities = (activities[pc.id] ?? []).slice(0, 5);
    const pcHistory    = (history[pc.id] ?? []).slice(0, 4);
    const pcCots       = (cotizaciones[pc.id] ?? []).slice(0, 3);
    const pcAlerts     = computeAlerts([pc]);

    const bullets: { text: string; urgent: boolean }[] = [];
    for (const a of pcAlerts) bullets.push({ text: a.message, urgent: a.urgency === "critical" });
    const lastService = pcHistory[0];
    if (lastService) {
      const daysAgo = Math.round((Date.now() - new Date(lastService.createdAt).getTime()) / 86400000);
      bullets.push({ text: `Ultimo servicio hace ${daysAgo} dias — ${lastService.type === "oil" ? "aceite" : lastService.type === "tires" ? "llantas" : lastService.type}`, urgent: false });
    }
    const pendingFu = (activities[pc.id] ?? []).find((a) => a.type === "appointment" && a.scheduledAt && new Date(a.scheduledAt) > new Date());
    if (pendingFu) bullets.push({ text: `Cita pendiente: ${pendingFu.title}`, urgent: false });

    // Mini cotizar helpers
    const bqFiltered = bqSearch.trim()
      ? CRM_PRODUCTS.filter((p) => (p.description + " " + p.brand + " " + p.tireSize).toLowerCase().includes(bqSearch.toLowerCase()))
      : CRM_PRODUCTS.slice(0, 6);
    const bqTotal = bqLines.reduce((s, l) => s + Math.round(lineUnitPrice(l.product, l.lista) * (1 - l.discount / 100)) * l.qty, 0);

    function bqAddLine(product: CrmProduct) {
      setBqLines((prev) => {
        const existing = prev.findIndex((l) => l.product.sku === product.sku && l.lista === bqLista);
        if (existing >= 0) return prev.map((l, i) => i === existing ? { ...l, qty: l.qty + 1 } : l);
        return [...prev, { product, qty: 1, lista: bqLista, discount: 0 }];
      });
      setBqSearch("");
    }

    function bqSaveCot() {
      if (!bqLines.length) return;
      const cot: Cotizacion = {
        id: `COT-${Date.now()}`,
        clientId: pc.id,
        clientName: pc.name,
        createdAt: new Date().toISOString(),
        rep: CURRENT_USER.name,
        paymentMethod: "contado",
        lines: bqLines.map((l) => {
          const unitPrice = lineUnitPrice(l.product, l.lista);
          const finalUnit = Math.round(unitPrice * (1 - l.discount / 100));
          return {
            productSku: l.product.sku,
            productName: `${l.product.brand} ${l.product.description}`,
            qty: l.qty,
            tipoLista: l.lista,
            unitPrice,
            discount: l.discount,
            finalUnit,
            subtotal: finalUnit * l.qty,
            warehouseAlloc: [],
          };
        }),
        total: bqTotal,
        status: "borrador",
      };
      onSaveCotizacion?.(pc.id, cot);
      setBqSavedCot(cot);
      setBqLines([]); setBqSearch(""); setBqSaved(true);
      setTimeout(() => setBqSaved(false), 3000);
    }

    function agSave() {
      if (!agTitle.trim()) return;
      const act: ActivityRecord = {
        id: `act-${Date.now()}`,
        createdAt: new Date().toISOString(),
        type: agType,
        title: agTitle.trim(),
        notes: agNotes.trim(),
        scheduledAt: `${agDate}T${agTime}:00`,
        loggedBy: CURRENT_USER.name,
      };
      onAddActivity?.(pc.id, act);
      setAgTitle(""); setAgNotes(""); setAgSaved(true);
      setAgendedDuringCall(true);
      setTimeout(() => setAgSaved(false), 3000);
    }

    const isOnCall = dialerState === "active" || dialerState === "dialing";

    const BRIEF_TABS = [
      { key: "resumen" as const,  label: "Resumen"  },
      { key: "cotizar" as const,  label: "Cotizar"  },
      { key: "agendar" as const,  label: "Agendar"  },
      { key: "nota"    as const,  label: "Nota"     },
    ];

    return (
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={() => { if (!isOnCall) { setPreCallClient(null); setBriefTab("resumen"); setDialerState("open"); } }} />
        <div className="relative flex flex-col w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white max-h-[90dvh]">

          {/* Dark header */}
          <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ backgroundColor: "#111111" }}>
            <div className="flex items-center justify-between mb-3">
              {isOnCall ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" style={{ animation: "pulse 1.5s infinite" }} />
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {dialerState === "dialing" ? "Marcando..." : fmtDuration(seconds)}
                  </span>
                </div>
              ) : (
                <button onClick={() => { setPreCallClient(null); setBriefTab("resumen"); setDialerState("open"); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Volver
                </button>
              )}
              <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#ff9900" }}>
                {isOnCall ? "En llamada" : "Centro de cliente"}
              </span>
              {isOnCall ? (
                <button onClick={() => setPreCallClient(null)} title="Minimizar"
                  className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
                  Minimizar
                </button>
              ) : (
                <div className="w-14" />
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black ${STATUS_RING[pc.status]}`}
                style={{ backgroundColor: "#1f1f1f", color: "#e5e7eb" }}>{pc.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-black text-white leading-tight">{pc.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEG_STYLE[pc.segment]}`}>{pc.segment}</span>
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: "#9ca3af" }}>{pc.phone}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>{pc.city} · Rep: {pc.rep} · NPS {pc.nps}</p>
              </div>
            </div>
            {/* Tab bar */}
            <div className="flex gap-1 bg-white/10 rounded-xl p-1">
              {BRIEF_TABS.map((t) => (
                <button key={t.key} onClick={() => setBriefTab(t.key)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={briefTab === t.key
                    ? { backgroundColor: "#ff9900", color: "#111111" }
                    : { color: "#9ca3af" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── RESUMEN tab ── */}
          {briefTab === "resumen" && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Orange alert strip */}
              {bullets.length > 0 && (
                <div className="px-5 py-3.5" style={{ backgroundColor: "#ff9900" }}>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: "#111111" }}>Lo que debes saber</p>
                  <div className="space-y-1.5">
                    {bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">
                          {b.urgent ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <p className="text-xs font-semibold leading-snug" style={{ color: "#111111" }}>{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100">

                {/* Recent activities */}
                {pcActivities.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Actividades recientes</p>
                    <div className="space-y-3">
                      {pcActivities.map((a) => (
                        <div key={a.id} className="flex items-start gap-3">
                          {activityIcon(a.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs font-bold text-gray-900 leading-none">{a.title || ACT_LABEL[a.type]}</p>
                              <span className="text-[10px] text-gray-400 flex-shrink-0">{fmtTs(a.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-snug line-clamp-2">{a.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cotizaciones */}
                {pcCots.length > 0 && (
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cotizaciones</p>
                      <button onClick={() => setBriefTab("cotizar")}
                        className="text-[10px] font-bold transition-colors"
                        style={{ color: "#ff9900" }}>+ Nueva</button>
                    </div>
                    <div className="space-y-2">
                      {pcCots.map((cot) => (
                        <div key={cot.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-700">{cot.id}</p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {cot.lines.slice(0, 2).map((l) => l.productName.split(" ").slice(0, 3).join(" ")).join(" · ")}
                              {cot.lines.length > 2 ? ` +${cot.lines.length - 2}` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-black tabular-nums flex-shrink-0" style={{ color: "#ff9900" }}>{fmtCOP(cot.total)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicles */}
                {pc.vehicles.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Vehiculos</p>
                    <div className="space-y-2.5">
                      {pc.vehicles.map((v) => {
                        const h = vehicleHealth(v);
                        return (
                          <div key={v.id} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-gray-800 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">{v.plate}</span>
                                <span className="text-xs text-gray-600">{v.make} {v.model} {v.year}</span>
                              </div>
                              <span className="text-xs text-gray-400">{v.tireSize}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: "Aceite", pct: h.oil.pct, crit: h.oil.critical, warn: h.oil.alert },
                                { label: "Llantas", pct: h.tire.pct, crit: h.tire.critical, warn: h.tire.alert },
                                { label: `Bateria ${v.batteryMonths}m`, pct: Math.min(Math.round((v.batteryMonths / 36) * 100), 100), crit: h.battery.critical, warn: h.battery.alert },
                              ].map(({ label, pct, crit, warn }) => (
                                <div key={label} className={["rounded-lg p-2 text-center", crit ? "bg-red-50" : warn ? "bg-amber-50" : "bg-white"].join(" ")}>
                                  <p className={["text-sm font-black tabular-nums", crit ? "text-red-600" : warn ? "text-amber-600" : "text-gray-700"].join(" ")}>{pct}%</p>
                                  <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service history */}
                {pcHistory.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Historial de servicios</p>
                    <div className="space-y-2.5">
                      {pcHistory.map((r) => (
                        <div key={r.id} className="flex items-center gap-3">
                          {svcIcon(r.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 leading-snug truncate">{r.description}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{r.date} · {r.store}</p>
                          </div>
                          <p className="text-xs font-bold text-gray-700 tabular-nums flex-shrink-0">{fmtCOP(r.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bullets.length === 0 && pcActivities.length === 0 && pcHistory.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-gray-400">Sin historial — primer contacto con este cliente.</p>
                  </div>
                )}
                <div className="h-28" />
              </div>
            </div>
          )}

          {/* ── COTIZAR tab ── */}
          {briefTab === "cotizar" && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="px-5 pt-4 space-y-4">

                {/* Price type */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Lista de precios</p>
                  <div className="flex gap-2">
                    {([["distribuidor","Flota"],["instalador","Distribucion"],["publico","Uno a uno"]] as [TipoLista,string][]).map(([v, lbl]) => (
                      <button key={v} onClick={() => setBqLista(v)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                        style={bqLista === v
                          ? { backgroundColor: "#111111", borderColor: "#ff9900", color: "#ff9900" }
                          : { backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#6b7280" }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product search */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Agregar productos</p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl h-10 px-3 mb-2">
                    <IcoSearch />
                    <input value={bqSearch} onChange={(e) => setBqSearch(e.target.value)}
                      placeholder="Buscar llanta, medida, marca..."
                      className="flex-1 bg-transparent text-xs text-gray-900 placeholder-gray-400 outline-none" />
                    {bqSearch && <button onClick={() => setBqSearch("")} className="text-gray-400"><IcoX /></button>}
                  </div>
                  {bqSearch.trim() && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto no-scrollbar">
                      {bqFiltered.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
                      )}
                      {bqFiltered.map((p) => (
                        <button key={p.sku} onClick={() => bqAddLine(p)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{p.brand} {p.description}</p>
                            <p className="text-[10px] text-gray-400">{p.tireSize}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-black tabular-nums" style={{ color: "#ff9900" }}>
                              {fmtCOP(lineUnitPrice(p, bqLista))}
                            </p>
                            <span className="text-[9px] text-emerald-500 font-bold">+ Agregar</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lines */}
                {bqLines.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Lineas</p>
                    <div className="space-y-2">
                      {bqLines.map((l, i) => {
                        const unit = Math.round(lineUnitPrice(l.product, l.lista) * (1 - l.discount / 100));
                        return (
                          <div key={i} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 leading-snug truncate">{l.product.brand} {l.product.description}</p>
                                <p className="text-[10px] text-gray-400">{l.product.tireSize}</p>
                              </div>
                              <button onClick={() => setBqLines((prev) => prev.filter((_, j) => j !== i))}
                                className="text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors"><IcoX /></button>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                                <button onClick={() => setBqLines((prev) => prev.map((x, j) => j === i ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}
                                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 text-sm font-bold">−</button>
                                <span className="w-7 text-center text-xs font-black text-gray-900">{l.qty}</span>
                                <button onClick={() => setBqLines((prev) => prev.map((x, j) => j === i ? { ...x, qty: x.qty + 1 } : x))}
                                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 text-sm font-bold">+</button>
                              </div>
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 h-7">
                                <span className="text-[10px] text-gray-400">-</span>
                                <input type="number" min="0" max="40" value={l.discount}
                                  onChange={(e) => setBqLines((prev) => prev.map((x, j) => j === i ? { ...x, discount: Math.min(40, Math.max(0, parseInt(e.target.value) || 0)) } : x))}
                                  className="w-8 text-xs font-bold text-gray-700 text-center outline-none bg-transparent" />
                                <span className="text-[10px] text-gray-400">%</span>
                              </div>
                              <p className="flex-1 text-right text-xs font-black tabular-nums" style={{ color: "#111111" }}>
                                {fmtCOP(unit * l.qty)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total */}
                    <div className="mt-3 flex items-center justify-between py-3 border-t border-gray-200">
                      <p className="text-sm font-bold text-gray-600">Total</p>
                      <p className="text-lg font-black tabular-nums" style={{ color: "#ff9900" }}>{fmtCOP(bqTotal)}</p>
                    </div>

                    {bqSavedCot ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-100">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <p className="text-xs font-bold text-emerald-700 flex-1">Cotizacion guardada · {bqSavedCot.id}</p>
                          <button onClick={() => { setBqSavedCot(null); setBqSaved(false); }}
                            className="text-emerald-400 hover:text-emerald-600 transition-colors"><IcoX /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => generatePDF(bqSavedCot, pc.name)}
                            className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors">
                            <IcoFileText />
                            <span className="text-[10px] font-bold text-gray-600">PDF</span>
                          </button>
                          <a href={`https://wa.me/${pc.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${pc.name.split(" ")[0]}, adjunto tu cotizacion de Merquellantas por ${fmtCOP(bqSavedCot.total)}. Cotizacion No. ${bqSavedCot.id}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-gray-200 hover:border-green-400 transition-colors">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.86L.057 23.994l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.366l-.36-.213-3.733.979 1.001-3.635-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                            </svg>
                            <span className="text-[10px] font-bold text-gray-600">WhatsApp</span>
                          </a>
                          <a href={`mailto:?subject=${encodeURIComponent(`Cotizacion Merquellantas ${bqSavedCot.id}`)}&body=${encodeURIComponent(`Hola ${pc.name.split(" ")[0]},\n\nAdjunto tu cotizacion No. ${bqSavedCot.id} por un total de ${fmtCOP(bqSavedCot.total)}.\n\nMerquellantas`)}`}
                            className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-blue-500">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span className="text-[10px] font-bold text-gray-600">Email</span>
                          </a>
                        </div>
                        <button onClick={() => { setBqSavedCot(null); setBqSaved(false); }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                          Nueva cotizacion
                        </button>
                      </div>
                    ) : (
                      <button onClick={bqSaveCot}
                        className="w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "#111111" }}>
                        Guardar cotizacion
                      </button>
                    )}
                  </div>
                )}

                {bqLines.length === 0 && !bqSearch && (
                  <div className="py-8 text-center text-gray-400">
                    <p className="text-xs">Busca un producto para comenzar la cotizacion</p>
                  </div>
                )}

                <div className="h-28" />
              </div>
            </div>
          )}

          {/* ── AGENDAR tab ── */}
          {briefTab === "agendar" && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="px-5 pt-4 space-y-4">

                {/* Upcoming agenda for this client */}
                {pcActivities.filter((a) => a.scheduledAt && new Date(a.scheduledAt) > new Date()).length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Proximas citas</p>
                    <div className="space-y-2">
                      {pcActivities.filter((a) => a.scheduledAt && new Date(a.scheduledAt) > new Date()).map((a) => (
                        <div key={a.id} className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-3">
                          {activityIcon(a.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 leading-snug">{a.title}</p>
                            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString("es-CO", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New activity form */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Nueva actividad</p>

                  {/* Type */}
                  <div className="flex gap-2 mb-3">
                    {([["call","Llamada"],["visit","Visita"],["appointment","Cita"]] as [ActivityRecord["type"],string][]).map(([v, lbl]) => (
                      <button key={v} onClick={() => setAgType(v)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                        style={agType === v
                          ? { backgroundColor: "#111111", borderColor: "#ff9900", color: "#ff9900" }
                          : { backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#6b7280" }}>
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <input value={agTitle} onChange={(e) => setAgTitle(e.target.value)}
                      placeholder={agType === "call" ? "Asunto de la llamada" : agType === "visit" ? "Motivo de la visita" : "Motivo de la cita"}
                      className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
                  </div>

                  {/* Date + Time */}
                  <div className="flex gap-2 mb-3">
                    <input type="date" value={agDate} onChange={(e) => setAgDate(e.target.value)}
                      className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                    <input type="time" value={agTime} onChange={(e) => setAgTime(e.target.value)}
                      className="w-28 h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                  </div>

                  {/* Notes */}
                  <textarea value={agNotes} onChange={(e) => setAgNotes(e.target.value)}
                    rows={3} placeholder="Notas adicionales..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none focus:border-gray-400 transition-colors leading-relaxed mb-3" />

                  {agSaved ? (
                    <div className="w-full py-3 rounded-xl text-sm font-black text-center bg-emerald-50 text-emerald-600">
                      Actividad agendada
                    </div>
                  ) : (
                    <button onClick={agSave} disabled={!agTitle.trim()}
                      className="w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: "#111111" }}>
                      Agendar
                    </button>
                  )}
                </div>

                <div className="h-28" />
              </div>
            </div>
          )}

          {/* ── NOTA tab ── */}
          {briefTab === "nota" && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="px-5 pt-4 space-y-3">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {isOnCall ? "Notas durante la llamada" : "Nota rapida"}
                  </p>
                  <textarea value={liveNote} onChange={(e) => setLiveNote(e.target.value)}
                    rows={8} autoFocus
                    placeholder={isOnCall ? "Escribe lo que van hablando, acuerdos, precios mencionados..." : "Escribe una nota sobre este cliente..."}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none focus:border-gray-400 transition-colors leading-relaxed" />
                  {liveNote && (
                    <p className="text-[10px] text-gray-400 mt-1.5 text-right">
                      {isOnCall ? "Se pre-llenará en el resumen post-llamada" : `${liveNote.length} caracteres`}
                    </p>
                  )}
                </div>
                {!isOnCall && liveNote.trim() && (
                  <button
                    onClick={() => {
                      const act: ActivityRecord = {
                        id: `act-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        type: "note",
                        title: "Nota rapida",
                        notes: liveNote.trim(),
                        loggedBy: CURRENT_USER.name,
                      };
                      onAddActivity?.(pc.id, act);
                      setLiveNote("");
                    }}
                    className="w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#111111" }}>
                    Guardar nota
                  </button>
                )}
                <div className="h-28" />
              </div>
            </div>
          )}

          {/* Fixed footer — call controls or Llamar */}
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3.5 flex items-center gap-3 transition-colors"
            style={{ backgroundColor: isOnCall ? "#111111" : "#ffffff", borderTop: isOnCall ? "1px solid #222222" : "1px solid #e5e7eb", boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}>
            {isOnCall ? (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-gray-500">{pc.phone}</p>
                  <p className="text-sm font-black text-white truncate">{pc.name}</p>
                </div>
                <button onClick={() => setIsMuted((m) => !m)}
                  className={["w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"].join(" ")}>
                  {isMuted ? <IcoMicOff /> : <IcoMic />}
                </button>
                <button onClick={() => setIsRecording((r) => !r)}
                  className={["w-10 h-10 rounded-xl flex items-center justify-center transition-all relative",
                    isRecording ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"].join(" ")}>
                  <svg viewBox="0 0 24 24" fill={isRecording ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                  {isRecording && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-300 border-2 border-gray-900 animate-pulse" />}
                </button>
                <button onClick={hangUp}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black text-white flex-shrink-0 transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ef4444" }}>
                  <IcoPhoneOff />
                  Colgar
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-400">{pc.phone}</p>
                  <p className="text-sm font-black text-gray-900 truncate">{pc.name}</p>
                </div>
                <button onClick={() => startCall(pc.name, pc.phone, pc.id)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black text-white flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "#10b981" }}>
                  <IcoPhoneOut />
                  Llamar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Open panel ───────────────────────────────────── */
  if (dialerState === "open") {
    return (
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end">
        <div className="mb-3 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden" style={{ width: 304 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">Nueva llamada</p>
            <button onClick={() => { setDialerState("closed"); setSearch(""); setDialNumber(""); }}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <IcoX />
            </button>
          </div>

          {/* Direct dial */}
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg h-10 px-3">
              <span className="text-gray-400"><IcoPhoneCall /></span>
              <input value={dialNumber}
                onChange={(e) => { setDialNumber(e.target.value); setSearch(""); }}
                placeholder="Marcar numero directo..."
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none font-mono"
              />
              {dialNumber && (
                <button onClick={() => startCall("Numero externo", dialNumber)}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors flex-shrink-0 text-white"
                  style={{ backgroundColor: "#10b981" }}>
                  <IcoPhoneOut />
                </button>
              )}
            </div>
          </div>

          {/* Client search */}
          <div className="px-4 pt-2 pb-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg h-10 px-3">
              <span className="text-gray-400"><IcoSearch /></span>
              <input value={search}
                onChange={(e) => { setSearch(e.target.value); setDialNumber(""); }}
                placeholder="Buscar cliente..."
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                autoFocus
              />
              {search && <button onClick={() => setSearch("")} className="text-gray-400"><IcoX /></button>}
            </div>
          </div>

          {/* Client list — click shows brief, not immediate call */}
          <div className="max-h-60 overflow-y-auto no-scrollbar divide-y divide-gray-100 pb-2">
            {filteredClients.map((c) => (
              <button key={c.id} onClick={() => { setPreCallClient(c); setDialerState("closed"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                  style={{ backgroundColor: "#f0f0f1", color: "#444" }}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{c.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{c.phone}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">Ver brief</span>
              </button>
            ))}
            {filteredClients.length === 0 && search && (
              <p className="text-xs text-gray-400 text-center py-8">Sin resultados</p>
            )}
          </div>
        </div>

        {/* FAB — close */}
        <button onClick={() => setDialerState("closed")}
          className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white"
          style={{ backgroundColor: "#ff9900" }}>
          <IcoX />
        </button>
      </div>
    );
  }

  /* ── Closed FAB ───────────────────────────────────── */
  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <button onClick={() => setDialerState("open")}
        title="Nueva llamada"
        className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#ff9900" }}>
        <IcoTabPhone />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   COTIZACIONES TAB
══════════════════════════════════════════════════════════ */

interface CotizacionesTabProps {
  clients: Client[];
  cotizaciones: Record<string, Cotizacion[]>;
  setCotizaciones: React.Dispatch<React.SetStateAction<Record<string, Cotizacion[]>>>;
  onSelectClient: (id: string) => void;
  onOpenWizard: (clientId?: string, clientName?: string) => void;
}

function CotizacionesTab({
  clients,
  cotizaciones,
  setCotizaciones,
  onSelectClient,
  onOpenWizard,
}: CotizacionesTabProps): ReactElement {
  const [ownerFilter, setOwnerFilter] = useState<"all" | "mine">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewCotizacion, setViewCotizacion] = useState<Cotizacion | null>(null);

  const allCotizaciones = useMemo(() => {
    const list: Cotizacion[] = [];
    for (const cots of Object.values(cotizaciones)) {
      list.push(...cots);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [cotizaciones]);

  const clientMap = useMemo(() => {
    const map = new Map<string, Client>();
    for (const c of clients) map.set(c.id, c);
    return map;
  }, [clients]);

  const filtered = useMemo(() => {
    return allCotizaciones.filter((cot) => {
      const client = clientMap.get(cot.clientId);
      const isMine = cot.rep === CURRENT_USER.name || client?.rep === CURRENT_USER.name;

      if (ownerFilter === "mine" && !isMine) return false;
      if (statusFilter !== "all" && cot.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = cot.id.toLowerCase().includes(q);
        const matchClient = cot.clientName.toLowerCase().includes(q);
        const matchRep = cot.rep.toLowerCase().includes(q);
        const matchProduct = cot.lines.some(
          (l) => l.productName.toLowerCase().includes(q) || l.productSku.toLowerCase().includes(q)
        );
        if (!matchId && !matchClient && !matchRep && !matchProduct) return false;
      }

      return true;
    });
  }, [allCotizaciones, clientMap, ownerFilter, statusFilter, search]);

  const metrics = useMemo(() => {
    const totalCount = filtered.length;
    const totalVal = filtered.reduce((acc, c) => acc + c.total, 0);
    const aceptadas = filtered.filter((c) => c.status === "aceptada");
    const aceptadasVal = aceptadas.reduce((acc, c) => acc + c.total, 0);
    const enviadas = filtered.filter((c) => c.status === "enviada");
    const enviadasVal = enviadas.reduce((acc, c) => acc + c.total, 0);
    const conversionRate = totalCount > 0 ? Math.round((aceptadas.length / totalCount) * 100) : 0;

    return { totalCount, totalVal, aceptadasCount: aceptadas.length, aceptadasVal, enviadasCount: enviadas.length, enviadasVal, conversionRate };
  }, [filtered]);

  function handleStatusChange(cotId: string, clientId: string, newStatus: Cotizacion["status"]) {
    setCotizaciones((prev) => {
      const list = prev[clientId] ?? [];
      const updated = list.map((c) => (c.id === cotId ? { ...c, status: newStatus } : c));
      return { ...prev, [clientId]: updated };
    });
    if (viewCotizacion && viewCotizacion.id === cotId) {
      setViewCotizacion({ ...viewCotizacion, status: newStatus });
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900">Cotizaciones</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {filtered.length} {filtered.length === 1 ? "cotización" : "cotizaciones"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Historial consolidado de propuestas comerciales emitidas a clientes y prospectos.
          </p>
        </div>

        <button
          onClick={() => onOpenWizard()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva cotización
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monto Total Cotizado</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{fmtCOP(metrics.totalVal)}</p>
          <p className="text-xs text-gray-500 mt-1">{metrics.totalCount} cotización(es) en total</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Aceptadas</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{fmtCOP(metrics.aceptadasVal)}</p>
          <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mt-1">
            <span>{metrics.aceptadasCount} aprobadas</span>
            <span className="bg-emerald-100 px-2 py-0.5 rounded-full">{metrics.conversionRate}% tasa</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Enviadas / Pendientes</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{fmtCOP(metrics.enviadasVal)}</p>
          <p className="text-xs text-amber-600 mt-1 font-semibold">{metrics.enviadasCount} en seguimiento activo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Promedio / Cotización</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {fmtCOP(metrics.totalCount > 0 ? Math.round(metrics.totalVal / metrics.totalCount) : 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Valor medio por propuesta</p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Ownership Filter Toggle (Mis Clientes vs Todos) */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setOwnerFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                ownerFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Todos los clientes
            </button>
            <button
              onClick={() => setOwnerFilter("mine")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                ownerFilter === "mine" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Solo mis clientes ({CURRENT_USER.name})
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: "all", label: "Todas" },
              { id: "borrador", label: "Borrador" },
              { id: "enviada", label: "Enviada" },
              { id: "aceptada", label: "Aceptada" },
              { id: "rechazada", label: "Rechazada" },
            ].map((st) => {
              const active = statusFilter === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por cotización (COT-...), cliente, producto o asesor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Cotizaciones Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-3">
              <IcoTabCotizacion />
            </div>
            <p className="text-base font-bold text-gray-900">No se encontraron cotizaciones</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {ownerFilter === "mine"
                ? "No hay cotizaciones para tus clientes con los filtros aplicados."
                : "No se registran cotizaciones que coincidan con la búsqueda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Cotización</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Asesor</th>
                  <th className="py-3 px-4">Productos / Items</th>
                  <th className="py-3 px-4">Pago & Plazo</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((cot) => {
                  const client = clientMap.get(cot.clientId);
                  const isMine = cot.rep === CURRENT_USER.name || client?.rep === CURRENT_USER.name;
                  const scfg = COTIZACION_STATUS_CFG[cot.status];
                  const formattedDate = new Date(cot.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={cot.id} className="hover:bg-orange-50/30 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-gray-900">{cot.id}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formattedDate}</p>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectClient(cot.clientId)}
                          className="font-bold text-gray-900 hover:text-orange-600 text-left transition-colors"
                        >
                          {cot.clientName}
                        </button>
                        {client?.city && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{client.city} • {client.segment}</p>
                        )}
                      </td>

                      {/* Rep / Asesor */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-gray-700">{cot.rep}</span>
                        {isMine && (
                          <span className="ml-1.5 inline-block text-[9px] font-extrabold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            Mi cliente
                          </span>
                        )}
                      </td>

                      {/* Products Summary */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-medium text-gray-800 truncate">
                          {cot.lines.map((l) => `${l.qty}x ${l.productName}`).join(", ")}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {cot.lines.length} {cot.lines.length === 1 ? "referencia" : "referencias"}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-medium text-gray-700">
                          {cot.paymentMethod === "creditodirecto"
                            ? "Crédito Directo"
                            : cot.paymentMethod === "contado"
                            ? "Contado"
                            : cot.paymentMethod === "addi"
                            ? "Addi"
                            : "MercadoPago"}
                        </span>
                        {cot.plazo && (
                          <p className="text-[10px] text-gray-400 mt-0.5">Plazo: {cot.plazo} días</p>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-black text-gray-900 tabular-nums">
                        {fmtCOP(cot.total)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full ${scfg.cls}`}>
                          {scfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewCotizacion(cot)}
                            title="Ver detalles / PDF"
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          <select
                            value={cot.status}
                            onChange={(e) =>
                              handleStatusChange(cot.id, cot.clientId, e.target.value as Cotizacion["status"])
                            }
                            className="bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-700 rounded-lg px-1.5 py-1 focus:outline-none focus:border-orange-500"
                          >
                            <option value="borrador">Borrador</option>
                            <option value="enviada">Enviada</option>
                            <option value="aceptada">Aceptada</option>
                            <option value="rechazada">Rechazada</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cotizacion Detail & PDF Modal */}
      {viewCotizacion && (
        <Modal
          title={`Cotización ${viewCotizacion.id}`}
          subtitle={`Cliente: ${viewCotizacion.clientName} • Creada por ${viewCotizacion.rep}`}
          onClose={() => setViewCotizacion(null)}
        >
          <div className="p-5 space-y-5 text-gray-800">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Fecha</span>
                <span className="font-bold text-gray-900">
                  {new Date(viewCotizacion.createdAt).toLocaleDateString("es-CO")}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Forma de Pago</span>
                <span className="font-bold text-gray-900 capitalize">{viewCotizacion.paymentMethod}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Estado</span>
                <span className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full mt-0.5 ${COTIZACION_STATUS_CFG[viewCotizacion.status].cls}`}>
                  {COTIZACION_STATUS_CFG[viewCotizacion.status].label}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Total</span>
                <span className="font-black text-orange-600 text-sm">{fmtCOP(viewCotizacion.total)}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detalle de Productos</p>
              <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 font-bold text-gray-500">
                    <tr>
                      <th className="p-2.5">Producto</th>
                      <th className="p-2.5 text-center">Cant.</th>
                      <th className="p-2.5 text-right">P. Unit.</th>
                      <th className="p-2.5 text-right">Desc.</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewCotizacion.lines.map((l, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{l.productName}</td>
                        <td className="p-2.5 text-center font-bold">{l.qty}</td>
                        <td className="p-2.5 text-right">{fmtCOP(l.unitPrice)}</td>
                        <td className="p-2.5 text-right text-emerald-600 font-semibold">{l.discount}%</td>
                        <td className="p-2.5 text-right font-black">{fmtCOP(l.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  generatePDF(viewCotizacion, viewCotizacion.clientName);
                }}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar / Ver PDF
              </button>

              <button
                onClick={() => setViewCotizacion(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */

type CrmTab = "dashboard" | "clientes" | "cotizaciones" | "llamadas" | "pipeline" | "oportunidades" | "reportes";

const CRM_NAV: { key: CrmTab; label: string; icon: ReactElement }[] = [
  { key: "dashboard",    label: "Dashboard",    icon: <IcoDash />        },
  { key: "clientes",     label: "Clientes",     icon: <IcoTabUsers />    },
  { key: "cotizaciones", label: "Cotizaciones", icon: <IcoTabCotizacion /> },
  { key: "llamadas",     label: "Llamadas",     icon: <IcoTabPhone />    },
  { key: "pipeline",     label: "Pipeline",     icon: <IcoTabPipeline /> },
  { key: "oportunidades",label: "Oportunidades",icon: <IcoTabTarget />   },
  { key: "reportes",     label: "Reportes",     icon: <IcoTabChart />    },
];

export default function CRMModule({ subtab }: { subtab: string }): ReactElement {
  const [activeTab, setActiveTab] = useState<CrmTab>(
    (subtab as CrmTab) && ["dashboard","clientes","cotizaciones","llamadas","pipeline","oportunidades","reportes"].includes(subtab as CrmTab)
      ? (subtab as CrmTab)
      : "dashboard"
  );
  const [navigateToClient, setNavigateToClient] = useState<string | null>(null);

  // Shared state (lifted for Dashboard visibility)
  const [clients,      setClients]      = useState<Client[]>(CLIENTS);
  const [history,      setHistory]      = useState<Record<string, ServiceRecord[]>>(INIT_HISTORY);
  const [activities,   setActivities]   = useState<Record<string, ActivityRecord[]>>(INIT_ACTIVITIES);
  const [cotizaciones, setCotizaciones] = useState<Record<string, Cotizacion[]>>(INIT_COTIZACIONES);
  const [calls,        setCalls]        = useState<CallRecord[]>(INIT_CALLS);
  const [deals,        setDeals]        = useState<Deal[]>(DEALS);

  const [cotizaModal, setCotizaModal] = useState<{ open: boolean; clientId?: string; clientName?: string }>({ open: false });
  const [selectClientForCotiza, setSelectClientForCotiza] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    if (subtab && ["dashboard","clientes","cotizaciones","llamadas","pipeline","oportunidades","reportes"].includes(subtab as CrmTab)) {
      setActiveTab(subtab as CrmTab);
    }
  }, [subtab]);

  function handleSelectClient(id: string) {
    setNavigateToClient(id);
    setActiveTab("clientes");
  }

  function handleCreateProspecto(d: ProspectoFD): string {
    const id = `c${Date.now()}`;
    const initials = d.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const now = new Date().toISOString();
    const newClient: Client = {
      id, name: d.name, phone: d.phone, email: d.email || undefined, city: "", initials,
      segment: "B2C", status: "active", nps: 0, totalRevenue: 0,
      vehicles: [], lastContact: now.slice(0, 10),
      rep: CURRENT_USER.name,
      leadSource: d.leadSource,
      leadSourceOther: d.otherSource || undefined,
      createdAt: now, updatedAt: now,
    };
    setClients((prev) => [newClient, ...prev]);
    return id;
  }

  function handleCreateActivity(clientId: string, d: ActivityFD) {
    const rec: ActivityRecord = {
      id: `act${Date.now()}`, type: d.type, title: d.title, notes: d.notes,
      outcome: d.outcome as ActivityRecord["outcome"],
      duration: d.duration ? Number(d.duration) : undefined,
      location: d.location || undefined,
      scheduledAt: d.scheduledDate ? `${d.scheduledDate}T${d.scheduledTime}:00` : undefined,
      createdAt: new Date().toISOString(), loggedBy: CURRENT_USER.name,
    };
    setActivities((prev) => ({ ...prev, [clientId]: [rec, ...(prev[clientId] ?? [])] }));
  }

  return (
    <div>
      {/* Tab bar — segmented control */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-7 overflow-x-auto no-scrollbar gap-0.5">
        {CRM_NAV.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={["flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
                isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"].join(" ")}>
              <span className={isActive ? "" : "opacity-60"}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "dashboard" && (
        <DashboardTab
          clients={clients} activities={activities} cotizaciones={cotizaciones}
          onSelectClient={handleSelectClient}
          onCreateProspecto={handleCreateProspecto}
          onCreateActivity={handleCreateActivity}
          onGoClientes={() => setActiveTab("clientes")}
        />
      )}
      {activeTab === "clientes" && (
        <ClientsTab
          clients={clients} setClients={setClients}
          history={history} setHistory={setHistory}
          activities={activities} setActivities={setActivities}
          cotizaciones={cotizaciones} setCotizaciones={setCotizaciones}
          initialSelectedId={navigateToClient}
        />
      )}
      {activeTab === "cotizaciones" && (
        <CotizacionesTab
          clients={clients}
          cotizaciones={cotizaciones}
          setCotizaciones={setCotizaciones}
          onSelectClient={handleSelectClient}
          onOpenWizard={(cid, cname) => {
            if (cid && cname) {
              setCotizaModal({ open: true, clientId: cid, clientName: cname });
            } else {
              setSelectClientForCotiza(true);
            }
          }}
        />
      )}
      {activeTab === "llamadas"      && (
        <CallsTab
          calls={calls}
          clients={clients}
          onUpdateCall={(id, patch) => setCalls((p) => p.map((c) => c.id === id ? { ...c, ...patch } : c))}
        />
      )}
      {activeTab === "pipeline"      && <PipelineTab deals={deals} setDeals={setDeals} />}
{activeTab === "oportunidades" && (
  <OportunidadesTab
    deals={deals}
    setDeals={setDeals}
    clients={clients}
    onSelectClient={handleSelectClient}
    onCotizarForDeal={(deal) => {
      // find or create a client match, then open the wizard
      const client = clients.find((c) => c.name === deal.clientName);
      if (client) {
        setCotizaModal({ open: true, clientId: client.id, clientName: client.name });
      } else {
        // fallback: create a temporary quote target using deal info
        setCotizaModal({ open: true, clientId: `deal-${deal.id}`, clientName: deal.clientName });
      }
    }}
    onLogCallForDeal={(deal) => {
      // simplest: log a placeholder call record for this deal's contact
      setCalls((p) => [{
        id: `call${Date.now()}`,
        clientName: deal.clientName,
        phone: deal.phone ?? "",
        direction: "outbound",
        status: "completed",
        startedAt: new Date().toISOString(),
        hasRecording: false,
        loggedBy: CURRENT_USER.name,
      }, ...p]);
    }}
    onAddActivityForDeal={(deal) => {
      const client = clients.find((c) => c.name === deal.clientName);
      if (client) {
        setActivities((p) => ({
          ...p,
          [client.id]: [{
            id: `act${Date.now()}`,
            createdAt: new Date().toISOString(),
            type: "appointment",
            title: `Seguimiento — ${deal.product}`,
            notes: "",
            loggedBy: CURRENT_USER.name,
          }, ...(p[client.id] ?? [])],
        }));
      }
    }}
  />
)}
      {activeTab === "reportes"      && <ReportesTab />}

      {selectClientForCotiza && (
        <Modal
          title="Seleccionar cliente para cotización"
          subtitle="Elige el cliente al que deseas emitir la cotización"
          onClose={() => setSelectClientForCotiza(false)}
        >
          <div className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Buscar cliente por nombre, teléfono o ciudad..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-orange-500"
            />
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl">
              {clients
                .filter((c) => !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch))
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectClientForCotiza(false);
                      setCotizaModal({ open: true, clientId: c.id, clientName: c.name });
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-orange-50/50 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{c.name}</p>
                      <p className="text-[10px] text-gray-400">{c.city || "Sin ciudad"} • Asesor: {c.rep}</p>
                    </div>
                    <span className="text-xs font-bold text-orange-600">Cotizar &rarr;</span>
                  </button>
                ))}
            </div>
          </div>
        </Modal>
      )}

      {cotizaModal.open && cotizaModal.clientId && cotizaModal.clientName && (
        <CotizacionWizard
          clientId={cotizaModal.clientId}
          clientName={cotizaModal.clientName}
          onClose={() => setCotizaModal({ open: false })}
          onSave={(cot) => {
            setCotizaciones((p) => ({ ...p, [cot.clientId]: [cot, ...(p[cot.clientId] ?? [])] }));
            setCotizaModal({ open: false });
          }}
        />
      )}

      <FloatingDialer
        clients={clients} activities={activities} history={history} cotizaciones={cotizaciones}
        onCallSaved={(c) => setCalls((p) => [c, ...p])}
        onSaveCotizacion={(cid, cot) => setCotizaciones((p) => ({ ...p, [cid]: [cot, ...(p[cid] ?? [])] }))}
        onAddActivity={(cid, act) => setActivities((p) => ({ ...p, [cid]: [act, ...(p[cid] ?? [])] }))}
      />
    </div>
  );
}
