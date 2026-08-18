import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import SignupPopup from "./components/SignupPopup";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
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
    <html lang="es" className={`${jost.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
          <SignupPopup />
        </CartProvider>
      </body>
    </html>
  );
}
