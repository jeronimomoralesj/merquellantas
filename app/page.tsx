import Navbar        from "./components/Navbar";
import HeroSection  from "./components/HeroSection";
import WhatsAppButton from "./components/WhatsAppButton";
import BrandsCarousel from "./components/BrandsCarousel";
import FlashDeals   from "./components/FlashDeals";
import BentoGrid    from "./components/BentoGrid";
import CityStats    from "./components/CityStats";
import StoreFinder  from "./components/StoreFinder";
import Testimonials from "./components/Testimonials";
import BlogSection  from "./components/BlogSection";
import Footer       from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />

      <BentoGrid />
      <FlashDeals />
      <CityStats />
      <StoreFinder />
      <Testimonials />
      <BlogSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
