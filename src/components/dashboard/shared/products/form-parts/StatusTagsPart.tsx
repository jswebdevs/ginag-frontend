"use client";

import { useState } from "react";
import { Tag as TagIcon, X, Globe } from "lucide-react";

export default function StatusTagsPart({ product, update }: any) {
  const [tagInput, setTagInput] = useState("");

  const statusOptions = ["DRAFT", "ACTIVE", "FEATURED", "HOT", "NEW", "FLASH_SALE", "ARCHIVED"];

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !product.tags.includes(val)) {
        update({ tags: [...product.tags, val] });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    update({ tags: product.tags.filter((t: string) => t !== tagToRemove) });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-theme-sm space-y-6">
      <h2 className="text-xl font-black text-foreground border-b border-border pb-4">Part 2: Status & Marketing</h2>

      {/* r1: Tags & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Search Tags</label>
          <div className="flex flex-wrap gap-2 p-2 bg-background border border-border rounded-2xl min-h-[50px] focus-within:ring-2 focus-within:ring-primary transition-all">
            {product.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 bg-muted text-foreground px-3 py-1 rounded-full text-xs font-bold border border-border/50">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive" title="Remove Tag">
                  <X size={12} />
                </button>
              </span>
            ))}
            <input 
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type & press Enter..."
              className="flex-1 bg-transparent outline-none text-sm min-w-[120px] px-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Product Status</label>
          <div className="relative">
            <TagIcon className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <select 
              value={product.productStatus}
              onChange={(e) => update({ productStatus: e.target.value })}
              className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* r2: blogUrl */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">External Review/Blog URL</label>
        <div className="relative">
          <Globe className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
          <input 
            type="url"
            value={product.blogUrl || ""}
            onChange={(e) => update({ blogUrl: e.target.value })}
            placeholder="https://example.com/review"
            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}