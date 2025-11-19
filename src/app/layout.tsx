import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Schrösk - Observation Creates Reality",
  description: "A quantum task management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} antialiased bg-background text-foreground font-mono selection:bg-neon-cyan/30 selection:text-neon-cyan bg-grid-pattern`}
      >
        {children}
      </body>
    </html>
  );
}
