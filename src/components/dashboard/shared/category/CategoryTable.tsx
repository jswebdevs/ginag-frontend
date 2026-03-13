"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Folder, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Swal from "sweetalert2";

// --- REACT-ICONS MASSIVE IMPORT ---
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as CgIcons from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";
import * as FcIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LuIcons from "react-icons/lu"; // Includes Lucide!
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RxIcons from "react-icons/rx";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as SlIcons from "react-icons/sl";
import * as TbIcons from "react-icons/tb";
import * as TfiIcons from "react-icons/tfi";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";

// Combine all libraries into one lookup object
const IconLibrary: Record<string, React.ElementType> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

interface CategoryTableProps {
  categories: any[];
  onView: (cat: any) => void;
  onEdit: (cat: any) => void;
  onDelete: (id: string) => void;
}

const DynamicIcon = ({ iconName }: { iconName?: string }) => {
  if (!iconName) return <Folder className="w-5 h-5 text-muted-foreground/50" />;

  let IconComponent = IconLibrary[iconName];

  // Backward Compatibility: If it's an old DB entry (e.g. "Monitor"), prefix it with "Lu" to use the react-icons Lucide version.
  if (!IconComponent && IconLibrary[`Lu${iconName}`]) {
    IconComponent = IconLibrary[`Lu${iconName}`];
  }

  // Fallback to Folder if the icon string is completely invalid
  if (!IconComponent) return <Folder className="w-5 h-5 text-muted-foreground/50" />;

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
        background: 'hsl(var(--card))',
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
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      reverseButtons: true,
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
    <div className="flex flex-col w-full">

      {/* ======================================================= */}
      {/* MOBILE SORTING DROPDOWN (Visible only on < md screens)  */}
      {/* ======================================================= */}
      <div className="md:hidden mb-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
          Sort Categories By
        </label>
        <div className="relative">
          <select
            value={`${sortConfig?.key || 'name'}-${sortConfig?.direction || 'asc'}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key: key as SortKey, direction: direction as "asc" | "desc" });
            }}
            className="w-full appearance-none bg-muted border border-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="parent-asc">Parent Category (A-Z)</option>
            <option value="parent-desc">Parent Category (Z-A)</option>
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
        {paginatedCategories.map((cat, index) => (
          <div key={cat.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">

            {/* Row 1: Serial | Image | Name */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-muted-foreground w-5 shrink-0">
                #{String(((currentPage - 1) * itemsPerPage) + index + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border overflow-hidden shadow-sm shrink-0 p-0.5">
                {cat.featuredImage?.thumbUrl ? (
                  <img src={cat.featuredImage.thumbUrl} alt="Featured" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-base leading-tight truncate">{cat.name}</h3>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5 truncate">{cat.slug}</p>
              </div>
            </div>

            {/* Row 2: Parent | Items */}
            <div className="flex justify-between items-center bg-muted/30 -mx-4 px-4 py-2.5 border-y border-border/50">
              <div className="flex-1 min-w-0 pr-2">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Parent Category</span>
                <span className="font-medium text-foreground/80 truncate block text-xs">{getParentName(cat.parentId)}</span>
              </div>
              <div className="text-right shrink-0 border-l border-border/50 pl-4">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Items</span>
                <span className="bg-primary/10 text-primary font-black px-2 py-1 rounded-md text-[10px] uppercase tracking-tighter">
                  {cat._count?.products || 0}
                </span>
              </div>
            </div>

            {/* Row 3: Icon | Actions */}
            <div className="flex justify-between items-center pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Icon: </span>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border/50 shadow-sm">
                  <DynamicIcon iconName={cat.icon} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onView(cat)} className="p-2 text-muted-foreground hover:text-primary bg-muted rounded-lg transition-colors" title="View Details">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit(cat)} className="p-2 text-muted-foreground hover:text-blue-500 bg-muted rounded-lg transition-colors" title="Edit Category">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => confirmDelete(cat)} className="p-2 text-muted-foreground hover:text-red-500 bg-muted rounded-lg transition-colors" title="Delete Category">
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
      <div className="hidden md:block overflow-x-auto custom-scrollbar bg-card rounded-2xl border border-border shadow-sm">
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
      </div>

      {/* Pagination Container (Visible on both PC and Mobile) */}
      <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-card shadow-sm text-muted-foreground text-sm mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-xl bg-muted font-bold text-foreground hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="font-bold">Page {currentPage} of {totalPages || 1}</span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl bg-muted font-bold text-foreground hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

    </div>
  );
}