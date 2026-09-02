// ─── Brand Logos ─────────────────────────────────────────────────────────────

const SAS = "?sv=2025-05-05&ss=bfqt&srt=sco&st=2026-07-22T15%3A22%3A48Z&se=2026-07-24T15%3A22%3A48Z&sp=rwdxylacuptfi&sig=86K%2F%2BN7E4jUezVp4J2xyCCkFS6exBOz%2B%2F0pCVUcwJTs%3D";
const blob = (id: string) => `https://mqplatform.blob.core.windows.net/brandslogo/${id}.png${SAS}`;

export const BRANDS = [
  { name: "Continental",    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgopNKbVtT9mGT0c1CQGatQpwMzMfr_619G2rwvekfZw&s=10" },
  { name: "Hankook", url: "https://upload.wikimedia.org/wikipedia/commons/8/88/Hankook_logo_as_of_2019.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original" },
  { name: "Aplus", url: "https://www.muchoneumatico.com/blog/wp-content/uploads/2023/01/El-logo-de-Neumaticos-Aplus.jpg" },
  { name: "CargoPower",     url: "https://cargopowertire.com/wp-content/uploads/2023/04/Untitled-design-48.png" },
  { name: "Tab",    url: "https://www.tabspain.com/wp-content/uploads/2020/01/logo-tab.png" },
  { name: "Rubia",       url: "https://dxm.content-center.totalenergies.com/api/wedia/dam/transform/xysh7dg731tahj1ycfut3xujac/telecharger-1-png.webp" },
  { name: "Total",     url: "https://guiadelubricantes.total-argentina.com.ar/v2/imagenes/logo.png" },
  { name: "Mobil",      url: "https://www.terpel.com/var/site/storage/images/5/1/4/6/96415-1-esl-CO/f6b50119131d-OG.png" },
  { name: "Alcoa",  url: "https://allvectorlogo.com/img/2017/09/alcoa-logo.png" },
  { name: "Willard",  url: "https://www.autoamericas.show/media/com_mtree/images/listings/m/5eac9965-adf8-d029-29fc-6980f2cee0d3_imagen_c.png?t=1771614019" },
  { name: "Nexen",       url: "https://www.tyrestar.cz/files/manufacturer_images/nexen-logo-1920x1080.png" },
];

// ─── Fitment Finder Data ────────────────────────────────────────────────────

export const YEARS = Array.from({ length: 25 }, (_, i) => String(2024 - i));

export const MAKES: Record<string, string[]> = {
  default: ["Chevrolet", "Ford", "Toyota", "Mazda", "Kia", "Hyundai", "Renault", "Nissan", "Honda", "Volkswagen", "Suzuki", "Mitsubishi"],
};

export const MAKES_BY_TYPE: Record<string, string[]> = {
  automovil: ["Chevrolet", "Ford", "Toyota", "Mazda", "Kia", "Hyundai", "Renault", "Nissan", "Honda", "Volkswagen", "Suzuki", "Mitsubishi"],
  camioneta: ["Toyota", "Ford", "Chevrolet", "Nissan", "Mitsubishi", "Volkswagen", "RAM", "Isuzu", "Mazda", "Land Rover", "Jeep"],
  camion: ["Kenworth", "Freightliner", "International", "Volvo", "Mercedes-Benz", "Scania", "Mack", "Isuzu", "Hino", "DAF", "IVECO"],
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

export const MODELS_CAMIONETA: Record<string, string[]> = {
  Toyota: ["Hilux", "4Runner", "Land Cruiser Prado", "Land Cruiser 200", "Fortuner"],
  Ford: ["Ranger", "F-150", "Explorer", "Bronco", "Expedition"],
  Chevrolet: ["Silverado", "Colorado", "Tahoe", "Suburban", "TrailBlazer"],
  Nissan: ["Frontier", "Navara", "Pathfinder", "X-Trail", "Armada"],
  Mitsubishi: ["L200", "Pajero Sport", "Outlander", "Eclipse Cross"],
  Volkswagen: ["Amarok", "Touareg"],
  RAM: ["RAM 1500", "RAM 2500", "RAM 3500", "RAM 700"],
  Isuzu: ["D-Max", "MU-X"],
  Mazda: ["BT-50", "CX-5", "CX-8", "CX-9"],
  "Land Rover": ["Defender", "Discovery", "Range Rover", "Discovery Sport"],
  Jeep: ["Wrangler", "Gladiator", "Grand Cherokee", "Cherokee"],
};

export const MODELS_CAMION: Record<string, string[]> = {
  Kenworth: ["T800", "T680", "T370", "W900", "T880"],
  Freightliner: ["Cascadia", "M2 106", "Coronado", "Columbia"],
  International: ["LT Series", "ProStar", "MV Series", "HV Series"],
  Volvo: ["FH", "FM", "FMX", "FE", "FL"],
  "Mercedes-Benz": ["Actros", "Axor", "Atego", "Arocs"],
  Scania: ["R Series", "S Series", "P Series", "G Series"],
  Mack: ["Anthem", "Granite", "Pinnacle", "TerraPro"],
  Isuzu: ["NMR", "NLR", "FVZ", "CYZ", "EXZ"],
  Hino: ["300 Series", "500 Series", "700 Series", "XL Series"],
  DAF: ["XF", "CF", "LF", "XG"],
  IVECO: ["Stralis", "Eurocargo", "Daily", "Trakker"],
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
    icon: "tires",
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
    icon: "lubricants",
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
    icon: "batteries",
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
    icon: "rims",
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
    imageColor: "#0d1117",
  },
  {
    id: "p2",
    name: "Hankook Ventus S1 Evo3",
    brand: "Hankook",
    category: "llantas",
    price: 480000,
    originalPrice: 555000,
    rating: 4.7,
    reviewCount: 892,
    badge: "best-seller",
    badgeLabel: "Más Vendido",
    discountPct: 14,
    specs: ["225/45 R17", "UHP", "91Y"],
    inStock: true,
    imageColor: "#0a0a1a",
  },
  {
    id: "p3",
    name: "Nexen Roadian AT Pro",
    brand: "Nexen",
    category: "llantas",
    price: 320000,
    rating: 4.5,
    reviewCount: 301,
    badge: "hot",
    badgeLabel: "Popular",
    specs: ["265/70 R16", "A/T", "SUV & 4x4"],
    inStock: true,
    imageColor: "#101520",
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
    imageColor: "#1a0d00",
  },
  {
    id: "p5",
    name: "Willard 600 60Ah",
    brand: "Willard",
    category: "baterias",
    price: 285000,
    originalPrice: 325000,
    rating: 4.6,
    reviewCount: 812,
    badge: "flash-deal",
    badgeLabel: "Flash Deal",
    discountPct: 12,
    specs: ["60Ah", "12V", "Libre mantenimiento"],
    inStock: true,
    imageColor: "#10001a",
  },
  {
    id: "p6",
    name: "Alcoa Ultra One 17\"",
    brand: "Alcoa",
    category: "rines",
    price: 520000,
    rating: 4.7,
    reviewCount: 234,
    badge: "new",
    badgeLabel: "Nuevo",
    specs: ["17\"", "5x114.3", "Aluminio forjado"],
    inStock: true,
    imageColor: "#141414",
  },
  {
    id: "p7",
    name: "Tab Total HP",
    brand: "Tab",
    category: "llantas",
    price: 245000,
    originalPrice: 285000,
    rating: 4.3,
    reviewCount: 134,
    badge: "flash-deal",
    badgeLabel: "Flash Deal",
    discountPct: 14,
    specs: ["225/45 R17", "HP", "91W"],
    inStock: true,
    imageColor: "#1a1200",
  },
  {
    id: "p8",
    name: "Total Quartz 9000 5W-40",
    brand: "Total",
    category: "lubricantes",
    price: 88000,
    rating: 4.7,
    reviewCount: 1102,
    badge: "hot",
    badgeLabel: "Top Ventas",
    specs: ["5W-40", "4L", "Full Sintético"],
    inStock: true,
    imageColor: "#00101a",
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
  "Flash Deal: 15% OFF en Michelin Primacy 4 — Solo hoy",
  "Envio GRATIS en compras superiores a $400.000",
  "Instalacion Express disponible en Bogota, Medellin y Cali",
  "+15.000 clientes satisfechos · Garantia certificada en todos los productos",
  "Distribuidores oficiales Michelin, Continental, Bridgestone y Pirelli en Colombia",
];
