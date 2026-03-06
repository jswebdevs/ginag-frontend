"use client";

import { X, Edit, ExternalLink, Calendar, Package } from "lucide-react";

interface ViewBrandModalProps {
  brand: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function ViewBrandModal({ brand, onClose, onEdit }: ViewBrandModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-black text-foreground">Brand Details</h2>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-bold transition-colors">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-destructive bg-background border border-border rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-background border border-border rounded-2xl flex items-center justify-center shadow-sm shrink-0 p-2 overflow-hidden">
              {brand.logo?.originalUrl ? (
                 <img src={brand.logo.originalUrl} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                 <span className="text-muted-foreground text-xs text-center">No Logo</span>
              )}
            </div>
            <div>
              <h3 className="text-3xl font-black text-foreground">{brand.name}</h3>
              <p className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded inline-block mt-2">/{brand.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Website</p>
              {brand.website ? (
                <a href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-semibold text-sm">
                    Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="font-semibold text-foreground text-sm">Not provided</p>
              )}
            </div>
            <div className="bg-background border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Products Count</p>
              <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <p className="font-black text-primary text-xl leading-none">{brand._count?.products || 0}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
              {brand.description || <span className="italic text-muted-foreground">No description provided.</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
            <Calendar className="w-4 h-4" />
            Added on {new Date(brand.createdAt).toLocaleDateString()}
          </div>
        </div>

      </div>
    </div>
  );
}