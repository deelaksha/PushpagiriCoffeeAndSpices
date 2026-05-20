// ============================================================
// InvoicePDFGenerator.ts
// ============================================================
// Client-side PDF generation utility.
// Uses html2canvas to snapshot the hidden InvoiceTemplate div,
// then jsPDF to create a proper A4 PDF.
// ============================================================

import type { OrderEmailData } from "@/lib/invoiceHelpers";

/**
 * Captures the invoice DOM element and returns a base64-encoded PDF string.
 *
 * @param elementId - The DOM id of the hidden InvoiceTemplate wrapper div.
 * @returns base64 PDF string (without data: prefix) or null on failure.
 */
export async function generateInvoicePDF(elementId: string): Promise<string | null> {
  try {
    // Dynamic imports — these are large libs, lazy-load them
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[InvoicePDF] Element #${elementId} not found in DOM`);
      return null;
    }

    // Snapshot the element
    const canvas = await html2canvas(element, {
      scale: 2,                    // 2× for crisp text at A4 resolution
      useCORS: true,               // allow cross-origin product images
      backgroundColor: "#FFFFFF",
      logging: false,
      windowWidth: 794,            // A4 width at 96dpi
      onclone: (clonedDoc) => {
        // Make the element visible in the clone so html2canvas can render it
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.display = "block";
          el.style.visibility = "visible";
          el.style.position = "relative";
          el.style.left = "0";
          el.style.top = "0";
        }
      },
    });

    // A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = A4_W;
    const imgHeight = (canvas.height * A4_W) / canvas.width;

    // If content overflows a single page, add extra pages
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
    heightLeft -= A4_H;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= A4_H;
    }

    // Return raw base64 (no data: prefix)
    const base64 = pdf.output("datauristring").split(",")[1];
    return base64;
  } catch (error) {
    console.error("[InvoicePDF] PDF generation failed:", error);
    return null;
  }
}

/**
 * Triggers a browser download of the invoice PDF.
 *
 * @param elementId - DOM id of the hidden InvoiceTemplate wrapper.
 * @param fileName  - Downloaded filename, e.g. "INV-20260520-0042.pdf"
 */
export async function downloadInvoicePDF(
  elementId: string,
  fileName: string
): Promise<void> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[InvoicePDF] Element #${elementId} not found in DOM`);
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      windowWidth: 794,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.display = "block";
          el.style.visibility = "visible";
          el.style.position = "relative";
          el.style.left = "0";
          el.style.top = "0";
        }
      },
    });

    const A4_W = 210;
    const A4_H = 297;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const imgWidth = A4_W;
    const imgHeight = (canvas.height * A4_W) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= A4_H;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= A4_H;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("[InvoicePDF] PDF download failed:", error);
  }
}

/**
 * Builds the filename for the invoice PDF.
 */
export function buildInvoiceFileName(order: Pick<OrderEmailData, "invoiceNumber">): string {
  return `${order.invoiceNumber}.pdf`;
}
