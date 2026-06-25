"use client";
import { useState } from "react";
import { useKameleoon } from "../context/KameleoonContext";

const STATUS_ICON: Record<string, string> = {
  ready: "🟢",
  loading: "🟡",
  error: "🔴",
};

const CUSTOM_DATA_LABELS: Record<number, string> = {
  0: "userType",
  1: "cartValue",
  2: "preferredCategory",
};

export default function DebugBar() {
  const {
    visitorCode,
    sdkStatus,
    isFeatureActive,
    getVariationKey,
    customDataSnapshot,
    conversionLog,
  } = useKameleoon();
  const [collapsed, setCollapsed] = useState(false);

  const shippingActive = isFeatureActive("free-shipping-banner");
  const heroCta = getVariationKey("hero-cta");

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 bg-[#2C1810] text-[#F5F0E8] text-xs px-3 py-1.5 rounded-full shadow-lg font-mono"
      >
        {STATUS_ICON[sdkStatus]} Kameleoon
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#2C1810]/95 text-[#F5F0E8] text-xs font-mono border-t border-[#C4622D]/40 backdrop-blur-sm">
      {/* Row 1: SDK status + flags */}
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-1 flex items-center gap-6 flex-wrap">
        <span className="font-semibold text-[#C4622D] shrink-0">
          {STATUS_ICON[sdkStatus]} Kameleoon Debug
        </span>

        <span className="text-[#F5F0E8]/60 shrink-0">
          visitor: <span className="text-[#F5F0E8]">{visitorCode || "—"}</span>
        </span>

        <span className="text-[#F5F0E8]/60 shrink-0">
          env:{" "}
          <span className="text-[#F5F0E8]">
            {process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV ?? "unknown"}
          </span>
        </span>

        <span className="text-[#F5F0E8]/60 shrink-0">
          free-shipping-banner:{" "}
          <span className={shippingActive ? "text-green-400" : "text-[#F5F0E8]/40"}>
            {sdkStatus === "ready" ? (shippingActive ? "ON" : "OFF") : "…"}
          </span>
        </span>

        <span className="text-[#F5F0E8]/60 shrink-0">
          hero-cta:{" "}
          <span className="text-[#F5F0E8]">{sdkStatus === "ready" ? heroCta : "…"}</span>
        </span>

        <span className="text-[#F5F0E8]/60 shrink-0">
          sdk: <span className="text-[#F5F0E8]">{sdkStatus}</span>
        </span>

        <button
          onClick={() => setCollapsed(true)}
          className="ml-auto text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors shrink-0"
          aria-label="Collapse debug bar"
        >
          ✕
        </button>
      </div>

      {/* Row 2: CustomData + Conversions */}
      <div className="max-w-screen-xl mx-auto px-4 pb-2 flex items-center gap-4 flex-wrap border-t border-[#F5F0E8]/10 pt-1">
        <span className="text-[#C4622D]/80 shrink-0 font-semibold">customData</span>

        {[0, 1, 2].map((index) => {
          const value = customDataSnapshot[index];
          return (
            <span key={index} className="text-[#F5F0E8]/60 shrink-0">
              [{index}] {CUSTOM_DATA_LABELS[index]}:{" "}
              <span className={value ? "text-yellow-300" : "text-[#F5F0E8]/25"}>
                {value ?? "—"}
              </span>
            </span>
          );
        })}

        <span className="text-[#F5F0E8]/60 shrink-0 ml-4">
          conversions:{" "}
          <span className={conversionLog.length > 0 ? "text-green-400" : "text-[#F5F0E8]/25"}>
            {conversionLog.length > 0 ? conversionLog.join(", ") : "—"}
          </span>
        </span>
      </div>
    </div>
  );
}
