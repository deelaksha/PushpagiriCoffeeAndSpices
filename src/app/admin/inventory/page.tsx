"use client";

import { useState, useEffect } from "react";
import { getDocuments, updateDocument } from "@/lib/firebase/firestore";
import { Product } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NextImage from "next/image";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Track modified stocks locally before saving
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getDocuments<Product>("products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productId: string, value: string) => {
    const numValue = value === "true" ? 999999 : 0;
    
    setStockUpdates(prev => ({
      ...prev,
      [productId]: numValue
    }));
  };

  const handleSaveAll = async () => {
    const idsToUpdate = Object.keys(stockUpdates);
    if (idsToUpdate.length === 0) return;

    setIsSaving(true);
    try {
      // In a real app, this should be a batched write via Firebase Admin or a batched transaction on client
      // For now, doing sequential updates for simplicity
      const promises = idsToUpdate.map(id => 
        updateDocument("products", id, { stock: stockUpdates[id] })
      );
      
      await Promise.all(promises);
      
      // Update local state
      setProducts(prev => prev.map(p => 
        stockUpdates[p.id!] !== undefined 
          ? { ...p, stock: stockUpdates[p.id!] } 
          : p
      ));
      
      setStockUpdates({});
      toast.success("Inventory updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update inventory");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Inventory Management</h2>
        <Button 
          onClick={handleSaveAll} 
          disabled={Object.keys(stockUpdates).length === 0 || isSaving}
          className="bg-brand-green-dark hover:bg-brand-green-dark/90"
        >
          <Save className="w-4 h-4 mr-2" /> 
          {isSaving ? "Saving..." : `Save Changes (${Object.keys(stockUpdates).length})`}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-card flex items-center gap-4 border-l-4 border-blue-500">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
            {products.length}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="font-semibold text-lg">Tracked items</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-card flex items-center gap-4 border-l-4 border-green-500">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">
            {products.length - outOfStockProducts.length}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">In Stock</p>
            <p className="font-semibold text-lg">Available items</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-card flex items-center gap-4 border-l-4 border-red-500">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl">
            {outOfStockProducts.length}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="font-semibold text-lg">Action required</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide w-40">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const currentStock = stockUpdates[product.id!] !== undefined 
                    ? stockUpdates[product.id!] 
                    : product.stock;
                    
                  const isOut = currentStock === 0;
                  const hasChanged = stockUpdates[product.id!] !== undefined && stockUpdates[product.id!] !== product.stock;

                  return (
                    <tr key={product.id} className={cn("hover:bg-muted/20 transition-colors", hasChanged && "bg-brand-cream/10")}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded bg-gray-100 overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <NextImage src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                          )}
                        </div>
                        <span className="font-medium text-brand-green-dark">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{product.sku || '-'}</td>
                      <td className="px-6 py-4">
                        {isOut ? (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <AlertTriangle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : (
                          <span className="text-green-600 text-xs font-medium">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          value={currentStock > 0 ? "true" : "false"}
                          onChange={(e) => handleStockChange(product.id!, e.target.value)}
                          className={cn("w-32 ml-auto text-right p-2 border rounded-md bg-white", hasChanged && "border-brand-green-light bg-brand-cream/20")}
                        >
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
