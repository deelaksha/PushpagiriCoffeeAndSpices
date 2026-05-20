import React, { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Theme & data can be moved to a separate config file if needed
const theme = {
  bgGradient: 'bg-gradient-to-br from-[#f2f6f4] via-[#e8f1ec] to-[#f4f7f5]',
  primaryText: 'text-[#1e4634]',
  secondaryText: 'text-slate-600',
  accentBorder: 'border-emerald-200/80',
  badgeBg: 'bg-[#e3ede8] text-[#1e4634] border-emerald-200',
  accentFill: 'fill-[#1e4634] text-[#1e4634]',
  cardBg: 'bg-[#f4f7f5]',
  tableHeaderBg: 'bg-[#e2edd3]/50',
  primaryBtn: 'bg-[#1e4634] hover:bg-[#153124] text-white shadow-lg shadow-emerald-950/20',
};

const companyDetails = {
  name: 'Pushpagiri Coffee & Spice',
  type: 'Premium Spices & Coffee Wholesaler',
  address: 'Pushpagiri, Main Rd, Choudlu',
  cityStateZip: 'Karnataka 571236, India',
  email: 'coffee.pushpagiri@gmail.com',
  phone: '+91 82772 61881',
  website: 'www.pushpagirispices.com',
};

const clientDetails = {
  name: 'Western Ghats Organic Distributors Ltd.',
  contactPerson: 'Arjun Somanna',
  address: '32/A KIADB Industrial Area, Kudige',
  cityStateZip: 'Somwarpet, Kodagu, KA 571232',
  email: 'orders@wg-organics.in',
  phone: '+91 94821 04412',
};

export const invoiceMeta = {
  invoiceNumber: 'PCS-2026-0891',
  createdDate: 'May 20, 2026',
  dueDate: 'June 04, 2026',
  poNumber: 'PO-COOR-4091',
};

const items = [
  { id: 1, name: 'Premium Arabica Coffee Beans (AA Grade)', desc: '100% Organically grown single‑origin green coffee beans - 50kg wholesale sack', qty: 10, price: 18500.0 },
  { id: 2, name: 'Coorg Bold Green Cardamom (8mm+)', desc: 'Sun‑dried high aroma, export quality cardamom - 10kg canister', qty: 5, price: 16900.0 },
  { id: 3, name: 'Organic Tellicherry Black Pepper', desc: 'Bold grade natural whole black peppercorns - 25kg bulk pack', qty: 12, price: 9900.0 },
  { id: 4, name: 'Premium Robusta Coffee Beans (Cherry)', desc: 'Rich body specialty robusta beans - 50kg wholesale sack', qty: 8, price: 14500.0 },
];

// Pre‑calculated financials (kept simple for the demo)
const subTotal = 404300.0;
const discountRate = 5; // %
const discountAmount = (subTotal * discountRate) / 100; // 20215
const taxRate = 5; // %
const taxAmount = ((subTotal - discountAmount) * taxRate) / 100; // 19204.25
const grandTotal = subTotal - discountAmount + taxAmount; // 403289.25

export default function Invoice() {
  const exportPDF = useCallback(async () => {
    const element = document.getElementById('invoice-sheet');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceMeta.invoiceNumber}.pdf`);
  }, []);

  return (
    <div className={`min-h-screen ${theme.bgGradient} font-sans flex flex-col items-center p-4 sm:p-8 md:p-12`}>
      {/* Print / PDF button – visible only on screen */}
      <div className="mb-6">
        <button
          onClick={exportPDF}
          className="${theme.primaryBtn} px-5 py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-95"
        >
          Export as PDF
        </button>
      </div>

      {/* Actual invoice – the element that will be rendered to canvas */}
      <div
        id="invoice-sheet"
        className="w-full max-w-4xl bg-white text-slate-900 shadow-2xl rounded-2xl border border-emerald-100/50 p-6 sm:p-12 md:p-14"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1e4634]">{companyDetails.name}</h1>
            <p className="text-sm text-[#b4833e] uppercase tracking-widest">{companyDetails.type}</p>
            <p className="mt-2 text-sm">{companyDetails.address}, {companyDetails.cityStateZip}</p>
            <p className="text-sm">Email: {companyDetails.email} • Phone: {companyDetails.phone}</p>
            <p className="text-sm text-[#1e4634] font-semibold">{companyDetails.website}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="inline-block bg-[#e2f0e8] text-[#1e4634] px-3 py-1 text-xs font-black rounded-full uppercase mb-2">
              TAX INVOICE
            </div>
            <h2 className="text-4xl font-black uppercase text-[#1e4634]">Invoice</h2>
            <div className="mt-4 text-sm space-y-1 border-l-2 pl-4 md:border-l-0 md:border-r-2 md:pr-4 md:text-right">
              <p><span className="font-bold uppercase">Invoice No:</span> <span className="font-mono">{invoiceMeta.invoiceNumber}</span></p>
              <p><span className="font-bold uppercase">Date Issued:</span> {invoiceMeta.createdDate}</p>
              <p><span className="font-bold uppercase">Payment Due:</span> {invoiceMeta.dueDate}</p>
              <p><span className="font-bold uppercase">P.O. Number:</span> {invoiceMeta.poNumber}</p>
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="p-5 rounded-2xl border ${theme.cardBg}">
            <div className="absolute top-0 left-5 -translate-y-1/2 bg-white px-2.5 text-[#b4833e] font-extrabold uppercase text-[9px]">
              BILLED TO
            </div>
            <p className="mt-4 font-extrabold text-[#1e4634]">{clientDetails.name}</p>
            <p className="text-slate-700">Attn: {clientDetails.contactPerson}</p>
            <p className="text-slate-600">{clientDetails.address}</p>
            <p className="text-slate-600">{clientDetails.cityStateZip}</p>
            <p className="mt-2 text-slate-500">Email: {clientDetails.email}</p>
            <p className="text-slate-500">Phone: {clientDetails.phone}</p>
          </div>

          <div className="border rounded-2xl p-5 flex flex-col justify-between">
            <h4 className="font-bold text-[#b4833e] uppercase text-[9px] mb-2">Quality Standard Guarantee</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              All commodities and whole spices invoiced are authentic agricultural products of the Somwarpet district. Hand‑picked, graded, and stored under optimized dry warehouses to retain pure aroma and freshness.
            </p>
            <div className="mt-4 p-3 bg-[#eef5f1] border rounded-xl flex justify-between items-center">
              <span className="text-sm font-bold uppercase text-slate-500">Total Balance (INR)</span>
              <span className="text-2xl font-black text-[#1e4634]">₹{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="${theme.tableHeaderBg} text-xs font-bold border-b">
                <th className="py-4 px-5 w-12 text-center">#</th>
                <th className="py-4 px-5">Item / Description</th>
                <th className="py-4 px-5 w-24 text-center">Qty</th>
                <th className="py-4 px-5 w-32 text-right">Unit Rate</th>
                <th className="py-4 px-5 w-36 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y">
              {items.map((item, i) => {
                const total = item.qty * item.price;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-5 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </td>
                    <td className="py-4 px-5 text-center font-mono font-semibold text-slate-800">{item.qty}</td>
                    <td className="py-4 px-5 text-right font-mono text-slate-800">₹{item.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-slate-950">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-5">
            <h4 className="font-bold text-[#b4833e] uppercase text-[9px]">Wholesale Storage Advice</h4>
            <p className="bg-stone-50 p-4 rounded-xl border text-sm italic">"Keep wholesale coffee sacks stacked off the floor on dry wooden pallets. Spices must remain sealed inside moisture barriers to prevent volatile oil degradation under monsoon cycles."
            </p>
            <h4 className="font-bold text-[#b4833e] uppercase text-[9px]">Payment Terms</h4>
            <p className="text-sm">Net‑15 days. Transfer to Pushpagiri State Bank, Account #8839‑220‑4921, IFSC SBIN0040921.</p>
          </div>
          <div className="md:col-span-5 bg-[#fcfdfc] border rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between"><span className="text-slate-500 font-semibold">Subtotal</span><span className="font-mono font-bold">₹{subTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between pt-3 border-t"><span className="text-slate-500 font-semibold">Bulk Discount</span><span className="font-mono text-emerald-800">-₹{discountAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
            <div className="flex justify-between pt-3 border-t"><span className="text-slate-500 font-semibold">GST (5%)</span><span className="font-mono font-bold">+₹{taxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
            <hr className="border-t-2 border-emerald-100/80 my-2" />
            <div className="flex justify-between items-baseline"><span className="text-slate-900 font-black uppercase">Grand Total Due</span><span className="text-2xl font-black text-[#1e4634] font-mono">₹{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t pt-8 grid md:grid-cols-12 text-xs text-slate-500">
          <div className="md:col-span-7 flex items-center gap-3">
            <div className="p-3 bg-[#1e4634] rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"></path><path d="M9 22v-4h4"></path></svg>
            </div>
            <div>
              <h5 className="font-bold uppercase text-[9px]">GROWN SUSTAINABLY</h5>
              <p className="text-slate-500 max-w-sm mt-0.5">Pushpagiri farms implement climate‑resilient mixed‑cropping patterns. Zero toxic runoff into Western Ghat waterways.</p>
            </div>
          </div>
          <div className="md:col-span-5 text-right">
            <div className="inline-block w-56 space-y-1">
              <div className="h-10 border-b font-serif italic text-lg flex items-end pl-2 border-stone-300">Dispatch Manager</div>
              <div className="flex justify-between text-xs uppercase font-bold text-slate-400">
                <span>Authorized Representative</span>
                <span>Date of Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
