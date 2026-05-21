"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { getDocuments, deleteDocument } from "@/lib/firebase/firestore";
import { Product } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn, isVideoUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getDocuments<Product>("products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDocument("products", id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Products</h2>
        <Button asChild className="bg-brand-green-dark hover:bg-brand-green-dark/90">
          <Link href="/admin/products/add">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products by name or SKU..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Category</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Price</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded bg-gray-100 overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                          isVideoUrl(product.images[0]) ? (
                            <video src={product.images[0]} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <NextImage src={product.images[0]} alt={product.name} fill className="object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Media</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-brand-green-dark">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku || product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{product.category.replace("-", " ")}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">{product.stock > 0 ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit", product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                        {!product.isActive && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit bg-gray-100 text-gray-700">
                            Hidden
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild className="hover:bg-brand-green-light/20 text-brand-green-dark">
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id!)} className="hover:bg-red-50 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No products found.
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
