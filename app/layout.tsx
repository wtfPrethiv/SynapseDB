import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import AuthProvider from "./components/AuthProvider";

export const metadata: Metadata = {
  title: "SynapseDB — AI Provenance & Reproducibility Tracker",
  description:
    "A specialized dashboard for AI researchers to solve the reproducibility crisis in machine learning. Provides a strict, verifiable audit trail for every model trained.",
  keywords: ["AI", "machine learning", "reproducibility", "experiment tracking", "provenance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
