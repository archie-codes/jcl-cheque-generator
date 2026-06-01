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
  title: "JC&L Cheque Generator",
  description: "For Cheque Printing",
  icons: {
    icon: [
      {
        url: "/jcl-logo.svg",
        type: "image/svg+xml",
        sizes: "32x32",
      },
      {
        url: "/jcl-logo.svg",
        type: "image/svg+xml",
        sizes: "16x16",
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        {/* ── GLOBAL BACKGROUND ───────────────────────────────────────
          Multi-layer translucent light gradient system.
          Fixed so it stays in place while content scrolls.
          z-[-1] keeps it behind all page content.
        ──────────────────────────────────────────────────────────── */}

        {/* Layer 1: Base diagonal gradient */}
        <div
          className="fixed inset-0 z-[-1]"
          style={{
            background:
              "linear-gradient(145deg, #fafcff 0%, #f3f0ff 20%, #fdf4ff 40%, #fff8f0 65%, #f0faf8 85%, #f8faff 100%)",
          }}
        />

        {/* Layer 2: Soft radial orbs for depth and color */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* Indigo/violet — top-left */}
          <div
            className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(165,138,255,0.18) 0%, rgba(165,138,255,0) 65%)",
            }}
          />
          {/* Sky blue — top-right */}
          <div
            className="absolute -top-[10%] -right-[12%] w-[55vw] h-[55vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99,195,255,0.15) 0%, rgba(99,195,255,0) 65%)",
            }}
          />
          {/* Rose/pink — center-left */}
          <div
            className="absolute top-[30%] -left-[12%] w-[45vw] h-[55vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,161,200,0.13) 0%, rgba(255,161,200,0) 65%)",
            }}
          />
          {/* Amber/peach — center-right */}
          <div
            className="absolute top-[25%] -right-[8%] w-[42vw] h-[42vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,196,120,0.14) 0%, rgba(255,196,120,0) 65%)",
            }}
          />
          {/* Emerald/teal — bottom-center */}
          <div
            className="absolute bottom-[-10%] left-[15%] w-[65vw] h-[50vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(100,230,200,0.13) 0%, rgba(100,230,200,0) 65%)",
            }}
          />
          {/* Extra lavender — bottom-right */}
          <div
            className="absolute bottom-[-5%] -right-[10%] w-[45vw] h-[45vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(179,157,255,0.12) 0%, rgba(179,157,255,0) 65%)",
            }}
          />

          {/* Subtle dot-grid overlay for texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        {/* CONTENT WRAPPER
          Uses flex-col to push the footer to the bottom even if content is short.
        */}
        <div className="flex flex-col min-h-screen relative z-10">
          {/* Main Page Content */}
          <main className="flex-1">{children}</main>

          {/* FOOTER 
            Added glassmorphism (backdrop-blur) so it blends with the aurora background.
          */}
          <footer className="print:hidden border-t border-slate-200/60 bg-white/40 backdrop-blur-md mt-auto">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
                <span>Created By:</span>
                <a 
                  href="https://www.arccodetech.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 flex items-center gap-1 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Archie
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                </a>
              </div>
            </div>
          </footer>
        </div>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
