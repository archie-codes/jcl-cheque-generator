// "use client";

// import type React from "react";
// import { useRef, useState, useEffect } from "react";
// import {
//   Printer,
//   RotateCcw,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   Calendar as CalendarIcon,
//   User,
//   DollarSign,
//   FileText,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { Plus } from "lucide-react";

// export default function BDOChequeFiller() {
//   const [showTemplate, setShowTemplate] = useState(true);
//   const [formData, setFormData] = useState<Record<string, string>>({
//     month1: "",
//     month2: "",
//     day1: "",
//     day2: "",
//     year1: "",
//     year2: "",
//     year3: "",
//     year4: "",
//     name: "",
//     pesos: "",
//     pesosSentece: "",
//   });
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [payees, setPayees] = useState<Array<{ id: number; name: string }>>([]);
//   const [newPayee, setNewPayee] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isLoadingPayees, setIsLoadingPayees] = useState(false);
//   const [isAddingPayee, setIsAddingPayee] = useState(false);

//   useEffect(() => {
//     async function loadPayees() {
//       setIsLoadingPayees(true);
//       try {
//         const res = await fetch("/api/payees");
//         const data = await res.json();
//         setPayees(data);
//       } catch (error) {
//         console.error("Failed to load payees:", error);
//       } finally {
//         setIsLoadingPayees(false);
//       }
//     }
//     loadPayees();
//   }, []);

//   const handleAddPayee = async () => {
//     if (!newPayee.trim()) return;

//     setIsAddingPayee(true);
//     try {
//       const res = await fetch("/api/payees", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newPayee.trim() }),
//       });

//       if (res.ok) {
//         const newPayeeData = await res.json();
//         setPayees((prev) =>
//           [...prev, newPayeeData].sort((a, b) => a.name.localeCompare(b.name))
//         );
//         setNewPayee("");
//         setIsDialogOpen(false);
//         // Optionally set the new payee as the selected payee
//         updateField("name", newPayeeData.name);
//       } else {
//         const error = await res.json();
//         alert(error.error || "Failed to add payee");
//       }
//     } catch (error) {
//       console.error("Failed to add payee:", error);
//       alert("Failed to add payee. Please try again.");
//     } finally {
//       setIsAddingPayee(false);
//       toast.success("Payee added successfully!", {
//         className: "!bg-indigo-500 !text-white",
//       });
//     }
//   };

//   const updateField = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetForm = () => {
//     const emptyData = Object.keys(formData).reduce((acc, key) => {
//       acc[key] = "";
//       return acc;
//     }, {} as Record<string, string>);
//     setFormData(emptyData);
//     setSelectedDate(undefined);
//   };

//   const handleDateSelect = (date?: Date) => {
//     setSelectedDate(date ?? undefined);
//     if (!date) {
//       setFormData((prev) => ({
//         ...prev,
//         month1: "",
//         month2: "",
//         day1: "",
//         day2: "",
//         year1: "",
//         year2: "",
//         year3: "",
//         year4: "",
//       }));
//       return;
//     }

//     const formatted = format(date, "MMddyyyy");
//     setFormData((prev) => ({
//       ...prev,
//       month1: formatted[0] ?? "",
//       month2: formatted[1] ?? "",
//       day1: formatted[2] ?? "",
//       day2: formatted[3] ?? "",
//       year1: formatted[4] ?? "",
//       year2: formatted[5] ?? "",
//       year3: formatted[6] ?? "",
//       year4: formatted[7] ?? "",
//     }));
//   };

//   function formatNumberOnBlur(value: string) {
//     const cleaned = (value ?? "").replace(/[^\d.]/g, "");
//     if (!cleaned) return "0.00";

//     const [rawInt = "0", rawDec = ""] = cleaned.split(".");

//     // No padStart so high amounts like 10,000,000 work
//     const intWithCommas = Number(rawInt).toLocaleString("en-US");

//     const decimal = "." + (rawDec + "00").slice(0, 2);

//     return intWithCommas + decimal;
//   }

//   function numberToWordsSentence(value: string) {
//     const cleaned = value.replace(/[^\d.]/g, "");
//     if (!cleaned) return "";
//     const num = Number.parseFloat(cleaned);
//     if (isNaN(num)) return "";

