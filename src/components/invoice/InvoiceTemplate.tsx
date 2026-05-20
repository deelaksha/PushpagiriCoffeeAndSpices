"use client";

// ============================================================
// InvoiceTemplate.tsx — Premium A4 PDF Invoice
// Hidden component rendered client-side, captured via html2canvas
// then exported as PDF with jsPDF.
// ============================================================

import React from "react";
import type { OrderEmailData } from "@/lib/invoiceHelpers";

interface InvoiceTemplateProps {
  order: OrderEmailData;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(isoString));
}

// ─── Styles (inline for pdf capture compatibility) ────────────────────────────

const S = {
  page: {
    width: "794px",          // A4 at 96dpi
    minHeight: "1123px",
    backgroundColor: "#FFFFFF",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: "13px",
    color: "#1A2E1A",
    position: "relative" as const,
    overflow: "hidden",
  },
  // Light green watermark-style bar top
  headerBar: {
    background: "linear-gradient(135deg,#2D4A2D 0%,#3A5A40 60%,#4A7A55 100%)",
    padding: "28px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyName: {
    color: "#FFFFFF",
    fontSize: "20px",
    fontWeight: "800",
    margin: "0 0 4px",
    letterSpacing: "-0.3px",
  },
  companyMeta: {
    color: "#A8D5BA",
    fontSize: "11px",
    lineHeight: "1.7",
    margin: 0,
  },
  invoiceBadge: {
    textAlign: "right" as const,
  },
  invoiceTitle: {
    color: "#A8D5BA",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    margin: "0 0 4px",
  },
  invoiceNumber: {
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: "800",
    margin: 0,
  },
  // Green accent stripe below header
  accentStripe: {
    height: "4px",
    background: "linear-gradient(90deg,#A8D5BA,#3A5A40,#6F4E37)",
  },
  body: {
    padding: "32px 40px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "28px",
  },
  infoBox: {
    background: "#F6FBF6",
    border: "1.5px solid #C8E6C9",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  infoBoxTitle: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "#3A5A40",
    margin: "0 0 10px",
    paddingBottom: "6px",
    borderBottom: "1px solid #C8E6C9",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "3px 0",
    fontSize: "12px",
  },
  infoLabel: { color: "#6B7280" },
  infoValue: { color: "#1A2E1A", fontWeight: "600" },
  // Product table
  tableWrapper: {
    border: "1.5px solid #C8E6C9",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "24px",
  },
  tableHead: {
    background: "linear-gradient(90deg,#2D4A2D,#3A5A40)",
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1.2fr 1.2fr",
    padding: "10px 16px",
  },
  tableHeadCell: {
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    textTransform: "uppercase" as const,
  },
  tableRow: (even: boolean) => ({
    display: "grid" as const,
    gridTemplateColumns: "3fr 1fr 1fr 1.2fr 1.2fr",
    padding: "12px 16px",
    background: even ? "#FAFDF8" : "#FFFFFF",
    borderBottom: "1px solid #E8F4E8",
    alignItems: "center" as const,
  }),
  productName: {
    fontWeight: "600",
    color: "#1A2E1A",
    fontSize: "13px",
  },
  productId: {
    fontSize: "10px",
    color: "#9CA3AF",
    marginTop: "2px",
  },
  // Totals section
  totalsWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
  },
  deliveryBox: {
    background: "#F6FBF6",
    border: "1.5px solid #C8E6C9",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  totalsBox: {
    border: "1.5px solid #C8E6C9",
    borderRadius: "10px",
    overflow: "hidden",
  },
  totalsBoxHead: {
    background: "#2D4A2D",
    padding: "10px 16px",
    color: "#A8D5BA",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
  },
  totalsBoxBody: {
    background: "#F6FBF6",
    padding: "12px 16px",
  },
  totalsRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: "13px",
  },
  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 16px",
    background: "linear-gradient(135deg,#2D4A2D,#3A5A40)",
    borderRadius: "0 0 8px 8px",
  },
  // Decorative watermark
  watermark: {
    position: "absolute" as const,
    bottom: "140px",
    right: "30px",
    fontSize: "80px",
    opacity: 0.04,
    color: "#3A5A40",
    fontWeight: "900",
    transform: "rotate(-15deg)",
    userSelect: "none" as const,
    pointerEvents: "none" as const,
  },
  // Footer
  footer: {
    borderTop: "1.5px solid #C8E6C9",
    padding: "20px 40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    background: "#F6FBF6",
  },
  footerSection: {
    fontSize: "10px",
    color: "#6B7280",
    lineHeight: "1.7",
  },
  footerTitle: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#2D4A2D",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
  },
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order }, ref) => {
    const {
      orderId, orderNumber, invoiceNumber, invoiceDate,
      customerName, customerEmail, customerPhone,
      shippingAddress, orderNotes,
      items, subtotal, shippingCost, discount, grandTotal,
      paymentMethod,
    } = order;

    const totalQty = items.reduce((a, b) => a + b.quantity, 0);

    return (
      <div ref={ref} style={S.page}>

        {/* ── Watermark ────────────────────────────────────────── */}
        <div style={S.watermark}>☕</div>

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={S.headerBar}>
          <div>
            <p style={{ color: "#A8D5BA", fontSize: "11px", margin: "0 0 6px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              🌿 &nbsp;Tax Invoice / Delivery Invoice
            </p>
            <h1 style={S.companyName}>Pushpagiri Coffee &amp; Spice</h1>
            <p style={S.companyMeta}>
              Pushpagiri, Main Rd, Choudlu, Karnataka 571236<br />
              📞 +91 82772 61881 &nbsp;|&nbsp; ✉ info@pushpagiricoffee.com<br />
              GSTIN: XXXXXXXXXXXX &nbsp;|&nbsp; FSSAI: Pending
            </p>
          </div>
          <div style={S.invoiceBadge}>
            <p style={S.invoiceTitle}>Invoice</p>
            <p style={S.invoiceNumber}>{invoiceNumber}</p>
            <p style={{ color: "#A8D5BA", fontSize: "11px", margin: "6px 0 0" }}>
              {formatDate(invoiceDate)}
            </p>
            {/* QR Placeholder */}
            <div style={{
              width: "60px", height: "60px", background: "rgba(255,255,255,0.15)",
              borderRadius: "6px", marginTop: "8px", marginLeft: "auto",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(168,213,186,0.4)",
            }}>
              <span style={{ fontSize: "24px" }}>◻</span>
            </div>
            <p style={{ color: "#6B8F73", fontSize: "9px", textAlign: "center", margin: "2px 0 0" }}>QR Code</p>
          </div>
        </div>

        {/* ── Accent Stripe ─────────────────────────────────────── */}
        <div style={S.accentStripe} />

        {/* ── Body ─────────────────────────────────────────────── */}
        <div style={S.body}>

          {/* Info Grid */}
          <div style={S.infoGrid}>

            {/* Billing Info */}
            <div style={S.infoBox}>
              <p style={S.infoBoxTitle}>📋 &nbsp;Bill To</p>
              <p style={{ margin: "0 0 6px", fontWeight: "700", fontSize: "14px", color: "#1A2E1A" }}>{customerName}</p>
              <p style={{ margin: "0 0 3px", color: "#6B7280", fontSize: "12px" }}>📞 {customerPhone}</p>
              <p style={{ margin: "0 0 3px", color: "#6B7280", fontSize: "12px" }}>✉ {customerEmail}</p>
              <p style={{ margin: "0", color: "#6B7280", fontSize: "12px", lineHeight: "1.6" }}>🏠 {shippingAddress}</p>
              {orderNotes && (
                <p style={{ margin: "8px 0 0", color: "#9CA3AF", fontSize: "11px", fontStyle: "italic", borderTop: "1px solid #E8EDE8", paddingTop: "6px" }}>
                  📝 Note: {orderNotes}
                </p>
              )}
            </div>

            {/* Invoice Details */}
            <div style={S.infoBox}>
              <p style={S.infoBoxTitle}>🧾 &nbsp;Invoice Details</p>
              {[
                ["Invoice Number", invoiceNumber],
                ["Order ID", orderNumber],
                ["Document ID", orderId.slice(0, 12) + "…"],
                ["Invoice Date", formatDate(invoiceDate)],
                ["Payment Mode", paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)],
                ["Total Items", String(totalQty)],
                ["Razorpay Ref", "N/A (Pending)"],  // Razorpay placeholder
              ].map(([label, val]) => (
                <div key={label} style={S.infoRow}>
                  <span style={S.infoLabel}>{label}</span>
                  <span style={S.infoValue}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Table */}
          <div style={S.tableWrapper}>
            {/* Table Header */}
            <div style={S.tableHead}>
              {["Product Description", "Qty", "Weight", "Unit Price", "Total"].map((h, i) => (
                <div key={h} style={{ ...S.tableHeadCell, textAlign: i > 1 ? "right" : "left" } as React.CSSProperties}>{h}</div>
              ))}
            </div>
            {/* Table Rows */}
            {items.map((item, idx) => (
              <div key={item.productId + idx} style={S.tableRow(idx % 2 === 0)}>
                <div>
                  <div style={S.productName}>{item.productName}</div>
                  <div style={S.productId}>Product ID: {item.productId}</div>
                </div>
                <div style={{ textAlign: "center", fontWeight: "600", color: "#3A5A40" }}>{item.quantity}</div>
                <div style={{ textAlign: "center", color: "#6B7280", fontSize: "12px" }}>{item.weight}</div>
                <div style={{ textAlign: "right", color: "#374151" }}>{formatINR(item.price)}</div>
                <div style={{ textAlign: "right", fontWeight: "700", color: "#2D4A2D" }}>{formatINR(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Delivery Notes + Totals */}
          <div style={S.totalsWrapper}>
            {/* Delivery Notes */}
            <div style={S.deliveryBox}>
              <p style={{ ...S.infoBoxTitle, margin: "0 0 8px" }}>🚚 &nbsp;Delivery &amp; Notes</p>
              <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#6B7280", fontSize: "12px", lineHeight: "2" }}>
                <li>Handle with care — perishable goods</li>
                <li>Deliver to address as specified above</li>
                <li>Contact customer before delivery</li>
                <li>Estimated delivery: 3–7 business days</li>
              </ul>
              <div style={{ marginTop: "14px", borderTop: "1px solid #C8E6C9", paddingTop: "10px" }}>
                <p style={{ margin: 0, color: "#3A5A40", fontSize: "12px", fontWeight: "600" }}>
                  🌿 Thank you for choosing Pushpagiri Coffee &amp; Spice!
                </p>
                <p style={{ margin: "4px 0 0", color: "#9CA3AF", fontSize: "10px" }}>
                  Order Tracking: Coming Soon &nbsp;|&nbsp; Track ID: {orderNumber}
                </p>
              </div>
            </div>

            {/* Totals */}
            <div style={S.totalsBox}>
              <div style={S.totalsBoxHead}>Price Breakdown</div>
              <div style={S.totalsBoxBody}>
                <div style={S.totalsRow}>
                  <span style={{ color: "#6B7280" }}>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div style={S.totalsRow}>
                  <span style={{ color: "#6B7280" }}>Shipping</span>
                  <span style={shippingCost === 0 ? { color: "#059669", fontWeight: "600" } : {}}>
                    {shippingCost === 0 ? "FREE" : formatINR(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div style={S.totalsRow}>
                    <span style={{ color: "#6B7280" }}>Discount</span>
                    <span style={{ color: "#059669" }}>−{formatINR(discount)}</span>
                  </div>
                )}
                <div style={{ height: "1px", background: "#C8E6C9", margin: "8px 0" }} />
                <div style={S.totalsRow}>
                  <span style={{ color: "#6B7280", fontSize: "11px" }}>Tax (Incl.)</span>
                  <span style={{ color: "#9CA3AF", fontSize: "11px" }}>GST Pending</span>
                </div>
              </div>
              <div style={S.grandTotalRow}>
                <span style={{ color: "#A8D5BA", fontWeight: "700", fontSize: "14px" }}>GRAND TOTAL</span>
                <span style={{ color: "#FFFFFF", fontWeight: "800", fontSize: "18px" }}>{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
            <div style={{ border: "1px dashed #C8E6C9", borderRadius: "8px", padding: "16px", textAlign: "center" as const }}>
              <div style={{ height: "40px", borderBottom: "1px solid #E8EDE8", marginBottom: "6px" }} />
              <p style={{ margin: 0, fontSize: "10px", color: "#9CA3AF" }}>Customer Signature</p>
            </div>
            <div style={{ border: "1px dashed #C8E6C9", borderRadius: "8px", padding: "16px", textAlign: "center" as const }}>
              <div style={{ height: "40px", borderBottom: "1px solid #E8EDE8", marginBottom: "6px" }} />
              <p style={{ margin: 0, fontSize: "10px", color: "#9CA3AF" }}>Authorized Signatory — Pushpagiri Coffee &amp; Spice</p>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div style={S.footer}>
          <div style={S.footerSection}>
            <div style={S.footerTitle}>Terms &amp; Conditions</div>
            <ul style={{ margin: 0, padding: "0 0 0 14px", lineHeight: "1.8" }}>
              <li>Goods once sold will not be taken back unless damaged.</li>
              <li>Please inspect on delivery.</li>
              <li>Subject to Karnataka jurisdiction.</li>
            </ul>
          </div>
          <div style={{ ...S.footerSection, textAlign: "center" as const }}>
            <div style={S.footerTitle}>Pushpagiri Coffee &amp; Spice</div>
            <p style={{ margin: 0 }}>
              Pushpagiri, Main Rd<br />
              Choudlu, Karnataka 571236<br />
              +91 82772 61881<br />
              info@pushpagiricoffee.com
            </p>
          </div>
          <div style={{ ...S.footerSection, textAlign: "right" as const }}>
            <div style={S.footerTitle}>Invoice Info</div>
            <p style={{ margin: 0 }}>
              Invoice: {invoiceNumber}<br />
              Order: {orderNumber}<br />
              Date: {formatDate(invoiceDate)}<br />
              <span style={{ color: "#3A5A40", fontWeight: "700" }}>🌿 From Coorg with ♥</span>
            </p>
          </div>
        </div>

      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
export default InvoiceTemplate;
