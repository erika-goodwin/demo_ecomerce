"use client";
import { products } from "../lib/products";
import ProductCard from "./ProductCard";

export default function NewArrivalsSection() {
  const newArrivals = products.slice(0, 3);

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-0.5 bg-[#C4622D] block"></span>
          <span className="text-[#C4622D] uppercase text-xs tracking-widest font-semibold">
            New Arrivals
          </span>
        </div>
        <h2 className="text-4xl font-bold text-[#2C1810] mb-2">
          Freshly Roasted
        </h2>
        <p className="text-[#2C1810]/55 mb-10 text-lg">
          Our latest beans, roasted this week and ready to ship.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
