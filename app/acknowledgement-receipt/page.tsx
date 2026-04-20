"use client";

import { useState } from "react";
import { Printer, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AcknowledgementReceipt() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    pesos: "",
    pesosSentence: "",
    particulars: "",
    particularsAmount: "",
    preparedBy: "",
    preparedByPos: "",
    verifiedBy: "",
    verifiedByPos: "",
    auditedBy: "",
    auditedByPos: "",
    receivedBy: "",
    receivedByPos: "",
    cvNo: "",
    checkNo: "",
    bank: "AUB", // Default bank
    receiptNo: "0001",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      name: "",
      pesos: "",
      pesosSentence: "",
      particulars: "",
      particularsAmount: "",
      preparedBy: "",
      preparedByPos: "",
      verifiedBy: "",
      verifiedByPos: "",
      auditedBy: "",
      auditedByPos: "",
      receivedBy: "",
      receivedByPos: "",
      cvNo: "",
      checkNo: "",
      bank: "AUB",
      receiptNo: "0001",
    });
  };

  function numberToWordsSentence(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    if (!cleaned) return "";
    const num = Number.parseFloat(cleaned);
    if (isNaN(num)) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const toWords = (n: number): string => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) {
        const tensPart = tens[Math.floor(n / 10)];
        const onesPart = n % 10 ? " " + ones[n % 10] : "";
        return tensPart + onesPart;
      }
      if (n < 1000) {
        const hundredsPart = ones[Math.floor(n / 100)] + " Hundred";
        const remainder = n % 100 ? " " + toWords(n % 100) : "";
        return hundredsPart + remainder;
      }
      if (n < 1000000) {
        const thousandsPart = toWords(Math.floor(n / 1000)) + " Thousand";
        const remainder = n % 1000 ? " " + toWords(n % 1000) : "";
        return thousandsPart + remainder;
      }
      if (n < 1000000000) {
        const millionsPart = toWords(Math.floor(n / 1000000)) + " Million";
        const remainder = n % 1000000 ? " " + toWords(n % 1000000) : "";
        return millionsPart + remainder;
      }
      return "";
    };

    const [intPart, decPart = ""] = cleaned.split(".");
    const pesos = Number.parseInt(intPart, 10);
    const centavos = decPart.substring(0, 2).padEnd(2, "0");
    const words = toWords(pesos);

    if (Number.parseInt(centavos) === 0) {
      return `${words} Pesos Only`;
    }
    return `${words} Pesos and ${centavos}/100 Centavos`;
  }

  const handleAmountBlur = () => {
    const cleaned = formData.pesos.replace(/[^\d.]/g, "");
    if (!cleaned) return;
    const [rawInt = "0", rawDec = ""] = cleaned.split(".");
    const intWithCommas = Number(rawInt).toLocaleString("en-US");
    const decimal = "." + (rawDec + "00").slice(0, 2);
    const formatted = intWithCommas + decimal;

    updateField("pesos", formatted);
    updateField("pesosSentence", numberToWordsSentence(formatted));
    if (!formData.particularsAmount) {
      updateField("particularsAmount", formatted);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 print:bg-white text-black pb-20 print:pb-0">
      <style type="text/css" media="print">
        {`
          @page { size: portrait; margin: 10mm; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            background: white !important;
          }
          #printable-voucher {
            min-height: calc(100vh - 20mm);
            display: flex;
            flex-direction: column;
          }
          .particulars-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }
          .particulars-content {
            flex-grow: 1;
            display: grid;
          }
        `}
      </style>
      {/* Header */}
      <header className="print:hidden bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h1 className="font-semibold text-slate-900">
                  Acknowledgement Receipt
                </h1>
                <p className="text-xs text-slate-500">
                  Fill details directly on the form
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="gap-2 text-slate-600 hover:text-slate-900 border-slate-300 bg-white"
              >
                <RotateCcw className="h-4 w-4" /> Reset Form
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:max-w-none print:px-0 print:py-0 print:mx-0 print:w-full">
        <Card className="print:border-none print:shadow-none print:border-top-none overflow-hidden h-fit shadow-xl print:rounded-none bg-white">
          {/* VOUCHER PREVIEW / PRINT AREA */}
          <div
            className="bg-white p-8 md:p-14 print:px-8 print:py-0 text-black font-sans text-sm relative print:border-none print:shadow-none w-full mx-auto"
            id="printable-voucher"
          >
            {/* Header Image/Logo Section */}
            <div className="flex justify-between items-start mb-2 border-t-12 border-emerald-800 pt-6">
              <div className="flex items-center gap-4">
                <div className="h-[72px] w-[72px] relative flex items-center justify-center">
                  <span className="text-xs font-bold text-center">
                    <Image
                      src="/jcl-logo.png"
                      alt="Logo"
                      width={72}
                      height={72}
                    />
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-3xl font-extrabold text-blue-900 leading-none">
                    JC&L
                  </h2>
                  <p className="text-emerald-700 font-bold tracking-[0.2em] text-sm">
                    PROSERVE INC.
                  </p>
                </div>
              </div>
              <div className="text-right pt-2">
                <h1 className="text-lg font-bold uppercase text-slate-800 tracking-widest mb-1">
                  Acknowledgement Receipt
                </h1>
                <div className="flex justify-end items-center gap-2">
                  <span className="font-bold text-slate-600 text-sm tracking-widest uppercase mr-1">
                    No.
                  </span>
                  <div className="flex items-center text-red-600 text-lg font-bold tracking-wider">
                    <span>
                      {new Date().getFullYear().toString().slice(-2)}-
                      {(new Date().getMonth() + 1).toString().padStart(2, "0")}-
                    </span>
                    <input
                      className="w-16 bg-transparent focus:outline-none focus:bg-slate-50 transition-colors rounded placeholder:font-normal placeholder:text-slate-300 tracking-wider"
                      placeholder="0001"
                      maxLength={4}
                      value={formData.receiptNo}
                      onChange={(e) => updateField("receiptNo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Title Bar */}
            <div className="bg-slate-400 text-white text-center font-bold py-1.5 text-lg mb-8 uppercase tracking-widest mt-2 shadow-sm"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 mb-6">
              {/* Row 1 */}
              <div className="col-span-8 flex items-end border-b border-black pb-1 group">
                <span className="font-bold w-24 shrink-0">BILLED TO:</span>
                <input
                  className="w-full bg-transparent focus:outline-none focus:bg-slate-50 font-bold uppercase transition-colors px-1"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter Billed To"
                />
              </div>
              <div className="col-span-4 flex items-end border-b border-black pb-1 group">
                <span className="font-bold w-12 shrink-0">Date:</span>
                <input
                  type="date"
                  className="w-full bg-transparent focus:outline-none focus:bg-slate-50 text-center font-bold uppercase text-[14px] transition-colors px-1 cursor-pointer"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>

              {/* Row 2 */}
              <div className="col-span-8 flex items-end border-b border-black pb-1 group">
                <span className="font-bold w-28 shrink-0">THE SUM OF:</span>
                <input
                  className="w-full bg-transparent focus:outline-none focus:bg-slate-50 font-bold uppercase text-[14px] transition-colors px-1"
                  value={formData.pesosSentence}
                  onChange={(e) => updateField("pesosSentence", e.target.value)}
                  placeholder="Amount in words"
                />
              </div>
              <div className="col-span-4 flex items-end border-b border-black pb-1 group">
                <span className="font-bold w-12 shrink-0">Pesos:</span>
                <input
                  className="w-full bg-transparent focus:outline-none focus:bg-slate-50 font-bold text-lg text-center transition-colors px-1"
                  value={formData.pesos}
                  onChange={(e) => updateField("pesos", e.target.value)}
                  onBlur={handleAmountBlur}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Particulars Table */}
            <div className="border border-black mb-8 mt-6 print:grow flex flex-col">
              <div className="grid grid-cols-[1fr_14rem] border-b border-black bg-slate-50/50">
                <div className="font-bold text-center py-2 border-r border-black tracking-wider">
                  PARTICULARS
                </div>
                <div className="font-bold text-center py-2 tracking-wider">
                  AMOUNT
                </div>
              </div>
              <div className="grid grid-cols-[1fr_14rem] print:grow min-h-[250px]">
                <div className="border-r border-black p-0 group min-w-0">
                  <Textarea
                    className="w-full h-full min-h-[250px] border-none resize-none focus-visible:ring-0 focus-visible:bg-slate-50 text-base bg-transparent p-4 transition-colors rounded-none"
                    placeholder="Enter particulars here..."
                    value={formData.particulars}
                    onChange={(e) => updateField("particulars", e.target.value)}
                  />
                </div>
                <div className="p-0 group min-w-0">
                  <Textarea
                    className="w-full h-full min-h-[250px] border-none resize-none focus-visible:ring-0 focus-visible:bg-slate-50 text-center font-bold text-base bg-transparent p-4 transition-colors rounded-none"
                    value={formData.particularsAmount}
                    onChange={(e) =>
                      updateField("particularsAmount", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Footer Signatories */}
            <div className="border border-black mb-8 shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-black">
                {/* Col 1 */}
                <div className="p-3">
                  <div className="font-bold text-xs mb-8 text-slate-700">
                    Prepared by:
                  </div>
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 font-bold text-sm transition-colors rounded"
                    placeholder="Enter Name"
                    value={formData.preparedBy}
                    onChange={(e) => updateField("preparedBy", e.target.value)}
                  />
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 text-xs text-slate-600 mt-1 transition-colors rounded"
                    placeholder="Position"
                    value={formData.preparedByPos}
                    onChange={(e) =>
                      updateField("preparedByPos", e.target.value)
                    }
                  />
                </div>
                {/* Col 2 */}
                <div className="p-3">
                  <div className="font-bold text-xs mb-8 text-slate-700">
                    Verified by:
                  </div>
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 font-bold text-sm transition-colors rounded"
                    placeholder="Enter Name"
                    value={formData.verifiedBy}
                    onChange={(e) => updateField("verifiedBy", e.target.value)}
                  />
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 text-xs text-slate-600 mt-1 transition-colors rounded"
                    placeholder="Position"
                    value={formData.verifiedByPos}
                    onChange={(e) =>
                      updateField("verifiedByPos", e.target.value)
                    }
                  />
                </div>
                {/* Col 3 */}
                <div className="p-3">
                  <div className="font-bold text-xs mb-8 text-slate-700">
                    Received by:
                  </div>
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 font-bold text-sm transition-colors rounded"
                    placeholder="Enter Name"
                    value={formData.auditedBy}
                    onChange={(e) => updateField("auditedBy", e.target.value)}
                  />
                  <input
                    className="w-full bg-transparent text-center focus:outline-none focus:bg-slate-50 text-xs text-slate-600 mt-1 transition-colors rounded"
                    placeholder="Position"
                    value={formData.auditedByPos}
                    onChange={(e) =>
                      updateField("auditedByPos", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer Address */}
            <div className="text-center text-[10px] mt-10 flex justify-between px-2 text-slate-600 pb-2">
              <div className="text-left w-1/2 pr-4 leading-relaxed">
                <span className="font-bold text-slate-900">
                  Office Address:
                </span>{" "}
                Unit 203 2nd Floor Landmark Building, Kalayaan Village Service
                Road, Barangay Quebiauan, City of San Fernando Pampanga
              </div>
              <div className="text-right w-1/2 space-y-1.5">
                <div>
                  <span className="font-bold text-slate-900">
                    Contact Number:
                  </span>{" "}
                  (+63) 994 - 843 - 0972
                </div>
                <div>
                  <span className="font-bold text-slate-900">Website:</span>{" "}
                  www.jclproserve.com
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
