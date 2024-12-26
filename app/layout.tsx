import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers/Providers";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Navbar from "@/components/Navbar";

const libre = Libre_Baskerville({
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MeadTools",
  description: "The all in one mead, wine, and cider making calculator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={libre.className}>{children}</body>
    </html>
  );
}
