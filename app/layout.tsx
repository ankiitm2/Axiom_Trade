import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./StoreProvider";
import QueryProvider from "./QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axiom Trade Replica",
  description: "Token Discovery Table",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <StoreProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
