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

  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
    featuredImage: undefined as { id: string; thumbUrl?: string; originalUrl: string } | undefined,
    galleryImages: [] as { id: string; thumbUrl?: string; originalUrl: string }[],
    attributes: [] as any[],
    variations: [] as any[],
    material: "",
    usage: "",
    usefulness: "",
    awareness: "",
    specifications: "",
    suggestedProducts: [] as string[]
  });

  useEffect(() => {
    // Only load the data ONCE to stop the form from wiping newly selected images
    if (initialData && !isInitialized) {
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
        origin: initialData.origin || "",
        brandId: initialData.brandId || "",

        categoryIds: initialData.categories?.map((c: any) => c.id) || initialData.categoryIds || [],
        suggestedProducts: initialData.suggestedProducts?.map((p: any) => p.id) || initialData.suggestedProducts || [],

        // 🔥 THE FIX: Fallback to featuredImageId if the API forgot to include the ID inside the image object!
        featuredImage: (initialData.featuredImage || initialData.featuredImageId)
          ? {
            id: initialData.featuredImage?.id || initialData.featuredImageId,
            thumbUrl: initialData.featuredImage?.thumbUrl || "",
            originalUrl: initialData.featuredImage?.originalUrl || "",
          }
          : undefined,

        galleryImages: initialData.images?.map((img: any) => ({
          id: img.id,
          thumbUrl: img.thumbUrl,
          originalUrl: img.originalUrl,
        })) || [],

        material: initialData.material || "",
        usage: initialData.usage || "",
        usefulness: initialData.usefulness || "",
        awareness: initialData.awareness || "",
        specifications: parsedSpecs,
      });

      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  const updateProduct = (fields: Partial<typeof product>) => {
    setProduct((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = async () => {
    if (!product.name || !product.productCode) {
      return Swal.fire("Error", "Product Title and Code are required", "error");
    }

    setLoading(true);
    try {
      // 🔥 THE FIX 2: Explicitly build the payload. 
      // Do NOT use ...rest because it might contain garbage data from Prisma (like the old categories array).
      const payload = {
        name: product.name,
        slug: product.slug,
        productCode: product.productCode,
        origin: product.origin,
        brandId: product.brandId,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        tags: product.tags,
        productStatus: product.productStatus,
        blogUrl: product.blogUrl,
        material: product.material,
        usage: product.usage,
        usefulness: product.usefulness,
        awareness: product.awareness,
        specifications: product.specifications,
        attributes: product.attributes,
        categoryIds: product.categoryIds,
        suggestedProducts: product.suggestedProducts,

        // This is now guaranteed to send a valid ID string or strict null
        featuredImageId: product.featuredImage ? product.featuredImage.id : null,
        galleryImageIds: product.galleryImages.map((img) => img.id).filter(Boolean),
      };

      if (isEdit) {
        // 1. Update Core Product
        await api.patch(`/products/${initialData.id}`, payload);

        // 2. Sync Variations
        const existingVars = product.variations.filter(v => v.id);
        const newVars = product.variations.filter(v => !v.id);

        if (existingVars.length > 0) {
          await Promise.all(existingVars.map(v =>
            api.patch(`/variations/${v.id}`, {
              basePrice: v.basePrice,
              salePrice: v.salePrice,
              stock: v.stock,
              sku: v.sku,
              isDefault: v.isDefault
            })
          ));
        }

        if (newVars.length > 0) {
          await api.post("/variations/bulk", {
            productId: initialData.id,
            variations: newVars
          });
        }
      } else {
        // Create Product
        const res = await api.post("/products", payload);
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
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      <div className="flex-1 w-full space-y-8">
        <BasicInfoPart product={product} update={updateProduct} />
        <StatusTagsPart product={product} update={updateProduct} />
        <DescriptionPart product={product} update={updateProduct} />
        <AdditionalInfoPart product={product} update={updateProduct} />
        <MediaPart product={product} update={updateProduct} />
      </div>

      <div className="w-full xl:w-[450px] space-y-8 xl:sticky xl:top-24">
        <CategorySidebar product={product} update={updateProduct} />
        <VariationManager product={product} update={updateProduct} />

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