"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Printer,
  ArrowLeft,
  FileText,
  X,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

// PDF Generation Imports
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Shadcn Pagination Imports
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define the shape of our voucher data based on your SQL table
interface Voucher {
  id: number;
  cvNo: string;
  checkNo: string;
  payeeName: string;
  amount: string;
  checkDate: string;
  particulars: string;
  preparedBy: string;
  preparedByPos: string;
  verifiedBy: string;
  verifiedByPos: string;
  auditedBy: string;
  auditedByPos: string;
  receivedBy: string;
  receivedByPos: string;
  bank: string;
}

export default function VoucherHistory() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State to hold the voucher we want to reprint/download
  const [reprintVoucher, setReprintVoucher] = useState<Voucher | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/vouchers/history?search=${encodeURIComponent(search)}&page=${currentPage}&limit=${itemsPerPage}`,
      );
      if (res.ok) {
        const json = await res.json();
        setVouchers(json.data);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (val: string | number) => {
    const num = Number(val);
    return isNaN(num)
      ? "0.00"
      : num.toLocaleString("en-US", { minimumFractionDigits: 2 });
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
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000)
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + toWords(n % 100) : "")
        );
      if (n < 1_000_000)
        return (
          toWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + toWords(n % 1000) : "")
        );
      if (n < 1_000_000_000)
        return (
          toWords(Math.floor(n / 1_000_000)) +
          " Million" +
          (n % 1_000_000 ? " " + toWords(n % 1_000_000) : "")
        );
      return "";
    };

    const [intPart, decPart = ""] = cleaned.split(".");
    const pesos = Number.parseInt(intPart, 10);
    const centavos = decPart.substring(0, 2).padEnd(2, "0");
    const words = toWords(pesos);

    if (Number.parseInt(centavos) === 0) {
      return `${words} ${pesos === 1 ? "Peso" : "Pesos"} Only`;
    }
    return `${words} ${pesos === 1 ? "Peso" : "Pesos"} and ${centavos}/100 Centavos`;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  // --- PDF DOWNLOAD FUNCTION (Using html-to-image) ---
  const handleDownloadPDF = async () => {
    const element = document.getElementById("printable-voucher");
    if (!element) return;

    setIsDownloading(true);
    try {
      // Capture the DOM element as a high-quality PNG
      const dataUrl = await toPng(element, {
        pixelRatio: 2, // 2x scale for crisp text
        backgroundColor: "#ffffff", // Ensure background isn't transparent
      });

      // Create an A4 PDF in portrait mode
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      // We need an image object to get the dimensions of the generated PNG
      const img = new window.Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdfHeight = (img.height * pdfWidth) / img.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${reprintVoucher?.cvNo || "Voucher"}.pdf`);
        setIsDownloading(false);
      };
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 print:bg-white">
      {/* Header hidden during print */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/40 sticky top-0 z-20 print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/aub">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cheque Filler
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <FileText className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">
                  Voucher History
                </h1>
                <p className="text-xs text-slate-500">JC&L Proserve Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content hidden during print */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 print:hidden">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Payee, CV No, or Check No..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    CV No.
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Check No.
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Payee
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Amount
                  </TableHead>
                  <TableHead className="text-center font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Search className="h-4 w-4 animate-pulse" />
                        Loading records...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : vouchers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-slate-500"
                    >
                      No vouchers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers.map((v, index) => (
                    <TableRow
                      key={v.id}
                      className="hover:bg-slate-50 transition-colors animate-pop-in"
                      style={{
                        // This multiplies the index by 50ms to create the "waterfall" stagger effect!
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <TableCell className="font-mono font-medium text-emerald-700">
                        {v.cvNo || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-slate-600">
                        {v.checkNo || "-"}
                      </TableCell>
                      <TableCell>
                        {v.checkDate
                          ? format(new Date(v.checkDate), "MMM dd, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="uppercase font-medium text-slate-800">
                        {v.payeeName}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-slate-900">
                        ₱{formatAmount(v.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Reprint Voucher"
                          onClick={() => setReprintVoucher(v)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* SHADCN PAGINATION FOOTER */}
            {!isLoading && totalPages > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
                <div className="text-sm text-slate-500 hidden sm:block">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>

                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, idx) => (
                      <PaginationItem key={idx}>
                        {pageNum === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNum}
                            onClick={(
                              e: React.MouseEvent<HTMLAnchorElement>,
                            ) => {
                              e.preventDefault();
                              setCurrentPage(pageNum as number);
                            }}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage((p) => p + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* REPRINT MODAL */}
      <Dialog
        open={!!reprintVoucher}
        onOpenChange={(open) => {
          if (!open) setReprintVoucher(null);
        }}
      >
        <DialogContent className="sm:max-w-[1200px] max-w-[1200px]! w-full max-h-[95vh] overflow-y-auto print:max-w-none print:w-full print:h-screen print:max-h-none print:p-0 print:border-none print:shadow-none [&>button.absolute]:hidden">
          {/* Header Controls */}
          <div className="print:hidden flex justify-between items-center sticky -top-6 -mx-6 px-6 z-50 bg-white pt-6 pb-4 mb-4 border-b border-slate-200">
            <DialogHeader>
              <DialogTitle>Reprint Voucher: {reprintVoucher?.cvNo}</DialogTitle>
              <DialogDescription>
                Verify the historical details and print or download.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              {/* NEW DOWNLOAD BUTTON */}
              <Button
                size="sm"
                variant="outline"
                disabled={isDownloading}
                onClick={handleDownloadPDF}
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download PDF
              </Button>

              <Button
                size="sm"
                onClick={() => window.print()}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Voucher
              </Button>

              <div className="ml-2 pl-2 border-l border-slate-300">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>

          {/* VOUCHER PRINT AREA (Only renders if reprintVoucher exists) */}
          {reprintVoucher && (
            <div
              className="bg-white p-8 text-black font-sans text-sm relative border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0 w-full mx-auto"
              id="printable-voucher"
            >
              {/* Header Logo */}
              <div className="flex justify-between items-start mb-2 border-t-10 border-emerald-800 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 relative flex items-center justify-center">
                    <span className="text-xs font-bold text-center">
                      <Image
                        src="/jcl-logo.png"
                        alt="Logo"
                        width={64}
                        height={64}
                      />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-800 leading-none">
                      JC&L
                    </h2>
                    <p className="text-emerald-700 font-semibold tracking-widest text-sm">
                      PROSERVE INC.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="bg-gray-400 text-white text-center font-bold py-1 text-lg mb-6 uppercase tracking-widest">
                Check Voucher
              </div>

              {/* Details */}
              <div className="grid grid-cols-12 gap-x-4 gap-y-6 mb-4">
                <div className="col-span-8 flex items-end border-b border-black pb-1">
                  <span className="font-bold w-24 shrink-0">PAY TO:</span>
                  <span className="font-medium uppercase">
                    {reprintVoucher.payeeName}
                  </span>
                </div>
                <div className="col-span-4 flex items-end border-b border-black pb-1">
                  <span className="font-bold w-12 shrink-0">Date:</span>
                  <span className="font-medium uppercase text-m w-full text-center">
                    {reprintVoucher.checkDate
                      ? format(
                          new Date(reprintVoucher.checkDate),
                          "MMMM dd, yyyy",
                        )
                      : ""}
                  </span>
                </div>
                <div className="col-span-8 flex items-end border-b border-black pb-1">
                  <span className="font-bold w-24 shrink-0">THE SUM OF:</span>
                  <span className="font-medium uppercase text-m">
                    {numberToWordsSentence(reprintVoucher.amount)}
                  </span>
                </div>
                <div className="col-span-4 flex items-end border-b border-black pb-1">
                  <span className="font-bold w-12 shrink-0">Pesos:</span>
                  <span className="font-bold text-lg w-full text-center">
                    {formatAmount(reprintVoucher.amount)}
                  </span>
                </div>
              </div>

              {/* Particulars Table */}
              <div className="border-2 border-black mb-6 mt-6">
                <div className="flex border-b-2 border-black">
                  <div className="flex-1 font-bold text-center py-1 border-r-2 border-black">
                    PARTICULARS
                  </div>
                  <div className="w-48 font-bold text-center py-1">AMOUNT</div>
                </div>
                <div className="flex min-h-[300px]">
                  <div className="flex-1 border-r-2 border-black p-2 whitespace-pre-wrap">
                    {reprintVoucher.particulars}
                  </div>
                  <div className="w-48 p-2 text-center font-medium">
                    {formatAmount(reprintVoucher.amount)}
                  </div>
                </div>
              </div>

              {/* Footer Signatories */}
              <div className="border border-black mb-6">
                <div className="grid grid-cols-3 divide-x divide-black">
                  {/* Col 1 */}
                  <div className="p-1 text-center">
                    <div className="font-bold text-xs mb-8 text-left">
                      Prepared by:
                    </div>
                    <div className="font-medium text-sm">
                      {reprintVoucher.preparedBy || "\u00A0"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {reprintVoucher.preparedByPos || "\u00A0"}
                    </div>
                  </div>
                  {/* Col 2 */}
                  <div className="p-1 text-center">
                    <div className="font-bold text-xs mb-8 text-left">
                      Verified by:
                    </div>
                    <div className="font-medium text-sm">
                      {reprintVoucher.verifiedBy || "\u00A0"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {reprintVoucher.verifiedByPos || "\u00A0"}
                    </div>
                  </div>
                  {/* Col 3 */}
                  <div className="p-1 text-center">
                    <div className="font-bold text-xs mb-8 text-left">
                      Audited by:
                    </div>
                    <div className="font-medium text-sm">
                      {reprintVoucher.auditedBy || "\u00A0"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {reprintVoucher.auditedByPos || "\u00A0"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-black border-t border-black">
                  {/* Col 1 */}
                  <div className="p-1">
                    <div className="font-bold text-xs mb-6">
                      Approved for payment
                    </div>
                    <div className="text-center font-bold uppercase text-sm">
                      LOUIE P. MAGLALANG
                    </div>
                    <div className="text-center text-xs">General Manager</div>
                  </div>
                  {/* Col 2 */}
                  <div className="p-1 text-center">
                    <div className="font-bold text-xs mb-8 text-left">
                      Payment Received by:
                    </div>
                    <div className="font-medium text-sm">
                      {reprintVoucher.receivedBy || "\u00A0"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {reprintVoucher.receivedByPos || "\u00A0"}
                    </div>
                  </div>
                  {/* Col 3 - CV Info */}
                  <div className="p-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">CV No.</span>
                      <span className="font-medium">{reprintVoucher.cvNo}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Check No.</span>
                      <span className="font-medium">
                        {reprintVoucher.checkNo}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Bank:</span>
                      <span className="font-medium">{reprintVoucher.bank}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Address */}
              <div className="text-center text-[10px] mt-8 flex justify-between px-4">
                <div className="text-left w-1/3">
                  <span className="font-bold">Office Address:</span> Unit 203
                  2nd Floor Landmark Building, Kalayaan Village Service Road,
                  Barangay Quebiauan, City of San Fernando Pampanga
                </div>
                <div className="text-right w-1/3 space-y-1">
                  <div>
                    <span className="font-bold">Contact Number:</span> (+63) 994
                    - 843 - 0972
                  </div>
                  <div>
                    <span className="font-bold">Website:</span>{" "}
                    www.jclproserve.com
                  </div>
                </div>
              </div>
            </div>
          )}

          <style>{`
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: auto; margin: 10mm; }
              body * { visibility: hidden; }
              #printable-voucher, #printable-voucher * { visibility: visible; }
              #printable-voucher {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </div>
  );
}
