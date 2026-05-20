"use client";

import { useRouter } from "next/navigation";
import { addDocument } from "@/lib/firebase/firestore";
import { Product } from "@/types/firebase";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      await addDocument("products", data);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
      throw error;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Add New Product</h2>
      </div>

      <ProductForm onSubmitAction={handleSubmit} />
    </div>
  );
}
