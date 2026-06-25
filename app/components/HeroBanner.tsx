"use client";
import Link from "next/link";
import { useKameleoon } from "../context/KameleoonContext";

const CTA_TEXT: Record<string, string> = {
  off: "Shop Now",
  discover_blends: "Discover Blends",
  brew_today: "Brew Today",
};

export default function HeroBanner() {
  const { getVariationKey, isReady } = useKameleoon();
  const variationKey = getVariationKey("hero-cta");
  const ctaText = CTA_TEXT[variationKey] ?? "Shop Now";

  return (
    <section className="bg-[#2C1810] text-[#F5F0E8] py-28 px-6 text-center">
      <p className="text-[#C4622D] uppercase tracking-widest text-sm mb-5 font-medium">
        Small batch · Specialty roasted
      </p>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Coffee Worth
        <br />
        <span className="text-[#C4622D]">Waking Up For.</span>
      </h1>
      <p className="text-[#F5F0E8]/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
        Handpicked beans from the world's finest origins. Roasted with care,
        delivered to your door.
      </p>
      <Link
        href="#products"
        className={`bg-[#C4622D] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#a84e22] transition-colors inline-block ${!isReady ? "invisible" : ""}`}
      >
        {ctaText}
      </Link>
    </section>
  );
}
