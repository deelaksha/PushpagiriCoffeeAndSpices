// ============================================================
// /api/invoice/[orderId]/route.ts — Invoice Download API
// ============================================================
// GET /api/invoice/:orderId
//   • Fetches order from Firestore
//   • Builds a printable HTML invoice page
//   • Returns as text/html (browser can print → Save as PDF)
//   • Also supports ?format=pdf for future server-side PDF generation
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { formatINR, formatDateReadable } from "@/lib/invoiceHelpers";

// ─── Helper: Build Printable Invoice HTML ─────────────────────────────────────

function buildPrintableInvoiceHTML(order: Record<string, unknown>): string {
  const {
    orderId, orderNumber, invoiceNumber, invoiceDate,
    customerInfo, shippingAddress, products, items,
    subtotal, shippingCharge, shippingCost,
    total, grandTotal, paymentMethod, orderNotes,
    createdAt,
  } = order as Record<string, any>;

  const resolvedItems: Array<{
    productName: string; productId: string;
    quantity: number; weight: string; price: number;
  }> = (items || products?.map((p: any) => ({
    productName: p.product?.name ?? p.productName ?? "Product",
    productId:   p.product?.id  ?? p.productId   ?? "-",
    quantity:    p.quantity ?? 1,
    weight:      p.weightLabel ?? p.weight ?? "-",
    price:       p.price ?? 0,
  }))) ?? [];

  const name    = customerInfo?.name    ?? customerInfo?.fullName ?? "Customer";
  const email   = customerInfo?.email   ?? "";
  const phone   = customerInfo?.phone   ?? "";
  const addrObj = shippingAddress ?? {};
  const address = typeof addrObj === "string"
    ? addrObj
    : [addrObj.street, addrObj.city, addrObj.state, addrObj.zipCode, addrObj.country]
        .filter(Boolean).join(", ");

  const resolvedSubtotal  = subtotal       ?? 0;
  const resolvedShipping  = shippingCharge ?? shippingCost ?? 0;

  const resolvedTotal     = grandTotal     ?? total        ?? 0;
  const resolvedInvoice   = invoiceNumber  ?? `INV-${Date.now()}`;
  const resolvedDate      = invoiceDate    ?? createdAt    ?? new Date().toISOString();
  const resolvedOrderNo   = orderNumber    ?? orderId      ?? "N/A";
  const resolvedMethod    = paymentMethod  ?? "pending";

  const rowsHTML = resolvedItems.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? "#F6FBF6" : "#FFFFFF"};">
      <td style="padding:12px 14px;border-bottom:1px solid #E8EDE8;">
        <div style="font-weight:600;color:#1A2E1A;">${item.productName}</div>
        <div style="font-size:11px;color:#9CA3AF;">ID: ${item.productId}</div>
      </td>
      <td style="padding:12px 8px;text-align:center;border-bottom:1px solid #E8EDE8;font-weight:600;color:#3A5A40;">${item.quantity}</td>
      <td style="padding:12px 8px;text-align:center;border-bottom:1px solid #E8EDE8;color:#6B7280;font-size:12px;">${item.weight}</td>
      <td style="padding:12px 8px;text-align:right;border-bottom:1px solid #E8EDE8;">${formatINR(item.price)}</td>
      <td style="padding:12px 14px;text-align:right;border-bottom:1px solid #E8EDE8;font-weight:700;color:#2D4A2D;">${formatINR(item.price * item.quantity)}</td>
    </tr>`).join("");



  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Invoice ${resolvedInvoice} — Pushpagiri Coffee & Spice</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F0F4F0; color: #1A2E1A; font-size: 13px; }
  .page { width: 794px; min-height: 1123px; background: #fff; margin: 0 auto; position: relative; overflow: hidden; }
  .header { background: linear-gradient(135deg, #2D4A2D, #4A7A55); padding: 28px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
  .accent { height: 4px; background: linear-gradient(90deg, #A8D5BA, #3A5A40, #6F4E37); }
  .body { padding: 32px 40px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  .info-box { background: #F6FBF6; border: 1.5px solid #C8E6C9; border-radius: 10px; padding: 16px 18px; }
  .info-box-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #3A5A40; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #C8E6C9; }
  .info-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
  table.products { width: 100%; border-collapse: separate; border-spacing: 0; border: 1.5px solid #C8E6C9; border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
  table.products thead tr { background: linear-gradient(90deg, #2D4A2D, #3A5A40); }
  table.products thead th { padding: 10px 14px; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }
  .totals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .totals-box { border: 1.5px solid #C8E6C9; border-radius: 10px; overflow: hidden; }
  .totals-head { background: #2D4A2D; padding: 10px 16px; color: #A8D5BA; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
  .totals-body { background: #F6FBF6; padding: 12px 16px; }
  .grand-row { background: linear-gradient(135deg, #2D4A2D, #3A5A40); padding: 10px 16px; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; }
  .watermark { position: absolute; bottom: 140px; right: 30px; font-size: 80px; opacity: 0.04; color: #3A5A40; font-weight: 900; transform: rotate(-15deg); pointer-events: none; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
  .sig-box { border: 1px dashed #C8E6C9; border-radius: 8px; padding: 16px; text-align: center; }
  .sig-line { height: 40px; border-bottom: 1px solid #E8EDE8; margin-bottom: 6px; }
  .footer { border-top: 1.5px solid #C8E6C9; padding: 20px 40px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; background: #F6FBF6; }
  .footer-title { font-size: 10px; font-weight: 700; color: #2D4A2D; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .footer-text { font-size: 10px; color: #6B7280; line-height: 1.7; }
  .print-btn { display: block; text-align: center; padding: 14px 32px; background: linear-gradient(135deg,#3A5A40,#4A7A55); color: #fff; font-size: 14px; font-weight: 700; border-radius: 8px; text-decoration: none; margin: 24px auto; width: fit-content; cursor: pointer; border: none; }
  @media print {
    body { background: #fff; }
    .page { width: 100%; box-shadow: none; }
    .no-print { display: none !important; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>

<!-- Print / Download button (hidden when printing) -->
<div class="no-print" style="text-align:center;padding:16px;background:#F0F4F0;">
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <p style="font-size:12px;color:#6B7280;margin-top:6px;">Use browser's "Save as PDF" option when printing</p>
</div>

<div class="page">
  <!-- Watermark -->
  <div class="watermark">☕</div>

  <!-- Header -->
  <div class="header">
    <div>
      <p style="color:#A8D5BA;font-size:11px;margin:0 0 6px;letter-spacing:1.5px;text-transform:uppercase;">🌿 Tax Invoice / Delivery Invoice</p>
      <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0 0 4px;">Pushpagiri Coffee &amp; Spice</h1>
      <p style="color:#A8D5BA;font-size:11px;line-height:1.7;margin:0;">
        Pushpagiri, Main Rd, Choudlu, Karnataka 571236<br/>
        📞 +91 82772 61881 &nbsp;|&nbsp; ✉ info@pushpagiricoffee.com<br/>
        GSTIN: XXXXXXXXXXXX &nbsp;|&nbsp; FSSAI: Pending
      </p>
    </div>
    <div style="text-align:right;">
      <p style="color:#A8D5BA;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Invoice</p>
      <p style="color:#fff;font-size:18px;font-weight:800;margin:0;">${resolvedInvoice}</p>
      <p style="color:#A8D5BA;font-size:11px;margin:6px 0 0;">${formatDateReadable(resolvedDate)}</p>
      <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:6px;margin:8px 0 0 auto;display:flex;align-items:center;justify-content:center;border:1px solid rgba(168,213,186,0.4);">
        <span style="font-size:24px;color:#A8D5BA;">◻</span>
      </div>
      <p style="color:#6B8F73;font-size:9px;text-align:center;margin:2px 0 0;">QR Code</p>
    </div>
  </div>
  <div class="accent"></div>

  <!-- Body -->
  <div class="body">
    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-box">
        <p class="info-box-title">📋 Bill To</p>
        <p style="font-weight:700;font-size:14px;margin:0 0 6px;">${name}</p>
        <p style="color:#6B7280;font-size:12px;margin:0 0 3px;">📞 ${phone}</p>
        <p style="color:#6B7280;font-size:12px;margin:0 0 3px;">✉ ${email}</p>
        <p style="color:#6B7280;font-size:12px;margin:0;line-height:1.6;">🏠 ${address}</p>
        ${orderNotes ? `<p style="margin:8px 0 0;color:#9CA3AF;font-size:11px;font-style:italic;border-top:1px solid #E8EDE8;padding-top:6px;">📝 ${orderNotes}</p>` : ""}
      </div>
      <div class="info-box">
        <p class="info-box-title">🧾 Invoice Details</p>
        ${[
          ["Invoice Number", resolvedInvoice],
          ["Order ID", resolvedOrderNo],
          ["Date", formatDateReadable(resolvedDate)],
          ["Payment Mode", resolvedMethod.charAt(0).toUpperCase() + resolvedMethod.slice(1)],
          ["Razorpay Ref", "N/A (Pending)"],
        ].map(([l, v]) => `<div class="info-row"><span style="color:#6B7280;">${l}</span><span style="font-weight:600;">${v}</span></div>`).join("")}
      </div>
    </div>

    <!-- Product Table -->
    <table class="products">
      <thead>
        <tr>
          <th style="text-align:left;">Product Description</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:center;">Weight</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>

    <!-- Totals + Delivery Notes -->
    <div class="totals-grid">
      <div class="info-box">
        <p class="info-box-title">🚚 Delivery &amp; Notes</p>
        <ul style="padding:0 0 0 16px;color:#6B7280;font-size:12px;line-height:2;">
          <li>Handle with care — perishable goods</li>
          <li>Deliver to address as specified above</li>
          <li>Contact customer before delivery</li>
          <li>Estimated delivery: 3–7 business days</li>
        </ul>
        <div style="margin-top:14px;border-top:1px solid #C8E6C9;padding-top:10px;">
          <p style="color:#3A5A40;font-size:12px;font-weight:600;margin:0;">🌿 Thank you for choosing Pushpagiri Coffee &amp; Spice!</p>
          <p style="color:#9CA3AF;font-size:10px;margin:4px 0 0;">Order Tracking: Coming Soon &nbsp;|&nbsp; Track ID: ${resolvedOrderNo}</p>
        </div>
      </div>
      <div class="totals-box">
        <div class="totals-head">Price Breakdown</div>
        <div class="totals-body">
          <table style="width:100%;font-size:13px;">
            <tr><td style="color:#6B7280;padding:4px 0;">Subtotal</td><td style="text-align:right;">${formatINR(resolvedSubtotal)}</td></tr>
            <tr><td style="color:#6B7280;padding:4px 0;">Shipping</td><td style="text-align:right;${resolvedShipping === 0 ? "color:#059669;font-weight:600;" : ""}">${resolvedShipping === 0 ? "FREE" : formatINR(resolvedShipping)}</td></tr>

            <tr><td colspan="2" style="padding:6px 0;"><div style="height:1px;background:#C8E6C9;"></div></td></tr>
            <tr><td style="color:#6B7280;font-size:11px;padding:3px 0;">Tax (Incl.)</td><td style="text-align:right;color:#9CA3AF;font-size:11px;">GST Pending</td></tr>
          </table>
        </div>
        <div class="grand-row">
          <span style="color:#A8D5BA;font-weight:700;font-size:14px;">GRAND TOTAL</span>
          <span style="color:#fff;font-weight:800;font-size:18px;">${formatINR(resolvedTotal)}</span>
        </div>
      </div>
    </div>

    <!-- Signatures -->
    <div class="sig-grid">
      <div class="sig-box">
        <div class="sig-line"></div>
        <p style="font-size:10px;color:#9CA3AF;">Customer Signature</p>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <p style="font-size:10px;color:#9CA3AF;">Authorized Signatory — Pushpagiri Coffee &amp; Spice</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>
      <div class="footer-title">Terms &amp; Conditions</div>
      <ul class="footer-text" style="padding:0 0 0 14px;">
        <li>Goods once sold will not be taken back unless damaged.</li>
        <li>Please inspect on delivery.</li>
        <li>Subject to Karnataka jurisdiction.</li>
      </ul>
    </div>
    <div style="text-align:center;">
      <div class="footer-title">Pushpagiri Coffee &amp; Spice</div>
      <p class="footer-text">Pushpagiri, Main Rd<br/>Choudlu, Karnataka 571236<br/>+91 82772 61881<br/>info@pushpagiricoffee.com</p>
    </div>
    <div style="text-align:right;">
      <div class="footer-title">Invoice Info</div>
      <p class="footer-text">Invoice: ${resolvedInvoice}<br/>Order: ${resolvedOrderNo}<br/>Date: ${formatDateReadable(resolvedDate)}<br/><span style="color:#3A5A40;font-weight:700;">🌿 From Coorg with ♥</span></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── GET Handler ──────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Fetch order from Firestore
    if (!adminDb) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const docSnap = await adminDb.collection("orders").doc(orderId).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = { ...docSnap.data(), orderId } as Record<string, unknown>;
    const html = buildPrintableInvoiceHTML(orderData);

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Invoice API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
