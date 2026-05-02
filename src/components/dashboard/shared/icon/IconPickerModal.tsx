"use client";

import { useState, useMemo } from "react";
import { X as LuX, Search as LuSearch } from "lucide-react";
import IconRenderer, { allIconNames } from "@/components/shared/IconRenderer";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export default function IconPickerModal({ isOpen, onClose, onSelect }: IconPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Optimize filtering to prevent lag when searching 30,000+ icons
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return allIconNames.slice(0, 150); // Default to first 150

    return allIconNames
      .filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 150); // Cap at 150 to keep the DOM light and snappy
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl border border-border rounded-3xl shadow-theme-2xl flex flex-col h-[85vh] overflow-hidden">

        {/* Header & Search */}
        <div className="p-4 sm:p-6 border-b border-border bg-muted/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Ultimate Icon Library</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Searching across all React-Icons packs ({allIconNames.length.toLocaleString()} total)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-background border border-border rounded-xl transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search icons (e.g., FaStar, MdMonitor, TbBrandNextjs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <LuSearch className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/5 custom-scrollbar">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredIcons.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => onSelect(iconName)}
                  className="flex flex-col items-center justify-center gap-2 p-3 aspect-square bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group"
                  title={iconName}
                >
                  {/* 🔥 Used IconRenderer perfectly right here! */}
                  <IconRenderer
                    name={iconName}
                    className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110"
                  />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary truncate w-full text-center">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <LuSearch className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-bold text-foreground">No icons found</p>
              <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}