// ─── Fitment Finder Data ────────────────────────────────────────────────────

export const YEARS = Array.from({ length: 25 }, (_, i) => String(2024 - i));

export const MAKES: Record<string, string[]> = {
  default: ["Chevrolet", "Ford", "Toyota", "Mazda", "Kia", "Hyundai", "Renault", "Nissan", "Honda", "Volkswagen", "Suzuki", "Mitsubishi"],
};

export const MODELS: Record<string, string[]> = {
  Chevrolet: ["Spark", "Sail", "Aveo", "Tracker", "Captiva", "Silverado", "Tahoe"],
  Ford: ["Fiesta", "Focus", "EcoSport", "Escape", "Explorer", "F-150", "Ranger"],
  Toyota: ["Yaris", "Corolla", "Camry", "RAV4", "Hilux", "Fortuner", "Land Cruiser"],
  Mazda: ["Mazda2", "Mazda3", "CX-3", "CX-5", "BT-50"],
  Kia: ["Picanto", "Rio", "Sportage", "Sorento", "Stinger"],
  Hyundai: ["i10", "i20", "Tucson", "Santa Fe", "Accent"],
  Renault: ["Sandero", "Logan", "Duster", "Koleos", "Kwid"],
  Nissan: ["March", "Versa", "Sentra", "X-Trail", "Frontier"],
  Honda: ["Fit", "City", "Civic", "HR-V", "CR-V", "Pilot"],
  Volkswagen: ["Polo", "Golf", "Jetta", "Tiguan", "Amarok"],
  Suzuki: ["Alto", "Swift", "Vitara", "Jimny", "S-Cross"],
  Mitsubishi: ["Mirage", "Outlander", "Eclipse Cross", "L200"],
};

export const VERSIONS: Record<string, string[]> = {
  default: ["Base", "LS", "LT", "LTZ", "Premier", "RS", "Sport", "GT", "SE", "Premium", "Full"],
};

export const TIRE_WIDTHS = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305"];
export const TIRE_PROFILES = ["35", "40", "45", "50", "55", "60", "65", "70", "75", "80"];
export const RIM_SIZES = ['13"', '14"', '15"', '16"', '17"', '18"', '19"', '20"', '22"'];

// ─── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  subCategories: string[];
  itemCount: number;
  gradient: string;
  accentColor: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "llantas",
    name: "Tires",
    nameEs: "Llantas",
    description: "Alto rendimiento, touring, todo terreno y más",
    subCategories: ["Alto Rendimiento", "Touring", "Todo Terreno", "Invierno", "SUV & Camionetas", "Economía"],
    itemCount: 840,
    gradient: "from-zinc-900 to-zinc-800",
    accentColor: "#ff9900",
    icon: "🔵",
  },
  {
    id: "lubricantes",
    name: "Lubricants",
    nameEs: "Lubricantes",
    description: "Aceites sintéticos, semi-sintéticos y convencionales",
    subCategories: ["Aceite Sintético", "Semi-Sintético", "Convencional", "Transmisión", "Motor Diésel", "Aditivos"],
    itemCount: 320,
    gradient: "from-zinc-900 to-zinc-800",
    accentColor: "#ff9900",
    icon: "🟡",
  },
  {
    id: "baterias",
    name: "Batteries",
    nameEs: "Baterías",
    description: "Baterías certificadas con garantía extendida",
    subCategories: ["Automóvil", "Camioneta", "Moto", "AGM", "Libre Mantenimiento", "Alta Potencia"],
    itemCount: 180,
    gradient: "from-zinc-900 to-zinc-800",
    accentColor: "#ff9900",
    icon: "🟢",
  },
  {
    id: "rines",
    name: "Rims",
    nameEs: "Rines",
    description: "Rines de aluminio y acero para todo vehículo",
    subCategories: ["Aluminio OEM", "Deportivos", "Acero", "Off-Road", "Cromo", "Custom"],
    itemCount: 260,
    gradient: "from-zinc-900 to-zinc-800",
    accentColor: "#ff9900",
    icon: "⚪",
  },
];

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "best-seller" | "flash-deal" | "new" | "hot";
  badgeLabel?: string;
  discountPct?: number;
  specs: string[];
  inStock: boolean;
  imageColor: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Michelin Primacy 4",
    brand: "Michelin",
    category: "llantas",
    price: 480000,
    originalPrice: 565000,
    rating: 4.9,
    reviewCount: 2341,
    badge: "best-seller",
    badgeLabel: "Más Vendido",
    discountPct: 15,
    specs: ["205/55 R16", "Touring", "Larga duración"],
    inStock: true,
    imageColor: "#1a1a1a",
  },
  {
    id: "p2",
    name: "Continental SportContact 7",
    brand: "Continental",
    category: "llantas",
    price: 620000,
    originalPrice: 730000,
    rating: 4.8,
    reviewCount: 1187,
    badge: "flash-deal",
    badgeLabel: "Flash Deal",
    discountPct: 15,
    specs: ["225/45 R17", "Performance", "Ultra UHP"],
    inStock: true,
    imageColor: "#222222",
  },
  {
    id: "p3",
    name: "Bridgestone Dueler A/T",
    brand: "Bridgestone",
    category: "llantas",
    price: 540000,
    rating: 4.7,
    reviewCount: 876,
    badge: "hot",
    badgeLabel: "Popular",
    specs: ["265/70 R16", "A/T", "SUV & 4x4"],
    inStock: true,
    imageColor: "#1c1c1c",
  },
  {
    id: "p4",
    name: "Mobil 1 Sintético 5W-30",
    brand: "Mobil",
    category: "lubricantes",
    price: 95000,
    originalPrice: 115000,
    rating: 4.9,
    reviewCount: 3456,
    badge: "best-seller",
    badgeLabel: "Más Vendido",
    discountPct: 17,
    specs: ["5W-30", "4L", "Full Sintético"],
    inStock: true,
    imageColor: "#0d0d0d",
  },
  {
    id: "p5",
    name: "Batería Bosch S4",
    brand: "Bosch",
    category: "baterias",
    price: 320000,
    originalPrice: 380000,
    rating: 4.8,
    reviewCount: 1023,
    badge: "flash-deal",
    badgeLabel: "Flash Deal",
    discountPct: 16,
    specs: ["60Ah", "12V", "Libre mantenimiento"],
    inStock: true,
    imageColor: "#111111",
  },
  {
    id: "p6",
    name: "Rines BBS CH-R 17\"",
    brand: "BBS",
    category: "rines",
    price: 890000,
    rating: 4.9,
    reviewCount: 445,
    badge: "new",
    badgeLabel: "Nuevo",
    specs: ["17\"", "5x114.3", "Aluminio forjado"],
    inStock: true,
    imageColor: "#1a1a1a",
  },
  {
    id: "p7",
    name: "Goodyear Wrangler AT",
    brand: "Goodyear",
    category: "llantas",
    price: 498000,
    originalPrice: 580000,
    rating: 4.6,
    reviewCount: 654,
    badge: "flash-deal",
    badgeLabel: "Flash Deal",
    discountPct: 14,
    specs: ["245/70 R16", "A/T", "4x4 & SUV"],
    inStock: true,
    imageColor: "#181818",
  },
  {
    id: "p8",
    name: "Pirelli P Zero",
    brand: "Pirelli",
    category: "llantas",
    price: 750000,
    rating: 4.9,
    reviewCount: 2109,
    badge: "hot",
    badgeLabel: "Top Ventas",
    specs: ["255/40 R18", "Performance", "UHP"],
    inStock: true,
    imageColor: "#141414",
  },
];

