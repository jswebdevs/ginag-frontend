"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Check, X } from "lucide-react";

export default function CategorySidebar({ product, update }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || []));
  }, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggleCategory = (id: string) => {
    const current = [...product.categoryIds];
    const index = current.indexOf(id);
    if (index > -1) current.splice(index, 1);
    else current.push(id);
    update({ categoryIds: current });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-4">
      <h3 className="font-black text-foreground uppercase tracking-widest text-sm">Select Categories</h3>
      
      <div className="relative">
        <div className="flex flex-wrap gap-2 mb-3">
          {product.categoryIds.map((id: string) => (
            <span key={id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              {categories.find(c => c.id === id)?.name}
              <X size={12} className="cursor-pointer" onClick={() => toggleCategory(id)}/>
            </span>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" value={search} onChange={(e) => {setSearch(e.target.value); setIsOpen(true);}}
            onFocus={() => setIsOpen(true)}
            placeholder="Search categories..."
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
          />
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
        </div>

        {isOpen && search && (
          <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-theme-xl z-50 overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
              {filtered.slice(0, 10).map(cat => (
                <div 
                  key={cat.id} onClick={() => toggleCategory(cat.id)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  {product.categoryIds.includes(cat.id) && <Check size={14} className="text-primary"/>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}