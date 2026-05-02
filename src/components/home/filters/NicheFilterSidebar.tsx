"use client";

import { useState } from "react";
import { 
  Layers, 
  ChevronDown, 
  Sparkles,
  Filter,
  Tag,
  DollarSign
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionSectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionSection = ({ title, icon: Icon, children, defaultOpen = false }: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between group hover:bg-white/5 transition-colors px-6"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-3.5 h-3.5 transition-colors", isOpen ? "text-primary" : "text-white/30")} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors",
            isOpen ? "text-white" : "text-white/40"
          )}>
            {title}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-3 h-3 text-white/20 transition-transform duration-300",
          isOpen && "rotate-180 text-primary"
        )} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function NicheFilterSidebar() {
  const { filters, activeFilters, setFilter, removeFilter, clearFilters, setPriceRange } = useProductStore();

  const toggleFilter = (key: 'category' | 'material', value: string) => {
    const currentFilters = activeFilters[key] as string[];
    if (currentFilters.includes(value)) {
      (removeFilter as any)(key, value);
    } else {
      (setFilter as any)(key, value);
    }
  };

  if (!filters) return (
    <aside className="w-full lg:w-72 h-[400px] bg-white/5 border border-white/10 rounded-[2rem] animate-pulse flex flex-col items-center justify-center">
        <Filter className="w-8 h-8 text-white/10 mb-4 animate-bounce" />
    </aside>
  );

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
        <h3 className="text-sm font-black tracking-tighter text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          FILTER ARTIFACTS
        </h3>
        {Object.values(activeFilters).some(v => Array.isArray(v) ? v.length > 0 : v !== null) && (
          <button 
            onClick={clearFilters}
            className="text-[9px] font-black uppercase text-primary hover:text-white transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Accordion Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        
        {/* Categories Accordion */}
        {filters.categories?.length > 0 && (
          <AccordionSection title="Collections" icon={Tag} defaultOpen={true}>
            <div className="flex flex-col gap-1">
              {filters.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleFilter('category', cat.id)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold text-left rounded-xl transition-all duration-200",
                    activeFilters.category?.includes(cat.id)
                      ? "bg-primary text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/60"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Materials Accordion */}
        {filters.materials?.length > 0 && (
          <AccordionSection title="Material" icon={Layers} defaultOpen={true}>
            <div className="flex flex-wrap gap-1.5">
              {filters.materials.map(material => (
                <button
                  key={material}
                  onClick={() => toggleFilter('material', material)}
                  className={cn(
                    "px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter border rounded-lg transition-all duration-200",
                    activeFilters.material?.includes(material)
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  {material}
                </button>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Price Range Accordion */}
        <AccordionSection title="Valuation" icon={DollarSign} defaultOpen={true}>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase">Min</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={activeFilters.minPrice || ''}
                  onChange={(e) => setPriceRange(e.target.value || null, activeFilters.maxPrice)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/20 uppercase">Max</label>
                <input 
                  type="number"
                  placeholder="∞"
                  value={activeFilters.maxPrice || ''}
                  onChange={(e) => setPriceRange(activeFilters.minPrice, e.target.value || null)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Quick Price Selection */}
            <div className="grid grid-cols-2 gap-1.5">
                {[
                    { l: '0', h: '1000', label: '< 1K' },
                    { l: '1000', h: '5000', label: '1K - 5K' },
                    { l: '5000', h: '10000', label: '5K - 10K' },
                    { l: '10000', h: '', label: '10K+' }
                ].map((range) => (
                    <button
                        key={range.label}
                        onClick={() => setPriceRange(range.l, range.h)}
                        className={cn(
                            "py-1.5 text-[9px] font-black border rounded-md transition-all",
                            activeFilters.minPrice === range.l && activeFilters.maxPrice === range.h
                                ? "bg-primary border-primary text-white"
                                : "border-white/5 text-white/30 hover:border-white/10 hover:text-white/50"
                        )}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
          </div>
        </AccordionSection>

      </div>

      {/* Aesthetic Footer Line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </aside>
  );
}
