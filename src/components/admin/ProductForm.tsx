"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/firebase/storage";
import { isVideoUrl } from "@/lib/utils";
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
  inStock: z.boolean().default(true),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(z.object({
    id: z.string().optional(),
    weightLabel: z.string().min(1, "Weight label is required"),
    price: z.coerce.number().min(0, "Price must be >= 0"),
  })).min(1, "At least one weight variant is required"),
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
      inStock: initialData ? initialData.stock > 0 : true,
      tags: initialData?.tags?.join(", ") || "",
      isFeatured: initialData?.isFeatured || false,
      isActive: initialData?.isActive !== false,
      variants: initialData?.variants?.length ? initialData.variants : [
        { id: Date.now().toString(), weightLabel: "500g", price: 0 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: form.control,
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

      const { inStock, variants, ...restValues } = values;

      const productData: Partial<Product> = {
        ...restValues,
        stock: inStock ? 999999 : 0,
        tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        variants: variants.map(v => {
          return {
            ...v,
            id: v.id || Date.now().toString() + Math.random().toString(36).substring(7)
          };
        }),
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



          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Price (₹) *</label>
              <Input type="number" {...form.register("price")} />
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-sm font-medium mb-2 block">Stock Status *</label>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border px-4 py-2.5 rounded-lg w-fit hover:bg-gray-100 transition-colors">
                <input type="checkbox" {...form.register("inStock")} className="w-4 h-4 text-brand-green-dark rounded" />
                <span className="text-sm font-medium">In Stock</span>
              </label>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Weight Variants *</label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ weightLabel: "", price: 0, id: Date.now().toString() })}>
                <Plus className="w-4 h-4 mr-2" /> Add Weight Option
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start border p-3 rounded-lg relative bg-gray-50/50">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Weight Label</label>
                    <Input {...form.register(`variants.${index}.weightLabel` as const)} placeholder="e.g. 250g" className="h-8 text-sm" />
                    {form.formState.errors.variants?.[index]?.weightLabel && <p className="text-red-500 text-[10px] mt-1">{form.formState.errors.variants[index]?.weightLabel?.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Price (₹)</label>
                    <Input type="number" {...form.register(`variants.${index}.price` as const)} className="h-8 text-sm" />
                  </div>
                </div>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-5 text-red-500 hover:bg-red-50 h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {form.formState.errors.variants?.message && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.variants.message}</p>
            )}
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
            <label className="text-sm font-medium mb-2 block">Product Media (Images & Videos)</label>
            
            {/* Existing Media */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {existingImages.map((url, i) => (
                <div key={i} className="relative group border rounded-lg overflow-hidden aspect-square bg-black">
                  {isVideoUrl(url) ? (
                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <NextImage src={url} alt="Product media" fill className="object-cover" />
                  )}
                  <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* New Files Preview */}
              {newImageFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative group border rounded-lg overflow-hidden aspect-square bg-black">
                  {file.type.startsWith("video/") ? (
                    <video src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-70" muted playsInline />
                  ) : (
                    <NextImage src={URL.createObjectURL(file)} alt="New preview" fill className="object-cover opacity-70" />
                  )}
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">NEW</span>
                  <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-green-light transition-colors aspect-square">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs font-medium text-gray-500">Upload Media</span>
                <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
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
