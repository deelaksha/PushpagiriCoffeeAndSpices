"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Download, User } from "lucide-react";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // We fetch all users who are not explicitly admins
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCustomers = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      // Filter out admins locally since we might not have a composite index set up yet
      const onlyCustomers = fetchedCustomers.filter(c => c.role !== "admin" && c.role !== "super_admin");
      
      setCustomers(onlyCustomers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    return customer.name?.toLowerCase().includes(search.toLowerCase()) ||
           customer.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Customer Management</h2>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Name or Email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Joined</th>
                  <th className="px-6 py-3 text-center font-semibold uppercase tracking-wide">Total Orders</th>
                  <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide">Total Spent</th>
                  <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map((customer) => {
                  const date = customer.createdAt?.seconds 
                    ? new Date(customer.createdAt.seconds * 1000) 
                    : new Date();
                    
                  return (
                    <tr key={customer.uid} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-green-light/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {customer.photoURL ? (
                              <img src={customer.photoURL} alt={customer.name || 'Customer'} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-brand-green-dark" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brand-green-dark">{customer.name || 'Unnamed Customer'}</p>
                            <p className="text-xs text-muted-foreground">{customer.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-semibold w-8 h-8 rounded-full text-xs">
                          {customer.totalOrders || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-right text-brand-green-dark">
                        {formatPrice(customer.totalSpent || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-brand-green-light/20 text-brand-green-dark font-medium">
                          <Link href={`/admin/customers/${customer.uid}`}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No customers found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
