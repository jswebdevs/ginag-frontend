"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProductForm from "@/components/dashboard/shared/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetching from the list and finding by ID
        const res = await api.get(`/products?limit=100`); 
        const found = res.data.data?.find((p: any) => p.id === id);
        if (found) setProduct(found);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="font-medium text-muted-foreground">Loading product data...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/admin/products"
          className="p-2 bg-background border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Back to Products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Update info and manage variations for {product?.name || 'Product'}</p>
        </div>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}