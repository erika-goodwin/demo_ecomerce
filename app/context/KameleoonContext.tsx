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
} from "@kameleoon/react-sdk";

type SDKStatus = "loading" | "ready" | "error";

interface KameleoonContextType {
  visitorCode: string;
  isReady: boolean;
  sdkStatus: SDKStatus;
  isFeatureActive: (flagKey: string) => boolean;
  getVariationKey: (flagKey: string) => string;
}

const KameleoonContext = createContext<KameleoonContextType>({
  visitorCode: "",
  isReady: false,
  sdkStatus: "loading",
  isFeatureActive: () => false,
  getVariationKey: () => "off",
});

export function KameleoonProvider({ children }: { children: ReactNode }) {
  const { initialize } = useInitialize();
  const { getVisitorCode } = useVisitorCode();
  const { isFeatureFlagActive, getVariation } = useFeatureFlag();
  const [visitorCode, setVisitorCode] = useState("");
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>("loading");

  const init = useCallback(async () => {
    try {
      await initialize();

      const vc = getVisitorCode();
      setVisitorCode(vc);

      setSdkStatus("ready");
      console.log(">>> Kam is READY", sdkStatus);
    } catch (e) {
      console.error("[Kameleoon] Init error:", e);
      setSdkStatus("error");
    }
  }, [initialize, getVisitorCode]);

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

  return (
    <KameleoonContext.Provider
      value={{
        visitorCode,
        isReady: sdkStatus === "ready",
        sdkStatus,
        isFeatureActive,
        getVariationKey,
      }}
    >
      {children}
    </KameleoonContext.Provider>
  );
}

export function useKameleoon() {
  return useContext(KameleoonContext);
}