//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//     ];
//     const teens = [
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const toWords = (n: number): string => {
//       if (n < 10) return ones[n];
//       if (n < 20) return teens[n - 10];
//       if (n < 100) {
//         const tensPart = tens[Math.floor(n / 10)];
//         const onesPart = n % 10 ? " " + ones[n % 10] : "";
//         return tensPart + onesPart;
//       }
//       if (n < 1000) {
//         const hundredsPart = ones[Math.floor(n / 100)] + " Hundred";
//         const remainder = n % 100 ? " " + toWords(n % 100) : "";
//         return hundredsPart + remainder;
//       }
//       if (n < 1_000_000) {
//         const thousandsPart = toWords(Math.floor(n / 1000)) + " Thousand";
//         const remainder = n % 1000 ? " " + toWords(n % 1000) : "";
//         return thousandsPart + remainder;
//       }
//       if (n < 1_000_000_000) {
//         const millionsPart = toWords(Math.floor(n / 1_000_000)) + " Million";
//         const remainder = n % 1_000_000 ? " " + toWords(n % 1_000_000) : "";
//         return millionsPart + remainder;
//       }
//       return "";
//     };

//     const [intPart, decPart = ""] = cleaned.split(".");
//     const pesos = Number.parseInt(intPart, 10);
//     const centavos = decPart.substring(0, 2).padEnd(2, "0");
//     const words = toWords(pesos);

//     if (Number.parseInt(centavos) === 0) {
//       return `${words} Pesos Only`;
//     }
//     return `${words} Pesos and ${centavos}/100 Centavos`;
//   }

//   const refs = {
//     month1: useRef<HTMLInputElement>(null),
//     month2: useRef<HTMLInputElement>(null),
//     day1: useRef<HTMLInputElement>(null),
//     day2: useRef<HTMLInputElement>(null),
//     year1: useRef<HTMLInputElement>(null),
//     year2: useRef<HTMLInputElement>(null),
//     year3: useRef<HTMLInputElement>(null),
//     year4: useRef<HTMLInputElement>(null),
//   };

//   const handleDigit = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: keyof typeof formData,
//     next?: React.RefObject<HTMLInputElement | null>
//   ) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 1);
//     updateField(field, value);
//     if (value && next?.current) {
//       // Use setTimeout to ensure the value is set before focusing
//       setTimeout(() => {
//         next.current?.focus();
//       }, 0);
//     }
//   };

//   const handlePayeeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.currentTarget.blur();
//     }
//   };

//   const handleAmountEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const formatted = formatNumberOnBlur(formData.pesos);
//       updateField("pesos", formatted);
//       const sentence = numberToWordsSentence(formatted);
//       updateField("pesosSentece", sentence);
//       // Blur the input to show the formatted value
//       e.currentTarget.blur();
//     }
//   };

//   const dateDisplay = `${formData.month1}${formData.month2}/${formData.day1}${formData.day2}/${formData.year1}${formData.year2}${formData.year3}${formData.year4}`;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 print:bg-white">
//       {/* Header */}
//       <header className="print:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
//         <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <Link href="/">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="gap-2 text-slate-600 hover:text-slate-900"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back
//                 </Button>
//               </Link>
//               <Separator orientation="vertical" className="h-6" />
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
//                   <span className="text-white font-bold text-xs">BDO</span>
//                 </div>
//                 <div>
//                   <h1 className="font-semibold text-slate-900">
//                     BDO Cheque Filler
//                   </h1>
//                   <p className="text-xs text-slate-500">Banco de Oro</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowTemplate(!showTemplate)}
//                 className="gap-2"
//               >
//                 {showTemplate ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//                 <span className="hidden sm:inline">
//                   {showTemplate ? "Hide" : "Show"} Template
//                 </span>
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={resetForm}
//                 className="gap-2 bg-transparent"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 <span className="hidden sm:inline">Reset</span>
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={() => window.print()}
//                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 <Printer className="h-4 w-4" />
//                 <span className="hidden sm:inline">Print</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 print:p-0">
//         <div className="flex flex-col xl:flex-row gap-6 print:block">
//           {/* Form Panel */}
//           <div className="w-full xl:w-96 shrink-0 print:hidden">
//             <Card className="sticky top-24 shadow-sm border-slate-200">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <FileText className="h-5 w-5 text-blue-600" />
//                   Cheque Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Date Section */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <CalendarIcon className="h-4 w-4 text-slate-400" />
//                     Date
//                   </Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal",
//                           !selectedDate && "text-slate-400"
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {selectedDate ? (
//                           format(selectedDate, "MM/dd/yyyy")
//                         ) : (
//                           <span>Select a date</span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={handleDateSelect}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 <Separator />

//                 {/* Payee Name */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <User className="h-4 w-4 text-slate-400" />
//                     Pay to the Order of
//                   </Label>
//                   <div className="flex gap-2">
//                     <Input
//                       value={formData.name}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       onKeyDown={handlePayeeEnter}
//                       placeholder="Enter payee name"
//                       className="h-10 flex-1"
//                       list="payees-list"
//                     />
//                     <datalist id="payees-list">
//                       {payees.map((payee) => (
//                         <option key={payee.id} value={payee.name} />
//                       ))}
//                     </datalist>
//                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon"
//                           className="h-10 w-10 shrink-0"
//                           title="Add new payee"
//                         >
//                           <Plus className="h-4 w-4" />
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Add New Payee</DialogTitle>
//                           <DialogDescription>
//                             Add a new payee to your database for quick
//                             selection.
//                           </DialogDescription>
//                         </DialogHeader>
//                         <div className="space-y-4 py-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="new-payee-name">Payee Name</Label>
//                             <Input
//                               id="new-payee-name"
//                               value={newPayee}
//                               onChange={(e) => setNewPayee(e.target.value)}
//                               placeholder="Enter payee name"
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                   e.preventDefault();
//                                   handleAddPayee();
//                                 }
//                               }}
//                               autoFocus
//                             />
//                           </div>
//                         </div>
//                         <DialogFooter>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => {
//                               setIsDialogOpen(false);
//                               setNewPayee("");
//                             }}
//                             disabled={isAddingPayee}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             type="button"
//                             onClick={handleAddPayee}
//                             disabled={!newPayee.trim() || isAddingPayee}
//                           >
//                             {isAddingPayee ? "Adding..." : "Add Payee"}
//                           </Button>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Amount */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <DollarSign className="h-4 w-4 text-slate-400" />
//                     Amount (PHP)
//                   </Label>
//                   <Input
//                     value={formData.pesos}
//                     onChange={(e) => updateField("pesos", e.target.value)}
//                     onKeyDown={handleAmountEnter}
//                     onBlur={(e) => {
//                       const formatted = formatNumberOnBlur(e.target.value);
//                       updateField("pesos", formatted);
//                       const sentence = numberToWordsSentence(formatted);
//                       updateField("pesosSentece", sentence);
//                     }}
//                     placeholder="0.00"
//                     className="h-10 font-mono text-lg"
//                   />
//                   {formData.pesosSentece && (
//                     <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border">
//                       {formData.pesosSentece}
//                     </p>
//                   )}
//                 </div>

//                 {/* Quick Summary */}
//                 {(formData.name || formData.pesos) && (
//                   <>
//                     <Separator />
//                     <div className="bg-blue-50 rounded-lg p-3 space-y-2">
//                       <p className="text-xs font-medium text-blue-700">
//                         Summary
//                       </p>
//                       {formData.name && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Payee:</span>{" "}
//                           {formData.name}
//                         </p>
//                       )}
//                       {formData.pesos && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Amount:</span> PHP{" "}
//                           {formData.pesos}
//                         </p>
//                       )}
//                       {dateDisplay.replace(/\//g, "") && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Date:</span>{" "}
//                           {dateDisplay}
//                         </p>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Cheque Preview */}
//           <div className="flex-1 print:w-full">
//             <div className="print:hidden mb-4">
//               <h2 className="text-sm font-medium text-slate-600">
//                 Cheque Preview
//               </h2>
//               <p className="text-xs text-slate-400">
//                 Fill in the form on the left to see your cheque
//               </p>
//             </div>

//             <div className="flex justify-center xl:justify-start print:justify-start print:absolute print:top-0 print:left-0">
//               <div
//                 className="bg-white shadow-xl rounded-lg overflow-hidden relative print:shadow-none print:rounded-none"
//                 id="cheque-container"
//                 style={{
//                   width: "205mm",
//                   height: "76mm",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 {/* Background Template Image */}
//                 {showTemplate && (
//                   <div
//                     className="absolute inset-0 print:hidden pointer-events-none"
//                     style={{ width: "205mm", height: "76mm" }}
//                   >
//                     <Image
//                       src="/template/bdo_cheque_scan.jpg"
//                       alt="Template Background"
//                       width={775}
//                       height={287}
//                       className="w-full h-full opacity-50 relative"
//                       style={{ objectFit: "fill" }}
//                     />
//                   </div>
//                 )}

//                 {/* Fillable Fields */}
//                 <div className="relative" style={{ padding: "9.52mm 3.27mm" }}>
//                   {/* Date Fields */}
//                   <div
//                     className="absolute"
//                     style={{ top: "11.7mm", right: "11.4mm" }}
//                   >
//                     <div className="flex items-baseline gap-0">
//                       {[
//                         {
//                           ref: refs.month1,
//                           field: "month1",
//                           next: refs.month2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.month2,
//                           field: "month2",
//                           next: refs.day1,
//                           mr: "2.2mm",
//                         },
//                         {
//                           ref: refs.day1,
//                           field: "day1",
//                           next: refs.day2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.day2,
//                           field: "day2",
//                           next: refs.year1,
//                           mr: "2.2mm",
//                         },
//                         {
//                           ref: refs.year1,
//                           field: "year1",
//                           next: refs.year2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year2,
//                           field: "year2",
//                           next: refs.year3,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year3,
//                           field: "year3",
//                           next: refs.year4,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year4,
//                           field: "year4",
//                           next: undefined,
//                           mr: "0.08mm",
//                         },
//                       ].map((item, i) => (
//                         <input
//                           key={i}
//                           ref={item.ref}
//                           value={formData[item.field]}
//                           inputMode="numeric"
//                           maxLength={1}
//                           pattern="[0-9]*"
//                           onChange={(e) =>
//                             handleDigit(
//                               e,
//                               item.field as keyof typeof formData,
//                               item.next
//                             )
//                           }
//                           className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                           style={{
//                             fontSize: "11pt",
//                             width: "4.6mm",
//                             marginRight: item.mr,
//                           }}
//                           disabled
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   {/* Name Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-7mm", left: "27mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={"***" + formData.name + "***"}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "115mm" }}
//                       disabled
//                     />
//                   </div>

//                   {/* Pesos Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-7mm", right: "24.5mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={formData.pesos}
//                       onChange={(e) => updateField("pesos", e.target.value)}
//                       onBlur={(e) => {
//                         const formatted = formatNumberOnBlur(e.target.value);
//                         updateField("pesos", formatted);
//                         const sentence = numberToWordsSentence(formatted);
//                         updateField("pesosSentece", sentence);
//                       }}
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "30mm" }}
//                       disabled
//                     />
//                   </div>

//                   {/* Pesos in Words Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-15mm", left: "18mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={"***" + formData.pesosSentece + "***"}
//                       onChange={(e) =>
//                         updateField("pesosSentece", e.target.value)
//                       }
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "180mm" }}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 {/* Print styles */}
//                 <style>{`
//                   @media print {
//                     body { margin: 0; padding: 0; }
//                     @page { size: 205mm 76mm; margin: 0; }
//                     input { 
//                       font-family: Arial, sans-serif !important;
//                       color: black !important;
//                     }
//                   }
//                 `}</style>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }




// "use client";

// import { useRef, useState, useEffect } from "react";
// import {
//   Printer,
//   RotateCcw,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   Calendar as CalendarIcon,
//   User,
//   DollarSign,
//   FileText,
//   Search,
//   Check,
//   Plus,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";

// export default function BDOChequeFiller() {
//   const [showTemplate, setShowTemplate] = useState(true);
//   const [formData, setFormData] = useState<Record<string, string>>({
//     month1: "",
//     month2: "",
//     day1: "",
//     day2: "",
//     year1: "",
//     year2: "",
//     year3: "",
//     year4: "",
//     name: "",
//     pesos: "",
//     pesosSentece: "",
//   });
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

//   // --- Payee Logic State ---
//   const [payees, setPayees] = useState<Array<{ id: number; name: string }>>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // "Add Mode" states inside the dialog
//   const [viewMode, setViewMode] = useState<"list" | "add">("list"); 
//   const [newPayeeName, setNewPayeeName] = useState("");
//   const [isAddingPayee, setIsAddingPayee] = useState(false);

//   useEffect(() => {
//     async function loadPayees() {
//       try {
//         const res = await fetch("/api/payees");
//         const data = await res.json();
//         setPayees(data);
//       } catch (error) {
//         console.error("Failed to load payees:", error);
//       }
//     }
//     loadPayees();
//   }, []);

//   // Filter logic
//   const filteredPayees = payees.filter((payee) =>
//     payee.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // 1. Select existing payee
//   const handleSelectPayee = (name: string) => {
//     updateField("name", name);
//     closeDialog();
//   };

//   // 2. Add new payee API call
//   const handleAddPayee = async () => {
//     if (!newPayeeName.trim()) return;

//     setIsAddingPayee(true);
//     try {
//       const res = await fetch("/api/payees", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newPayeeName.trim() }),
//       });

//       if (res.ok) {
//         const newPayeeData = await res.json();
//         // Update local list and sort
//         setPayees((prev) =>
//           [...prev, newPayeeData].sort((a, b) => a.name.localeCompare(b.name))
//         );
//         // Select the new payee
//         updateField("name", newPayeeData.name);
        
//         toast.success("Payee added successfully!", {
//           className: "!bg-indigo-500 !text-white",
//         });
//         closeDialog();
//       } else {
//         const error = await res.json();
//         alert(error.error || "Failed to add payee");
//       }
//     } catch (error) {
//       console.error("Failed to add payee:", error);
//       alert("Failed to add payee. Please try again.");
//     } finally {
//       setIsAddingPayee(false);
//     }
//   };

//   // Helper to reset dialog state
//   const closeDialog = () => {
//     setIsDialogOpen(false);
//     setSearchTerm("");
//     setNewPayeeName("");
//     setViewMode("list");
//   };

//   // Switch to Add Mode
//   const switchToAddMode = () => {
//     setNewPayeeName(searchTerm);
//     setViewMode("add");
//   };

//   const updateField = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetForm = () => {
//     const emptyData = Object.keys(formData).reduce((acc, key) => {
//       acc[key] = "";
//       return acc;
//     }, {} as Record<string, string>);
//     setFormData(emptyData);
//     setSelectedDate(undefined);
//   };

//   const handleDateSelect = (date?: Date) => {
//     setSelectedDate(date ?? undefined);
//     if (!date) {
//       setFormData((prev) => ({
//         ...prev,
//         month1: "",
//         month2: "",
//         day1: "",
//         day2: "",
//         year1: "",
//         year2: "",
//         year3: "",
//         year4: "",
//       }));
//       return;
//     }

//     const formatted = format(date, "MMddyyyy");
//     setFormData((prev) => ({
//       ...prev,
//       month1: formatted[0] ?? "",
//       month2: formatted[1] ?? "",
//       day1: formatted[2] ?? "",
//       day2: formatted[3] ?? "",
//       year1: formatted[4] ?? "",
//       year2: formatted[5] ?? "",
//       year3: formatted[6] ?? "",
//       year4: formatted[7] ?? "",
//     }));
//   };

//   function formatNumberOnBlur(value: string) {
//     const cleaned = (value ?? "").replace(/[^\d.]/g, "");
//     if (!cleaned) return "0.00";

//     const [rawInt = "0", rawDec = ""] = cleaned.split(".");

//     // No padStart so high amounts like 10,000,000 work
//     const intWithCommas = Number(rawInt).toLocaleString("en-US");

//     const decimal = "." + (rawDec + "00").slice(0, 2);

//     return intWithCommas + decimal;
//   }

//   function numberToWordsSentence(value: string) {
//     const cleaned = value.replace(/[^\d.]/g, "");
//     if (!cleaned) return "";
//     const num = Number.parseFloat(cleaned);
//     if (isNaN(num)) return "";

//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//     ];
//     const teens = [
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const toWords = (n: number): string => {
//       if (n < 10) return ones[n];
//       if (n < 20) return teens[n - 10];
//       if (n < 100) {
//         const tensPart = tens[Math.floor(n / 10)];
//         const onesPart = n % 10 ? " " + ones[n % 10] : "";
//         return tensPart + onesPart;
//       }
//       if (n < 1000) {
//         const hundredsPart = ones[Math.floor(n / 100)] + " Hundred";
//         const remainder = n % 100 ? " " + toWords(n % 100) : "";
//         return hundredsPart + remainder;
//       }
//       if (n < 1_000_000) {
//         const thousandsPart = toWords(Math.floor(n / 1000)) + " Thousand";
//         const remainder = n % 1000 ? " " + toWords(n % 1000) : "";
//         return thousandsPart + remainder;
//       }
//       if (n < 1_000_000_000) {
//         const millionsPart = toWords(Math.floor(n / 1_000_000)) + " Million";
//         const remainder = n % 1_000_000 ? " " + toWords(n % 1_000_000) : "";
//         return millionsPart + remainder;
//       }
//       return "";
//     };

//     const [intPart, decPart = ""] = cleaned.split(".");
//     const pesos = Number.parseInt(intPart, 10);
//     const centavos = decPart.substring(0, 2).padEnd(2, "0");
//     const words = toWords(pesos);

//     if (Number.parseInt(centavos) === 0) {
//       return `${words} Pesos Only`;
//     }
//     return `${words} Pesos and ${centavos}/100 Centavos`;
//   }

//   const refs = {
//     month1: useRef<HTMLInputElement>(null),
//     month2: useRef<HTMLInputElement>(null),
//     day1: useRef<HTMLInputElement>(null),
//     day2: useRef<HTMLInputElement>(null),
//     year1: useRef<HTMLInputElement>(null),
//     year2: useRef<HTMLInputElement>(null),
//     year3: useRef<HTMLInputElement>(null),
//     year4: useRef<HTMLInputElement>(null),
//   };

//   const handleDigit = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: keyof typeof formData,
//     next?: React.RefObject<HTMLInputElement | null>
//   ) => {
//     const value = e.target.value.replace(/\D/g, "").slice(0, 1);
//     updateField(field, value);
//     if (value && next?.current) {
//       // Use setTimeout to ensure the value is set before focusing
//       setTimeout(() => {
//         next.current?.focus();
//       }, 0);
//     }
//   };

//   const handlePayeeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.currentTarget.blur();
//     }
//   };

//   const handleAmountEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const formatted = formatNumberOnBlur(formData.pesos);
//       updateField("pesos", formatted);
//       const sentence = numberToWordsSentence(formatted);
//       updateField("pesosSentece", sentence);
//       // Blur the input to show the formatted value
//       e.currentTarget.blur();
//     }
//   };

//   const dateDisplay = `${formData.month1}${formData.month2}/${formData.day1}${formData.day2}/${formData.year1}${formData.year2}${formData.year3}${formData.year4}`;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 print:bg-white">
//       {/* Header */}
//       <header className="print:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
//         <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <Link href="/">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="gap-2 text-slate-600 hover:text-slate-900"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back
//                 </Button>
//               </Link>
//               <Separator orientation="vertical" className="h-6" />
//               <div className="flex items-center gap-3">
//                 <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
//                   <span className="text-white font-bold text-xs">BDO</span>
//                 </div>
//                 <div>
//                   <h1 className="font-semibold text-slate-900">
//                     BDO Cheque Filler
//                   </h1>
//                   <p className="text-xs text-slate-500">Banco de Oro</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowTemplate(!showTemplate)}
//                 className="gap-2"
//               >
//                 {showTemplate ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//                 <span className="hidden sm:inline">
//                   {showTemplate ? "Hide" : "Show"} Template
//                 </span>
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={resetForm}
//                 className="gap-2 bg-transparent"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 <span className="hidden sm:inline">Reset</span>
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={() => window.print()}
//                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 <Printer className="h-4 w-4" />
//                 <span className="hidden sm:inline">Print</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 print:p-0">
//         <div className="flex flex-col xl:flex-row gap-6 print:block">
//           {/* Form Panel */}
//           <div className="w-full xl:w-96 shrink-0 print:hidden">
//             <Card className="sticky top-24 shadow-sm border-slate-200">
//               <CardHeader className="pb-4">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <FileText className="h-5 w-5 text-blue-600" />
//                   Cheque Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Date Section */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <CalendarIcon className="h-4 w-4 text-slate-400" />
//                     Date
//                   </Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal",
//                           !selectedDate && "text-slate-400"
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {selectedDate ? (
//                           format(selectedDate, "MM/dd/yyyy")
//                         ) : (
//                           <span>Select a date</span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={selectedDate}
//                         onSelect={handleDateSelect}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 <Separator />

//                 {/* Payee Name Section (Combined Search & Add) */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <User className="h-4 w-4 text-slate-400" />
//                     Pay to the Order of
//                   </Label>
//                   <div className="flex gap-2">
//                     <Input
//                       value={formData.name}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       onKeyDown={handlePayeeEnter}
//                       placeholder="Enter payee name"
//                       className="h-10 flex-1"
//                     />

//                     {/* SMART MODAL TRIGGER */}
//                     <Dialog open={isDialogOpen} onOpenChange={(open) => {
//                       if(!open) closeDialog(); 
//                       else setIsDialogOpen(true);
//                     }}>
//                       <DialogTrigger asChild>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon"
//                           className="h-10 w-10 shrink-0"
//                           title="Search or Add Payee"
//                         >
//                           <Search className="h-4 w-4" />
//                         </Button>
//                       </DialogTrigger>
                      
//                       <DialogContent className="sm:max-w-md">
//                         {/* VIEW 1: SEARCH & LIST VIEW */}
//                         {viewMode === "list" ? (
//                           <>
//                             <DialogHeader>
//                               <DialogTitle>Select Payee</DialogTitle>
//                               <DialogDescription>
//                                 Search existing payees or add a new one.
//                               </DialogDescription>
//                             </DialogHeader>

//                             <div className="space-y-4 py-4">
//                               <div className="relative">
//                                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
//                                 <Input
//                                   placeholder="Search payees..."
//                                   value={searchTerm}
//                                   onChange={(e) => setSearchTerm(e.target.value)}
//                                   className="pl-9"
//                                   autoFocus
//                                 />
//                               </div>

//                               <div className="max-h-[250px] overflow-y-auto border rounded-md divide-y">
//                                 {filteredPayees.length > 0 ? (
//                                   filteredPayees.map((payee) => (
//                                     <button
//                                       key={payee.id}
//                                       type="button"
//                                       onClick={() => handleSelectPayee(payee.name)}
//                                       className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group"
//                                     >
//                                       <span className="font-medium text-slate-700">
//                                         {payee.name}
//                                       </span>
//                                       {formData.name === payee.name && (
//                                         <Check className="h-4 w-4 text-green-600" />
//                                       )}
//                                     </button>
//                                   ))
//                                 ) : (
//                                   <div className="p-8 text-center text-sm text-slate-500">
//                                     No payees found matching "{searchTerm}"
//                                   </div>
//                                 )}
//                               </div>
//                             </div>

//                             <DialogFooter className="flex-col sm:justify-between sm:flex-row gap-2">
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   onClick={closeDialog}
//                                 >
//                                   Cancel
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   onClick={switchToAddMode}
//                                   className="gap-2"
//                                 >
//                                   <Plus className="h-4 w-4" />
//                                   Add "{searchTerm || "New Payee"}"
//                                 </Button>
//                             </DialogFooter>
//                           </>
//                         ) : (
//                           /* VIEW 2: ADD NEW PAYEE VIEW */
//                           <>
//                              <DialogHeader>
//                               <DialogTitle>Add New Payee</DialogTitle>
//                               <DialogDescription>
//                                 This will add the payee to your database for future use.
//                               </DialogDescription>
//                             </DialogHeader>
                            
//                             <div className="space-y-4 py-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="new-payee-name">Payee Name</Label>
//                                 <Input
//                                   id="new-payee-name"
//                                   value={newPayeeName}
//                                   onChange={(e) => setNewPayeeName(e.target.value)}
//                                   placeholder="Enter name"
//                                   onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                       e.preventDefault();
//                                       handleAddPayee();
//                                     }
//                                   }}
//                                   autoFocus
//                                 />
//                               </div>
//                             </div>

//                             <DialogFooter>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => setViewMode("list")}
//                                 disabled={isAddingPayee}
//                               >
//                                 Back to Search
//                               </Button>
//                               <Button
//                                 type="button"
//                                 onClick={handleAddPayee}
//                                 disabled={!newPayeeName.trim() || isAddingPayee}
//                               >
//                                 {isAddingPayee && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                                 Save & Select
//                               </Button>
//                             </DialogFooter>
//                           </>
//                         )}
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Amount */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
//                     <DollarSign className="h-4 w-4 text-slate-400" />
//                     Amount (PHP)
//                   </Label>
//                   <Input
//                     value={formData.pesos}
//                     onChange={(e) => updateField("pesos", e.target.value)}
//                     onKeyDown={handleAmountEnter}
//                     onBlur={(e) => {
//                       const formatted = formatNumberOnBlur(e.target.value);
//                       updateField("pesos", formatted);
//                       const sentence = numberToWordsSentence(formatted);
//                       updateField("pesosSentece", sentence);
//                     }}
//                     placeholder="0.00"
//                     className="h-10 font-mono text-lg"
//                   />
//                   {formData.pesosSentece && (
//                     <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border">
//                       {formData.pesosSentece}
//                     </p>
//                   )}
//                 </div>

//                 {/* Quick Summary */}
//                 {(formData.name || formData.pesos) && (
//                   <>
//                     <Separator />
//                     <div className="bg-blue-50 rounded-lg p-3 space-y-2">
//                       <p className="text-xs font-medium text-blue-700">
//                         Summary
//                       </p>
//                       {formData.name && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Payee:</span>{" "}
//                           {formData.name}
//                         </p>
//                       )}
//                       {formData.pesos && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Amount:</span> PHP{" "}
//                           {formData.pesos}
//                         </p>
//                       )}
//                       {dateDisplay.replace(/\//g, "") && (
//                         <p className="text-sm text-blue-900">
//                           <span className="text-blue-600">Date:</span>{" "}
//                           {dateDisplay}
//                         </p>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Cheque Preview */}
//           <div className="flex-1 print:w-full">
//             <div className="print:hidden mb-4">
//               <h2 className="text-sm font-medium text-slate-600">
//                 Cheque Preview
//               </h2>
//               <p className="text-xs text-slate-400">
//                 Fill in the form on the left to see your cheque
//               </p>
//             </div>

//             <div className="flex justify-center xl:justify-start print:justify-start print:absolute print:top-0 print:left-0">
//               <div
//                 className="bg-white shadow-xl rounded-lg overflow-hidden relative print:shadow-none print:rounded-none"
//                 id="cheque-container"
//                 style={{
//                   width: "205mm",
//                   height: "76mm",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 {/* Background Template Image */}
//                 {showTemplate && (
//                   <div
//                     className="absolute inset-0 print:hidden pointer-events-none"
//                     style={{ width: "205mm", height: "76mm" }}
//                   >
//                     <Image
//                       src="/template/bdo_cheque_scan.jpg"
//                       alt="Template Background"
//                       width={775}
//                       height={287}
//                       className="w-full h-full opacity-50 relative"
//                       style={{ objectFit: "fill" }}
//                     />
//                   </div>
//                 )}

//                 {/* Fillable Fields */}
//                 <div className="relative" style={{ padding: "9.52mm 3.27mm" }}>
//                   {/* Date Fields */}
//                   <div
//                     className="absolute"
//                     style={{ top: "11.7mm", right: "11.4mm" }}
//                   >
//                     <div className="flex items-baseline gap-0">
//                       {[
//                         {
//                           ref: refs.month1,
//                           field: "month1",
//                           next: refs.month2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.month2,
//                           field: "month2",
//                           next: refs.day1,
//                           mr: "2.2mm",
//                         },
//                         {
//                           ref: refs.day1,
//                           field: "day1",
//                           next: refs.day2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.day2,
//                           field: "day2",
//                           next: refs.year1,
//                           mr: "2.2mm",
//                         },
//                         {
//                           ref: refs.year1,
//                           field: "year1",
//                           next: refs.year2,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year2,
//                           field: "year2",
//                           next: refs.year3,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year3,
//                           field: "year3",
//                           next: refs.year4,
//                           mr: "0.66mm",
//                         },
//                         {
//                           ref: refs.year4,
//                           field: "year4",
//                           next: undefined,
//                           mr: "0.08mm",
//                         },
//                       ].map((item, i) => (
//                         <input
//                           key={i}
//                           ref={item.ref}
//                           value={formData[item.field as keyof typeof formData]}
//                           inputMode="numeric"
//                           maxLength={1}
//                           pattern="[0-9]*"
//                           onChange={(e) =>
//                             handleDigit(
//                               e,
//                               item.field as keyof typeof formData,
//                               item.next
//                             )
//                           }
//                           className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                           style={{
//                             fontSize: "11pt",
//                             width: "4.6mm",
//                             marginRight: item.mr,
//                           }}
//                           disabled={false}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   {/* Name Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-7mm", left: "27mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={"***" + formData.name + "***"}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "115mm" }}
//                       disabled={false}
//                     />
//                   </div>

//                   {/* Pesos Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-7mm", right: "24.5mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={formData.pesos}
//                       onChange={(e) => updateField("pesos", e.target.value)}
//                       onBlur={(e) => {
//                         const formatted = formatNumberOnBlur(e.target.value);
//                         updateField("pesos", formatted);
//                         const sentence = numberToWordsSentence(formatted);
//                         updateField("pesosSentece", sentence);
//                       }}
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "30mm" }}
//                       disabled={false}
//                     />
//                   </div>

//                   {/* Pesos in Words Field */}
//                   <div
//                     className="absolute"
//                     style={{ bottom: "-15mm", left: "18mm" }}
//                   >
//                     <input
//                       type="text"
//                       value={"***" + formData.pesosSentece + "***"}
//                       onChange={(e) =>
//                         updateField("pesosSentece", e.target.value)
//                       }
//                       className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
//                       style={{ fontSize: "11pt", width: "180mm" }}
//                       disabled={false}
//                     />
//                   </div>
//                 </div>

//                 {/* Print styles */}
//                 <style>{`
//                   @media print {
//                     body { margin: 0; padding: 0; }
//                     @page { size: 205mm 76mm; margin: 0; }
//                     input { 
//                       font-family: Arial, sans-serif !important;
//                       color: black !important;
//                     }
//                   }
//                 `}</style>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useRef, useState, useEffect } from "react";
import {
  Printer,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowLeft,
  Calendar as CalendarIcon,
  User,
  DollarSign,
  FileText,
  Search,
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function BDOChequeFiller() {
  const [showTemplate, setShowTemplate] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({
    month1: "",
    month2: "",
    day1: "",
    day2: "",
    year1: "",
    year2: "",
    year3: "",
    year4: "",
    name: "",
    pesos: "",
    pesosSentece: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // --- Payee Logic State ---
  const [payees, setPayees] = useState<Array<{ id: number; name: string }>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // "Add Mode" states inside the dialog
  const [viewMode, setViewMode] = useState<"list" | "add">("list"); 
  const [newPayeeName, setNewPayeeName] = useState("");
  const [isAddingPayee, setIsAddingPayee] = useState(false);

  useEffect(() => {
    async function loadPayees() {
      try {
        const res = await fetch("/api/payees");
        const data = await res.json();
        setPayees(data);
      } catch (error) {
        console.error("Failed to load payees:", error);
      }
    }
    loadPayees();
  }, []);

  // Filter logic
  const filteredPayees = payees.filter((payee) =>
    payee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Select existing payee
  const handleSelectPayee = (name: string) => {
    updateField("name", name);
    closeDialog();
  };

  // 2. Add new payee API call
  const handleAddPayee = async () => {
    if (!newPayeeName.trim()) return;

    setIsAddingPayee(true);
    try {
      const res = await fetch("/api/payees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newPayeeName.trim() }),
      });

      if (res.ok) {
        const newPayeeData = await res.json();
        setPayees((prev) =>
          [...prev, newPayeeData].sort((a, b) => a.name.localeCompare(b.name))
        );
        updateField("name", newPayeeData.name);
        
        toast.success("Payee added successfully!", {
          className: "!bg-indigo-500 !text-white",
        });
        closeDialog();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add payee");
      }
    } catch (error) {
      console.error("Failed to add payee:", error);
      alert("Failed to add payee. Please try again.");
    } finally {
      setIsAddingPayee(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSearchTerm("");
    setNewPayeeName("");
    setViewMode("list");
  };

  const switchToAddMode = () => {
    setNewPayeeName(searchTerm);
    setViewMode("add");
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    const emptyData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>);
    setFormData(emptyData);
    setSelectedDate(undefined);
  };

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date ?? undefined);
    if (!date) {
      setFormData((prev) => ({
        ...prev,
        month1: "",
        month2: "",
        day1: "",
        day2: "",
        year1: "",
        year2: "",
        year3: "",
        year4: "",
      }));
      return;
    }

    const formatted = format(date, "MMddyyyy");
    setFormData((prev) => ({
      ...prev,
      month1: formatted[0] ?? "",
      month2: formatted[1] ?? "",
      day1: formatted[2] ?? "",
      day2: formatted[3] ?? "",
      year1: formatted[4] ?? "",
      year2: formatted[5] ?? "",
      year3: formatted[6] ?? "",
      year4: formatted[7] ?? "",
    }));
  };

  function formatNumberOnBlur(value: string) {
    const cleaned = (value ?? "").replace(/[^\d.]/g, "");
    if (!cleaned) return "0.00";
    const [rawInt = "0", rawDec = ""] = cleaned.split(".");
    const intWithCommas = Number(rawInt).toLocaleString("en-US");
    const decimal = "." + (rawDec + "00").slice(0, 2);
    return intWithCommas + decimal;
  }

  function numberToWordsSentence(value: string) {
    const cleaned = value.replace(/[^\d.]/g, "");
    if (!cleaned) return "";
    const num = Number.parseFloat(cleaned);
    if (isNaN(num)) return "";

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

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
      if (n < 1_000_000) {
        const thousandsPart = toWords(Math.floor(n / 1000)) + " Thousand";
        const remainder = n % 1000 ? " " + toWords(n % 1000) : "";
        return thousandsPart + remainder;
      }
      if (n < 1_000_000_000) {
        const millionsPart = toWords(Math.floor(n / 1_000_000)) + " Million";
        const remainder = n % 1_000_000 ? " " + toWords(n % 1_000_000) : "";
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

  const refs = {
    month1: useRef<HTMLInputElement>(null),
    month2: useRef<HTMLInputElement>(null),
    day1: useRef<HTMLInputElement>(null),
    day2: useRef<HTMLInputElement>(null),
    year1: useRef<HTMLInputElement>(null),
    year2: useRef<HTMLInputElement>(null),
    year3: useRef<HTMLInputElement>(null),
    year4: useRef<HTMLInputElement>(null),
  };

  const handleDigit = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData,
    next?: React.RefObject<HTMLInputElement | null>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    updateField(field, value);
    if (value && next?.current) {
      setTimeout(() => {
        next.current?.focus();
      }, 0);
    }
  };

  const handlePayeeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleAmountEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formatted = formatNumberOnBlur(formData.pesos);
      updateField("pesos", formatted);
      const sentence = numberToWordsSentence(formatted);
      updateField("pesosSentece", sentence);
      e.currentTarget.blur();
    }
  };

  const dateDisplay = `${formData.month1}${formData.month2}/${formData.day1}${formData.day2}/${formData.year1}${formData.year2}${formData.year3}${formData.year4}`;

  return (
    // 1. REMOVED bg-linear-to-br AND min-h-screen
    // This allows the layout.tsx Aurora background to show through.
    <div className="w-full print:bg-white">
      
      {/* Header */}
      <header className="print:hidden bg-white/70 backdrop-blur-md border-b border-white/40 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">BDO</span>
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">
                    BDO Cheque Filler
                  </h1>
                  <p className="text-xs text-slate-500">Banco de Oro</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplate(!showTemplate)}
                className="gap-2"
              >
                {showTemplate ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {showTemplate ? "Hide" : "Show"} Template
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 print:p-0">
        <div className="flex flex-col xl:flex-row gap-6 print:block">
          {/* Form Panel */}
          <div className="w-full xl:w-96 shrink-0 print:hidden">
            {/* 2. UPDATED CARD STYLING: Added bg-white/70 backdrop-blur-md for Glass effect */}
            <Card className="sticky top-24 shadow-sm border-slate-200/60 bg-white/70 backdrop-blur-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Cheque Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <CalendarIcon className="h-4 w-4 text-slate-400" />
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/50",
                          !selectedDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "MM/dd/yyyy")
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                {/* Payee Name Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    Pay to the Order of
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      onKeyDown={handlePayeeEnter}
                      placeholder="Enter payee name"
                      className="h-10 flex-1 bg-white/50"
                    />

                    {/* Smart Modal Trigger */}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                      if(!open) closeDialog(); 
                      else setIsDialogOpen(true);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0 bg-white/50"
                          title="Search or Add Payee"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="sm:max-w-md">
                        {/* VIEW 1: SEARCH & LIST */}
                        {viewMode === "list" ? (
                          <>
                            <DialogHeader>
                              <DialogTitle>Select Payee</DialogTitle>
                              <DialogDescription>
                                Search existing payees or add a new one.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="Search payees..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-9"
                                  autoFocus
                                />
                              </div>

                              <div className="max-h-[250px] overflow-y-auto border rounded-md divide-y">
                                {filteredPayees.length > 0 ? (
                                  filteredPayees.map((payee) => (
                                    <button
                                      key={payee.id}
                                      type="button"
                                      onClick={() => handleSelectPayee(payee.name)}
                                      className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group"
                                    >
                                      <span className="font-medium text-slate-700">
                                        {payee.name}
                                      </span>
                                      {formData.name === payee.name && (
                                        <Check className="h-4 w-4 text-green-600" />
                                      )}
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-8 text-center text-sm text-slate-500">
                                    No payees found matching "{searchTerm}"
                                  </div>
                                )}
                              </div>
                            </div>

                            <DialogFooter className="flex-col sm:justify-between sm:flex-row gap-2">
                                <Button type="button" variant="ghost" onClick={closeDialog}>
                                  Cancel
                                </Button>
                                <Button type="button" onClick={switchToAddMode} className="gap-2">
                                  <Plus className="h-4 w-4" />
                                  Add "{searchTerm || "New Payee"}"
                                </Button>
                            </DialogFooter>
                          </>
                        ) : (
                          /* VIEW 2: ADD NEW PAYEE */
                          <>
                             <DialogHeader>
                              <DialogTitle>Add New Payee</DialogTitle>
                              <DialogDescription>
                                This will add the payee to your database for future use.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-payee-name">Payee Name</Label>
                                <Input
                                  id="new-payee-name"
                                  value={newPayeeName}
                                  onChange={(e) => setNewPayeeName(e.target.value)}
                                  placeholder="Enter name"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddPayee();
                                  }}
                                  autoFocus
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setViewMode("list")} disabled={isAddingPayee}>
                                Back to Search
                              </Button>
                              <Button type="button" onClick={handleAddPayee} disabled={!newPayeeName.trim() || isAddingPayee}>
                                {isAddingPayee && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save & Select
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Separator />

                {/* Amount */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    Amount (PHP)
                  </Label>
                  <Input
                    value={formData.pesos}
                    onChange={(e) => updateField("pesos", e.target.value)}
                    onKeyDown={handleAmountEnter}
                    onBlur={(e) => {
                      const formatted = formatNumberOnBlur(e.target.value);
                      updateField("pesos", formatted);
                      const sentence = numberToWordsSentence(formatted);
                      updateField("pesosSentece", sentence);
                    }}
                    placeholder="0.00"
                    className="h-10 font-mono text-lg bg-white/50"
                  />
                  {formData.pesosSentece && (
                    <p className="text-xs text-slate-500 bg-slate-50/80 p-2 rounded-md border">
                      {formData.pesosSentece}
                    </p>
                  )}
                </div>

                {/* Quick Summary */}
                {(formData.name || formData.pesos) && (
                  <>
                    <Separator />
                    <div className="bg-blue-50/80 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-medium text-blue-700">
                        Summary
                      </p>
                      {formData.name && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Payee:</span>{" "}
                          {formData.name}
                        </p>
                      )}
                      {formData.pesos && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Amount:</span> PHP{" "}
                          {formData.pesos}
                        </p>
                      )}
                      {dateDisplay.replace(/\//g, "") && (
                        <p className="text-sm text-blue-900">
                          <span className="text-blue-600">Date:</span>{" "}
                          {dateDisplay}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cheque Preview */}
          <div className="flex-1 print:w-full">
            <div className="print:hidden mb-4">
              <h2 className="text-sm font-medium text-slate-600">
                Cheque Preview
              </h2>
              <p className="text-xs text-slate-400">
                Fill in the form on the left to see your cheque
              </p>
            </div>

            <div className="flex justify-center xl:justify-start print:justify-start print:absolute print:top-0 print:left-0">
              <div
                className="bg-white shadow-xl rounded-lg overflow-hidden relative print:shadow-none print:rounded-none"
                id="cheque-container"
                style={{
                  width: "205mm",
                  height: "76mm",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {/* Background Template Image */}
                {showTemplate && (
                  <div
                    className="absolute inset-0 print:hidden pointer-events-none"
                    style={{ width: "205mm", height: "76mm" }}
                  >
                    <Image
                      src="/template/bdo_cheque_scan.jpg"
                      alt="Template Background"
                      width={775}
                      height={287}
                      className="w-full h-full opacity-50 relative"
                      style={{ objectFit: "fill" }}
                    />
                  </div>
                )}

                {/* Fillable Fields */}
                <div className="relative" style={{ padding: "9.52mm 3.27mm" }}>
                  {/* Date Fields */}
                  <div
                    className="absolute"
                    style={{ top: "11.7mm", right: "11.4mm" }}
                  >
                    <div className="flex items-baseline gap-0">
                      {[
                        { ref: refs.month1, field: "month1", next: refs.month2, mr: "0.66mm" },
                        { ref: refs.month2, field: "month2", next: refs.day1, mr: "2.2mm" },
                        { ref: refs.day1, field: "day1", next: refs.day2, mr: "0.66mm" },
                        { ref: refs.day2, field: "day2", next: refs.year1, mr: "2.2mm" },
                        { ref: refs.year1, field: "year1", next: refs.year2, mr: "0.66mm" },
                        { ref: refs.year2, field: "year2", next: refs.year3, mr: "0.66mm" },
                        { ref: refs.year3, field: "year3", next: refs.year4, mr: "0.66mm" },
                        { ref: refs.year4, field: "year4", next: undefined, mr: "0.08mm" },
                      ].map((item, i) => (
                        <input
                          key={i}
                          ref={item.ref}
                          value={formData[item.field as keyof typeof formData]}
                          inputMode="numeric"
                          maxLength={1}
                          pattern="[0-9]*"
                          onChange={(e) => handleDigit(e, item.field as keyof typeof formData, item.next)}
                          className="border-b border-gray-400 print:border-none text-center bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                          style={{ fontSize: "11pt", width: "4.6mm", marginRight: item.mr }}
                          disabled={false}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="absolute" style={{ bottom: "-7mm", left: "27mm" }}>
                    <input
                      type="text"
                      value={"***" + formData.name + "***"}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "115mm" }}
                      disabled={false}
                    />
                  </div>

                  {/* Pesos Field */}
                  <div className="absolute" style={{ bottom: "-7mm", right: "24.5mm" }}>
                    <input
                      type="text"
                      value={formData.pesos}
                      onChange={(e) => updateField("pesos", e.target.value)}
                      onBlur={(e) => {
                        const formatted = formatNumberOnBlur(e.target.value);
                        updateField("pesos", formatted);
                        const sentence = numberToWordsSentence(formatted);
                        updateField("pesosSentece", sentence);
                      }}
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "30mm" }}
                      disabled={false}
                    />
                  </div>

                  {/* Pesos in Words Field */}
                  <div className="absolute" style={{ bottom: "-15mm", left: "18mm" }}>
                    <input
                      type="text"
                      value={"***" + formData.pesosSentece + "***"}
                      onChange={(e) => updateField("pesosSentece", e.target.value)}
                      className="border-b border-gray-400 print:border-none text-left bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2 transition-colors"
                      style={{ fontSize: "11pt", width: "180mm" }}
                      disabled={false}
                    />
                  </div>
                </div>

                {/* Print styles */}
                <style>{`
                  @media print {
                    body { margin: 0; padding: 0; }
                    @page { size: 205mm 76mm; margin: 0; }
                    input { 
                      font-family: Arial, sans-serif !important;
                      color: black !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}