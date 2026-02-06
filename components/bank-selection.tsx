"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

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
  },
]

export function BankSelection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-8xl mx-auto bg-transparent">
      {banks.map((bank) => (
        <Link key={bank.id} href={bank.href} className="group">
          <div
            className={`relative bg-card rounded-2xl border-2 border-border ${bank.accentColor} transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${bank.tagColor}`}>{bank.name}</span>
            </div>

            {/* Cheque Image Container */}
            <div className="relative pt-14 px-6 pb-4">
              <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={bank.image || "/placeholder.svg"}
                  alt={`${bank.name} cheque sample`}
                  fill
                  className="object-fill group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-1">{bank.description}</h3>
                  <p className="text-sm text-muted-foreground">Click to select and print</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground transition-colors duration-300">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
