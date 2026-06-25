"use client";
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import {
  useInitialize,
  useVisitorCode,
  useFeatureFlag,
  useData,
  Conversion,
  CustomData,
} from "@kameleoon/react-sdk";

type SDKStatus = "loading" | "ready" | "error";

interface KameleoonContextType {
  visitorCode: string;
  isReady: boolean;
  sdkStatus: SDKStatus;
  isFeatureActive: (flagKey: string) => boolean;
  getVariationKey: (flagKey: string) => string;
  trackConversion: (goalId: number, revenue?: number) => void;
  trackCustomData: (index: number, ...values: string[]) => void;
  customDataSnapshot: Record<number, string>;
  conversionLog: number[];
}

const KameleoonContext = createContext<KameleoonContextType>({
  visitorCode: "",
  isReady: false,
  sdkStatus: "loading",
  isFeatureActive: () => false,
  getVariationKey: () => "off",
  trackConversion: () => {},
  trackCustomData: () => {},
  customDataSnapshot: {},
  conversionLog: [],
});

export function KameleoonProvider({ children }: { children: ReactNode }) {
  const { initialize } = useInitialize();
  const { getVisitorCode } = useVisitorCode();
  const { isFeatureFlagActive, getVariation } = useFeatureFlag();
  const { addData } = useData();
  const [visitorCode, setVisitorCode] = useState("");
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>("loading");
  const [customDataSnapshot, setCustomDataSnapshot] = useState<Record<number, string>>({});
  const [conversionLog, setConversionLog] = useState<number[]>([]);

  const init = useCallback(async () => {
    try {
      await initialize();

      const vc = getVisitorCode();
      setVisitorCode(vc);

      // customData index 0: userType — "new" or "returning" (detected via localStorage)
      const isReturning = typeof window !== "undefined" && localStorage.getItem("kam_visited") === "true";
      if (typeof window !== "undefined") localStorage.setItem("kam_visited", "true");
      const userType = isReturning ? "returning" : "new";
      addData(vc, new CustomData(0, userType));
      setCustomDataSnapshot({ 0: userType });

      setSdkStatus("ready");
      console.log(">>> Kam is READY", sdkStatus);
    } catch (e) {
      console.error("[Kameleoon] Init error:", e);
      setSdkStatus("error");
    }
  }, [initialize, getVisitorCode, addData]);

  useEffect(() => {
    init();
  }, [init]);

  const isFeatureActive = (flagKey: string): boolean => {
    if (sdkStatus !== "ready" || !visitorCode) return false;

    try {
      return isFeatureFlagActive({ visitorCode, featureKey: flagKey });
    } catch (e) {
      console.error(`[Kameleoon] isFeatureFlagActive error for "${flagKey}":`, e);
      return false;
    }
  };

  const getVariationKey = (flagKey: string): string => {
    if (sdkStatus !== "ready" || !visitorCode) return "off";

    try {
      console.log(
        ">>>> getVariationKey called with flagKey:",
        getVariation({ visitorCode, featureKey: flagKey }),
      );
      return getVariation({ visitorCode, featureKey: flagKey }).key;
    } catch (e) {
      console.error(`[Kameleoon] getVariation error for "${flagKey}":`, e);
      return "off";
    }
  };

  const trackConversion = (goalId: number, revenue?: number): void => {
    if (sdkStatus !== "ready" || !visitorCode) return;
    try {
      addData(visitorCode, new Conversion({ goalId, ...(revenue !== undefined && { revenue }) }));
      setConversionLog((prev) => [...prev, goalId]);
      console.group("[Kameleoon] 🎯 Conversion");
      console.log("goalId :", goalId);
      if (revenue !== undefined) console.log("revenue:", revenue);
      console.groupEnd();
    } catch (e) {
      console.error("[Kameleoon] trackConversion error:", e);
    }
  };

  const CUSTOM_DATA_NAMES: Record<number, string> = {
    0: "userType",
    1: "cartValue",
    2: "preferredCategory",
  };

  const trackCustomData = (index: number, ...values: string[]): void => {
    if (sdkStatus !== "ready" || !visitorCode) return;
    try {
      addData(visitorCode, new CustomData(index, ...values));
      setCustomDataSnapshot((prev) => ({ ...prev, [index]: values.join(", ") }));
      console.group(`[Kameleoon] 📦 CustomData — ${CUSTOM_DATA_NAMES[index] ?? `index ${index}`}`);
      console.log("index :", index);
      console.log("values:", values);
      console.groupEnd();
    } catch (e) {
      console.error("[Kameleoon] trackCustomData error:", e);
    }
  };

  return (
    <KameleoonContext.Provider
      value={{
        visitorCode,
        isReady: sdkStatus === "ready",
        sdkStatus,
        isFeatureActive,
        getVariationKey,
        trackConversion,
        trackCustomData,
        customDataSnapshot,
        conversionLog,
      }}
    >
      {children}
    </KameleoonContext.Provider>
  );
}

export function useKameleoon() {
  return useContext(KameleoonContext);
}
