"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

// 🔥 Use the central IconRenderer and stable static UI icons
import IconRenderer from '@/components/shared/IconRenderer';
import { LuX, LuLoader, LuChevronDown } from 'react-icons/lu';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategoryDrawer({ isOpen, onClose }: MobileCategoryDrawerProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories');
        const allCats = res.data.data || [];

        const parents = allCats.filter((c: any) => !c.parentId);
        const nestedCategories = parents.map((parent: any) => ({
          ...parent,
          children: allCats.filter((c: any) => c.parentId === parent.id)
        }));

        setCategories(nestedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-card z-[101] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-theme-lg border-r border-border ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/10">
          <span className="font-black text-lg text-primary uppercase tracking-tighter italic">DreamShop</span>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-muted border border-transparent hover:border-border">
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-primary">
              <LuLoader className="w-6 h-6 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-10 text-sm text-muted-foreground text-center font-medium italic">No categories found.</div>
          ) : (
            <div className="flex flex-col">
              {categories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedCats[cat.id];

                return (
                  <div key={cat.id} className="border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-between group">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={onClose}
                        className="flex-1 flex items-center gap-4 px-5 py-3.5 text-foreground hover:bg-primary/5 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary transition-colors group-hover:text-primary-foreground shadow-sm">
                          {/* 🔥 Using IconRenderer instead of local DynamicCategoryIcon */}
                          <IconRenderer name={cat.icon} className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={(e) => toggleExpand(cat.id, e)}
                          className="p-4 text-muted-foreground hover:text-primary transition-colors border-l border-border/30"
                        >
                          <LuChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out bg-muted/20 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="py-2 px-10 flex flex-col gap-1 border-l-2 border-primary/20 ml-7 my-2">
                          {cat.children.map((child: any) => (
                            <Link
                              key={child.id}
                              href={`/categories/${child.slug}`}
                              onClick={onClose}
                              className="py-2.5 text-sm text-muted-foreground hover:text-primary font-bold transition-colors flex items-center gap-3 group"
                            >
                              {/* 🔥 Using IconRenderer for the child icon as well */}
                              <IconRenderer
                                name={child.icon}
                                className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary transition-colors"
                              />
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/5">
          <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-[0.2em]">DreamShop Lifestyle</p>
        </div>
      </div>
    </>
  );
}