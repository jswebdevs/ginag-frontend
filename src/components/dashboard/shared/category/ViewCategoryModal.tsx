"use client";

// 🔥 Use the central IconRenderer and stable static icons
import IconRenderer from "@/components/shared/IconRenderer";
import { LuX, LuPencil, LuCalendar } from "react-icons/lu";

interface ViewCategoryModalProps {
  category: any;
  categories: any[];
  onClose: () => void;
  onEdit: () => void;
}

export default function ViewCategoryModal({ category, categories, onClose, onEdit }: ViewCategoryModalProps) {
  const parentName = category.parentId
    ? categories.find(c => c.id === category.parentId)?.name || "Unknown"
    : "None (Top Level)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-black text-foreground tracking-tight">Category Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-bold transition-colors"
            >
              <LuPencil className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-destructive bg-background border border-border rounded-lg transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted/50 border border-border/50 rounded-2xl flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
              {category.featuredImage?.originalUrl ? (
                <img
                  src={category.featuredImage.originalUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                // 🔥 Replaced manual logic with IconRenderer
                <IconRenderer
                  name={category.icon}
                  className="w-10 h-10 text-muted-foreground/50"
                />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">{category.name}</h3>
              <p className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md inline-block mt-1.5 border border-border/50">
                /{category.slug}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Parent Category</p>
              <p className="font-bold text-foreground text-sm">{parentName}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Products</p>
              <p className="font-black text-primary text-xl leading-none">{category._count?.products || 0}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Description</p>
            <div className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border border-border/50 leading-relaxed shadow-inner min-h-[80px]">
              {category.description || <span className="italic text-muted-foreground opacity-60">No description provided for this category.</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
            <LuCalendar className="w-4 h-4" />
            Created on {new Date(category.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

      </div>
    </div>
  );
}