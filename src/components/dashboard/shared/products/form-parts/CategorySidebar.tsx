"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Check, X, Loader2, Sparkles, Tag } from "lucide-react";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service";

export default function CategorySidebar({ product, update }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);

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

  // --- AI AUTO-CATEGORIZE HANDLER ---
  const handleAutoCategorize = async () => {
    if (!product.name) {
      return Swal.fire("Missing Name", "Please enter a Product Title in Part 1 so the AI knows what to categorize!", "warning");
    }
    if (categories.length === 0) {
      return Swal.fire("No Categories", "Please wait for categories to load or add some categories first.", "warning");
    }

    setIsGenerating(true);

    // Build a compact list of categories to feed the AI
    const availableCategories = categories.map(c => `${c.id}: ${c.name}`).join("\n");

    const systemInstruction = `You are an expert e-commerce taxonomy manager.`;

    const prompt = `
      Product Name: "${product.name}"
      
      Available Categories:
      ${availableCategories}
      
      Task: Select the 1 to 3 most relevant category IDs for this product from the list above.
      CRITICAL RULE: Return ONLY the exact category IDs separated by commas (e.g., id1, id2). Do NOT include names, explanations, or any markdown formatting.
    `;

    try {
      const aiResponse = await generateAIContent(prompt, systemInstruction);

      // Clean and parse the response (split by comma, trim spaces)
      const suggestedIds = aiResponse.split(',')
        .map(id => id.trim())
        .filter(id => categories.some(c => c.id === id)); // Ensure the AI didn't hallucinate an ID

      if (suggestedIds.length > 0) {
        // Merge the AI suggestions with whatever the user already manually selected
        const mergedIds = Array.from(new Set([...selectedIds, ...suggestedIds]));
        update({ categoryIds: mergedIds });

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Auto-categorized successfully!',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire("No Match", "The AI couldn't confidently match any of your existing categories to this product.", "info");
      }

    } catch (error: any) {
      console.error("AI Categorization Error:", error);
      Swal.fire("Generation Failed", error.message || "Failed to auto-categorize.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-4 md:p-8 shadow-theme-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-black text-foreground uppercase tracking-widest text-sm flex items-center gap-2">
          <Tag size={16} className="text-muted-foreground" /> Categories
        </h3>

        <button
          type="button"
          onClick={handleAutoCategorize}
          disabled={isGenerating || categories.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
          title="Let AI pick the best categories based on product name"
        >
          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Auto-Select
        </button>
      </div>

      <div className="relative pt-2">

        {/* SELECTED CATEGORY BADGES */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[30px]">
          {selectedIds.length === 0 && !isGenerating && (
            <span className="text-xs text-muted-foreground italic mt-1">No categories selected...</span>
          )}

          {selectedIds.map((id: string) => {
            const catName = categories.find(c => c.id === id)?.name || "Loading...";

            return (
              <span
                key={id}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors hover:bg-primary/20 animate-in zoom-in"
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
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground relative z-20"
          />
          <Search className="absolute left-3 top-3 text-muted-foreground z-20" size={16} />
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
                      {isSelected && <Check size={16} className="text-primary animate-in zoom-in" />}
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