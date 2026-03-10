"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Loader2 } from "lucide-react";
import BrandTable from "@/components/dashboard/shared/brands/BrandTable";
import ViewBrandModal from "@/components/dashboard/shared/brands/ViewBrandModal";
import BrandForm from "@/components/dashboard/shared/brands/BrandForm";
import Swal from "sweetalert2"; // 🔥 Import SweetAlert2

export default function BrandsManagementPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/brands');
      setBrands(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateNew = () => {
    setSelectedBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (brand: any) => {
    setSelectedBrand(brand);
    setIsViewOpen(true);
  };

  // 🔥 UPDATED: Beautiful Swal confirmation and error handling
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This brand will be permanently deleted from your store.",
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
      await api.delete(`/brands/${id}`);

      // Show success toast or small alert
      Swal.fire({
        title: "Deleted!",
        text: "The brand has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
      });

      fetchBrands();
    } catch (error: any) {
      console.error("Failed to delete:", error);

      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete brand.",
        icon: "error",
        confirmButtonColor: "hsl(var(--primary))",
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">Brands</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your store's product brands</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-theme-md hover:scale-105 transition-all shadow-theme-sm"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Loading brands...</p>
          </div>
        ) : (
          <BrandTable
            brands={brands}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {isViewOpen && selectedBrand && (
        <ViewBrandModal
          brand={selectedBrand}
          onClose={() => setIsViewOpen(false)}
          onEdit={() => handleEdit(selectedBrand)}
        />
      )}

      {isFormOpen && (
        <BrandForm
          initialData={selectedBrand}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchBrands();
          }}
        />
      )}
    </div>
  );
}