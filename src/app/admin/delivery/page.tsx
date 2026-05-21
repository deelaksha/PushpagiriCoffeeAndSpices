"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Package,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  Clock,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Dummy Data ---

type DeliveryStatus = "In Transit" | "Delayed" | "Delivered" | "Out for Delivery" | "Processing";

interface TimelineEvent {
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  current?: boolean;
  isException?: boolean;
}

interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  courier: string;
  trackingNumber: string;
  destination: string;
  eta: string;
  status: DeliveryStatus;
  items: number;
  timeline: TimelineEvent[];
}

const mockShipments: Shipment[] = [
  {
    id: "SHP-10023",
    orderId: "ORD-8923",
    customerName: "Aarav Patel",
    courier: "Delhivery",
    trackingNumber: "DLV892374921",
    destination: "Mumbai, MH",
    eta: "Oct 25, 2023",
    status: "In Transit",
    items: 3,
    timeline: [
      { title: "Order Placed", date: "Oct 22, 10:30 AM", completed: true },
      { title: "Dispatched", description: "Package left facility", date: "Oct 23, 08:15 AM", completed: true },
      { title: "In Transit", description: "Arrived at Mumbai Hub", date: "Oct 24, 02:40 PM", completed: true, current: true },
      { title: "Out for Delivery", date: "Pending", completed: false },
      { title: "Delivered", date: "Pending", completed: false },
    ],
  },
  {
    id: "SHP-10024",
    orderId: "ORD-8924",
    customerName: "Priya Sharma",
    courier: "BlueDart",
    trackingNumber: "BD459201883",
    destination: "Bangalore, KA",
    eta: "Oct 24, 2023",
    status: "Delayed",
    items: 1,
    timeline: [
      { title: "Order Placed", date: "Oct 20, 04:20 PM", completed: true },
      { title: "Dispatched", description: "Package left facility", date: "Oct 21, 09:00 AM", completed: true },
      { title: "In Transit", description: "Delayed due to weather conditions", date: "Oct 22, 11:30 AM", completed: true, current: true, isException: true },
      { title: "Out for Delivery", date: "Pending", completed: false },
      { title: "Delivered", date: "Pending", completed: false },
    ],
  },
  {
    id: "SHP-10025",
    orderId: "ORD-8925",
    customerName: "Vikram Singh",
    courier: "FedEx",
    trackingNumber: "FX901238475",
    destination: "Delhi, DL",
    eta: "Oct 24, 2023",
    status: "Out for Delivery",
    items: 5,
    timeline: [
      { title: "Order Placed", date: "Oct 21, 11:15 AM", completed: true },
      { title: "Dispatched", description: "Package left facility", date: "Oct 22, 07:45 AM", completed: true },
      { title: "In Transit", description: "Arrived at Delhi Hub", date: "Oct 23, 06:20 PM", completed: true },
      { title: "Out for Delivery", description: "Courier is on the way", date: "Oct 24, 08:30 AM", completed: true, current: true },
      { title: "Delivered", date: "Pending", completed: false },
    ],
  },
  {
    id: "SHP-10026",
    orderId: "ORD-8926",
    customerName: "Ananya Desai",
    courier: "DTDC",
    trackingNumber: "DT234857690",
    destination: "Ahmedabad, GJ",
    eta: "Oct 23, 2023",
    status: "Delivered",
    items: 2,
    timeline: [
      { title: "Order Placed", date: "Oct 19, 02:10 PM", completed: true },
      { title: "Dispatched", description: "Package left facility", date: "Oct 20, 10:00 AM", completed: true },
      { title: "In Transit", description: "Arrived at Ahmedabad Hub", date: "Oct 21, 04:15 PM", completed: true },
      { title: "Out for Delivery", description: "Courier is on the way", date: "Oct 23, 09:10 AM", completed: true },
      { title: "Delivered", description: "Handed to resident", date: "Oct 23, 02:45 PM", completed: true, current: true },
    ],
  },
  {
    id: "SHP-10027",
    orderId: "ORD-8927",
    customerName: "Rohan Kapoor",
    courier: "Ecom Express",
    trackingNumber: "EC847562910",
    destination: "Pune, MH",
    eta: "Oct 26, 2023",
    status: "Processing",
    items: 4,
    timeline: [
      { title: "Order Placed", date: "Oct 24, 09:00 AM", completed: true, current: true },
      { title: "Dispatched", date: "Pending", completed: false },
      { title: "In Transit", date: "Pending", completed: false },
      { title: "Out for Delivery", date: "Pending", completed: false },
      { title: "Delivered", date: "Pending", completed: false },
    ],
  },
];

const summaryStats = {
  inTransit: 142,
  delayed: 8,
  deliveredToday: 56,
};

// --- Components ---

const StatusBadge = ({ status }: { status: DeliveryStatus }) => {
  switch (status) {
    case "In Transit":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <Truck className="w-3 h-3 mr-1" /> In Transit
        </span>
      );
    case "Delayed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" /> Delayed
        </span>
      );
    case "Delivered":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
        </span>
      );
    case "Out for Delivery":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
          <MapPin className="w-3 h-3 mr-1" /> Out for Delivery
        </span>
      );
    case "Processing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          <Package className="w-3 h-3 mr-1" /> Processing
        </span>
      );
    default:
      return null;
  }
};

