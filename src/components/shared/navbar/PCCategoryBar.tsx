"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

// --- REACT-ICONS MASSIVE LOOKUP ---
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as CgIcons from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";
import * as FcIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RxIcons from "react-icons/rx";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as SlIcons from "react-icons/sl";
import * as TbIcons from "react-icons/tb";
import * as TfiIcons from "react-icons/tfi";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";

const IconLibrary: Record<string, any> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

// --- HYBRID DYNAMIC ICON RENDERER ---
const DynamicCategoryIcon = ({ iconData, className }: { iconData?: string, className?: string }) => {
  if (!iconData) return <LuIcons.LuPackage className={className} />;

  // 1. Handle Image URLs
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Category Icon" className={`object-contain ${className}`} />;
  }

  // 2. Check React-Icons Library (FaApple, MdHome, etc.)
  const ReactIconComponent = IconLibrary[iconData];
  if (ReactIconComponent) return <ReactIconComponent className={className} />;

  // 3. Fallback to Lucide-React legacy strings
  const LucideIconComponent = (LucideIcons as any)[iconData] || LuIcons.LuPackage;
  return <LucideIconComponent className={className} />;
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
              <LuIcons.LuChevronLeft className="w-5 h-5" />
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
                    <DynamicCategoryIcon
                      iconData={cat.icon}
                      className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'scale-110 opacity-100' : 'opacity-80'}`}
                    />
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <LuIcons.LuChevronDown className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'rotate-180 opacity-100' : 'opacity-50'}`} />
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
              <LuIcons.LuChevronRight className="w-5 h-5" />
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
                    <DynamicCategoryIcon
                      iconData={child.icon}
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