/* ══════════════════════════════════════════════════════════════
   MERQUELLANTAS CRM — Mock Data & Types
   All data is structured at module level for fast filtering/memoization.
══════════════════════════════════════════════════════════════ */

export interface Vehicle {
  id: string;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  currentKm: number;
  weeklyKm: number;
  lastOilChangeKm: number;
  oilChangeIntervalKm: number;
  batteryMonths: number;
  tireSize: string;
  tireKmSinceInstall: number;
  tireLifespanKm: number;
}

export interface Client {
  id: string;
  initials: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  segment: "B2C" | "B2B" | "Fleet";
  vehicles: Vehicle[];
  lastContact: string;
  nps: number;
  totalRevenue: number;
  status: "active" | "at-risk" | "dormant";
  rep: string;
  leadSource?: string;
  leadSourceOther?: string;
  createdAt: string;
  updatedAt: string;
}

export const CURRENT_USER = { id: "u1", name: "Andrea S.", initials: "AS", store: "BOG Norte" };

export type DealStage = "prospecto" | "cotizado" | "negociacion" | "cerrado";

export interface Deal {
  id: string;
  clientName: string;
  product: string;
  value: number;
  stage: DealStage;
  daysInStage: number;
  rep: string;
  closedAt?: string;
  phone?: string;
  city?: string;
  notes?: string;
  email?: string;
}

export interface ProductTier {
  level: "budget" | "optimal" | "premium";
  brand: string;
  product: string;
  price: number;
  warranty: string;
  badge: string;
}

export interface VehicleAlert {
  id: string;
  type: "oil" | "battery" | "tire";
  clientName: string;
  plate: string;
  vehicleLabel: string;
  message: string;
  urgency: "critical" | "warning";
  phone: string;
}

/* ── Clients & Vehicles ─────────────────────────────────── */

