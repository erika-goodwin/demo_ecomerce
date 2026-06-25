"use client";
import Link from "next/link";
import { Product } from "../lib/products";
import { useCart } from "../context/CartContext";
import { useKameleoon } from "../context/KameleoonContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cartItems } = useCart();
  const { trackCustomData } = useKameleoon();

  const handleProductClick = () => {
    // customData index 2: preferredCategory — tracks which category the visitor browses
    trackCustomData(2, product.category);
  };

  const handleAddToCart = () => {
    addToCart(product);
    // customData index 1: cartValue — new cart total after adding this product
    const currentTotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const newTotal = currentTotal + product.price;
    trackCustomData(1, newTotal.toFixed(2));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={`/products/${product.id}`} onClick={handleProductClick} className="group block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.id}`} onClick={handleProductClick}>
          <span className="text-xs uppercase tracking-widest text-[#C4622D] font-semibold mb-1 block">
            {product.category}
          </span>
          <h3 className="text-[#2C1810] font-bold text-lg mb-2 hover:text-[#C4622D] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#2C1810]/55 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#2C1810] font-bold text-xl">
            €{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-[#2C1810] text-[#F5F0E8] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#C4622D] transition-colors text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
