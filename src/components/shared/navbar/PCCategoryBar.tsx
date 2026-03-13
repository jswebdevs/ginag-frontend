"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

// 🔥 Use the central IconRenderer and stable static UI icons
import IconRenderer from '@/components/shared/IconRenderer';
import { LuChevronLeft, LuChevronRight, LuChevronDown } from 'react-icons/lu';

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

  const activeCategoryData = categories.find((c) => c.id === activeHover);
  const hasActiveChildren = activeCategoryData && activeCategoryData.children?.length > 0;

  return (
    <div
      className="hidden md:block relative border-b border-border bg-background shadow-sm transition-colors duration-300 z-30"
      onMouseLeave={() => setActiveHover(null)}
    >
      <div className="container mx-auto px-4 relative flex items-center h-14">

        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 h-full flex items-center pr-4 bg-gradient-to-r from-background via-background to-transparent z-10">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border shadow-md text-foreground hover:text-primary hover:border-primary transition-all ml-2"
            >
              <LuChevronLeft className="w-5 h-5" />
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
                    className={`flex items-center gap-2 text-sm font-bold tracking-tight transition-colors whitespace-nowrap ${isHovered ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <IconRenderer
                      name={cat.icon}
                      className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'scale-110 opacity-100' : 'opacity-80'}`}
                    />
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <LuChevronDown className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'rotate-180 opacity-100' : 'opacity-50'}`} />
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
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* --- THE MEGA MENU TRAY --- */}
      {hasActiveChildren && (
        <div className="absolute top-14 left-0 w-full bg-card border-b border-border shadow-theme-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-6 gap-x-6">
              {activeCategoryData.children.map((child: any) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  onClick={() => setActiveHover(null)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                    <IconRenderer
                      name={child.icon}
                      className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                    />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
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