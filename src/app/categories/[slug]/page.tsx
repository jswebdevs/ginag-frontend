"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
const DynamicCategoryIcon = ({ iconData, className }: { iconData?: string, className?: string }) => {
  if (!iconData) return <LucideIcons.Folder className={className} />;

  // 1. Handle Image URLs
  if (iconData.startsWith('http') || iconData.startsWith('/')) {
    return <img src={iconData} alt="Category Icon" className={`object-contain ${className}`} />;
  }

  // 2. Check React-Icons Library (The new names with prefixes like Fa, Md, etc.)
  const ReactIconComponent = IconLibrary[iconData];
  if (ReactIconComponent) return <ReactIconComponent className={className} />;

  // 3. Fallback to Lucide-React (Legacy names like "Monitor" or "Watch")
  const LucideIconComponent = (LucideIcons as any)[iconData] || LucideIcons.Folder;
  return <LucideIconComponent className={className} />;
};

export default function SingleCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return;
      setLoading(true);
      setError(false);

      try {
        // 1. Fetch the exact category using the slug
        const catRes = await api.get(`/categories/${slug}`);
        const currentCategory = catRes.data.category || catRes.data.data;

        if (!currentCategory) {
          setError(true);
          setLoading(false);
          return;
        }

        setCategory(currentCategory);

        // 2. Fetch all categories to find the children (subcategories)
        const allCatsRes = await api.get('/categories');
        const allCats = allCatsRes.data.data || [];
        const foundSubcats = allCats.filter((c: any) => c.parentId === currentCategory.id);
        setSubcategories(foundSubcats);

        // 3. Fetch all products linked to this category's ID
        const prodRes = await api.get(`/products?category=${currentCategory.id}`);
        setProducts(prodRes.data.data || []);

      } catch (err) {
        console.error("Failed to load category page data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <LucideIcons.Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <LucideIcons.CloudOff className="w-10 h-10 text-muted-foreground opacity-50" />
        </div>
        <h1 className="text-3xl font-black text-heading mb-2">Category Not Found</h1>
        <p className="text-subheading mb-8">The category you are looking for doesn't exist or has been moved.</p>
        <Link href="/categories" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">
          Browse All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">

      {/* --- CATEGORY HEADER --- */}
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-theme-md shrink-0">
            <DynamicCategoryIcon iconData={category.icon} className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-heading mb-3 tracking-tight">
              {category.name}
            </h1>
            {category.description ? (
              <p className="text-subheading max-w-2xl text-base md:text-lg">
                {category.description}
              </p>
            ) : (
              <p className="text-subheading max-w-2xl text-base md:text-lg">
                Explore our premium selection of {category.name.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">

        {/* --- SUBCATEGORIES SECTION --- */}
        {subcategories.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">Shop by Subcategory</h2>
              <div className="h-[2px] flex-1 bg-border/50 ml-4 rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/category/${subcat.slug}`}
                  className="group relative bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-theme-md overflow-hidden"
                >
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors duration-300">
                    <DynamicCategoryIcon iconData={subcat.icon} className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {subcat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* --- PRODUCTS SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">All Products</h2>
              <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-md">
                {products.length}
              </span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => {
                const itemName = product.name || product.title || "Unnamed Product";
                const imageSrc = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;
                const priceText = product.basePrice ? `৳${Number(product.basePrice).toLocaleString()}` : 'N/A';

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug || product.id}`}
                    className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 shadow-sm hover:shadow-theme-md"
                  >
                    <div className="aspect-square bg-muted/30 relative flex items-center justify-center overflow-hidden border-b border-border/50 p-4">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={itemName}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <LucideIcons.Image className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {itemName}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-black text-primary text-lg">{priceText}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card/50 border border-border border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <LucideIcons.PackageOpen className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">We are currently restocking our {category.name} collection.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}