const TimelineStepper = ({ timeline }: { timeline: TimelineEvent[] }) => {
  return (
    <div className="py-4 px-6 bg-brand-cream/30 rounded-xl mt-4 border border-brand-green-light/20">
      <h4 className="text-sm font-semibold text-brand-green-dark mb-6">Tracking Timeline</h4>
      <div className="relative">
        {/* Continuous Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {timeline.map((event, idx) => {
            const isLast = idx === timeline.length - 1;
            
            return (
              <div key={idx} className="relative flex items-start group">
                <div className="flex items-center h-8">
                  <div
                    className={cn(
                      "z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ring-4 ring-white",
                      event.completed
                        ? event.isException
                          ? "bg-red-50 border-red-500 text-red-500"
                          : "bg-brand-green-light/20 border-brand-green-dark text-brand-green-dark"
                        : "bg-white border-gray-300 text-gray-300"
                    )}
                  >
                    {event.completed ? (
                      event.isException ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h5
                      className={cn(
                        "text-sm font-semibold",
                        event.current
                          ? event.isException
                            ? "text-red-700"
                            : "text-brand-green-dark"
                          : event.completed
                          ? "text-gray-900"
                          : "text-gray-500"
                      )}
                    >
                      {event.title}
                    </h5>
                    <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.date}
                    </div>
                  </div>
                  {event.description && (
                    <p
                      className={cn(
                        "text-xs mt-1",
                        event.isException ? "text-red-600 font-medium" : "text-gray-600"
                      )}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function DeliveryTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleNotifyCustomer = (customer: string) => {
    toast.success(`Notification sent to ${customer}`);
  };

  const handleContactCourier = (courier: string) => {
    toast.info(`Opening support chat with ${courier}...`);
  };

  const filteredShipments = mockShipments.filter(
    (shipment) =>
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green-dark">Delivery & Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor shipments, resolve exceptions, and track delivery performance.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => toast.success("Delivery report exported successfully")}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Export Report
          </button>
          <button
            onClick={() => toast.success("Refreshed tracking statuses")}
            className="px-4 py-2 bg-brand-green-dark text-white rounded-lg shadow-sm hover:bg-brand-green-dark/90 transition-colors text-sm font-medium"
          >
            Refresh Status
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-brand-green-light/20 flex items-start space-x-4"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Packages in Transit</p>
            <h3 className="text-2xl font-bold text-brand-green-dark mt-1">{summaryStats.inTransit}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start space-x-4"
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Exceptions / Delayed</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{summaryStats.delayed}</h3>
            <p className="text-xs text-red-500 mt-1 font-medium">Requires attention</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-start space-x-4"
        >
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Delivered Today</p>
            <h3 className="text-2xl font-bold text-brand-green-dark mt-1">{summaryStats.deliveredToday}</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-green-light/20 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Tracking #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark/20 focus:border-brand-green-dark transition-all"
            />
          </div>
          <button
            onClick={() => toast.info("Filter options opened")}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order Details</th>
                <th className="px-6 py-4 font-medium">Tracking Info</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium">Status & ETA</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <AnimatePresence>
                {filteredShipments.map((shipment) => (
                  <React.Fragment key={shipment.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "group hover:bg-gray-50/50 transition-colors cursor-pointer",
                        expandedRow === shipment.id ? "bg-gray-50/50" : ""
                      )}
                      onClick={() => toggleRow(shipment.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-brand-green-dark">{shipment.orderId}</span>
                          <span className="text-gray-500 text-xs mt-0.5">{shipment.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{shipment.courier}</span>
                          <div className="flex items-center text-gray-500 text-xs mt-0.5">
                            {shipment.trackingNumber}
                            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {shipment.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <StatusBadge status={shipment.status} />
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" /> ETA: {shipment.eta}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(shipment.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-brand-green-dark hover:bg-brand-green-light/10 rounded-lg transition-colors"
                          >
                            {expandedRow === shipment.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Row */}
                    <AnimatePresence>
                      {expandedRow === shipment.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50/50 border-b border-gray-100"
                        >
                          <td colSpan={5} className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2">
                              
                              {/* Shipment details side */}
                              <div className="lg:col-span-1 space-y-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Shipment Details</h4>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 text-sm">Weight / Items</span>
                                      <span className="text-gray-900 text-sm font-medium">{shipment.items} items</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 text-sm">Service Type</span>
                                      <span className="text-gray-900 text-sm font-medium">Express</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 text-sm">Origin</span>
                                      <span className="text-gray-900 text-sm font-medium">Coorg, KA</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h4>
                                  <div className="flex flex-col gap-2">
                                    <button 
                                      onClick={() => handleNotifyCustomer(shipment.customerName)}
                                      className="w-full px-4 py-2 text-sm text-left font-medium text-brand-green-dark bg-brand-green-light/10 hover:bg-brand-green-light/20 rounded-lg transition-colors"
                                    >
                                      Notify Customer
                                    </button>
                                    <button 
                                      onClick={() => handleContactCourier(shipment.courier)}
                                      className="w-full px-4 py-2 text-sm text-left font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                      Contact Courier
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Timeline side */}
                              <div className="lg:col-span-2">
                                <TimelineStepper timeline={shipment.timeline} />
                              </div>

                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredShipments.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No shipments found</p>
              <p className="mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Showing {filteredShipments.length} of 150 shipments</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-brand-green-dark font-medium">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
