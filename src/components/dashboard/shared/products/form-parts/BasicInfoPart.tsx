"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { ChevronDown, Search, Check, AlignLeft, List, Plus, Trash2, Wand2, Sparkles, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { generateAIContent } from "@/services/ai.service";

export default function BasicInfoPart({ product, update }: any) {
  const [brands, setBrands] = useState<any[]>([]);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [descType, setDescType] = useState<"paragraph" | "list">("paragraph");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI States
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [generatedFields, setGeneratedFields] = useState<string[]>([]);

  useEffect(() => {
    api.get('/brands').then(res => setBrands(res.data.data || []));
    if (product.shortDesc?.includes('\n')) setDescType("list");

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as any)) {
        setIsBrandOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [product.shortDesc]);

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    update({ name: val, slug });
  };

  const generateCode = () => {
    if (!product.name) {
      return Swal.fire("Name Required", "Please enter a Product Title first to generate a code.", "warning");
    }
    const prefix = product.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'PRD';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    update({ productCode: `${prefix}-${randomNum}` });
  };

  // --- AI GENERATION HANDLER ---
  const handleAIGenerate = async (field: string) => {
    if (!product.name) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Product Name',
        text: 'Please enter a product name first so the AI knows what to generate!',
        confirmButtonColor: '#0ea5e9'
      });
    }

    setGeneratingField(field);

    let prompt = "";
    const baseContext = `You are an e-commerce assistant for a store in Bangladesh. The product name is "${product.name}".`;

    switch (field) {
      case "origin":
        prompt = `${baseContext} Guess the most likely country of origin/manufacture for this product. Return ONLY the country name (e.g., Bangladesh, China, Italy).`;
        break;
      case "slug":
        prompt = `${baseContext} Generate a short, highly SEO-optimized URL slug. Return ONLY the slug, using lowercase letters and hyphens.`;
        break;
      case "basePrice":
        prompt = `${baseContext} Suggest a realistic premium retail base price in BDT (Bangladeshi Taka). Return ONLY the number (e.g., 2500). Do not include commas or currency symbols.`;
        break;
      case "salePrice":
        prompt = `${baseContext} Suggest a realistic discounted sale price in BDT for this product, assuming it's currently on sale. Return ONLY the number. Do not include commas or currency symbols.`;
        break;
      case "shortDesc":
        if (descType === "paragraph") {
          prompt = `${baseContext} Write a cohesive 2-3 sentence engaging summary for this product. Return ONLY the raw text. Do not use markdown.`;
        } else {
          prompt = `${baseContext} Write between 3 and 10 short, punchy feature points for this product. 
          Return ONLY the points, each on a new line. 
          CRITICAL: Do NOT use dashes, bullet points, asterisks, or numbers at the start of the lines. Just provide the raw text for each line.`;
        }
        break;
    }

    try {
      let aiResponse = await generateAIContent(prompt);

      // Clean up the response based on the field type
      if (field === "basePrice" || field === "salePrice") {
        aiResponse = aiResponse.replace(/[^0-9]/g, ''); // Ensure only numbers
      } else if (field === "shortDesc" && descType === "list") {
        // Strip any accidental bullets/dashes the AI might have added despite instructions
        aiResponse = aiResponse.split('\n')
          .map(line => line.replace(/^[-*•\d.\s]+/, '').trim())
          .filter(Boolean)
          .join('\n');
      }

      update({ [field]: aiResponse });
      setGeneratedFields(prev => [...prev, field]); // Hide the button after successful generation

    } catch (error: any) {
      console.error(`AI Error (${field}):`, error);
      Swal.fire("Generation Failed", error.message || "Failed to generate content.", "error");
    } finally {
      setGeneratingField(null);
    }
  };

  // --- List Mode Helpers ---
  const listItems = product.shortDesc ? product.shortDesc.split("\n") : [""];
  const updateListItem = (index: number, value: string) => {
    const newList = [...listItems];
    newList[index] = value;
    update({ shortDesc: newList.join("\n") });
  };
  const addListItem = () => update({ shortDesc: (product.shortDesc || "") + "\n" });
  const removeListItem = (index: number) => {
    const newList = listItems.filter((_: string, i: number) => i !== index);
    update({ shortDesc: newList.join("\n") });
  };

  const selectedBrand = brands.find(b => b.id === product.brandId);
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));

  // Reusable AI Button Component
  const AIGenerateButton = ({ field }: { field: string }) => {
    if (generatedFields.includes(field)) return null;

    return (
      <button
        type="button"
        onClick={() => handleAIGenerate(field)}
        disabled={generatingField !== null}
        className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 ml-2"
        title={`Auto-generate ${field}`}
      >
        {generatingField === field ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
        AI
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-4 md:p-8 shadow-theme-sm space-y-6">
      <h2 className="text-xl font-black text-foreground border-b border-border pb-4 tracking-tight">Part 1: Basic Information</h2>

      {/* r1: Name & Product Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Product Title *</label>
          <input
            type="text" value={product.name} onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter product name..."
            className="w-full bg-background border border-border rounded-2xl px-5 py-3 text-lg font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="md:col-span-1 relative">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Product Code *</label>
          <input
            type="text" value={product.productCode} onChange={(e) => update({ productCode: e.target.value.toUpperCase().trim() })}
            placeholder="e.g. DRESS-001"
            className="w-full bg-background border border-border rounded-2xl pl-5 pr-12 py-3 text-lg font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-mono uppercase"
          />
          <button
            type="button" onClick={generateCode} title="Auto-Generate Code"
            className="absolute right-3 top-[38px] p-2 bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
          >
            <Wand2 size={16} />
          </button>
        </div>
      </div>

      {/* r2: Origin, Brand, Slug */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <label className="text-xs font-bold text-muted-foreground">Origin</label>
            <AIGenerateButton field="origin" />
          </div>
          <input
            type="text" value={product.origin} onChange={(e) => update({ origin: e.target.value })}
            placeholder="e.g. Bangladesh"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-bold text-muted-foreground mb-2">Brand</label>
          <div
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm flex items-center justify-between cursor-pointer hover:border-primary transition-all"
          >
            <span className={selectedBrand ? "text-foreground font-bold" : "text-muted-foreground"}>{selectedBrand ? selectedBrand.name : "Select Brand"}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isBrandOpen ? "rotate-180" : ""}`} />
          </div>

          {isBrandOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-theme-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b border-border bg-muted/20">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-muted-foreground" size={14} />
                  <input
                    type="text" autoFocus placeholder="Search brands..."
                    value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-8 pr-2 py-1.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                <div onClick={() => { update({ brandId: "" }); setIsBrandOpen(false); }} className="px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg cursor-pointer flex items-center justify-between">
                  No Brand {product.brandId === "" && <Check size={14} className="text-primary" />}
                </div>
                {filteredBrands.map(b => (
                  <div key={b.id} onClick={() => { update({ brandId: b.id }); setIsBrandOpen(false); }} className="px-3 py-2 text-xs font-bold text-foreground hover:bg-muted rounded-lg cursor-pointer flex items-center justify-between">
                    {b.name} {product.brandId === b.id && <Check size={14} className="text-primary" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-2">
            <label className="text-xs font-bold text-muted-foreground">Slug</label>
            <AIGenerateButton field="slug" />
          </div>
          <input
            type="text" value={product.slug} onChange={(e) => update({ slug: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none font-mono text-xs focus:border-primary"
          />
        </div>
      </div>

      {/* r3: Default Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-primary/5 rounded-3xl border border-primary/10">
        <div>
          <div className="flex items-center mb-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest">Global Base Price (৳)</label>
            <AIGenerateButton field="basePrice" />
          </div>
          <input
            type="number" value={product.basePrice} onChange={(e) => update({ basePrice: e.target.value })}
            className="w-full bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-primary font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div>
          <div className="flex items-center mb-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest">Global Sale Price (৳)</label>
            <AIGenerateButton field="salePrice" />
          </div>
          <input
            type="number" value={product.salePrice} onChange={(e) => update({ salePrice: e.target.value })}
            className="w-full bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-primary font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* r4: Short Description with Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Short Description</label>
            <AIGenerateButton field="shortDesc" />
          </div>
          <div className="flex bg-muted p-1 rounded-xl self-start sm:self-auto">
            <button type="button" onClick={() => setDescType("paragraph")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${descType === 'paragraph' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <AlignLeft size={14} /> Paragraph
            </button>
            <button type="button" onClick={() => setDescType("list")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${descType === 'list' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <List size={14} /> List
            </button>
          </div>
        </div>

        {descType === "paragraph" ? (
          <textarea
            value={product.shortDesc} onChange={(e) => update({ shortDesc: e.target.value })}
            rows={4} placeholder="Enter a cohesive summary..."
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-all"
          />
        ) : (
          <div className="space-y-2 animate-in fade-in duration-300">
            {listItems.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <input
                  type="text" value={item} onChange={(e) => updateListItem(idx, e.target.value)}
                  placeholder={`Feature point ${idx + 1}`}
                  className="flex-1 bg-transparent border-b border-border py-1 text-sm outline-none focus:border-primary"
                />
                <button type="button" onClick={() => removeListItem(idx)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addListItem} className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-wider mt-4 hover:underline">
              <Plus size={14} /> Add Point
            </button>
          </div>
        )}
      </div>
    </div>
  );
}