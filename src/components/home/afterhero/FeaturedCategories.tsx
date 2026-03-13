"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IconLibrary: Record<string, any> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

const bgColors = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-red-500/10 text-red-600 dark:text-red-400",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
];

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories?tree=false")
      .then((res) => {
        const data = res.data?.data || [];
        const mainCategories = data
          .filter((cat: any) => !cat.parentId)
          .map((mainCat: any) => {
            const subCategoryCount = data.filter((c: any) => c.parentId === mainCat.id).length;
            return { ...mainCat, subCategoryCount };
          });
        setCategories(mainCategories);
      })
      .catch((err) => console.error("Category Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── HYBRID DYNAMIC ICON (Pure react-icons) ──
  const DynamicIcon = ({ iconName, className }: { iconName?: string; className: string }) => {
    if (!iconName) return <LuIcons.LuFolder className={className} />;

    // 1. Direct match (e.g. "LuHome", "FaApple", "MdStore")
    let IconComponent = IconLibrary[iconName];
    if (IconComponent) return <IconComponent className={className} />;

    // 2. Legacy support: if DB still has old name without "Lu" (e.g. "Monitor")
    if (!iconName.startsWith("Lu")) {
      IconComponent = IconLibrary[`Lu${iconName}`];
      if (IconComponent) return <IconComponent className={className} />;
    }

    // 3. Final fallback
    return <LuIcons.LuFolder className={className} />;
  };

  if (!loading && categories.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading tracking-tighter uppercase italic">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground mt-2 font-medium text-sm md:text-base">
              Handpicked collections curated just for your style.
            </p>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-primary font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-80 transition-all w-fit"
          >
            All Categories
            <LuIcons.LuArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 md:gap-5 overflow-hidden pb-14">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 shrink-0 h-56 md:h-64 bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center animate-pulse"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-muted mb-6" />
                <div className="h-4 bg-muted w-3/4 rounded mb-2" />
                <div className="h-3 bg-muted w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={2}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 6, spaceBetween: 20 },
                1280: { slidesPerView: 7, spaceBetween: 20 },
              }}
              className="pb-14 !overflow-visible"
            >
              {categories.map((category, index) => {
                const colorClass = bgColors[index % bgColors.length];
                const hasImage = category.image?.thumbUrl || category.image?.originalUrl;

                return (
                  <SwiperSlide key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col items-center text-center group hover:border-primary hover:shadow-theme-lg hover:-translate-y-2 transition-all duration-500 h-full"
                    >
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-5 md:mb-6 transition-all duration-500 group-hover:rotate-12 shadow-sm relative overflow-hidden ${hasImage ? 'bg-muted' : colorClass}`}>
                        {hasImage ? (
                          <Image
                            src={hasImage}
                            alt={category.name}
                            fill
                            sizes="5rem"
                            className="object-cover"
                          />
                        ) : (
                          <DynamicIcon
                            iconName={category.icon}
                            className="w-8 h-8 md:w-10 md:h-10"
                          />
                        )}
                      </div>

                      <h3 className="font-black text-heading text-sm md:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tighter w-full">
                        {category.name}
                      </h3>
                      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        {category.subCategoryCount} Subcategories
                      </p>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

      </div>
    </section>
  );
}