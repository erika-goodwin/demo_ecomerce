"use client";
import { useKameleoon } from "../context/KameleoonContext";

export default function FreeShippingBanner() {
  const { isFeatureActive, isReady } = useKameleoon();

  console.log(
    ">>> FreeShippingBanner isReady:",
    isReady,
    'isFeatureActive("free-shipping-banner"):',
    isFeatureActive("free-shipping-banner"),
  );

  if (!isReady || !isFeatureActive("free-shipping-banner")) return null;

  return (
    <div className="bg-[#C4622D] text-white text-center py-2.5 text-sm tracking-wide">
      ☕ Free shipping on orders over €40 — Use code <strong>BREWLY10</strong>{" "}
      for 10% off your first order
    </div>
  );
}
