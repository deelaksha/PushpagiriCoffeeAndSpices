// ============================================================
// PUSHPAGIRI COFFEE & SPICE — Invoice Helpers
// ============================================================
// Provides: invoice number generation, INR formatting,
//           and complete HTML builders for customer + admin emails.
// ============================================================

export interface OrderItemData {
  productId: string;
  productName: string;
  quantity: number;
  weight: string;
  price: number;         // unit price (per chosen weight)
  image?: string;
}

export interface OrderEmailData {
  orderId: string;           // Firestore doc id, e.g. "abc123"
  orderNumber: string;       // human-readable, e.g. "PCS-123456"
  invoiceNumber: string;     // e.g. "INV-20260520-0042"
  invoiceDate: string;       // ISO date string
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;   // formatted single string
  orderNotes?: string;
  items: OrderItemData[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  invoiceDownloadUrl?: string;  // absolute URL to /api/invoice/[orderId]
  storeName?: string;           // defaults to "Pushpagiri Coffee & Spice"
}

// ─── Invoice Number ──────────────────────────────────────────────────────────

/**
 * Generates a unique invoice number in INV-YYYYMMDD-XXXX format.
 * Called once per order at the time of email generation.
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");                              // "20260520"
  const seq = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `INV-${date}-${seq}`;
}

// ─── Formatting Helpers ──────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateReadable(isoString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(isoString));
}

function paymentStatusBadge(status: string): string {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    paid:    { bg: "#D1FAE5", color: "#065F46", label: "✓ Paid" },
    pending: { bg: "#FEF3C7", color: "#92400E", label: "⏳ Pending" },
    refunded:{ bg: "#FEE2E2", color: "#991B1B", label: "↩ Refunded" },
  };
  const entry = map[status] ?? { bg: "#F3F4F6", color: "#374151", label: status };
  return `<span style="background:${entry.bg};color:${entry.color};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">${entry.label}</span>`;
}

function orderStatusBadge(status: string): string {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    processing: { bg: "#DBEAFE", color: "#1E40AF", label: "🔄 Processing" },
    confirmed:  { bg: "#D1FAE5", color: "#065F46", label: "✓ Confirmed" },
    shipped:    { bg: "#EDE9FE", color: "#5B21B6", label: "📦 Shipped" },
    delivered:  { bg: "#D1FAE5", color: "#065F46", label: "🏠 Delivered" },
    cancelled:  { bg: "#FEE2E2", color: "#991B1B", label: "✕ Cancelled" },
    pending:    { bg: "#FEF3C7", color: "#92400E", label: "⏳ Pending" },
  };
  const entry = map[status] ?? { bg: "#F3F4F6", color: "#374151", label: status };
  return `<span style="background:${entry.bg};color:${entry.color};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">${entry.label}</span>`;
}

// ─── Product Rows ─────────────────────────────────────────────────────────────

function buildProductRows(items: OrderItemData[]): string {
  return items
    .map((item, i) => {
      const rowBg = i % 2 === 0 ? "#FAFAF8" : "#FFFFFF";
      const lineTotal = item.price * item.quantity;
      return `
      <tr style="background:${rowBg};">
        <td style="padding:14px 16px;border-bottom:1px solid #E8EDE8;">
          <div style="font-weight:600;color:#1A2E1A;font-size:14px;">${item.productName}</div>
          <div style="color:#6B7280;font-size:12px;margin-top:2px;">Product ID: ${item.productId}</div>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #E8EDE8;text-align:center;color:#3A5A40;font-weight:600;">×${item.quantity}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #E8EDE8;text-align:center;color:#6B7280;font-size:13px;">${item.weight}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #E8EDE8;text-align:right;color:#374151;">${formatINR(item.price)}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #E8EDE8;text-align:right;font-weight:700;color:#3A5A40;">${formatINR(lineTotal)}</td>
      </tr>`;
    })
    .join("");
}

// ─── Customer Email HTML ──────────────────────────────────────────────────────

/**
 * Builds the premium order confirmation HTML email for the customer.
 */
export function generateCustomerEmailHTML(order: OrderEmailData): string {
  const {
    orderNumber, invoiceNumber, invoiceDate, customerName, customerPhone,
    shippingAddress, orderNotes, items, subtotal, shippingCost,
    discount, grandTotal, paymentMethod, paymentStatus, orderStatus,
    invoiceDownloadUrl,
  } = order;

  const readableDate = formatDateReadable(invoiceDate);
  const whatsappUrl = `https://wa.me/918277261881?text=${encodeURIComponent(`Hi, I need help with my order ${orderNumber}`)}`;
  const storeUrl = "https://pushpagiricoffee.com";
  const downloadUrl = invoiceDownloadUrl ?? "#";

  const productRows = buildProductRows(items);
  const shippingLine = shippingCost === 0
    ? `<tr><td style="padding:6px 0;color:#6B7280;">Shipping</td><td style="padding:6px 0;text-align:right;color:#059669;font-weight:600;">FREE</td></tr>`
    : `<tr><td style="padding:6px 0;color:#6B7280;">Shipping</td><td style="padding:6px 0;text-align:right;">${formatINR(shippingCost)}</td></tr>`;


  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Order Confirmed — ${orderNumber}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F0F4F0;font-family:'Segoe UI',Arial,sans-serif;-webkit-text-size-adjust:100%;">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;color:#F0F4F0;">
  Your order ${orderNumber} is confirmed! Thank you for choosing Pushpagiri Coffee &amp; Spice. 🌿
</div>

<!-- Email Wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4F0;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- ═══ HEADER ═══ -->
  <tr><td style="background:linear-gradient(135deg,#2D4A2D 0%,#3A5A40 50%,#4A7A55 100%);border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
    <!-- Logo placeholder leaf icon -->
    <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;line-height:64px;">🌿</div>
    <h1 style="margin:0 0 6px;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Pushpagiri Coffee &amp; Spice</h1>
    <p style="margin:0 0 16px;color:#A8D5BA;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">From the Misty Hills of Coorg</p>
    <!-- Order confirmed badge -->
    <div style="display:inline-block;background:rgba(168,213,186,0.25);border:1.5px solid #A8D5BA;border-radius:24px;padding:8px 20px;">
      <span style="color:#A8D5BA;font-size:13px;font-weight:700;letter-spacing:0.5px;">✓ &nbsp;ORDER CONFIRMED</span>
    </div>
  </td></tr>

  <!-- ═══ THANK YOU ═══ -->
  <tr><td style="background:#FFFFFF;padding:36px 40px 28px;text-align:center;">
    <div style="font-size:40px;margin-bottom:12px;">🎉</div>
    <h2 style="margin:0 0 10px;color:#2D4A2D;font-size:24px;font-weight:700;">Thank you, ${customerName.split(" ")[0]}!</h2>
    <p style="margin:0 0 8px;color:#4A5568;font-size:15px;line-height:1.7;">
      Your order has been placed successfully. We're thrilled to bring the finest organic
      coffee &amp; spices from the misty hills of Coorg right to your doorstep.
    </p>
    <p style="margin:0;color:#6B7280;font-size:13px;">
      We'll reach out on WhatsApp shortly to confirm payment and delivery details.
    </p>
  </td></tr>

  <!-- ═══ ORDER SUMMARY CARD ═══ -->
  <tr><td style="background:#FFFFFF;padding:0 40px 28px;">
    <div style="background:#F6FBF6;border:1.5px solid #C8E6C9;border-radius:12px;padding:24px;">
      <h3 style="margin:0 0 16px;color:#2D4A2D;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Order Details</h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;width:45%;">Order Number</td>
          <td style="padding:5px 0;color:#1A2E1A;font-weight:700;font-size:13px;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Invoice Number</td>
          <td style="padding:5px 0;color:#1A2E1A;font-weight:700;font-size:13px;">${invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Order Date</td>
          <td style="padding:5px 0;color:#1A2E1A;font-size:13px;">${readableDate}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Payment Status</td>
          <td style="padding:5px 0;">${paymentStatusBadge(paymentStatus)}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Order Status</td>
          <td style="padding:5px 0;">${orderStatusBadge(orderStatus)}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Contact Phone</td>
          <td style="padding:5px 0;color:#1A2E1A;font-size:13px;">${customerPhone}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#6B7280;font-size:13px;">Payment Method</td>
          <td style="padding:5px 0;color:#1A2E1A;font-size:13px;text-transform:capitalize;">${paymentMethod}</td>
        </tr>
      </table>
    </div>
  </td></tr>

  <!-- ═══ PRODUCT TABLE ═══ -->
  <tr><td style="background:#FFFFFF;padding:0 40px 28px;">
    <h3 style="margin:0 0 14px;color:#2D4A2D;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Items Ordered</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E8EDE8;border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <thead>
        <tr style="background:linear-gradient(90deg,#3A5A40,#4A7A55);">
          <th style="padding:12px 16px;text-align:left;color:#FFFFFF;font-size:12px;font-weight:600;letter-spacing:0.5px;">PRODUCT</th>
          <th style="padding:12px 8px;text-align:center;color:#FFFFFF;font-size:12px;font-weight:600;">QTY</th>
          <th style="padding:12px 8px;text-align:center;color:#FFFFFF;font-size:12px;font-weight:600;">WEIGHT</th>
          <th style="padding:12px 8px;text-align:right;color:#FFFFFF;font-size:12px;font-weight:600;">UNIT</th>
          <th style="padding:12px 16px;text-align:right;color:#FFFFFF;font-size:12px;font-weight:600;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
  </td></tr>

  <!-- ═══ CUSTOMER DETAILS + PRICE BREAKDOWN ═══ -->
  <tr><td style="background:#FFFFFF;padding:0 40px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <!-- Customer Details -->
        <td style="width:50%;vertical-align:top;padding-right:12px;">
          <div style="background:#F6FBF6;border:1.5px solid #C8E6C9;border-radius:12px;padding:20px;">
            <h3 style="margin:0 0 12px;color:#2D4A2D;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">📍 Delivery Details</h3>
            <p style="margin:0 0 6px;font-weight:700;color:#1A2E1A;font-size:14px;">${customerName}</p>
            <p style="margin:0 0 4px;color:#6B7280;font-size:13px;">📞 ${customerPhone}</p>
            <p style="margin:0 0 4px;color:#6B7280;font-size:13px;line-height:1.6;">🏠 ${shippingAddress}</p>
            ${orderNotes ? `<p style="margin:8px 0 0;color:#6B7280;font-size:12px;font-style:italic;border-top:1px solid #E8EDE8;padding-top:8px;">📝 ${orderNotes}</p>` : ""}
          </div>
        </td>
        <!-- Price Breakdown -->
        <td style="width:50%;vertical-align:top;padding-left:12px;">
          <div style="background:#F6FBF6;border:1.5px solid #C8E6C9;border-radius:12px;padding:20px;">
            <h3 style="margin:0 0 12px;color:#2D4A2D;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">💰 Price Summary</h3>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
              <tr><td style="padding:6px 0;color:#6B7280;">Subtotal</td><td style="padding:6px 0;text-align:right;">${formatINR(subtotal)}</td></tr>
              ${shippingLine}

              <tr><td colspan="2" style="padding:6px 0;"><div style="height:1px;background:#C8E6C9;"></div></td></tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#1A2E1A;font-size:15px;">Grand Total</td>
                <td style="padding:8px 0;text-align:right;font-weight:800;color:#2D4A2D;font-size:18px;">${formatINR(grandTotal)}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ═══ DELIVERY MESSAGE ═══ -->
  <tr><td style="background:#FFFFFF;padding:0 40px 28px;">
    <div style="background:linear-gradient(135deg,#F6FBF6,#EDF7EE);border-left:4px solid #3A5A40;border-radius:0 12px 12px 0;padding:20px 24px;">
      <h3 style="margin:0 0 8px;color:#2D4A2D;font-size:15px;font-weight:700;">🚚 What Happens Next?</h3>
      <ul style="margin:0;padding:0 0 0 18px;color:#4A5568;font-size:13px;line-height:2;">
        <li>Our team will confirm your order via <strong>WhatsApp</strong> within 24 hours.</li>
        <li>Payment details (UPI/Bank transfer) will be shared on WhatsApp.</li>
        <li>Your order ships within <strong>2–3 business days</strong> after payment.</li>
        <li>Standard delivery: <strong>3–7 business days</strong> across India.</li>
      </ul>
      <p style="margin:12px 0 0;color:#6B7280;font-size:12px;">
        Questions? Call us at <strong>+91 82772 61881</strong> or email <strong>info@pushpagiricoffee.com</strong>
      </p>
    </div>
  </td></tr>

  <!-- ═══ CTA BUTTONS ═══ -->
  <tr><td style="background:#FFFFFF;padding:0 40px 36px;text-align:center;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="padding:0 6px;">
          <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#3A5A40,#4A7A55);color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">
            📥 Download Invoice
          </a>
        </td>
        <td style="padding:0 6px;">
          <a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">
            💬 WhatsApp Us
          </a>
        </td>
        <td style="padding:0 6px;">
          <a href="${storeUrl}" style="display:inline-block;background:#6F4E37;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">
            🛍️ Visit Store
          </a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ═══ FOOTER ═══ -->
  <tr><td style="background:linear-gradient(135deg,#2D4A2D,#3A5A40);border-radius:0 0 16px 16px;padding:32px 40px;text-align:center;">
    <div style="margin-bottom:16px;">
      <a href="https://instagram.com/pushpagiricoffee" style="display:inline-block;width:32px;height:32px;background:rgba(255,255,255,0.15);border-radius:50%;color:#A8D5BA;text-decoration:none;line-height:32px;margin:0 4px;font-size:14px;">📷</a>
      <a href="https://facebook.com/pushpagiricoffee" style="display:inline-block;width:32px;height:32px;background:rgba(255,255,255,0.15);border-radius:50%;color:#A8D5BA;text-decoration:none;line-height:32px;margin:0 4px;font-size:14px;">👍</a>
      <a href="${whatsappUrl}" style="display:inline-block;width:32px;height:32px;background:rgba(255,255,255,0.15);border-radius:50%;color:#A8D5BA;text-decoration:none;line-height:32px;margin:0 4px;font-size:14px;">💬</a>
    </div>
    <p style="margin:0 0 6px;color:#A8D5BA;font-size:13px;font-weight:700;">Pushpagiri Coffee &amp; Spice</p>
    <p style="margin:0 0 4px;color:#6B8F73;font-size:12px;">Pushpagiri, Main Rd, Choudlu, Karnataka 571236</p>
    <p style="margin:0 0 16px;color:#6B8F73;font-size:12px;">+91 82772 61881 &nbsp;|&nbsp; info@pushpagiricoffee.com</p>
    <p style="margin:0;color:#4A6B4A;font-size:11px;">
      You received this email because you placed an order on Pushpagiri Coffee &amp; Spice.<br/>
      © ${new Date().getFullYear()} Pushpagiri Coffee &amp; Spice. All rights reserved.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Admin Email HTML ─────────────────────────────────────────────────────────

/**
 * Builds the admin/owner notification email. More data-dense than the
 * customer version. Includes the PDF invoice as an attachment (handled
 * separately via nodemailer attachments[]).
 */
export function generateAdminEmailHTML(order: OrderEmailData): string {
  const {
    orderId, orderNumber, invoiceNumber, invoiceDate, customerName,
    customerEmail, customerPhone, shippingAddress, orderNotes,
    items, subtotal, shippingCost, discount, grandTotal,
    paymentMethod, paymentStatus, orderStatus,
  } = order;

  const readableDate = formatDateReadable(invoiceDate);
  const productRows = buildProductRows(items);
  const whatsappUrl = `https://wa.me/91${customerPhone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hi ${customerName}, your order ${orderNumber} has been received!`)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>🛎 New Order — ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F4F0;font-family:'Segoe UI',Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:24px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Admin Header -->
  <tr><td style="background:linear-gradient(135deg,#1A3020,#2D4A2D);border-radius:12px 12px 0 0;padding:28px 32px;">
    <table width="100%"><tr>
      <td>
        <div style="color:#A8D5BA;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Admin Notification</div>
        <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:700;">🛎 New Order Received</h1>
      </td>
      <td style="text-align:right;">
        <div style="background:#A8D5BA;color:#1A3020;padding:8px 16px;border-radius:8px;font-weight:800;font-size:16px;">${orderNumber}</div>
        <div style="color:#6B8F73;font-size:11px;margin-top:4px;">${readableDate}</div>
      </td>
    </tr></table>
  </td></tr>

  <!-- Quick Stats Bar -->
  <tr><td style="background:#FFFFFF;padding:20px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="text-align:center;padding:0 8px;">
        <div style="font-size:11px;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Grand Total</div>
        <div style="font-size:22px;font-weight:800;color:#2D4A2D;">${formatINR(grandTotal)}</div>
      </td>
      <td style="width:1px;background:#E8EDE8;"></td>
      <td style="text-align:center;padding:0 8px;">
        <div style="font-size:11px;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Items</div>
        <div style="font-size:22px;font-weight:800;color:#2D4A2D;">${items.reduce((a, b) => a + b.quantity, 0)}</div>
      </td>
      <td style="width:1px;background:#E8EDE8;"></td>
      <td style="text-align:center;padding:0 8px;">
        <div style="font-size:11px;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Payment</div>
        <div>${paymentStatusBadge(paymentStatus)}</div>
      </td>
      <td style="width:1px;background:#E8EDE8;"></td>
      <td style="text-align:center;padding:0 8px;">
        <div style="font-size:11px;color:#6B7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Status</div>
        <div>${orderStatusBadge(orderStatus)}</div>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="background:#FFFFFF;padding:0 32px;"><div style="height:1px;background:#E8EDE8;"></div></td></tr>

  <!-- Customer Info -->
  <tr><td style="background:#FFFFFF;padding:24px 32px;">
    <h3 style="margin:0 0 14px;color:#2D4A2D;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Customer Details</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
      <tr>
        <td style="padding:5px 0;color:#6B7280;width:120px;">Name</td>
        <td style="padding:5px 0;color:#1A2E1A;font-weight:600;">${customerName}</td>
        <td style="padding:5px 0;color:#6B7280;width:120px;">Email</td>
        <td style="padding:5px 0;color:#1A2E1A;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#6B7280;">Phone</td>
        <td style="padding:5px 0;">
          <a href="${whatsappUrl}" style="color:#25D366;font-weight:600;text-decoration:none;">${customerPhone} 💬</a>
        </td>
        <td style="padding:5px 0;color:#6B7280;">Payment</td>
        <td style="padding:5px 0;color:#1A2E1A;text-transform:capitalize;">${paymentMethod}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#6B7280;vertical-align:top;">Address</td>
        <td colspan="3" style="padding:5px 0;color:#1A2E1A;">${shippingAddress}</td>
      </tr>
      ${orderNotes ? `<tr><td style="padding:5px 0;color:#6B7280;vertical-align:top;">Notes</td><td colspan="3" style="padding:5px 0;color:#6B7280;font-style:italic;">${orderNotes}</td></tr>` : ""}
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="background:#FFFFFF;padding:0 32px;"><div style="height:1px;background:#E8EDE8;"></div></td></tr>

  <!-- Products -->
  <tr><td style="background:#FFFFFF;padding:24px 32px;">
    <h3 style="margin:0 0 14px;color:#2D4A2D;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Items Ordered</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E8EDE8;border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <thead>
        <tr style="background:linear-gradient(90deg,#2D4A2D,#3A5A40);">
          <th style="padding:10px 14px;text-align:left;color:#FFFFFF;font-size:11px;font-weight:600;letter-spacing:0.5px;">PRODUCT</th>
          <th style="padding:10px 8px;text-align:center;color:#FFFFFF;font-size:11px;font-weight:600;">QTY</th>
          <th style="padding:10px 8px;text-align:center;color:#FFFFFF;font-size:11px;font-weight:600;">WEIGHT</th>
          <th style="padding:10px 8px;text-align:right;color:#FFFFFF;font-size:11px;font-weight:600;">UNIT</th>
          <th style="padding:10px 14px;text-align:right;color:#FFFFFF;font-size:11px;font-weight:600;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
    </table>
  </td></tr>

  <!-- Invoice Info + Totals -->
  <tr><td style="background:#FFFFFF;padding:0 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:50%;vertical-align:top;padding-right:12px;">
        <div style="background:#F6FBF6;border:1.5px solid #C8E6C9;border-radius:10px;padding:16px;">
          <h3 style="margin:0 0 10px;color:#2D4A2D;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Invoice Info</h3>
          <table width="100%" style="font-size:12px;">
            <tr><td style="color:#6B7280;padding:3px 0;">Invoice No</td><td style="color:#1A2E1A;font-weight:700;">${invoiceNumber}</td></tr>
            <tr><td style="color:#6B7280;padding:3px 0;">Order ID</td><td style="color:#1A2E1A;">${orderNumber}</td></tr>
            <tr><td style="color:#6B7280;padding:3px 0;">Doc ID</td><td style="color:#6B7280;font-size:11px;">${orderId}</td></tr>
            <tr><td style="color:#6B7280;padding:3px 0;">Date</td><td style="color:#1A2E1A;">${readableDate}</td></tr>
          </table>
        </div>
      </td>
      <td style="width:50%;vertical-align:top;padding-left:12px;">
        <div style="background:#F6FBF6;border:1.5px solid #C8E6C9;border-radius:10px;padding:16px;">
          <h3 style="margin:0 0 10px;color:#2D4A2D;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Price Summary</h3>
          <table width="100%" style="font-size:12px;">
            <tr><td style="color:#6B7280;padding:3px 0;">Subtotal</td><td style="text-align:right;">${formatINR(subtotal)}</td></tr>
            <tr><td style="color:#6B7280;padding:3px 0;">Shipping</td><td style="text-align:right;${shippingCost === 0 ? "color:#059669;font-weight:600;" : ""}">${shippingCost === 0 ? "FREE" : formatINR(shippingCost)}</td></tr>

            <tr><td colspan="2" style="padding:4px 0;"><div style="height:1px;background:#C8E6C9;"></div></td></tr>
            <tr><td style="color:#1A2E1A;font-weight:700;padding:4px 0;">Grand Total</td><td style="text-align:right;color:#2D4A2D;font-weight:800;font-size:15px;">${formatINR(grandTotal)}</td></tr>
          </table>
        </div>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Admin Action -->
  <tr><td style="background:#FFFFFF;padding:0 32px 32px;text-align:center;">
    <div style="background:#FEF9E7;border:1.5px solid #F9E79F;border-radius:10px;padding:14px 20px;margin-bottom:16px;">
      <p style="margin:0;color:#8B6914;font-size:13px;">
        ⚡ <strong>Action Required:</strong> Contact ${customerName} on WhatsApp to confirm payment and shipment.
      </p>
    </div>
    <a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;">
      💬 Reply on WhatsApp
    </a>
  </td></tr>

  <!-- Admin Footer -->
  <tr><td style="background:#1A3020;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
    <p style="margin:0;color:#4A6B4A;font-size:11px;">
      Pushpagiri Coffee &amp; Spice — Admin Notification<br/>
      Invoice PDF attached • ${invoiceNumber}<br/>
      © ${new Date().getFullYear()} Pushpagiri Coffee &amp; Spice
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
