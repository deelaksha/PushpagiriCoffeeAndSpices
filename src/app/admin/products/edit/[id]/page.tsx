"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDocument, updateDocument } from "@/lib/firebase/firestore";
import { Product } from "@/types/firebase";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { use } from "react";

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getDocument<Product>("products", params.id);
        if (data) {
          setProduct({ ...data, id: params.id });
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      await updateDocument("products", params.id, data);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
      throw error;
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading product data...</div>;
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Edit Product</h2>
      </div>

      <ProductForm initialData={product} onSubmitAction={handleSubmit} />
    </div>
  );
}
