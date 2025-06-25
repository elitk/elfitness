import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elfitness - AI Fitness Coach",
  description: "Your AI-powered fitness companion for personalized workouts and nutrition tracking",
  keywords: ["fitness", "workout", "nutrition", "AI", "health", "exercise"],
  authors: [{ name: "Elfitness Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
