"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import api from '@/lib/axios';

// --- DYNAMIC ICON RENDERER ---
const DynamicCategoryIcon = ({ iconData, className }: { iconData: string, className?: string }) => {
  if (!iconData) return <LucideIcons.Package className={className} />;
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Category Icon" className={`object-contain ${className}`} />;
  }
  const IconComponent = (LucideIcons as any)[iconData] || LucideIcons.Package;
  return <IconComponent className={className} />;
};

export default function PCCategoryBar() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // React State for Hover Menu
  const [activeHover, setActiveHover] = useState<string | null>(null);
  
  // Scrolling States
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const allCats = res.data.data || [];

        // Build Hierarchy: Parents -> Children for the Dropdowns
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
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="hidden md:flex items-center justify-center h-14 border-b border-border bg-background">
        <div className="flex gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-4 w-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  // Grab the currently hovered category to display its children
  const activeCategoryData = categories.find((c) => c.id === activeHover);
  const hasActiveChildren = activeCategoryData && activeCategoryData.children?.length > 0;

  return (
    <div 
      className="hidden md:block relative border-b border-border bg-background shadow-sm transition-colors duration-300 z-30"
      onMouseLeave={() => setActiveHover(null)} // Close Mega Menu when mouse leaves the bar area
    >
      <div className="container mx-auto px-4 relative flex items-center h-14">
        
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 h-full flex items-center pr-4 bg-gradient-to-r from-background via-background to-transparent z-10">
            <button 
              onClick={scrollLeft} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:text-primary hover:border-primary transition-all ml-2"
            >
              <LucideIcons.ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-8 items-center h-14 w-max px-2">
            {categories.map((cat) => {
              const hasChildren = cat.children && cat.children.length > 0;
              const isHovered = activeHover === cat.id;

              return (
                <div 
                  key={cat.id || cat.slug} 
                  className="flex items-center h-full cursor-pointer"
                  onMouseEnter={() => setActiveHover(cat.id)}
                >
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${isHovered ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <DynamicCategoryIcon 
                      iconData={cat.icon} 
                      className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'scale-110 opacity-100' : 'opacity-80'}`} 
                    />
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <LucideIcons.ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'rotate-180 opacity-100' : 'opacity-50'}`} />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 h-full flex items-center pl-4 bg-gradient-to-l from-background via-background to-transparent z-10">
            <button 
              onClick={scrollRight} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:text-primary hover:border-primary transition-all mr-2"
            >
              <LucideIcons.ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* --- THE MEGA MENU TRAY --- */}
      {hasActiveChildren && (
        <div className="absolute top-14 left-0 w-full bg-card border-b border-border shadow-theme-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-4 gap-x-6">
              {activeCategoryData.children.map((child: any) => (
                <Link 
                  key={child.id}
                  href={`/category/${child.slug}`}
                  onClick={() => setActiveHover(null)}
                  className="flex items-center gap-2.5 group"
                >
                  {/* Replaced Bullet with Dynamic Icon */}
                  <DynamicCategoryIcon 
                    iconData={child.icon} 
                    className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" 
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {child.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}