"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, Loader2 } from "lucide-react";
import ProductTable from "@/components/dashboard/shared/products/ProductTable";

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error: any) {
      console.error("Failed to delete:", error);
      alert(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage inventory, pricing, and variations</p>
        </div>
        
        {/* Navigates to the dedicated create page */}
        <Link 
          href="/dashboard/admin/products/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Loading products...</p>
          </div>
        ) : (
          <ProductTable 
            products={products} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </div>
  );
}