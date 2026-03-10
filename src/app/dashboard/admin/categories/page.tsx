"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Loader2 } from "lucide-react";
import CategoryTable from "@/components/dashboard/shared/category/CategoryTable";
import ViewCategoryModal from "@/components/dashboard/shared/category/ViewCategoryModal";
import CategoryForm from "@/components/dashboard/shared/category/CategoryForm";
import Swal from "sweetalert2"; // 🔥 Import SweetAlert2

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handlers
  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (category: any) => {
    setSelectedCategory(category);
    setIsViewOpen(true);
  };

  // 🔥 UPDATED: Beautiful Swal confirmation and error handling
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category and its sub-categories might be affected.",
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
      await api.delete(`/categories/${id}`);

      Swal.fire({
        title: "Deleted!",
        text: "Category has been successfully removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
      });

      fetchCategories();
    } catch (error: any) {
      console.error("Failed to delete:", error);

      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete category.",
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
          <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">Categories</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your store's product categories</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-theme-md hover:scale-105 transition-all shadow-theme-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Loading categories...</p>
          </div>
        ) : (
          <CategoryTable
            categories={categories}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      {isViewOpen && selectedCategory && (
        <ViewCategoryModal
          category={selectedCategory}
          categories={categories}
          onClose={() => setIsViewOpen(false)}
          onEdit={() => handleEdit(selectedCategory)}
        />
      )}

      {isFormOpen && (
        <CategoryForm
          initialData={selectedCategory}
          categories={categories}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}