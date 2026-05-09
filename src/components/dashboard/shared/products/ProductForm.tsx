"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

import BasicInfoPart from "./form-parts/BasicInfoPart";
import StatusTagsPart from "./form-parts/StatusTagsPart";
import DescriptionPart from "./form-parts/DescriptionPart";
import AdditionalInfoPart from "./form-parts/AdditionalInfoPart";
import MediaPart from "./form-parts/MediaPart";
import CategorySidebar from "./form-parts/CategorySidebar";

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    productCode: "",
    priceMin: "" as number | string | null,
    priceMax: "" as number | string | null,
    priceNote: "",
    shortDesc: "",
    longDesc: "",
    tags: [] as string[],
    productStatus: "DRAFT",
    blogUrl: "",
    categoryIds: [] as string[],
    featuredImage: undefined as { id: string; thumbUrl?: string; originalUrl: string } | undefined,
    galleryImages: [] as { id: string; thumbUrl?: string; originalUrl: string }[],
    attributes: [] as any[],
    material: "",
    usage: "",
    usefulness: "",
    awareness: "",
    specifications: "",
    suggestedProducts: [] as string[],
  });

  useEffect(() => {
    if (initialData && !isInitialized) {
      let parsedSpecs = "";
      if (typeof initialData.specifications === "string") {
        parsedSpecs = initialData.specifications;
      } else if (Array.isArray(initialData.specifications)) {
        parsedSpecs = initialData.specifications.map((s: any) => `${s.key}: ${s.value}`).join("\n");
      }

      setProduct({
        ...initialData,
        priceMin:
          initialData.priceMin === null || initialData.priceMin === undefined
            ? ""
            : Number(initialData.priceMin),
        priceMax:
          initialData.priceMax === null || initialData.priceMax === undefined
            ? ""
            : Number(initialData.priceMax),
        priceNote: initialData.priceNote || "",

        categoryIds: initialData.categories?.map((c: any) => c.id) || initialData.categoryIds || [],
        suggestedProducts:
          initialData.suggestedProducts?.map((p: any) => p.id) || initialData.suggestedProducts || [],

        featuredImage:
          initialData.featuredImage || initialData.featuredImageId
            ? {
                id: initialData.featuredImage?.id || initialData.featuredImageId,
                thumbUrl: initialData.featuredImage?.thumbUrl || "",
                originalUrl: initialData.featuredImage?.originalUrl || "",
              }
            : undefined,

        galleryImages:
          initialData.images?.map((img: any) => ({
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

    const cleanPrice = (v: number | string | null | undefined) => {
      if (v === null || v === undefined || v === "" || (typeof v === "number" && Number.isNaN(v))) return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };
    const minN = cleanPrice(product.priceMin);
    const maxN = cleanPrice(product.priceMax);
    if (minN != null && maxN != null && minN > maxN) {
      return Swal.fire("Error", "Min price cannot be greater than max price.", "error");
    }

    setLoading(true);
    try {
      const payload = {
        name: product.name,
        slug: product.slug,
        productCode: product.productCode,
        priceMin: minN,
        priceMax: maxN,
        priceNote: product.priceNote || null,
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

      if (isEdit) {
        await api.patch(`/products/${initialData.id}`, payload);
      } else {
        await api.post("/products", payload);
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
    <div className="space-y-8">
      {/* Single-scroll, equal-width 2-column grid (stacks below xl) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <BasicInfoPart product={product} update={updateProduct} />
          <DescriptionPart product={product} update={updateProduct} />
          <MediaPart product={product} update={updateProduct} />
        </div>

        <div className="space-y-8">
          <CategorySidebar product={product} update={updateProduct} />
          <StatusTagsPart product={product} update={updateProduct} />
          <AdditionalInfoPart product={product} update={updateProduct} />
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-30">
        <div className="bg-card border border-border rounded-3xl p-4 shadow-theme-lg">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isEdit ? "Update Changes" : "Publish Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
