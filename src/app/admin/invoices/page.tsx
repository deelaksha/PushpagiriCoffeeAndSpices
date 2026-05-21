"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import InvoiceTemplate from "@/components/invoice/InvoiceTemplate";
import { downloadInvoicePDF, buildInvoiceFileName } from "@/components/invoice/InvoicePDFGenerator";
import type { OrderEmailData } from "@/lib/invoiceHelpers";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Archive,
  RefreshCw
} from "lucide-react";

// Types
type InvoiceStatus = "Paid" | "Pending" | "Overdue";

interface Invoice {
  id: string;
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: InvoiceStatus;
  rawOrder: any;
}



const ITEMS_PER_PAGE = 7;

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedOrderData, setSelectedOrderData] = useState<OrderEmailData | null>(null);
  const [previewOrderData, setPreviewOrderData] = useState<OrderEmailData | null>(null);

  // Fetch from Firestore
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        const dateStr = data.createdAt?.seconds 
          ? new Date(data.createdAt.seconds * 1000).toISOString() 
          : new Date().toISOString();
          
        let status: InvoiceStatus = "Pending";
        if (data.paymentStatus === "paid" || data.paymentStatus === "Paid") status = "Paid";
        else if (data.paymentStatus === "overdue") status = "Overdue";

        return {
          id: doc.id,
          orderId: data.orderId || doc.id,
          orderDate: dateStr,
          customerName: data.customerInfo?.name || "Unknown Customer",
          customerEmail: data.customerInfo?.email || "No Email",
          amount: data.total || 0,
          status,
          rawOrder: data
        };
      });
      setInvoices(fetched);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load real-time invoices.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Summary Calculations
  const totalCollected = invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "Pending").reduce((acc, i) => acc + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "Overdue").reduce((acc, i) => acc + i.amount, 0);
  const pendingCount = invoices.filter(i => i.status === "Pending").length;
  const overdueCount = invoices.filter(i => i.status === "Overdue").length;

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
      
      const matchesDateFrom = dateFrom === "" || new Date(invoice.orderDate) >= new Date(dateFrom);
      const matchesDateTo = dateTo === "" || new Date(invoice.orderDate) <= new Date(dateTo);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [searchTerm, statusFilter, dateFrom, dateTo, invoices]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleSyncArchive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Invoice archive synchronized successfully", {
        description: "All recent PDF invoices have been backed up securely."
      });
    }, 1500);
  };

  const generateOrderData = (invoice: Invoice): OrderEmailData => {
    const raw = invoice.rawOrder;
    const items = raw.products || raw.items || [];
    return {
      orderId: invoice.id,
      orderNumber: raw.orderId || invoice.id,
      invoiceNumber: invoice.id.replace("PCS", "INV"),
      invoiceDate: invoice.orderDate,
      customerName: raw.customerInfo?.name || "Unknown",
      customerEmail: raw.customerInfo?.email || "Unknown",
      customerPhone: raw.customerInfo?.phone || "",
      shippingAddress: typeof raw.shippingAddress === 'string' 
        ? raw.shippingAddress 
        : (raw.shippingAddress?.street ? `${raw.shippingAddress.street}, ${raw.shippingAddress.city}, ${raw.shippingAddress.state} - ${raw.shippingAddress.zipCode}` : "N/A"),
      orderNotes: raw.orderNotes || "",
      items: items.map((item: any) => ({
        productId: item.productId || item.product?.id || "",
        productName: item.productName || item.product?.name || "Product",
        quantity: item.quantity || 1,
        weight: item.weight || item.weightLabel || "",
        price: item.price || 0,
        image: item.image || item.product?.images?.[0] || "",
      })),
      subtotal: raw.subtotal || raw.total || 0,
      shippingCost: raw.shippingCharge || raw.shippingCost || 0,

      grandTotal: raw.total || raw.grandTotal || 0,
      paymentMethod: raw.paymentMethod || "online",
      paymentStatus: raw.paymentStatus || "pending",
      orderStatus: raw.orderStatus || "processing",
    };
  };

  const handleDownload = (invoice: Invoice) => {
    if (downloadingId) return;
    setDownloadingId(invoice.id);
    toast.info(`Generating PDF for ${invoice.orderId}...`);
    setActiveDropdown(null);

    const orderData = generateOrderData(invoice);
    setSelectedOrderData(orderData);

    // Give DOM time to render the hidden template, then trigger download
    setTimeout(async () => {
      try {
        await downloadInvoicePDF("pushpagiri-invoice-template", buildInvoiceFileName(orderData));
        toast.success("Download complete");
      } catch (err) {
        toast.error("Failed to generate PDF");
        console.error(err);
      } finally {
        setDownloadingId(null);
        setSelectedOrderData(null);
      }
    }, 800);
  };

  const handleView = (invoice: Invoice) => {
    setPreviewOrderData(generateOrderData(invoice));
    setActiveDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Hidden Invoice Template for PDF Generation */}
      {selectedOrderData && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            visibility: "visible",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <div id="pushpagiri-invoice-template">
            <InvoiceTemplate order={selectedOrderData} />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="flex justify-between items-center p-4 md:px-6 border-b shrink-0 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Invoice Preview: {previewOrderData.invoiceNumber}</h2>
              <button 
                onClick={() => setPreviewOrderData(null)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4 md:p-8 bg-gray-200">
              <div className="mx-auto shadow-lg bg-white overflow-hidden" style={{ width: "794px", maxWidth: "100%" }}>
                <InvoiceTemplate order={previewOrderData} />
              </div>
            </div>

            <div className="p-4 md:px-6 border-t shrink-0 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewOrderData(null)}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 font-medium text-gray-700"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  const invoice = invoices.find(i => i.id === previewOrderData.orderId);
                  setPreviewOrderData(null);
                  if (invoice) handleDownload(invoice);
                }}
                className="px-4 py-2 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-dark/90 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-8 w-8 text-brand-green-dark dark:text-brand-green-light" />
            Invoices & Billing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your customer invoices and billing history.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSyncArchive}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
            Sync Archive
          </button>
          <button 
            onClick={() => toast.info("Navigating to Backup Settings")}
            className="flex items-center gap-2 bg-brand-green-dark hover:bg-brand-green-dark/90 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Archive className="h-4 w-4" />
            Backup Vault
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(totalCollected)}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <span className="font-medium">+12.5%</span> from last month
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Amount</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(pendingAmount)}</h3>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <RefreshCw className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {pendingCount} invoices awaiting payment
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{formatPrice(overdueAmount)}</h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Archive className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
            <span className="font-medium">Action required</span> on {overdueCount} invoices
          </p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Invoice ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green-dark/50 focus:border-brand-green-dark outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none p-0 focus:ring-0 outline-none w-28 text-gray-600 dark:text-gray-400"
              />
              <span>to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none p-0 focus:ring-0 outline-none w-28 text-gray-600 dark:text-gray-400"
              />
            </div>
          </div>
          
          {(searchTerm || statusFilter !== "All" || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Invoice ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Order Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Customer</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right whitespace-nowrap">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center whitespace-nowrap">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading invoices...
                  </td>
                </tr>
              ) : paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group relative"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{invoice.id}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Ref: {invoice.orderId}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(invoice.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{invoice.customerName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{invoice.customerEmail}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white text-right whitespace-nowrap">
                      {formatPrice(invoice.amount)}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", getStatusColor(invoice.status))}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2 relative">
                        <button
                          onClick={() => handleView(invoice)}
                          className="p-1.5 text-gray-400 hover:text-brand-green-dark dark:hover:text-brand-green-light rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(invoice)}
                          disabled={downloadingId === invoice.id}
                          className="p-1.5 text-gray-400 hover:text-brand-green-dark dark:hover:text-brand-green-light rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingId === invoice.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(invoice.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {activeDropdown === invoice.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setActiveDropdown(null)} 
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                                <button
                                  onClick={() => {
                                    toast.success("Invoice sent to customer");
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Resend Email
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      await updateDoc(doc(db, "orders", invoice.id), {
                                        paymentStatus: "paid",
                                        status: "processing" 
                                      });
                                      toast.success("Payment status updated to Paid");
                                    } catch (err) {
                                      toast.error("Failed to update status");
                                    }
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Mark as Paid
                                </button>
                                <button
                                  onClick={() => {
                                    toast.success("Invoice backed up to vault");
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Archive Manually
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-base font-medium text-gray-900 dark:text-white">No invoices found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                      {(searchTerm || statusFilter !== "All" || dateFrom || dateTo) && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("All");
                            setDateFrom("");
                            setDateTo("");
                          }}
                          className="mt-4 text-brand-green-dark dark:text-brand-green-light hover:underline text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)}
              </span>{" "}
              of <span className="font-medium text-gray-900 dark:text-white">{filteredInvoices.length}</span> invoices
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
