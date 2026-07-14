import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import Footer from '../components/layout/Footer';
import { Toaster } from "react-hot-toast"; 
import { AuthProvider } from "@/src/context/AuthContext"; 
import { AuthModalProvider } from "@/src/context/AuthModalContext";const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JerdeshMoskva — Работа, жильё и услуги в Москве",
  description: "Объявления кыргызстанцев в Москве",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0 bg-white">
        <AuthProvider>
          <AuthModalProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '12px',
              },
            }} 
          />
          
          <Header />
          <main className="flex-1 bg-white w-full max-w-[1800px] mx-auto px-4">
            {children}
          </main>
          <div className=" ">
            <Footer />
          </div>
          <BottomNav />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}