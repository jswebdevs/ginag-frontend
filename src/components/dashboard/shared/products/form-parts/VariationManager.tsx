"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Wand2, Trash2, Tag, Box, Plus, X, Settings2 } from "lucide-react";
import Swal from "sweetalert2";

export default function VariationManager({ product, update }: any) {
  const [inputValue, setInputValue] = useState<{ [key: number]: string }>({});

  const addAttribute = () => update({ attributes: [...(product.attributes || []), { name: "", values: [] }] });

  const removeAttribute = (index: number) => {
    const newAttrs = [...product.attributes];
    newAttrs.splice(index, 1);
    update({ attributes: newAttrs });
  };

  const updateAttrName = (index: number, name: string) => {
    const newAttrs = [...product.attributes];
    newAttrs[index].name = name;
    update({ attributes: newAttrs });
  };

  const addValue = (attrIndex: number, value: string) => {
    const val = value.trim();
    if (!val) return;
    const newAttrs = [...product.attributes];
    if (!newAttrs[attrIndex].values.includes(val)) {
      newAttrs[attrIndex].values.push(val);
      update({ attributes: newAttrs });
    }
    setInputValue({ ...inputValue, [attrIndex]: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, attrIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue(attrIndex, inputValue[attrIndex] || "");
    }
  };

  const removeValue = (attrIndex: number, valIndex: number) => {
    const newAttrs = [...product.attributes];
    newAttrs[attrIndex].values.splice(valIndex, 1);
    update({ attributes: newAttrs });
  };

  const generateMatrix = async () => {
    const validAttrs = (product.attributes || []).filter((a: any) => a.name && a.values.length > 0);
    if (validAttrs.length === 0) return Swal.fire("Missing Data", "Please add at least one attribute with values first.", "warning");

    const result = await Swal.fire({
      title: 'Generate Variations?',
      text: "This will append new variations to your list. Make sure you generated a Product Code first!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Generate Now',
      confirmButtonColor: '#2563eb'
    });

    if (result.isConfirmed) {
      const cartesian = (arrays: string[][]): string[][] => arrays.reduce((acc: string[][], curr: string[]) => acc.flatMap(d => curr.map(e => [d, e].flat())), [[]] as string[][]);

      const names: string[] = validAttrs.map((a: any) => a.name);
      const values: string[][] = validAttrs.map((a: any) => a.values);
      const combinations = cartesian(values);

      const newVars = combinations.map((combo: string[], idx: number) => {
        const options: Record<string, string> = {};
        names.forEach((name: string, i: number) => options[name] = combo[i]);

        return {
          name: combo.join(" / "),
          sku: `${product.productCode || 'SKU'}-${combo.map((c: string) => c.substring(0, 3).toUpperCase()).join('-')}`,
          options,
          basePrice: product.basePrice || 0,
          salePrice: product.salePrice || 0,
          stock: 0,
          isDefault: idx === 0 && (!product.variations || product.variations.length === 0) // Only make default if list was empty
        };
      });

      update({ variations: newVars }); // Overwrites local list (requires hitting save to DB)
    }
  };

  const updateVar = (index: number, field: string, val: any) => {
    const nv = [...product.variations];
    nv[index] = { ...nv[index], [field]: val };
    update({ variations: nv });
  };

  // --- NEW: LIVE DELETION FOR EDIT MODE ---
  const deleteVar = async (index: number) => {
    const v = product.variations[index];

    if (v.id) {
      // If it has an ID, it exists in the DB. Confirm and delete it via API immediately.
      const confirm = await Swal.fire({
        title: 'Delete from Database?',
        text: 'This variation is saved. Deleting it here will remove it from the system permanently.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Yes, delete it'
      });

      if (confirm.isConfirmed) {
        try {
          await api.delete(`/variations/${v.id}`);
          const nv = [...product.variations];
          nv.splice(index, 1);
          update({ variations: nv });
          Swal.fire('Deleted!', 'Variation removed from database.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete variation. It might be linked to an order.', 'error');
        }
      }
    } else {
      // It's a new unsaved variation, just remove locally
      const nv = [...product.variations];
      nv.splice(index, 1);
      update({ variations: nv });
    }
  };

  const setDefault = (index: number) => {
    const nv = product.variations.map((v: any, i: number) => ({ ...v, isDefault: i === index }));
    update({ variations: nv });
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <h3 className="font-black text-foreground uppercase tracking-widest text-sm">Product Variations</h3>
        <button
          type="button" onClick={generateMatrix}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:scale-105 transition-transform shadow-sm"
        >
          <Wand2 size={12} /> Generate Matrix
        </button>
      </div>

      {/* STEP 1: ATTRIBUTES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">1. Define Attributes</label>
          <button type="button" onClick={addAttribute} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"><Plus size={12} /> Add Attribute</button>
        </div>

        {(product.attributes || []).length === 0 && (
          <div className="text-center p-4 border border-dashed border-border rounded-xl text-xs text-muted-foreground italic">Add attributes like "Size" or "Color" to generate variations.</div>
        )}

        <div className="space-y-3">
          {(product.attributes || []).map((attr: any, i: number) => (
            <div key={i} className="bg-muted/10 border border-border rounded-xl p-3 space-y-3 relative group">
              <button type="button" onClick={() => removeAttribute(i)} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Attribute Name</label>
                <input type="text" value={attr.name} onChange={(e) => updateAttrName(i, e.target.value)} placeholder="e.g., Color, Size" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Values (Press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {attr.values.map((val: string, vIdx: number) => (
                    <span key={vIdx} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">{val} <button type="button" onClick={() => removeValue(i, vIdx)} className="hover:text-destructive"><X size={10} /></button></span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={inputValue[i] || ""} onChange={(e) => setInputValue({ ...inputValue, [i]: e.target.value })} onKeyDown={(e) => handleKeyDown(e, i)} placeholder="Type value & press Enter..." className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary" />
                  <button type="button" onClick={() => addValue(i, inputValue[i] || "")} className="bg-foreground text-background px-3 rounded-lg text-xs font-bold">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-border my-2" />

      {/* STEP 2: GENERATED VARIATIONS LIST */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
          <span>2. Generated Inventory</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{product.variations?.length || 0} Items</span>
        </label>

        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          {(!product.variations || product.variations.length === 0) && (
            <div className="text-center py-8 border border-dashed border-border rounded-xl">
              <Settings2 className="mx-auto text-muted-foreground/30 mb-2" size={24} />
              <p className="text-xs text-muted-foreground font-medium">No variations generated yet.</p>
            </div>
          )}

          {(product.variations || []).map((v: any, i: number) => (
            <div key={i} className={`bg-background border rounded-xl p-4 relative transition-all ${v.isDefault ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
              <button type="button" onClick={() => deleteVar(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>

              <div className="flex items-center gap-2 mb-3 pr-6">
                <div className="w-5 h-5 bg-primary/10 text-primary rounded-md flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                <h4 className="font-bold text-foreground text-xs truncate">{v.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Tag size={10} /> SKU</label>
                  <input type="text" value={v.sku} onChange={(e) => updateVar(i, 'sku', e.target.value)} className="w-full bg-muted/30 border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary uppercase font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Box size={10} /> Stock</label>
                  <input type="number" value={v.stock} onChange={(e) => updateVar(i, 'stock', Number(e.target.value))} className="w-full bg-muted/30 border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Base Price</label>
                  <input type="number" value={v.basePrice} onChange={(e) => updateVar(i, 'basePrice', Number(e.target.value))} className="w-full bg-muted/30 border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary font-bold text-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Sale Price</label>
                  <input type="number" value={v.salePrice} onChange={(e) => updateVar(i, 'salePrice', Number(e.target.value))} className="w-full bg-muted/30 border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary font-bold text-primary" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer group w-max">
                <input type="radio" name="default_var_radio" checked={v.isDefault} onChange={() => setDefault(i)} className="accent-primary" />
                <span className={`text-[10px] font-black uppercase tracking-wider ${v.isDefault ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {v.isDefault ? "Default Variation" : "Set as Default"}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}