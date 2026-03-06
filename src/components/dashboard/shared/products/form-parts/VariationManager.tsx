"use client";
import { Wand2, Trash2, Tag, Box } from "lucide-react";
import Swal from "sweetalert2";

export default function VariationManager({ product, update }: any) {
  
  // ... (Include same Cartesian Logic from previous step) ...

  const deleteVar = (index: number) => {
    const nv = [...product.variations];
    nv.splice(index, 1);
    update({ variations: nv });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Part 6: Variations</h2>
        <button onClick={() => {/* trigger generation */}} className="bg-foreground text-background px-5 py-2 rounded-xl font-bold flex items-center gap-2">
            <Wand2 size={16}/> Generate Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.variations.map((v: any, i: number) => (
          <div key={i} className="bg-card border border-border rounded-3xl p-5 shadow-theme-sm relative group hover:border-primary/30 transition-all">
            <button onClick={() => deleteVar(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={18}/>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black">
                {i + 1}
              </div>
              <h4 className="font-bold text-foreground truncate pr-6">{v.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">SKU</label>
                <input type="text" value={v.sku} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Stock</label>
                <input type="number" value={v.stock} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Price Override</label>
                <input type="number" value={v.basePrice} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary font-bold text-primary" />
              </div>
              <div className="flex items-center mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="defaultVar" checked={v.isDefault} className="accent-primary" />
                    <span className="text-xs font-bold text-muted-foreground">Set Default</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}