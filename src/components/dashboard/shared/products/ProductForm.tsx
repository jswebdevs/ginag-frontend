"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

// Sub-components
import BasicInfoPart from "./form-parts/BasicInfoPart";
import StatusTagsPart from "./form-parts/StatusTagsPart";
import DescriptionPart from "./form-parts/DescriptionPart";
import AdditionalInfoPart from "./form-parts/AdditionalInfoPart";
import MediaPart from "./form-parts/MediaPart";
import CategorySidebar from "./form-parts/CategorySidebar";
import VariationManager from "./form-parts/VariationManager";

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    productCode: "",
    origin: "",
    brandId: "",
    basePrice: 0,
    salePrice: 0,
    shortDesc: "",
    longDesc: "",
    tags: [] as string[],
    productStatus: "DRAFT",
    blogUrl: "",
    categoryIds: [] as string[],
    featuredImageId: "",
    galleryImageIds: [] as string[],
    attributes: [] as any[],
    variations: [] as any[],
    // --- EXTENDED FIELDS ---
    material: "",
    usage: "",
    usefulness: "",
    awareness: "",
    specifications: "",
    suggestedProducts: [] as string[]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Safely convert old JSON specifications to the new String format if needed
      let parsedSpecs = "";
      if (typeof initialData.specifications === 'string') {
        parsedSpecs = initialData.specifications;
      } else if (Array.isArray(initialData.specifications)) {
        parsedSpecs = initialData.specifications.map((s: any) => `${s.key}: ${s.value}`).join('\n');
      }

      setProduct({
        ...initialData,
        basePrice: Number(initialData.basePrice) || 0,
        salePrice: Number(initialData.salePrice) || 0,

        // THE FIX: Aggressively map Prisma objects to string IDs on load
        categoryIds: initialData.categories?.map((c: any) => c.id) || initialData.categoryIds || [],
        galleryImageIds: initialData.images?.map((img: any) => img.id) || initialData.galleryImageIds || [],
        suggestedProducts: initialData.suggestedProducts?.map((p: any) => p.id) || initialData.suggestedProducts || [],

        // Hydrate extended fields
        material: initialData.material || "",
        usage: initialData.usage || "",
        usefulness: initialData.usefulness || "",
        awareness: initialData.awareness || "",
        specifications: parsedSpecs,
      });
    }
  }, [initialData]);

  const updateProduct = (fields: Partial<typeof product>) => {
    setProduct((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = async () => {
    if (!product.name || !product.productCode) {
      return Swal.fire("Error", "Name and Code are required", "error");
    }
    setLoading(true);
    try {
      if (isEdit) {
        await api.patch(`/products/${initialData.id}`, product);
      } else {
        const res = await api.post("/products", product);
        if (product.variations.length > 0) {
          await api.post("/variations/bulk", {
            productId: res.data.product.id,
            variations: product.variations
          });
        }
      }
      Swal.fire("Success", "Product saved successfully", "success");
      router.push("/dashboard/super-admin/products");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">

      {/* LEFT SIDE: Core Data */}
      <div className="flex-1 w-full space-y-8">
        <BasicInfoPart product={product} update={updateProduct} />
        <StatusTagsPart product={product} update={updateProduct} />
        <DescriptionPart product={product} update={updateProduct} />
        <AdditionalInfoPart product={product} update={updateProduct} />
        <MediaPart product={product} update={updateProduct} />
      </div>

      {/* RIGHT SIDE: Configurations & Final Action */}
      <div className="w-full xl:w-[450px] space-y-8 xl:sticky xl:top-24">

        <CategorySidebar product={product} update={updateProduct} />
        <VariationManager product={product} update={updateProduct} />

        {/* Save Action locked to bottom right */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            title="Commit all product data to database"
            className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isEdit ? "Update Changes" : "Publish Product"}
          </button>
        </div>

      </div>

    </div>
  );
}