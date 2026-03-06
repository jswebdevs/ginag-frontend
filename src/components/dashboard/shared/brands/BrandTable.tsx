"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

interface BrandTableProps {
  brands: any[];
  onView: (brand: any) => void;
  onEdit: (brand: any) => void;
  onDelete: (id: string) => void;
}

type SortKey = "name" | "website" | "products" | null;

export default function BrandTable({ brands, onView, onEdit, onDelete }: BrandTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedBrands = [...brands].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;

    if (key === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (key === "website") {
      aValue = (a.website || "").toLowerCase();
      bValue = (b.website || "").toLowerCase();
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

  if (brands.length === 0) {
    return <div className="p-10 text-center text-muted-foreground">No brands found. Add one!</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">SL</th>
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Logo</th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1.5">
                Brand Name <SortIcon columnKey="name" />
              </div>
            </th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("website")}
            >
              <div className="flex items-center gap-1.5">
                Website <SortIcon columnKey="website" />
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
          {sortedBrands.map((brand, index) => (
            <tr key={brand.id} className="hover:bg-muted/10 transition-colors group">
              <td className="p-4 text-sm font-medium text-muted-foreground">{index + 1}</td>
              
              <td className="p-4">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-border overflow-hidden p-1 shadow-sm shrink-0">
                  {brand.logo?.thumbUrl || brand.logo?.originalUrl ? (
                    <img src={brand.logo.thumbUrl || brand.logo.originalUrl} alt={brand.name} className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </div>
              </td>

              <td className="p-4 font-bold text-foreground">
                {brand.name}
                <div className="text-xs text-muted-foreground font-normal mt-0.5">/{brand.slug}</div>
              </td>
              
              <td className="p-4 text-sm text-foreground">
                {brand.website ? (
                  <a href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                    {brand.website.replace(/(^\w+:|^)\/\//, '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </td>
              
              <td className="p-4 text-center">
                <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-md text-xs">
                  {brand._count?.products || 0}
                </span>
              </td>
              
              <td className="p-4">
                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onView(brand)} className="p-2 text-muted-foreground hover:text-primary bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(brand)} className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(brand.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" title="Delete">
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