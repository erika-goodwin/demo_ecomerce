"use client";
import { products } from "../lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <section id="products" className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#2C1810] mb-2 text-center">
          Our Collection
        </h2>
        <p className="text-[#2C1810]/55 text-center mb-12 text-lg">
          From bright single-origins to rich espresso blends
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
