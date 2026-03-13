"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface BrandTableProps {
  brands: any[];
  onView: (brand: any) => void;
  onEdit: (brand: any) => void;
  onDelete: (id: string) => void;
}

type SortKey = "name" | "website" | "products" | null;

export default function BrandTable({ brands, onView, onEdit, onDelete }: BrandTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
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

  // Pagination Logic
  const totalPages = Math.ceil(sortedBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = sortedBrands.slice(startIndex, startIndex + itemsPerPage);

  if (brands.length === 0) {
    return <div className="p-10 text-center text-muted-foreground font-medium border border-border rounded-2xl bg-card">No brands found. Add one!</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4">

      {/* ======================================================= */}
      {/* MOBILE SORTING DROPDOWN (Visible only on < md screens)  */}
      {/* ======================================================= */}
      <div className="md:hidden bg-card p-4 rounded-2xl border border-border shadow-sm">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
          Sort Brands By
        </label>
        <div className="relative">
          <select
            value={`${sortConfig?.key || 'name'}-${sortConfig?.direction || 'asc'}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key: key as SortKey, direction: direction as "asc" | "desc" });
              setCurrentPage(1);
            }}
            className="w-full appearance-none bg-muted border border-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="products-desc">Most Products</option>
            <option value="products-asc">Least Products</option>
          </select>
          <ArrowUpDown className="absolute right-4 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ======================================================= */}
      {/* MOBILE CARD LAYOUT (Visible only on < md screens)       */}
      {/* ======================================================= */}
      <div className="flex flex-col gap-4 md:hidden">
        {paginatedBrands.map((brand) => (
          <div key={brand.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            {/* Top row: Logo & Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center border border-border overflow-hidden p-1.5 shadow-sm shrink-0">
                {brand.logo?.thumbUrl || brand.logo?.originalUrl ? (
                  <img src={brand.logo.thumbUrl || brand.logo.originalUrl} alt={brand.name} className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-foreground text-lg leading-tight">{brand.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">/{brand.slug}</p>
                <div className="mt-2 inline-flex">
                  <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                    {brand._count?.products || 0} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: Website & Actions */}
            <div className="flex justify-between items-center border-t border-border/50 pt-3 mt-1">
              <div className="text-sm">
                {brand.website ? (
                  <a href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                    <ExternalLink className="w-3.5 h-3.5" /> Website
                  </a>
                ) : (
                  <span className="text-muted-foreground italic text-xs">No website</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => onView(brand)} className="p-2 text-muted-foreground hover:text-primary bg-muted rounded-lg transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit(brand)} className="p-2 text-muted-foreground hover:text-blue-500 bg-muted rounded-lg transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(brand.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-muted rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================= */}
      {/* DESKTOP TABLE LAYOUT (Hidden on < md screens)           */}
      {/* ======================================================= */}
      <div className="hidden md:flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-16 text-center">SL</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-20">Logo</th>
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
              {paginatedBrands.map((brand, index) => (
                <tr key={brand.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-4 text-sm font-bold text-muted-foreground text-center">
                    {startIndex + index + 1}
                  </td>
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
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">/{brand.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {brand.website ? (
                      <a href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                        {brand.website.replace(/(^\w+:|^)\/\//, '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg text-xs">
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
      </div>

      {/* ======================================================= */}
      {/* PAGINATION CONTROLS                                     */}
      {/* ======================================================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Showing <span className="font-bold text-foreground">{startIndex + 1}</span> to <span className="font-bold text-foreground">{Math.min(startIndex + itemsPerPage, sortedBrands.length)}</span> of <span className="font-bold text-foreground">{sortedBrands.length}</span> brands
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm font-medium sm:hidden">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}