"use client";
import "./globals.css";
import Navbar from "./components/Navbar";
import DebugBar from "./components/DebugBar";
import { CartProvider } from "./context/CartContext";
import { KameleoonProviderSSR } from "@kameleoon/react-sdk";
import { KameleoonProvider } from "./context/KameleoonContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Brewly — Premium Coffee</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Small batch specialty coffee, roasted with care and delivered to your door."
        />
      </head>
      <body className="bg-[#F5F0E8] min-h-screen">
        <KameleoonProviderSSR
          sdkParameters={{
            siteCode: process.env.NEXT_PUBLIC_KAMELEOON_SITE_CODE ?? "",
            configuration: {
              environment: process.env.NODE_ENV === "development" ? "development" : "production",
              updateInterval: 5,
            },
          }}
        >
          <KameleoonProvider>
            <CartProvider>
              <Navbar />
              {children}
              {process.env.NODE_ENV === "development" && <DebugBar />}
            </CartProvider>
          </KameleoonProvider>
        </KameleoonProviderSSR>
      </body>
    </html>
  );
}