export const CLIENTS: Client[] = [
  {
    id: "c1", initials: "CM", name: "Carlos Mendoza",
    phone: "+573001234567", city: "Bogotá", segment: "B2C",
    status: "active", lastContact: "18 Jul", nps: 82, totalRevenue: 4800000,
    rep: "Miguel R.", createdAt: "2025-03-12T09:14:00Z", updatedAt: "2026-07-18T10:22:00Z",
    vehicles: [{
      id: "v1", plate: "ABC-123", vin: "2T1BURHE0JC020734",
      make: "Toyota", model: "Hilux", year: 2021,
      currentKm: 9800, weeklyKm: 350,
      lastOilChangeKm: 0, oilChangeIntervalKm: 10000,
      batteryMonths: 8, tireSize: "265/65R17",
      tireKmSinceInstall: 18000, tireLifespanKm: 50000,
    }],
  },
  {
    id: "c2", initials: "JP", name: "Juan Perez",
    phone: "+573109876543", city: "Medellín", segment: "Fleet",
    status: "active", lastContact: "15 Jul", nps: 75, totalRevenue: 28400000,
    rep: "Andrea S.", createdAt: "2024-11-05T14:30:00Z", updatedAt: "2026-07-20T08:45:00Z",
    vehicles: [
      {
        id: "v2", plate: "TRK-007", vin: "5TBET34136S507065",
        make: "Chevrolet", model: "NPR", year: 2020,
        currentKm: 145000, weeklyKm: 1200,
        lastOilChangeKm: 140000, oilChangeIntervalKm: 5000,
        batteryMonths: 24, tireSize: "7.50R16",
        tireKmSinceInstall: 45000, tireLifespanKm: 50000,
      },
      {
        id: "v3", plate: "TRK-012", vin: "5TBET34136S507066",
        make: "Chevrolet", model: "NPR", year: 2020,
        currentKm: 132000, weeklyKm: 900,
        lastOilChangeKm: 128000, oilChangeIntervalKm: 5000,
        batteryMonths: 18, tireSize: "7.50R16",
        tireKmSinceInstall: 38000, tireLifespanKm: 50000,
      },
    ],
  },
  {
    id: "c3", initials: "LR", name: "Laura Rodriguez",
    phone: "+573215556789", city: "Cali", segment: "B2C",
    status: "at-risk", lastContact: "2 Jun", nps: 54, totalRevenue: 1200000,
    rep: "Carlos T.", createdAt: "2025-06-20T11:00:00Z", updatedAt: "2026-06-02T16:10:00Z",
    vehicles: [{
      id: "v4", plate: "XYZ-456", vin: "3VWF17AT6FM123456",
      make: "Volkswagen", model: "Jetta", year: 2019,
      currentKm: 67000, weeklyKm: 220,
      lastOilChangeKm: 62000, oilChangeIntervalKm: 10000,
      batteryMonths: 30, tireSize: "205/55R16",
      tireKmSinceInstall: 22000, tireLifespanKm: 40000,
    }],
  },
  {
    id: "c4", initials: "AF", name: "Andres Florez",
    phone: "+573124445678", city: "Bogotá", segment: "B2B",
    status: "active", lastContact: "20 Jul", nps: 90, totalRevenue: 12600000,
    rep: "Miguel R.", createdAt: "2024-08-15T08:00:00Z", updatedAt: "2026-07-20T14:33:00Z",
    vehicles: [{
      id: "v5", plate: "SUV-901", vin: "JM3KFBDM0N0123456",
      make: "Mazda", model: "CX-5", year: 2022,
      currentKm: 34000, weeklyKm: 280,
      lastOilChangeKm: 30000, oilChangeIntervalKm: 5000,
      batteryMonths: 6, tireSize: "225/65R17",
      tireKmSinceInstall: 8000, tireLifespanKm: 50000,
    }],
  },
  {
    id: "c5", initials: "MG", name: "Maria Gomez",
    phone: "+573187654321", city: "Barranquilla", segment: "B2C",
    status: "dormant", lastContact: "12 Mar", nps: 61, totalRevenue: 800000,
    rep: "Carlos T.", createdAt: "2025-01-08T10:20:00Z", updatedAt: "2026-03-12T09:00:00Z",
    vehicles: [{
      id: "v6", plate: "RIO-345", vin: "U5YHM813DDL123456",
      make: "Kia", model: "Rio", year: 2018,
      currentKm: 88000, weeklyKm: 180,
      lastOilChangeKm: 83000, oilChangeIntervalKm: 5000,
      batteryMonths: 38, tireSize: "185/65R15",
      tireKmSinceInstall: 28000, tireLifespanKm: 40000,
    }],
  },
  {
    id: "c6", initials: "RP", name: "Roberto Prada",
    phone: "+573001112233", city: "Bogotá", segment: "Fleet",
    status: "active", lastContact: "21 Jul", nps: 88, totalRevenue: 45200000,
    rep: "Andrea S.", createdAt: "2023-09-01T07:30:00Z", updatedAt: "2026-07-21T11:55:00Z",
    vehicles: [{
      id: "v7", plate: "FLT-201", vin: "1FTNW2A5XBEB12345",
      make: "Ford", model: "F-350", year: 2021,
      currentKm: 78000, weeklyKm: 650,
      lastOilChangeKm: 75000, oilChangeIntervalKm: 5000,
      batteryMonths: 14, tireSize: "LT235/85R16",
      tireKmSinceInstall: 32000, tireLifespanKm: 60000,
    }],
  },
  {
    id: "c7", initials: "SC", name: "Sofia Castro",
    phone: "+573156789012", city: "Bogotá", segment: "B2C",
    status: "active", lastContact: "19 Jul", nps: 95, totalRevenue: 3400000,
    rep: "Carlos T.", createdAt: "2025-05-14T13:45:00Z", updatedAt: "2026-07-19T09:20:00Z",
    vehicles: [{
      id: "v8", plate: "DUS-888", vin: "8AP2E2KH9KD123456",
      make: "Renault", model: "Duster", year: 2023,
      currentKm: 18000, weeklyKm: 190,
      lastOilChangeKm: 15000, oilChangeIntervalKm: 10000,
      batteryMonths: 4, tireSize: "215/65R16",
      tireKmSinceInstall: 5000, tireLifespanKm: 50000,
    }],
  },
  {
    id: "c8", initials: "DM", name: "Diego Martinez",
    phone: "+573048765432", city: "Cali", segment: "B2B",
    status: "at-risk", lastContact: "5 Jun", nps: 58, totalRevenue: 2100000,
    rep: "Andrea S.", createdAt: "2025-02-28T16:00:00Z", updatedAt: "2026-06-05T14:10:00Z",
    vehicles: [{
      id: "v9", plate: "KOR-777", vin: "KNAGM4AD7E5123456",
      make: "Kia", model: "Sportage", year: 2020,
      currentKm: 52000, weeklyKm: 310,
      lastOilChangeKm: 48000, oilChangeIntervalKm: 10000,
      batteryMonths: 20, tireSize: "235/55R18",
      tireKmSinceInstall: 19000, tireLifespanKm: 45000,
    }],
  },
];

/* ── Deals ──────────────────────────────────────────────── */

