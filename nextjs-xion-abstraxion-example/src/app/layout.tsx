"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
import address from "./contract/info.json"

const inter = Inter({ subsets: ["latin"] });

// Example XION seat contract
const seatContractAddress = address.address;

const legacyConfig = {
  contracts: [
    seatContractAddress,
  ]
};

const treasuryConfig = {
  treasury: "xion1nnptdsujk8v5uu79mug6h60mtvcfy4qj3ngf7q3pcxrpakdze5aq6v44p9",
  rpcUrl: "https://rpc.xion-testnet-1.burnt.com:443",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider
          config={treasuryConfig}
        >
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}