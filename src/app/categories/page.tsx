"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";


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
const DynamicCategoryIcon = ({ iconData, className }: { iconData: string, className?: string }) => {
  if (!iconData) return <LucideIcons.Package className={className} />;

  // 1. Handle Image URLs
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Category Icon" className={`object-contain ${className}`} />;
  }

  // 2. Check React-Icons Library (The new names with prefixes like Fa, Md, etc.)
  const ReactIconComponent = IconLibrary[iconData];
  if (ReactIconComponent) return <ReactIconComponent className={className} />;

  // 3. Fallback to Lucide-React (Legacy names like "Monitor" or "Watch")
  const LucideIconComponent = (LucideIcons as any)[iconData] || LucideIcons.Package;
  return <LucideIconComponent className={className} />;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg mb-4"></div>
        <div className="h-4 w-96 bg-muted rounded mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-card border border-border rounded-3xl flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-muted rounded-full mb-4"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16 mb-8 md:mb-12">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-heading mb-4 tracking-tight">
            Shop by <span className="text-primary">Category</span>
          </h1>
          <p className="text-subheading max-w-2xl mx-auto md:mx-0 text-base md:text-lg">
            Explore our wide range of premium products organized just for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-theme-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300 relative z-10">
                  <DynamicCategoryIcon
                    iconData={cat.icon}
                    className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:scale-110"
                  />
                </div>

                <h3 className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300 relative z-10 line-clamp-2">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <LucideIcons.LayoutGrid className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Categories Found</h2>
          </div>
        )}
      </div>
    </div>
  );
}