export const DEALS: Deal[] = [
  { id: "d1", clientName: "Juan Perez", product: "4x Bridgestone NPR 7.50R16", value: 4800000, stage: "prospecto", daysInStage: 2, rep: "Sin asignar", phone: "+573109876543", city: "Medellín", notes: "Interesado en renovación de llantas para camión." },
  { id: "d2", clientName: "Andres Florez", product: "Aceite sintetico 5W-30 x6", value: 480000, stage: "cotizado", daysInStage: 1, rep: "Miguel R.", phone: "+573124445678", city: "Bogotá" },
  { id: "d3", clientName: "Roberto Prada", product: "8x Goodyear Fleet LT235/85R16", value: 9600000, stage: "negociacion", daysInStage: 4, rep: "Andrea S.", phone: "+573001112233", city: "Bogotá" },
  { id: "d4", clientName: "Maria Gomez", product: "2x Michelin Energy 185/65R15", value: 920000, stage: "prospecto", daysInStage: 8, rep: "Sin asignar", phone: "+573187654321", city: "Barranquilla", notes: "Solicitó cotización por la web." },
  { id: "d5", clientName: "Carlos Mendoza", product: "4x Continental CrossContact 265/65R17", value: 3200000, stage: "cotizado", daysInStage: 3, rep: "Miguel R.", phone: "+573001234567", city: "Bogotá" },
  { id: "d6", clientName: "Laura Rodriguez", product: "Bateria Bosch Silver 70Ah", value: 380000, stage: "cerrado", daysInStage: 0, rep: "Carlos T.", closedAt: "2026-07-15T10:00:00Z", phone: "+573215556789", city: "Cali" },
  { id: "d7", clientName: "Dist. TechMaq SAS", product: "12x Fate Radial AR28 195/65R15", value: 7200000, stage: "negociacion", daysInStage: 6, rep: "Sin asignar", phone: "+573159998877", city: "Bucaramanga", notes: "Distribuidora requiere descuento corporativo." },
  { id: "d8", clientName: "Trans. Veloz", product: "Reencauche 10x cascos 7.50R16", value: 6500000, stage: "cotizado", daysInStage: 2, rep: "Sin asignar", phone: "+573014443322", city: "Medellín", notes: "Pendiente confirmación de entrega de cascos." },
  { id: "d9", clientName: "Sofia Castro", product: "4x Kumho Road Venture 215/65R16", value: 1680000, stage: "cerrado", daysInStage: 0, rep: "Carlos T.", closedAt: "2026-07-20T14:00:00Z", phone: "+573156789012", city: "Bogotá" },
  { id: "d10", clientName: "Diego Martinez", product: "2x Pirelli Scorpion 235/55R18", value: 1840000, stage: "prospecto", daysInStage: 14, rep: "Andrea S.", phone: "+573048765432", city: "Cali" },
  { id: "d11", clientName: "Transportes El Sol", product: "20x Goodyear Marathon 295/80R22.5", value: 24000000, stage: "prospecto", daysInStage: 1, rep: "Sin asignar", phone: "+573178881122", city: "Bogotá", notes: "Oportunidad de flota pesada ingresada por formulario publicitario." },
  { id: "d12", clientName: "Taller Automotriz Central", product: "Kit de Alineacion + 10x Aceite Mobil", value: 3400000, stage: "prospecto", daysInStage: 3, rep: "Sin asignar", phone: "+573113334455", city: "Pereira", notes: "Llamaron al PBX preguntando por precios al por mayor." },
];

/* ── Quote tiers (Good / Better / Best per tire size) ───── */

