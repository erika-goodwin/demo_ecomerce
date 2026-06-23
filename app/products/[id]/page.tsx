"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { products } from "../../lib/products";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">☕</p>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-4">
            Product not found
          </h2>
          <Link href="/" className="text-[#C4622D] hover:underline font-medium">
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-[#C4622D] hover:text-[#2C1810] transition-colors font-medium flex items-center gap-2 mb-8 w-fit"
        >
          ← Back to shop
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-10 flex flex-col">
            <span className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold mb-2 block">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-[#2C1810] mb-4">
              {product.name}
            </h1>
            <p className="text-[#2C1810]/60 leading-relaxed mb-6 text-base">
              {product.description}
            </p>

            <div className="bg-[#F5F0E8] rounded-2xl p-4 mb-6 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-[#2C1810]/50 uppercase tracking-wide mb-1">
                  Weight
                </p>
                <p className="font-semibold text-[#2C1810] text-sm">250g</p>
              </div>
              <div>
                <p className="text-xs text-[#2C1810]/50 uppercase tracking-wide mb-1">
                  Roast
                </p>
                <p className="font-semibold text-[#2C1810] text-sm">
                  {product.category === "Espresso"
                    ? "Dark"
                    : product.category === "Filter"
                    ? "Light"
                    : "Medium"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#2C1810]/50 uppercase tracking-wide mb-1">
                  Origin
                </p>
                <p className="font-semibold text-[#2C1810] text-sm">Single</p>
              </div>
            </div>

            <div className="mt-auto border-t border-[#F5F0E8] pt-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-bold text-[#2C1810]">
                  €{product.price.toFixed(2)}
                </span>
                <span className="text-[#C4622D] text-sm font-medium bg-[#C4622D]/10 px-3 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="w-full bg-[#2C1810] text-[#F5F0E8] py-4 rounded-xl font-bold text-lg hover:bg-[#C4622D] transition-colors"
              >
                Add to Cart
              </button>

              <p className="text-center text-[#2C1810]/40 text-xs mt-4">
                Free shipping on orders over €40
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
