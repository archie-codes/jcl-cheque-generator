"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const banks = [
  {
    id: "aub",
    name: "AUB",
    description: "AUB Cheque",
    href: "/aub",
    image: "/aub.jpg",
    accentColor: "hover:border-[#c41e3a]",
    tagColor: "bg-[#fdf2f4] text-[#c41e3a]",
  },
  {
    id: "bpi",
    name: "BPI",
    description: "BPI Cheque",
    href: "/bpi",
    image: "/bpi.jpg",
    accentColor: "hover:border-[#c41e3a]",
    tagColor: "bg-[#fdf2f4] text-[#c41e3a]",
    underDevelopment: true,
  },
  // {
  //   id: "acknowledgement-receipt",
  //   name: "ACKNOWLEDGEMENT RECEIPT",
  //   description: "Acknowledgement Receipt",
  //   href: "/acknowledgement-receipt",
  //   image: "/jcl-logo.png",
  //   accentColor: "hover:border-[#059669]",
  //   tagColor: "bg-[#ecfdf5] text-[#059669]",
  // },
];

export function BankSelection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-8xl mx-auto bg-transparent">
      {banks.map((bank) => {
        const isDisabled = !!bank.underDevelopment;
        const Wrapper = isDisabled
          ? ({ children }: { children: React.ReactNode }) => (
              <div className="group cursor-not-allowed select-none">{children}</div>
            )
          : ({ children }: { children: React.ReactNode }) => (
              <Link href={bank.href} className="group">{children}</Link>
            );

        return (
          <Wrapper key={bank.id}>
            <div
              className={`relative bg-card rounded-2xl border-2 border-border transition-all duration-300 overflow-hidden ${
                isDisabled
                  ? "border-border"
                  : `${bank.accentColor} hover:shadow-xl hover:-translate-y-1`
              }`}
            >
              {/* Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${bank.tagColor}`}>
                  {bank.name}
                </span>
              </div>

              {/* Under Development badge */}
              {isDisabled && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 border border-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-700 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                    Under Development
                  </span>
                </div>
              )}

              {/* Cheque Image Container */}
              <div className="relative pt-14 px-6 pb-4">
                <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-lg shadow-lg transition-shadow duration-300">
                  {/* Always show the image */}
                  <Image
                    src={bank.image || "/placeholder.svg"}
                    alt={`${bank.name} cheque sample`}
                    fill
                    className={`object-fill transition-transform duration-500 ${
                      isDisabled ? "blur-[1px] brightness-90" : "group-hover:scale-[1.02]"
                    }`}
                  />

                  {/* Frosted overlay for under-development cards */}
                  {isDisabled && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/30 backdrop-blur-[2px]">
                      <svg className="w-7 h-7 text-amber-600/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.65-4.652 3.013-2.498a1.5 1.5 0 0 0-1.086-2.714L9.586 8.07" />
                      </svg>
                      <span className="text-xs font-bold text-amber-700/90 tracking-wider uppercase">Work in Progress</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-1">
                      {bank.description}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isDisabled ? "Currently unavailable" : "Click to select and print"}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors duration-300 ${
                    isDisabled ? "opacity-40" : "group-hover:bg-foreground"
                  }`}>
                    <ArrowRight className={`w-5 h-5 text-muted-foreground transition-colors duration-300 ${
                      isDisabled ? "" : "group-hover:text-background"
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
