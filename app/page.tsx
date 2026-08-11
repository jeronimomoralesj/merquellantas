import Navbar          from "./components/Navbar";
import HeroSection     from "./components/HeroSection";
import WhatsAppButton  from "./components/WhatsAppButton";
import BrandsCarousel  from "./components/BrandsCarousel";
import FlashDeals      from "./components/FlashDeals";
import CategoryMatrix  from "./components/CategoryMatrix";
import CityStats       from "./components/CityStats";
import StoreFinder     from "./components/StoreFinder";
import Testimonials    from "./components/Testimonials";
import BlogSection     from "./components/BlogSection";
import Footer          from "./components/Footer";

/*
  Conversion-optimized section order:
  1. Hero slider + fitment finder   → grab attention + primary action
  2. Brands carousel                → instant credibility by association
  3. Flash Deals                    → impulse purchase with real prices
  4. Categories                     → browse if fitment search wasn't used
  5. City presence + 32 years       → trust & credibility before deciding
  6. Store finder                   → reduce friction for in-person buyers
  7. Testimonials                   → final social proof push
  8. Footer
*/

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BrandsCarousel />
      <CategoryMatrix />
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
