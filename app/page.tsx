"use client";
import FreeShippingBanner from "./components/FreeShippingBanner";
import HeroBanner from "./components/HeroBanner";
import NewArrivalsSection from "./components/NewArrivalsSection";
import ProductGrid from "./components/ProductGrid";

export default function HomePage() {
  return (
    <main>
      <FreeShippingBanner />
      <HeroBanner />
      <NewArrivalsSection />
      <ProductGrid />
    </main>
  );
}
