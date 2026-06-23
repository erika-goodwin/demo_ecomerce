"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { cartItems, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 40 ? 0 : 4.9;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-6xl mb-6">☕</p>
        <h2 className="text-2xl font-bold text-[#2C1810] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#2C1810]/55 mb-8">
          Add some great coffee to get started.
        </p>
        <Link
          href="/"
          className="bg-[#2C1810] text-[#F5F0E8] px-8 py-3 rounded-full font-semibold hover:bg-[#C4622D] transition-colors inline-block"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#C4622D]/10 border border-[#C4622D]/30 rounded-2xl p-4 mb-6 text-center">
        <p className="text-[#C4622D] font-medium">
          🎉 10% off your first order — use code{" "}
          <strong className="font-bold">BREWLY10</strong> at checkout
        </p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
        {cartItems.map((item, i) => (
          <div
            key={item.product.id}
            className={`flex items-center gap-4 p-5 ${
              i < cartItems.length - 1 ? "border-b border-[#F5F0E8]" : ""
            }`}
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#2C1810] truncate">
                {item.product.name}
              </h3>
              <p className="text-[#2C1810]/50 text-xs mt-0.5">
                {item.product.category}
              </p>
              <p className="text-[#2C1810]/60 text-sm mt-1">
                Qty: {item.quantity} × €{item.product.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-[#2C1810] text-lg">
                €{(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-xs text-[#C4622D] hover:underline mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between mb-3 text-[#2C1810]/60">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4 text-[#2C1810]/60">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-[#C4622D] font-medium" : ""}>
            {shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t border-[#F5F0E8] pt-4 flex justify-between font-bold text-[#2C1810] text-xl">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <button className="w-full mt-6 bg-[#2C1810] text-[#F5F0E8] py-4 rounded-xl font-bold text-lg hover:bg-[#C4622D] transition-colors tracking-wide">
          Checkout
        </button>
        {subtotal < 40 && (
          <p className="text-center text-[#2C1810]/40 text-xs mt-3">
            Add €{(40 - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
      </div>
    </div>
  );
}
