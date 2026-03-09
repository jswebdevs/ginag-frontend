"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Folder, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Swal from "sweetalert2";

interface CategoryTableProps {
  categories: any[];
  onView: (cat: any) => void;
  onEdit: (cat: any) => void;
  onDelete: (id: string) => void;
}

const DynamicIcon = ({ iconName }: { iconName?: string }) => {
  if (!iconName) return <Folder className="w-5 h-5 text-muted-foreground/50" />;
  const IconComponent = (LucideIcons as any)[iconName] || Folder;
  return <IconComponent className="w-5 h-5 text-foreground" />;
};

type SortKey = "name" | "parent" | "products" | null;

export default function CategoryTable({ categories, onView, onEdit, onDelete }: CategoryTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper for UI rendering
  const getParentName = (parentId: string | null) => {
    if (!parentId) return <span className="text-muted-foreground italic text-xs">None (Top Level)</span>;
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  const getParentString = (parentId: string | null) => {
    if (!parentId) return "none";
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name.toLowerCase() : "unknown";
  };

  // --- REFINED: THEMED SWEETALERT DIALOG ---
  const confirmDelete = (cat: any) => {
    const productCount = cat._count?.products || 0;

    // Block if category is not empty
    if (productCount > 0) {
      return Swal.fire({
        title: "Action Blocked",
        text: `The category "${cat.name}" still contains ${productCount} products. Please empty the category first.`,
        icon: "error",
        background: 'hsl(var(--card))', // Matches your Tailwind card background
        color: 'hsl(var(--foreground))',
        confirmButtonColor: '#3b82f6',
      });
    }

    // Confirmation for empty category
    Swal.fire({
      title: "Are you sure?",
      text: `"${cat.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Destructive Red
      cancelButtonColor: "#64748b",  // Slate Gray
      confirmButtonText: "Yes, delete it!",
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      reverseButtons: true, // Puts Cancel on left, Confirm on right
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(cat.id);
      }
    });
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    if (key === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (key === "parent") {
      aValue = getParentString(a.parentId);
      bValue = getParentString(b.parentId);
    } else if (key === "products") {
      aValue = a._count?.products || 0;
      bValue = b._count?.products || 0;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  if (categories.length === 0) {
    return (
      <div className="p-20 text-center bg-card border border-dashed border-border rounded-3xl">
        <Folder className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
        <p className="text-muted-foreground font-bold text-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-16">SL</th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Icon & Image</th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("name")}>
              <div className="flex items-center gap-1.5">Name <SortIcon columnKey="name" /></div>
            </th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("parent")}>
              <div className="flex items-center gap-1.5">Parent Category <SortIcon columnKey="parent" /></div>
            </th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center cursor-pointer hover:bg-muted/50 transition-colors select-none" onClick={() => handleSort("products")}>
              <div className="flex items-center justify-center gap-1.5">Products <SortIcon columnKey="products" /></div>
            </th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {paginatedCategories.map((cat, index) => (
            <tr key={cat.id} className="hover:bg-muted/10 transition-colors group">
              <td className="p-4 text-xs font-mono font-medium text-muted-foreground">{String(((currentPage - 1) * itemsPerPage) + index + 1).padStart(2, '0')}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                    <DynamicIcon iconName={cat.icon} />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 overflow-hidden shadow-sm shrink-0 p-0.5">
                    {cat.featuredImage?.thumbUrl ? (
                      <img src={cat.featuredImage.thumbUrl} alt="Featured" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-muted-foreground/20" />
                    )}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <p className="font-bold text-foreground text-sm tracking-tight">{cat.name}</p>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5 opacity-60">{cat.slug}</div>
              </td>
              <td className="p-4 text-sm font-medium text-foreground/80">{getParentName(cat.parentId)}</td>
              <td className="p-4 text-center">
                <span className="bg-primary/10 text-primary font-black px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-tighter">
                  {cat._count?.products || 0} ITEMS
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button onClick={() => onView(cat)} className="p-2 text-muted-foreground hover:text-primary bg-background rounded-xl border border-transparent hover:border-border hover:shadow-sm transition-all" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(cat)} className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-xl border border-transparent hover:border-border hover:shadow-sm transition-all" title="Edit Category">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => confirmDelete(cat)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-xl border border-transparent hover:border-border hover:shadow-sm transition-all" title="Delete Category">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30 text-muted-foreground text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 rounded-md bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}