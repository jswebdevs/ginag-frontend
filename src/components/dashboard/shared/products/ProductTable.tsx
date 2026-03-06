"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Edit, Trash2, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ProductTableProps {
  products: any[];
  onDelete: (id: string) => void;
}

type SortKey = "name" | "price" | "stock" | "category" | null;

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  // Helper to calculate total stock from variations
  const getTotalStock = (product: any) => {
    if (!product.variations || product.variations.length === 0) return 0;
    return product.variations.reduce((sum: number, v: any) => sum + (Number(v.stock) || 0), 0);
  };

  // Helper to get category text (since it's an array of objects)
  const getCategoryText = (product: any) => {
    if (!product.categories || product.categories.length === 0) return "";
    return product.categories.map((c: any) => c.name).join(", ");
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
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
      aValue = Number(a.basePrice) || 0;
      bValue = Number(b.basePrice) || 0;
    } else if (key === "stock") {
      aValue = getTotalStock(a);
      bValue = getTotalStock(b);
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
    return <div className="p-10 text-center text-muted-foreground">No products found. Start adding some!</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-16">Image</th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("name")}
              title="Sort by Name"
            >
              <div className="flex items-center gap-1.5">
                Product <SortIcon columnKey="name" />
              </div>
            </th>

            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => handleSort("category")}
              title="Sort by Category"
            >
              <div className="flex items-center gap-1.5">
                Category <SortIcon columnKey="category" />
              </div>
            </th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none text-right"
              onClick={() => handleSort("price")}
              title="Sort by Price"
            >
              <div className="flex items-center justify-end gap-1.5">
                Base Price <SortIcon columnKey="price" />
              </div>
            </th>
            
            <th 
              className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors select-none text-center"
              onClick={() => handleSort("stock")}
              title="Sort by Stock"
            >
              <div className="flex items-center justify-center gap-1.5">
                Total Stock <SortIcon columnKey="stock" />
              </div>
            </th>
            
            <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedProducts.map((product) => {
            const imageSrc = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
            const categoryText = getCategoryText(product);
            const totalStock = getTotalStock(product);
            
            return (
              <tr key={product.id} className="hover:bg-muted/10 transition-colors group">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-border overflow-hidden p-1 shadow-sm shrink-0">
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
                  <div className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                    <span>{product.productCode}</span>
                    {product.variations?.length > 0 && (
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" title={`${product.variations.length} Variations`}>
                        {product.variations.length} Vars
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-sm font-medium text-foreground max-w-[200px] truncate" title={categoryText}>
                  {categoryText || <span className="text-muted-foreground italic">None</span>}
                </td>
                
                <td className="p-4 text-right font-black text-foreground">
                  ৳{Number(product.basePrice).toLocaleString()}
                </td>
                
                <td className="p-4 text-center">
                  <span 
                    title={`${totalStock} items across all variations`}
                    className={`font-bold px-2.5 py-1 rounded-md text-xs ${totalStock <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}
                  >
                    {totalStock}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {/* View Button */}
                    <Link 
                      href={`/products/${product.slug || product.id}`} 
                      target="_blank"
                      className="p-2 text-muted-foreground hover:text-primary bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" 
                      title="View Live Product Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {/* Edit Button */}
                    <Link 
                      href={`/dashboard/super-admin/products/${product.id}/edit`}
                      className="p-2 text-muted-foreground hover:text-blue-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" 
                      title="Edit Product & Variations"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => onDelete(product.id)} 
                      className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-lg border border-transparent hover:border-border hover:shadow-sm transition-all" 
                      title="Delete Product Permanently"
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
  );
}