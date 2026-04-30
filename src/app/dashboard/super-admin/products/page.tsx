"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, Loader2 } from "lucide-react";
import ProductTable from "@/components/dashboard/shared/products/ProductTable";
import Swal from "sweetalert2"; // 🔥 Import SweetAlert2

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

  // 🔥 UPDATED: Beautiful Swal confirmation and error handling
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product and all its variations will be permanently deleted. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Destructive red
      cancelButtonColor: "#64748b", // Slate muted
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`);

      Swal.fire({
        title: "Deleted!",
        text: "The product has been removed from your inventory.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
      });

      fetchProducts();
    } catch (error: any) {
      console.error("Failed to delete:", error);

      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete product.",
        icon: "error",
        confirmButtonColor: "hsl(var(--primary))",
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
      });
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">Products</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage inventory, pricing, and variations</p>
        </div>

        <Link
          href="/dashboard/super-admin/products/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-theme-md hover:scale-105 transition-all shadow-theme-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Loading products...</p>
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