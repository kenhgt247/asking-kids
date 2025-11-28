import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/layout/Toaster";
import { AuthModal } from "@/components/layout/AuthModal";

export const metadata: Metadata = {
  title: "Asking Kids - Học mà chơi, chơi mà học",
  description: "Nền tảng giáo dục AI và cộng đồng cho cha mẹ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 font-sans text-gray-800">
        <AppProvider>
          <Navbar />
          <main className="min-h-screen pt-4 md:pt-8 pb-20 md:pb-0">
            {children}
          </main>
          <Footer onNavigate={() => {}} />
          <Toaster />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}