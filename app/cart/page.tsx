"use client";
import Link from "next/link";
import CartSummary from "../components/CartSummary";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#2C1810]">Your Cart</h1>
          <Link
            href="/"
            className="text-[#C4622D] hover:text-[#2C1810] transition-colors text-sm font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
        <CartSummary />
      </div>
    </main>
  );
}
