import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
      <body className={`${libre.className} bg-secondary h-screen`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
