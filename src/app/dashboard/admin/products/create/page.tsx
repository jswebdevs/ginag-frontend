"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/dashboard/shared/products/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/admin/products"
          className="p-2 bg-background border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Create a product shell and generate variations.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}