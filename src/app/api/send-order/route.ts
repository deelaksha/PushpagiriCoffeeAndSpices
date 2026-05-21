// ============================================================
// /api/send-order/route.ts — Premium Email Sender
// ============================================================
// Sends two emails per order:
//   1. Customer: beautiful order confirmation with PDF attached
//   2. Admin/Owner: full data-dense notification with PDF attached
// ============================================================

import nodemailer from "nodemailer";
import type { NextRequest } from "next/server";
import {
  generateInvoiceNumber,
  generateCustomerEmailHTML,
  generateAdminEmailHTML,
  type OrderEmailData,
} from "@/lib/invoiceHelpers";
import { adminDb } from "@/lib/firebase/admin";

// ─── Nodemailer Transporter ───────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

// ─── Retry Helper ─────────────────────────────────────────────────────────────

async function sendWithRetry(
  transporter: ReturnType<typeof createTransporter>,
  mailOptions: object,
  attempts = 3
): Promise<void> {
  for (let i = 1; i <= attempts; i++) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (err) {
      if (i === attempts) throw err;
      console.warn(`[Email] Attempt ${i} failed, retrying…`, err);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firestoreDocId,   // Firestore document id for updating
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderNotes,
      items,            // OrderItemData[]
      subtotal,
      shippingCost,

      grandTotal,
      paymentMethod,
      paymentStatus,
      orderStatus,
      pdfBase64,        // base64 PDF string from client, may be null
    } = body;

    // Validate minimum required fields
    if (!orderNumber || !customerEmail || !items?.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required order fields" }),
        { status: 400 }
      );
    }

    // ── Generate Invoice Number ──────────────────────────────────────────────
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate   = new Date().toISOString();

    // Build the invoice download URL (public endpoint)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pushpagiricoffee.com";
    const invoiceDownloadUrl = `${baseUrl}/api/invoice/${firestoreDocId}`;

    const orderData: OrderEmailData = {
      orderId:     firestoreDocId ?? orderNumber,
      orderNumber,
      invoiceNumber,
      invoiceDate,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderNotes,
      items,
      subtotal,
      shippingCost: shippingCost ?? 0,

      grandTotal,
      paymentMethod: paymentMethod ?? "pending",
      paymentStatus: paymentStatus ?? "pending",
      orderStatus:   orderStatus ?? "processing",
      invoiceDownloadUrl,
    };

    // ── Build Email HTML ──────────────────────────────────────────────────────
    const customerHTML = generateCustomerEmailHTML(orderData);
    const adminHTML    = generateAdminEmailHTML(orderData);

    // ── Build PDF Attachment ──────────────────────────────────────────────────
    const pdfAttachment = pdfBase64
      ? [
          {
            filename: `${invoiceNumber}.pdf`,
            content:  Buffer.from(pdfBase64, "base64"),
            contentType: "application/pdf",
          },
        ]
      : [];

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "developerdeelaksha@gmail.com";
    const FROM_EMAIL  = process.env.EMAIL_FROM  || process.env.EMAIL_USER;

    const transporter = createTransporter();

    // ── Send Customer Email ───────────────────────────────────────────────────
    if (customerEmail && customerEmail.includes("@")) {
      await sendWithRetry(transporter, {
        from:        `"Pushpagiri Coffee & Spice" <${FROM_EMAIL}>`,
        to:          customerEmail,
        subject:     `✅ Order Confirmed — ${orderNumber} | Pushpagiri Coffee & Spice`,
        html:        customerHTML,
        attachments: pdfAttachment,
      });
    }

    // ── Send Admin Email ──────────────────────────────────────────────────────
    await sendWithRetry(transporter, {
      from:        `"Pushpagiri Orders" <${FROM_EMAIL}>`,
      to:          ADMIN_EMAIL,
      subject:     `🛎 New Order ${orderNumber} — ${customerName} — ₹${grandTotal}`,
      html:        adminHTML,
      attachments: pdfAttachment,
    });

    // ── Update Firestore with Invoice Info ────────────────────────────────────
    if (firestoreDocId && adminDb) {
      try {
        await adminDb.collection("orders").doc(firestoreDocId).update({
          invoiceNumber,
          invoiceDate,
          emailSent:           true,
          emailSentAt:         new Date().toISOString(),
          invoiceDownloadUrl,
          // Firebase Storage placeholder — upload PDF here in future
          invoiceStorageUrl:   null,
        });
      } catch (dbErr) {
        // Non-fatal: log but don't fail the email response
        console.error("[Email] Firestore update failed:", dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        success:       true,
        invoiceNumber,
        invoiceDate,
        invoiceDownloadUrl,
        message:       "Emails sent successfully",
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("[Email] send-order failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:   error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
