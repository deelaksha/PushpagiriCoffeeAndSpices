"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/firebase/storage";
import { Product } from "@/types/firebase";
import { Trash2, Plus, Upload, X } from "lucide-react";
import NextImage from "next/image";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0),
  sku: z.string().optional(),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  weightOptions: z.string().optional(), // Comma separated string for simplicity
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSubmitAction: (data: Partial<Product>) => Promise<void>;
}

export function ProductForm({ initialData, onSubmitAction }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      category: initialData?.category || "coffee",
      price: initialData?.price || 0,
      discountPrice: initialData?.discountPrice || 0,
      stock: initialData?.stock || 0,
      sku: initialData?.sku || "",
      tags: initialData?.tags?.join(", ") || "",
      isFeatured: initialData?.isFeatured || false,
      isActive: initialData?.isActive !== false,
      weightOptions: initialData?.weightOptions?.join(", ") || "",
    },
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value);
    if (!initialData) {
      form.setValue("slug", generateSlug(e.target.value));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      
      // Upload new images
      for (const file of newImageFiles) {
        const url = await uploadImage(file, "products");
        if (url) uploadedUrls.push(url);
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const productData: Partial<Product> = {
        ...values,
        tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        weightOptions: values.weightOptions ? values.weightOptions.split(",").map(t => t.trim()).filter(Boolean) : [],
        images: allImages,
        updatedAt: new Date(),
      };

      if (!initialData) {
        productData.createdAt = new Date();
      }

      await onSubmitAction(productData);
    } catch (error) {
      console.error("Error submitting product", error);
      alert("Failed to submit product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column - Basics */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Product Name *</label>
            <Input {...form.register("name")} onChange={handleNameChange} placeholder="e.g. Premium Arabica Coffee" />
            {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Slug *</label>
            <Input {...form.register("slug")} placeholder="e.g. premium-arabica-coffee" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Price (₹) *</label>
              <Input type="number" {...form.register("price")} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Discount Price (₹)</label>
              <Input type="number" {...form.register("discountPrice")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Stock Quantity *</label>
              <Input type="number" {...form.register("stock")} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU</label>
              <Input {...form.register("sku")} placeholder="e.g. COF-001" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Category *</label>
            <select {...form.register("category")} className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm bg-background">
              <option value="coffee">Coffee</option>
              <option value="spices">Spices</option>
              <option value="honey">Honey</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Weight Options (Comma separated)</label>
            <Input {...form.register("weightOptions")} placeholder="e.g. 250g, 500g, 1kg" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Tags (Comma separated)</label>
            <Input {...form.register("tags")} placeholder="e.g. organic, fresh, premium" />
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("isFeatured")} className="w-4 h-4 text-brand-green-dark rounded" />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("isActive")} className="w-4 h-4 text-brand-green-dark rounded" />
              <span className="text-sm font-medium">Active (Visible in Store)</span>
            </label>
          </div>
        </div>

        {/* Right Column - Media & Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Short Description</label>
            <Textarea {...form.register("shortDescription")} rows={2} placeholder="Brief summary for product cards..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Full Description</label>
            <Textarea {...form.register("description")} rows={6} placeholder="Detailed product information..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Product Images</label>
            
            {/* Existing Images */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {existingImages.map((url, i) => (
                <div key={i} className="relative group border rounded-lg overflow-hidden aspect-square">
                  <NextImage src={url} alt="Product image" fill className="object-cover" />
                  <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* New Files Preview */}
              {newImageFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative group border rounded-lg overflow-hidden aspect-square bg-gray-50">
                  <NextImage src={URL.createObjectURL(file)} alt="New preview" fill className="object-cover opacity-70" />
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">NEW</span>
                  <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-green-light transition-colors aspect-square">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs font-medium text-gray-500">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-brand-green-dark hover:bg-brand-green-dark/90 min-w-[150px]">
          {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
