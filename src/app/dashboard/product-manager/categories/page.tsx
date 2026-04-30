"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import CategoryTable from "@/components/dashboard/shared/category/CategoryTable";
import ViewCategoryModal from "@/components/dashboard/shared/category/ViewCategoryModal";
import CategoryForm from "@/components/dashboard/shared/category/CategoryForm";

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
    setIsViewOpen(false); // Close view modal if it was open
    setIsFormOpen(true);
  };

  const handleView = (category: any) => {
    setSelectedCategory(category);
    setIsViewOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Failed to delete:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete category.",
        icon: "error",
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your store's product categories</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:shadow-theme-md hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Loading categories...</p>
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
          categories={categories} // Passed to find parent name
          onClose={() => setIsViewOpen(false)}
          onEdit={() => handleEdit(selectedCategory)}
        />
      )}

      {isFormOpen && (
        <CategoryForm
          initialData={selectedCategory}
          categories={categories} // Passed to populate "Parent Category" dropdown
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