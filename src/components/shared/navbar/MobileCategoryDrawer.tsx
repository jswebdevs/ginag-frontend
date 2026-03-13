"use client";

import React, { useEffect, useState } from 'react';
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

// Combine into lookup
const IconLibrary: Record<string, any> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

// --- SAFE HYBRID DYNAMIC ICON RENDERER ---
const DynamicCategoryIcon = ({ iconData, className }: { iconData?: string, className?: string }) => {
  // Fallback to a guaranteed existing component from the Lu set
  const Fallback = LuIcons.LuPackage;

  if (!iconData) return <Fallback className={className} />;

  // 1. Handle Image URLs
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Icon" className={`object-contain ${className}`} />;
  }

  // 2. Resolve Component (Check React-Icons then legacy strings)
  const IconComponent = IconLibrary[iconData];

  // 3. CRITICAL VALIDATION: Ensure IconComponent is a valid function or class (React component)
  // This prevents the "Element type is invalid: expected a string... but got: undefined" error.
  if (!IconComponent || typeof IconComponent !== 'function') {
    return <Fallback className={className} />;
  }

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
            <LuIcons.LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-primary">
              <LuIcons.LuLoader className="w-6 h-6 animate-spin" />
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
                        href={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="flex-1 flex items-center gap-4 px-5 py-3.5 text-foreground hover:bg-primary/5 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary transition-colors group-hover:text-primary-foreground shadow-sm">
                          <DynamicCategoryIcon iconData={cat.icon} className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={(e) => toggleExpand(cat.id, e)}
                          className="p-4 text-muted-foreground hover:text-primary transition-colors border-l border-border/30"
                        >
                          <LuIcons.LuChevronDown
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
                              href={`/category/${child.slug}`}
                              onClick={onClose}
                              className="py-2.5 text-sm text-muted-foreground hover:text-primary font-bold transition-colors flex items-center gap-3 group"
                            >
                              <DynamicCategoryIcon
                                iconData={child.icon}
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