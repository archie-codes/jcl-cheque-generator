import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Sparkles } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBP Cheque Printing",
  description: "For Cheque Printing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        {/* GLOBAL BACKGROUND 
          1. fixed: So it doesn't scroll away when the page is long.
          2. z-[-1]: To ensure it stays behind all content.
        */}
        <div
          className="fixed inset-0 z-[-1]"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
              radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
              radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
              radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
              linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
            `,
          }}
        />

        {/* CONTENT WRAPPER
          Uses flex-col to push the footer to the bottom even if content is short.
        */}
        <div className="flex flex-col min-h-screen relative z-10">
          
          {/* Main Page Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER 
            Added glassmorphism (backdrop-blur) so it blends with the aurora background.
          */}
          <footer className="print:hidden border-t border-slate-200/60 bg-white/40 backdrop-blur-md mt-auto">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
                <span>Created By:</span>
                <span className="text-indigo-600 flex items-center gap-1">
                  Archie
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                </span>
              </div>
            </div>
          </footer>
        </div>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
