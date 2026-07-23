import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryMatrix from "./components/CategoryMatrix";
import FlashDeals from "./components/FlashDeals";
import TrustAccelerator from "./components/TrustAccelerator";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoryMatrix />
      <FlashDeals />
      <TrustAccelerator />
      <Footer />
    </main>
  );
}
