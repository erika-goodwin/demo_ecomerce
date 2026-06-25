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

  useEffect(() => {
    if (sdkStatus !== "ready") return;

    const LABELS: Record<number, string> = { 0: "userType", 1: "cartValue", 2: "preferredCategory" };
    const tableData = Object.entries(customDataSnapshot).reduce<Record<string, { index: number; value: string }>>((acc, [idx, val]) => {
      const i = Number(idx);
      acc[LABELS[i] ?? `index_${i}`] = { index: i, value: val };
      return acc;
    }, {});

    console.group("[Kameleoon] 📊 CustomData snapshot");
    console.table(tableData);
    if (conversionLog.length > 0) console.log("conversions fired:", conversionLog);
    console.groupEnd();

    if (typeof window !== "undefined") {
      (window as any).__kam = {
        visitorCode,
        customData: customDataSnapshot,
        customDataLabeled: tableData,
        conversions: conversionLog,
      };
    }
  }, [customDataSnapshot, conversionLog, sdkStatus, visitorCode]);

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
