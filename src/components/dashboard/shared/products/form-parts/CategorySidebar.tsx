"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Check, X, Loader2 } from "lucide-react";

export default function CategorySidebar({ product, update }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get('/categories')
      .then(res => {
        const fetchedData = res.data?.data || res.data || [];
        setCategories(Array.isArray(fetchedData) ? fetchedData : []);
      })
      .catch(err => console.error("Failed to fetch categories", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Aggressive Sanitization: Ensure we only ever map valid String IDs
  const rawCategories = product?.categoryIds || product?.categories || [];
  const selectedIds = Array.from(
    new Set<string>(
      rawCategories
        .map((c: any) => typeof c === "string" ? c : c?.id)
        .filter((id: any): id is string => typeof id === "string" && id.trim() !== "")
    )
  );


  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (id: string) => {
    const current = [...selectedIds];
    const index = current.indexOf(id);

    if (index > -1) current.splice(index, 1);
    else current.push(id);

    // Send clean string array back to the parent form immediately
    update({ categoryIds: current });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-4">
      <h3 className="font-black text-foreground uppercase tracking-widest text-sm">Select Categories</h3>

      <div className="relative">

        {/* SELECTED CATEGORY BADGES */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedIds.map((id: string) => {
            const catName = categories.find(c => c.id === id)?.name || "Loading...";

            return (
              <span
                key={id}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors hover:bg-primary/20"
              >
                {catName}
                <X
                  size={14}
                  className="cursor-pointer hover:text-destructive transition-colors shrink-0"
                  onClick={() => toggleCategory(id)}
                />
              </span>
            );
          })}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative z-10">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search categories..."
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground relative z-20"
          />
          <Search className="absolute left-3 top-2.5 text-muted-foreground z-20" size={16} />
        </div>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-theme-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[200px] overflow-y-auto p-1.5 custom-scrollbar">

              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary mb-2" />
                  <span className="text-xs font-bold">Loading Categories...</span>
                </div>
              ) : filtered.length > 0 ? (
                filtered.slice(0, 10).map(cat => {
                  const isSelected = selectedIds.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        toggleCategory(cat.id);
                        setSearch(""); // Clear search so they see the badge
                        setIsOpen(false); // Close dropdown
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted'}`}
                    >
                      <span className={`text-sm ${isSelected ? 'font-bold text-primary' : 'font-medium text-foreground'}`}>
                        {cat.name}
                      </span>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-center text-sm text-muted-foreground font-medium">
                  No categories found.
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Invisible backdrop to close dropdown cleanly */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}