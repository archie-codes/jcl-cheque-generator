"use client";

import { Facebook, Globe } from "lucide-react";
import { BankSelection } from "../components/bank-selection";
import Image from "next/image";

export default function HomePage() {
  return (
    // Changed: Removed py-12 from here so the header can sit at the top
    <div className="w-full">
      
      {/* NEW: Header with Logo and Nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          
          {/* UPDATED: Imported Image Logo */}
          <div className="relative h-8 w-8">
             <Image 
               src="/jcl-logo.png"
               alt="ChequePrint Logo" 
               fill // Automates width/height to fill the container
               className="object-contain" // Keeps aspect ratio
               priority // Loads image immediately since it's above the fold
             />
          </div>

          <span className="text-xl font-bold tracking-tight text-foreground">
            JC&L Proserve Inc.
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="https://www.facebook.com/jclproserveinc" className="hover:text-foreground transition-colors">
            <Facebook />
          </a>
          <a href="https://www.jclproserve.com/" className="hover:text-foreground transition-colors">
            <Globe />
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-8 pb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground text-center mb-4 tracking-tight text-balance">
            Printing Made Simple
          </h1>
          <p className="text-muted-foreground text-center text-lg max-w-xl mx-auto mb-12 text-pretty">
            Select your bank below to begin printing cheques with precision and
            security. Fast, reliable, and accurate.
          </p>
        </section>

        {/* Bank Selection */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Select Your Bank
            </h2>
          </div>
          <BankSelection />
        </section>
      </main>
    </div>
  );
}
