import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrendingUp, User } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stocks Portfolio",
  description: "",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Navbar */}
          <nav className="bg-[#deeff5] shadow-lg fixed top-0 w-full z-10">
            <div className="mx-2 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl text-gray-900 ml-2">
                      <b>Portfolio</b>Tracker
                    </span>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 rounded-full cursor-pointer text-black text-xl w-11 h-11 flex items-center justify-center hover:bg-gray-200 transition">
                  <p>P</p>
                </div>
              </div>
            </div>
          </nav>
          <div className="mt-15">{children}</div>
        </div>
      </body>
    </html>
  );
}
