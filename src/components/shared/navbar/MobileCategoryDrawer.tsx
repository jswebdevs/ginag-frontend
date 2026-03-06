"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import api from '@/lib/axios';

// Dynamic Icon Renderer
const DynamicCategoryIcon = ({ iconData, className }: { iconData: string, className?: string }) => {
  if (!iconData) return <LucideIcons.Package className={className} />;
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Category Icon" className={`object-contain ${className}`} />;
  }
  const IconComponent = (LucideIcons as any)[iconData] || LucideIcons.Package;
  return <IconComponent className={className} />;
};

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategoryDrawer({ isOpen, onClose }: MobileCategoryDrawerProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Only fetch if the drawer is opened or we already have data
    if (!isOpen && categories.length > 0) return;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories');
        const allCats = res.data.data || [];
        console.log("Fetched categories:", allCats);

        // Build Hierarchy: Separate parents from children
        const parents = allCats.filter((c: any) => !c.parentId);
        
        // Attach children to their parents
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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when just opening the accordion
    e.stopPropagation();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-theme z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-theme-lg border-r border-border ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-transparent">
          <span className="font-bold text-lg text-primary">Shop Categories</span>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted">
            <LucideIcons.X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-primary">
              <LucideIcons.Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-4 text-sm text-muted-foreground text-center">No categories found.</div>
          ) : (
            <div className="flex flex-col">
              {categories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedCats[cat.id];

                return (
                  <div key={cat.id} className="border-b border-border/50 last:border-0">
                    {/* Parent Row */}
                    <Link 
                      href={`/categories/${cat.slug}`}
                      onClick={(e) => {
                        // If it has children and we click the chevron area, just expand. 
                        // If we click the name/icon, navigate and close.
                        if (!hasChildren) onClose();
                      }}
                      className="group flex items-center justify-between px-5 py-3.5 text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4" onClick={() => !hasChildren && onClose()}>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary transition-colors group-hover:text-primary-foreground">
                          <DynamicCategoryIcon iconData={cat.icon} className="w-4 h-4 transition-all duration-300" />
                        </div>
                        <span className="font-semibold text-sm">{cat.name}</span>
                      </div>
                      
                      {/* Accordion Toggle Button */}
                      {hasChildren && (
                        <button 
                          onClick={(e) => toggleExpand(cat.id, e)}
                          className="p-2 -mr-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <LucideIcons.ChevronDown 
                            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} 
                          />
                        </button>
                      )}
                    </Link>

                    {/* Children Container (Accordion) */}
                    {hasChildren && (
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out bg-muted/20 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="py-2 px-14 flex flex-col gap-1 border-l-2 border-primary/20 ml-7 my-2">
                          {cat.children.map((child: any) => (
                            <Link 
                              key={child.id}
                              href={`/categories/${child.slug}`}
                              onClick={onClose}
                              // Removed the before: CSS classes that created the bullet
                              className="py-2 text-sm text-muted-foreground hover:text-primary font-medium transition-colors flex items-center gap-2.5 group"
                            >
                              {/* Render dynamic icon for the child category */}
                              <DynamicCategoryIcon 
                                iconData={child.icon} 
                                className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" 
                              />
                              <span>{child.name}</span>
                            </Link>
                          ))}
                          
                          {/* "View All" link for the parent category */}
                          <Link
                            href={`/categories/${cat.slug}`}
                            onClick={onClose}
                            className="py-2 text-xs text-primary font-bold hover:underline mt-1"
                          >
                            View all in {cat.name} &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}