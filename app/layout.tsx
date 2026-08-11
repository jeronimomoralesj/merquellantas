import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Merquellantas — Llantas, Lubricantes, Baterías y Rines en Colombia",
  description:
    "Distribuidor oficial de las mejores marcas de llantas, lubricantes, baterías y rines en Colombia. Envío express, garantía certificada y red de instalación.",
  keywords: "llantas colombia, michelin, continental, bridgestone, lubricantes, baterias, rines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
