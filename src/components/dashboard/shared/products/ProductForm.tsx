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

        featuredImageId: product.featuredImage ? product.featuredImage.id : null,
        galleryImageIds: product.galleryImages.map((img) => img.id).filter(Boolean),
      };

      // --- EXTRACT MAIN IMAGES FOR FALLBACKS ---
      const defaultFeaturedImageUrl = product.featuredImage ? product.featuredImage.originalUrl : null;
      const defaultGalleryUrls = product.galleryImages.length > 0 ? product.galleryImages.map(img => img.originalUrl) : [];

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
              isDefault: v.isDefault,
              // Apply fallback logic if variation is missing images
              featuredImage: v.featuredImage || defaultFeaturedImageUrl,
              gallery: (v.gallery && v.gallery.length > 0) ? v.gallery : defaultGalleryUrls
            })
          ));
        }

        if (newVars.length > 0) {
          // Map new variations to ensure fallbacks are applied before creating
          const processedNewVars = newVars.map(v => ({
            ...v,
            featuredImage: v.featuredImage || defaultFeaturedImageUrl,
            gallery: (v.gallery && v.gallery.length > 0) ? v.gallery : defaultGalleryUrls
          }));

          await api.post("/variations/bulk", {
            productId: initialData.id,
            variations: processedNewVars
          });
        }
      } else {
        // Create Core Product
        const res = await api.post("/products", payload);

        if (product.variations.length > 0) {
          // Map variations to ensure fallbacks are applied during initial creation
          const processedAllVars = product.variations.map(v => ({
            ...v,
            featuredImage: v.featuredImage || defaultFeaturedImageUrl,
            gallery: (v.gallery && v.gallery.length > 0) ? v.gallery : defaultGalleryUrls
          }));

          await api.post("/variations/bulk", {
            productId: res.data.product.id,
            variations: processedAllVars
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
    // 1. Give the wrapper a fixed height on large screens to act as a boundaries for the scrollbars
    <div className="flex flex-col xl:flex-row gap-8 items-start xl:h-[calc(100vh-8rem)]">

      {/* Left Column */}
      <div className="flex-1 w-full xl:overflow-y-auto xl:pr-4 space-y-8 xl:h-full scrollbar-thin">
        <BasicInfoPart product={product} update={updateProduct} />
        <StatusTagsPart product={product} update={updateProduct} />
        <DescriptionPart product={product} update={updateProduct} />
        <AdditionalInfoPart product={product} update={updateProduct} />
        <MediaPart product={product} update={updateProduct} />
      </div>

      {/* Right Column */}
      <div className="w-full xl:w-[450px] xl:overflow-y-auto xl:pr-4 space-y-8 xl:h-full scrollbar-thin">
        <CategorySidebar product={product} update={updateProduct} />
        <VariationManager product={product} update={updateProduct} />

        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            title="Commit all product data to database"
            className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isEdit ? "Update Changes" : "Publish Product"}
          </button>
        </div>
      </div>

    </div>
  );
}