export const QUOTE_TIERS: Record<string, ProductTier[]> = {
  "205/55R16": [
    { level: "budget", brand: "Fate", product: "Fate Radial AR28", price: 280000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Goodyear", product: "Goodyear EfficientGrip Performance", price: 420000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Michelin", product: "Michelin Energy Saver+", price: 580000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "265/65R17": [
    { level: "budget", brand: "Maxxis", product: "Maxxis Bravo AT-771", price: 520000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Bridgestone", product: "Bridgestone Dueler A/T", price: 780000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Continental", product: "Continental CrossContact AT", price: 980000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "185/65R15": [
    { level: "budget", brand: "Uniroyal", product: "Uniroyal Tiger Paw Touring", price: 210000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Goodyear", product: "Goodyear Assurance ComfortDrive", price: 320000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Michelin", product: "Michelin Energy Saver", price: 460000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "225/65R17": [
    { level: "budget", brand: "Fate", product: "Fate Maxima SUV", price: 380000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Kumho", product: "Kumho Road Venture AT51", price: 540000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Pirelli", product: "Pirelli Scorpion ATR", price: 720000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "215/65R16": [
    { level: "budget", brand: "Fate", product: "Fate Maxima Touring", price: 310000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Kumho", product: "Kumho Solus HA31", price: 450000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Michelin", product: "Michelin Primacy 4", price: 620000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "235/55R18": [
    { level: "budget", brand: "Nankang", product: "Nankang AS-1", price: 440000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Hankook", product: "Hankook Ventus Prime3", price: 640000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Pirelli", product: "Pirelli P Zero", price: 890000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
  "7.50R16": [
    { level: "budget", brand: "Fate", product: "Fate TR-600 Camion", price: 780000, warranty: "1 ano", badge: "Economico" },
    { level: "optimal", brand: "Bridgestone", product: "Bridgestone R164", price: 1100000, warranty: "2 anos", badge: "Optimo" },
    { level: "premium", brand: "Michelin", product: "Michelin XZE2+", price: 1480000, warranty: "3 anos + garantia total", badge: "Premium" },
  ],
};

/* ── Store performance ──────────────────────────────────── */

export const STORE_METRICS = [
  { id: "s1", name: "Bogota Norte", city: "Bogota", sales: 8200000, target: 9000000, nps: 88, tickets: 42, growth: 3.2 },
  { id: "s2", name: "Bogota Sur", city: "Bogota", sales: 7400000, target: 8000000, nps: 84, tickets: 38, growth: -1.4 },
  { id: "s3", name: "Medellin Itague", city: "Medellin", sales: 11600000, target: 10000000, nps: 92, tickets: 54, growth: 8.6 },
  { id: "s4", name: "Medellin Centro", city: "Medellin", sales: 6800000, target: 8000000, nps: 79, tickets: 31, growth: -3.1 },
  { id: "s5", name: "Cali Norte", city: "Cali", sales: 5900000, target: 7000000, nps: 82, tickets: 28, growth: 1.8 },
  { id: "s6", name: "Barranquilla", city: "Barranquilla", sales: 9100000, target: 9000000, nps: 86, tickets: 45, growth: 5.4 },
  { id: "s7", name: "Bucaramanga", city: "Bucaramanga", sales: 4200000, target: 5000000, nps: 77, tickets: 22, growth: -0.8 },
  { id: "s8", name: "Pereira", city: "Pereira", sales: 3800000, target: 4500000, nps: 80, tickets: 19, growth: 2.1 },
];

/* ── Inventory ──────────────────────────────────────────── */

export const INVENTORY_ITEMS = [
  { sku: "MQ-2055516-GOO", product: "Goodyear EfficientGrip 205/55R16", stock: 48, min: 20, location: "BOG-1", rotDays: 8 },
  { sku: "MQ-2656517-CON", product: "Continental CrossContact 265/65R17", stock: 32, min: 15, location: "BOG-1", rotDays: 12 },
  { sku: "MQ-1856515-MIC", product: "Michelin Energy Saver 185/65R15", stock: 7, min: 20, location: "MED-1", rotDays: 6 },
  { sku: "MQ-7506-BRI", product: "Bridgestone R164 7.50R16", stock: 24, min: 10, location: "BOG-2", rotDays: 15 },
  { sku: "MQ-AC-5W30-MOT", product: "Mobil 1 5W-30 Full Synthetic 4L", stock: 180, min: 50, location: "ALL", rotDays: 4 },
  { sku: "MQ-BAT-70AH-BOS", product: "Bosch Silver S4 70Ah", stock: 12, min: 15, location: "CAL-1", rotDays: 10 },
  { sku: "MQ-2256517-KUM", product: "Kumho Road Venture AT51 225/65R17", stock: 18, min: 12, location: "MED-1", rotDays: 18 },
  { sku: "MQ-AC-20W50-VAL", product: "Valvoline Max Life 20W-50 4L", stock: 92, min: 40, location: "ALL", rotDays: 5 },
];

/* ── Logistics ──────────────────────────────────────────── */

export type LogStatus = "en_ruta" | "en_bodega" | "entregado" | "procesando";

export const LOGISTICS_ITEMS: {
  id: string; destination: string; client: string;
  items: string; status: LogStatus; eta: string; carrier: string;
}[] = [
  { id: "DEP-0894", destination: "Bogota Norte", client: "Juan Perez", items: "4x Bridgestone 7.50R16", status: "en_ruta", eta: "Hoy 3pm", carrier: "Coordinadora" },
  { id: "DEP-0895", destination: "Medellin Itague", client: "Roberto Prada", items: "8x Goodyear Fleet", status: "en_bodega", eta: "Man 10am", carrier: "Servientrega" },
  { id: "DEP-0896", destination: "Cali Norte", client: "Laura Rodriguez", items: "Bateria Bosch 70Ah", status: "entregado", eta: "Entregado", carrier: "Inter" },
  { id: "DEP-0897", destination: "Barranquilla", client: "Maria Gomez", items: "2x Michelin 185/65R15", status: "en_ruta", eta: "Hoy 6pm", carrier: "Coordinadora" },
  { id: "DEP-0898", destination: "Bogota Sur", client: "Andres Florez", items: "Aceite 5W-30 x6", status: "procesando", eta: "Man 2pm", carrier: "DHL" },
  { id: "DEP-0899", destination: "Bucaramanga", client: "TechMaq SAS", items: "12x Fate 195/65R15", status: "en_ruta", eta: "23 Jul", carrier: "Servientrega" },
];

/* ── Finance ────────────────────────────────────────────── */

export const FINANCE_MONTHS = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];
export const FINANCE_REVENUE = [1820, 2100, 1950, 2280, 2190, 2400];
export const FINANCE_EXPENSES = [680, 790, 720, 850, 810, 890];
export const FINANCE_EBITDA = [520, 640, 580, 710, 680, 620];

/* ── Marketing campaigns ────────────────────────────────── */

export const CAMPAIGNS = [
  { id: "camp1", name: "Temporada lluvias 2026", channel: "Meta Ads", budget: 8000000, spent: 5200000, leads: 1840, cpl: 2826, status: "active" as const },
  { id: "camp2", name: "B2B Fleet Agosto", channel: "Email + LinkedIn", budget: 3500000, spent: 1100000, leads: 312, cpl: 3526, status: "active" as const },
  { id: "camp3", name: "Reactivacion Inactivos", channel: "WhatsApp API", budget: 1200000, spent: 1200000, leads: 890, cpl: 1348, status: "completed" as const },
  { id: "camp4", name: "Lanzamiento Pirelli P-Zero", channel: "Google Ads", budget: 6000000, spent: 2800000, leads: 540, cpl: 5185, status: "active" as const },
  { id: "camp5", name: "Black Friday Anticipado", channel: "Meta + Email", budget: 12000000, spent: 0, leads: 0, cpl: 0, status: "draft" as const },
  { id: "camp6", name: "Convenio Empresas Q2", channel: "Fuerza de ventas", budget: 2000000, spent: 2000000, leads: 78, cpl: 25641, status: "completed" as const },
];

/* ── Welfare (Merque Te Cuida) ──────────────────────────── */

export const WELFARE_ITEMS = [
  { id: "w1", title: "Seguro de vida grupo", provider: "Sura", beneficiaries: 1240, status: "active" as const },
  { id: "w2", title: "Convenio optica", provider: "GMO Colombia", beneficiaries: 980, status: "active" as const },
  { id: "w3", title: "Subsidio educacion hijos", provider: "Merquellantas", beneficiaries: 342, status: "active" as const },
  { id: "w4", title: "Medicina prepagada", provider: "Colsanitas", beneficiaries: 620, status: "active" as const },
  { id: "w5", title: "Caja de compensacion", provider: "Cafam", beneficiaries: 1240, status: "active" as const },
  { id: "w6", title: "Fondo de empleados", provider: "Fondemer", beneficiaries: 860, status: "active" as const },
];

export const VACATION_REQUESTS = [
  { id: "vr1", name: "Ana Rios", store: "BOG Norte", days: 15, from: "28 Jul", to: "11 Ago", status: "pending" as const },
  { id: "vr2", name: "Pedro Navas", store: "MED Itague", days: 8, from: "1 Ago", to: "8 Ago", status: "approved" as const },
  { id: "vr3", name: "Claudia Melo", store: "CAL Norte", days: 12, from: "4 Ago", to: "15 Ago", status: "pending" as const },
  { id: "vr4", name: "Jorge Luna", store: "BOG Sur", days: 5, from: "25 Jul", to: "29 Jul", status: "approved" as const },
  { id: "vr5", name: "Valentina Cruz", store: "BAQ", days: 20, from: "11 Ago", to: "29 Ago", status: "pending" as const },
  { id: "vr6", name: "Hector Gomez", store: "PER", days: 10, from: "18 Ago", to: "27 Ago", status: "rejected" as const },
];

/* ── Computed: predictive alerts ────────────────────────── */

export function computeAlerts(clients: Client[]): VehicleAlert[] {
  const alerts: VehicleAlert[] = [];
  for (const client of clients) {
    for (const v of client.vehicles) {
      const kmToOil = v.oilChangeIntervalKm - (v.currentKm - v.lastOilChangeKm);
      const weeksToOil = kmToOil / v.weeklyKm;
      if (weeksToOil <= 2) {
        alerts.push({
          id: `${client.id}-${v.id}-oil`,
          type: "oil",
          clientName: client.name,
          plate: v.plate,
          vehicleLabel: `${v.year} ${v.make} ${v.model}`,
          message: `${v.plate} llega al umbral de aceite en ${weeksToOil < 1 ? "esta semana" : "~2 semanas"} (${v.currentKm.toLocaleString()} km actuales)`,
          urgency: weeksToOil < 1 ? "critical" : "warning",
          phone: client.phone,
        });
      }
      if (v.batteryMonths >= 22) {
        alerts.push({
          id: `${client.id}-${v.id}-bat`,
          type: "battery",
          clientName: client.name,
          plate: v.plate,
          vehicleLabel: `${v.year} ${v.make} ${v.model}`,
          message: `Bateria de ${v.plate} en mes ${v.batteryMonths} — diagnostico preventivo recomendado`,
          urgency: v.batteryMonths >= 30 ? "critical" : "warning",
          phone: client.phone,
        });
      }
      const tireWear = v.tireKmSinceInstall / v.tireLifespanKm;
      if (tireWear >= 0.75) {
        alerts.push({
          id: `${client.id}-${v.id}-tire`,
          type: "tire",
          clientName: client.name,
          plate: v.plate,
          vehicleLabel: `${v.year} ${v.make} ${v.model}`,
          message: `Llantas ${v.tireSize} de ${v.plate} en ${Math.round(tireWear * 100)}% de vida util estimada`,
          urgency: tireWear >= 0.9 ? "critical" : "warning",
          phone: client.phone,
        });
      }
    }
  }
  return alerts.sort((a, b) => (a.urgency === "critical" && b.urgency !== "critical" ? -1 : 1));
}

/* ── Helpers ────────────────────────────────────────────── */

export function fmtCOP(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* ── CRM Prospecto & Cotización types ───────────────────── */

export type LeadSource = "referido" | "toma" | "carpa" | "feria" | "otro";
export type PaymentMethod = "contado" | "addi" | "creditodirecto" | "mf";
export type Plazo = "0-30" | "30-60" | "60-90" | "90-120";
export type TipoLista = "distribuidor" | "instalador" | "publico";

export interface Warehouse {
  id: string;
  name: string;
  city: string;
}

export interface CrmProduct {
  sku: string;
  description: string;
  tireSize: string;
  brand: string;
  stock: Record<string, number>;
  precioDistribuidor: number;
  precioInstalador: number;
  precioPublico: number;
}

export interface CotizacionLine {
  productSku: string;
  productName: string;
  qty: number;
  tipoLista: TipoLista;
  unitPrice: number;
  discount: number;
  finalUnit: number;
  subtotal: number;
  warehouseAlloc: { warehouseId: string; warehouseName: string; qty: number }[];
}

export interface Cotizacion {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  rep: string;
  paymentMethod: PaymentMethod;
  plazo?: Plazo;
  lines: CotizacionLine[];
  total: number;
  status: "borrador" | "enviada" | "aceptada" | "rechazada";
}

/* ── Mock Initial Cotizaciones ──────────────────────────── */

export const INIT_COTIZACIONES: Record<string, Cotizacion[]> = {
  c2: [
    {
      id: "COT-1002",
      clientId: "c2",
      clientName: "Juan Perez (TruckPrime S.A.S)",
      createdAt: "2026-07-24T14:30:00Z",
      rep: "Andrea S.",
      paymentMethod: "creditodirecto",
      plazo: "30-60",
      lines: [
        {
          productSku: "MQ-7506-BRI",
          productName: "Bridgestone R164 7.50R16",
          qty: 8,
          tipoLista: "distribuidor",
          unitPrice: 920000,
          discount: 5,
          finalUnit: 874000,
          subtotal: 6992000,
          warehouseAlloc: [{ warehouseId: "w-bog1", warehouseName: "Bogota Norte", qty: 8 }],
        },
      ],
      total: 6992000,
      status: "enviada",
    },
    {
      id: "COT-1001",
      clientId: "c2",
      clientName: "Juan Perez (TruckPrime S.A.S)",
      createdAt: "2026-06-12T11:00:00Z",
      rep: "Andrea S.",
      paymentMethod: "contado",
      lines: [
        {
          productSku: "MQ-7506-BRI",
          productName: "Bridgestone R164 7.50R16",
          qty: 4,
          tipoLista: "instalador",
          unitPrice: 1010000,
          discount: 0,
          finalUnit: 1010000,
          subtotal: 4040000,
          warehouseAlloc: [{ warehouseId: "w-bog1", warehouseName: "Bogota Norte", qty: 4 }],
        },
      ],
      total: 4040000,
      status: "aceptada",
    },
  ],
  c6: [
    {
      id: "COT-1005",
      clientId: "c6",
      clientName: "Roberto Prada (Expreso Bolivar)",
      createdAt: "2026-07-20T16:00:00Z",
      rep: "Andrea S.",
      paymentMethod: "creditodirecto",
      plazo: "60-90",
      lines: [
        {
          productSku: "MQ-LT2358516-GOO",
          productName: "Goodyear Fleet HSD LT235/85R16",
          qty: 12,
          tipoLista: "distribuidor",
          unitPrice: 1050000,
          discount: 8,
          finalUnit: 966000,
          subtotal: 11592000,
          warehouseAlloc: [{ warehouseId: "w-bog2", warehouseName: "Bogota Sur", qty: 12 }],
        },
      ],
      total: 11592000,
      status: "aceptada",
    },
  ],
  c8: [
    {
      id: "COT-1007",
      clientId: "c8",
      clientName: "Diego Martinez",
      createdAt: "2026-07-15T15:20:00Z",
      rep: "Andrea S.",
      paymentMethod: "contado",
      lines: [
        {
          productSku: "MQ-2355518-PIR",
          productName: "Pirelli P Zero 235/55R18",
          qty: 2,
          tipoLista: "publico",
          unitPrice: 890000,
          discount: 0,
          finalUnit: 890000,
          subtotal: 1780000,
          warehouseAlloc: [{ warehouseId: "w-cal1", warehouseName: "Cali Norte", qty: 2 }],
        },
      ],
      total: 1780000,
      status: "rechazada",
    },
  ],
  c1: [
    {
      id: "COT-1003",
      clientId: "c1",
      clientName: "Carlos Mendoza",
      createdAt: "2026-07-18T10:00:00Z",
      rep: "Miguel R.",
      paymentMethod: "contado",
      lines: [
        {
          productSku: "MQ-2656517-CON",
          productName: "Continental CrossContact AT 265/65R17",
          qty: 4,
          tipoLista: "publico",
          unitPrice: 980000,
          discount: 5,
          finalUnit: 931000,
          subtotal: 3724000,
          warehouseAlloc: [{ warehouseId: "w-bog1", warehouseName: "Bogota Norte", qty: 4 }],
        },
      ],
      total: 3724000,
      status: "aceptada",
    },
  ],
  c4: [
    {
      id: "COT-1004",
      clientId: "c4",
      clientName: "Andres Florez",
      createdAt: "2026-07-21T09:15:00Z",
      rep: "Miguel R.",
      paymentMethod: "addi",
      lines: [
        {
          productSku: "MQ-2256517-KUM",
          productName: "Kumho Road Venture AT51 225/65R17",
          qty: 4,
          tipoLista: "instalador",
          unitPrice: 500000,
          discount: 0,
          finalUnit: 500000,
          subtotal: 2000000,
          warehouseAlloc: [{ warehouseId: "w-bog1", warehouseName: "Bogota Norte", qty: 4 }],
        },
      ],
      total: 2000000,
      status: "enviada",
    },
  ],
  c7: [
    {
      id: "COT-1006",
      clientId: "c7",
      clientName: "Sofia Castro",
      createdAt: "2026-07-25T08:45:00Z",
      rep: "Carlos T.",
      paymentMethod: "contado",
      lines: [
        {
          productSku: "MQ-2156516-KUM",
          productName: "Kumho Solus HA31 215/65R16",
          qty: 4,
          tipoLista: "publico",
          unitPrice: 450000,
          discount: 0,
          finalUnit: 450000,
          subtotal: 1800000,
          warehouseAlloc: [{ warehouseId: "w-bog1", warehouseName: "Bogota Norte", qty: 4 }],
        },
      ],
      total: 1800000,
      status: "borrador",
    },
  ],
};

/* ── Warehouses ─────────────────────────────────────────── */

export const WAREHOUSES: Warehouse[] = [
  { id: "w-bog1", name: "Bogota Norte", city: "Bogotá" },
  { id: "w-bog2", name: "Bogota Sur", city: "Bogotá" },
  { id: "w-med1", name: "Medellin Itague", city: "Medellín" },
  { id: "w-cal1", name: "Cali Norte", city: "Cali" },
  { id: "w-baq1", name: "Barranquilla", city: "Barranquilla" },
];

/* ── Product catalog for quotes ─────────────────────────── */

export const CRM_PRODUCTS: CrmProduct[] = [
  {
    sku: "MQ-2055516-GOO", description: "Goodyear EfficientGrip Performance 205/55R16",
    tireSize: "205/55R16", brand: "Goodyear",
    stock: { "w-bog1": 24, "w-bog2": 12, "w-med1": 18, "w-cal1": 6, "w-baq1": 8 },
    precioDistribuidor: 320000, precioInstalador: 370000, precioPublico: 420000,
  },
  {
    sku: "MQ-2656517-CON", description: "Continental CrossContact AT 265/65R17",
    tireSize: "265/65R17", brand: "Continental",
    stock: { "w-bog1": 16, "w-bog2": 4, "w-med1": 8, "w-cal1": 2, "w-baq1": 2 },
    precioDistribuidor: 820000, precioInstalador: 900000, precioPublico: 980000,
  },
  {
    sku: "MQ-1856515-MIC", description: "Michelin Energy Saver+ 185/65R15",
    tireSize: "185/65R15", brand: "Michelin",
    stock: { "w-bog1": 10, "w-bog2": 6, "w-med1": 20, "w-cal1": 8, "w-baq1": 12 },
    precioDistribuidor: 380000, precioInstalador: 420000, precioPublico: 460000,
  },
  {
    sku: "MQ-7506-BRI", description: "Bridgestone R164 7.50R16",
    tireSize: "7.50R16", brand: "Bridgestone",
    stock: { "w-bog1": 30, "w-bog2": 20, "w-med1": 15, "w-cal1": 0, "w-baq1": 5 },
    precioDistribuidor: 920000, precioInstalador: 1010000, precioPublico: 1100000,
  },
  {
    sku: "MQ-2256517-KUM", description: "Kumho Road Venture AT51 225/65R17",
    tireSize: "225/65R17", brand: "Kumho",
    stock: { "w-bog1": 8, "w-bog2": 5, "w-med1": 12, "w-cal1": 6, "w-baq1": 4 },
    precioDistribuidor: 460000, precioInstalador: 500000, precioPublico: 540000,
  },
  {
    sku: "MQ-2156516-KUM", description: "Kumho Solus HA31 215/65R16",
    tireSize: "215/65R16", brand: "Kumho",
    stock: { "w-bog1": 20, "w-bog2": 10, "w-med1": 8, "w-cal1": 4, "w-baq1": 6 },
    precioDistribuidor: 380000, precioInstalador: 415000, precioPublico: 450000,
  },
  {
    sku: "MQ-2355518-PIR", description: "Pirelli P Zero 235/55R18",
    tireSize: "235/55R18", brand: "Pirelli",
    stock: { "w-bog1": 6, "w-bog2": 4, "w-med1": 10, "w-cal1": 2, "w-baq1": 0 },
    precioDistribuidor: 740000, precioInstalador: 815000, precioPublico: 890000,
  },
  {
    sku: "MQ-LT2358516-GOO", description: "Goodyear Fleet HSD LT235/85R16",
    tireSize: "LT235/85R16", brand: "Goodyear",
    stock: { "w-bog1": 14, "w-bog2": 8, "w-med1": 6, "w-cal1": 0, "w-baq1": 4 },
    precioDistribuidor: 1050000, precioInstalador: 1150000, precioPublico: 1280000,
  },
  {
    sku: "MQ-2256517-PIR", description: "Pirelli Scorpion ATR 225/65R17",
    tireSize: "225/65R17", brand: "Pirelli",
    stock: { "w-bog1": 12, "w-bog2": 6, "w-med1": 8, "w-cal1": 4, "w-baq1": 2 },
    precioDistribuidor: 620000, precioInstalador: 670000, precioPublico: 720000,
  },
  {
    sku: "MQ-1956515-FAT", description: "Fate Radial AR28 195/65R15",
    tireSize: "195/65R15", brand: "Fate",
    stock: { "w-bog1": 40, "w-bog2": 32, "w-med1": 28, "w-cal1": 16, "w-baq1": 20 },
    precioDistribuidor: 210000, precioInstalador: 235000, precioPublico: 260000,
  },
];
