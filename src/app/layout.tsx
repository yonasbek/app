import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MSLeo App",
  description: "MSLeo Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