// ─── Trust Tiers (Good / Better / Best) ─────────────────────────────────────

export interface TierProduct {
  tier: "good" | "better" | "best";
  label: string;
  labelEs: string;
  priceRange: string;
  description: string;
  features: string[];
  brands: string[];
  recommended?: boolean;
}

export const TIER_PRODUCTS: TierProduct[] = [
  {
    tier: "good",
    label: "Good",
    labelEs: "Buena",
    priceRange: "$150.000 – $350.000",
    description: "Rendimiento confiable para uso urbano diario",
    features: ["Garantía 1 año", "Marca reconocida", "Stock inmediato", "Montaje incluido"],
    brands: ["Kumho", "Nexen", "Linglong", "Triangle"],
  },
  {
    tier: "better",
    label: "Better",
    labelEs: "Mejor",
    priceRange: "$350.000 – $600.000",
    description: "Equilibrio óptimo entre rendimiento y durabilidad",
    features: ["Garantía 2 años", "Marca premium", "Mayor durabilidad", "Mejor tracción"],
    brands: ["Goodyear", "Bridgestone", "Firestone", "Cooper"],
    recommended: true,
  },
  {
    tier: "best",
    label: "Best",
    labelEs: "La Mejor",
    priceRange: "$600.000 – $1.200.000",
    description: "Tecnología de punta para el máximo desempeño",
    features: ["Garantía 3 años", "Marca de élite", "Máximo rendimiento", "Tecnología de punta"],
    brands: ["Michelin", "Continental", "Pirelli", "Bridgestone Turanza"],
  },
];

// ─── Trust Badges ────────────────────────────────────────────────────────────

export const TRUST_BADGES = [
  { icon: "truck", label: "Envío Express", sublabel: "Bogotá en 24h" },
  { icon: "shield", label: "Garantía Certificada", sublabel: "Hasta 3 años" },
  { icon: "map-pin", label: "Red de Instalación", sublabel: "+120 talleres aliados" },
  { icon: "credit-card", label: "Pago Seguro", sublabel: "Encriptación 256-bit" },
  { icon: "refresh-cw", label: "Devolución Fácil", sublabel: "30 días sin preguntas" },
  { icon: "star", label: "4.9 / 5 Estrellas", sublabel: "+15.000 reseñas" },
];

// ─── Announcement ticker ─────────────────────────────────────────────────────

export const ANNOUNCEMENTS = [
  "🔥 Flash Deal: 15% OFF en Michelin Primacy 4 — Solo hoy",
  "🚚 Envío GRATIS en compras superiores a $400.000",
  "⚡ Instalación Express disponible en Bogotá, Medellín y Cali",
  "✅ +15.000 clientes satisfechos · Garantía certificada en todos los productos",
  "🏆 Distribuidores oficiales Michelin, Continental, Bridgestone y Pirelli en Colombia",
];
