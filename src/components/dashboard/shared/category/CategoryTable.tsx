"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Folder, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import * as LucideIcons from "lucide-react";

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

  // Helper for UI rendering
  const getParentName = (parentId: string | null) => {
    if (!parentId) return <span className="text-muted-foreground italic">None</span>;
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  // Helper specifically for sorting strings
  const getParentString = (parentId: string | null) => {
    if (!parentId) return "none";
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name.toLowerCase() : "unknown";
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

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  if (categories.length === 0) {
    return <div className="p-10 text-center text-muted-foreground">No categories found. Create one!</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">SL</th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Icon & Image</th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1.5">
                Name <SortIcon columnKey="name" />
              </div>
            </th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("parent")}
            >
              <div className="flex items-center gap-1.5">
                Parent Category <SortIcon columnKey="parent" />
              </div>
            </th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("products")}
            >
              <div className="flex items-center justify-center gap-1.5">
                Products <SortIcon columnKey="products" />
              </div>
            </th>
            
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedCategories.map((cat, index) => (
            <tr key={cat.id} className="hover:bg-muted/10 transition-colors group">
              <td className="p-4 text-sm font-medium text-muted-foreground">{index + 1}</td>
              
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border/50 shrink-0">
                    <DynamicIcon iconName={cat.icon} />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border/50 overflow-hidden shrink-0">
                    {cat.featuredImage?.thumbUrl ? (
                      <img src={cat.featuredImage.thumbUrl} alt="Featured" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </div>
                </div>
              </td>

              <td className="p-4 font-bold text-foreground">
                {cat.name}
                <div className="text-xs text-muted-foreground font-normal">{cat.slug}</div>
              </td>
              
              <td className="p-4 text-sm text-foreground">
                {getParentName(cat.parentId)}
              </td>
              
              <td className="p-4 text-center">
                <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-md text-xs">
                  {cat._count?.products || 0}
                </span>
              </td>
              
              <td className="p-4">
                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onView(cat)} className="p-2 text-muted-foreground hover:text-primary bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(cat)} className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(cat.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}