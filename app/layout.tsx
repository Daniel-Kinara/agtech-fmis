import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure your CSS is imported here

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartFarm FMIS",
  description: "Advanced Farm Management & Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}