"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ProductTableProps {
  products: any[];
  onDelete: (id: string) => void;
}

type SortKey = "name" | "price" | "category" | null;

const formatRange = (p: any) => {
  const min = p.priceMin != null ? Number(p.priceMin) : null;
  const max = p.priceMax != null ? Number(p.priceMax) : null;
  if (min == null && max == null) return p.priceNote || "—";
  if (min != null && max != null && min !== max) {
    return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  }
  const v = (min ?? max)!;
  return `$${v.toLocaleString()}`;
};

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  const getCategoryText = (product: any) => {
    if (!product.categories || product.categories.length === 0) return "";
    return product.categories.map((c: any) => c.name).join(", ");
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any, bValue: any;
    if (key === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (key === "price") {
      aValue = Number(a.priceMin) || 0;
      bValue = Number(b.priceMin) || 0;
    } else if (key === "category") {
      aValue = getCategoryText(a).toLowerCase();
      bValue = getCategoryText(b).toLowerCase();
    }
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  if (products.length === 0) {
    return <div className="p-10 text-center text-muted-foreground">No products yet. Add one to get started.</div>;
  }

  return (
    <div className="w-full">
      {/* Mobile sort */}
      <div className="md:hidden mb-4">
        <select
          className="w-full p-2.5 text-sm border border-border rounded-lg bg-background text-foreground"
          value={sortConfig ? `${sortConfig.key}-${sortConfig.direction}` : "none-none"}
          onChange={(e) => {
            const [key, dir] = e.target.value.split("-");
            if (key === "none") setSortConfig(null);
            else setSortConfig({ key: key as SortKey, direction: dir as "asc" | "desc" });
          }}
        >
          <option value="none-none">Default</option>
          <option value="name-asc">Name (A→Z)</option>
          <option value="name-desc">Name (Z→A)</option>
          <option value="price-asc">Price (low→high)</option>
          <option value="price-desc">Price (high→low)</option>
        </select>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {sortedProducts.map((product) => {
          const imageSrc = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
          const categoryText = getCategoryText(product);
          return (
            <div key={product.id} className="border border-border rounded-xl p-4 bg-card flex flex-col gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center border border-border overflow-hidden p-1 shrink-0">
                  {imageSrc ? (
                    <img src={imageSrc} alt={product.name} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate" title={product.name}>{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate" title={categoryText}>
                    {categoryText || <span className="italic">Uncategorized</span>}
                  </p>
                  <div className="text-xs text-muted-foreground font-mono mt-1.5">{product.productCode}</div>
                </div>
              </div>

              <div className="py-3 border-y border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Price Range</p>
                <p className="font-black text-foreground">{formatRange(product)}</p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/products/${product.slug || product.id}`}
                  target="_blank"
                  className="p-2.5 text-muted-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-lg transition-colors flex-1 flex justify-center"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/super-admin/products/${product.id}/edit`}
                  className="p-2.5 text-muted-foreground hover:text-blue-500 bg-muted/50 hover:bg-muted rounded-lg transition-colors flex-1 flex justify-center"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2.5 text-muted-foreground hover:text-red-500 bg-muted/50 hover:bg-red-500/10 rounded-lg transition-colors flex-1 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-16">Image</th>
              <th
                className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1.5">Product <SortIcon columnKey="name" /></div>
              </th>
              <th
                className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1.5">Category <SortIcon columnKey="category" /></div>
              </th>
              <th
                className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none text-right"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-1.5">Price Range <SortIcon columnKey="price" /></div>
              </th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts.map((product) => {
              const imageSrc = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
              const categoryText = getCategoryText(product);
              return (
                <tr key={product.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-border overflow-hidden p-1 shrink-0">
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-foreground max-w-[250px] truncate" title={product.name}>
                      {product.name}
                    </p>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{product.productCode}</div>
                  </td>

                  <td className="p-4 text-sm font-medium text-foreground max-w-50 truncate" title={categoryText}>
                    {categoryText || <span className="text-muted-foreground italic">None</span>}
                  </td>

                  <td className="p-4 text-right font-black text-foreground">{formatRange(product)}</td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-primary bg-background rounded-lg border border-transparent hover:border-border transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/super-admin/products/${product.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-lg border border-transparent hover:border-border transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-lg border border-transparent hover:border-border transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
