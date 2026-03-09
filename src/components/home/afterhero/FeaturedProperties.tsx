"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Folder } from "lucide-react";
import * as LucideIcons from "lucide-react";
import api from "@/lib/axios";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Color palette for the dynamic backgrounds
const bgColors = [
  "bg-blue-500/10 text-blue-500",
  "bg-pink-500/10 text-pink-500",
  "bg-purple-500/10 text-purple-500",
  "bg-orange-500/10 text-orange-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-red-500/10 text-red-500",
  "bg-indigo-500/10 text-indigo-500",
  "bg-amber-500/10 text-amber-500",
];

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories?tree=false") // Fetch flat list with product counts
      .then((res) => {
        const data = res.data?.data || [];
        // Only show categories that actually have an icon or are top-level
        setCategories(data);
      })
      .catch((err) => console.error("Category Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const DynamicIcon = ({ iconName, className }: { iconName?: string; className: string }) => {
    if (!iconName) return <Folder className={className} />;
    const IconComponent = (LucideIcons as any)[iconName] || Folder;
    return <IconComponent className={className} />;
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-heading tracking-tighter uppercase italic">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground mt-2 font-medium">Handpicked collections curated just for your style.</p>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:opacity-80 transition-all"
          >
            All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Carousel Implementation */}
        <div className="relative group">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
            className="pb-14 !overflow-visible"
          >
            {categories.map((category, index) => {
              // Assign a color based on index
              const colorClass = bgColors[index % bgColors.length];

              return (
                <SwiperSlide key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="bg-card border border-border rounded-4xl p-8 flex flex-col items-center text-center group hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full"
                  >
                    {/* Icon Container */}
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-10 shadow-sm ${colorClass}`}>
                      <DynamicIcon
                        iconName={category.icon}
                        className="w-10 h-10"
                      />
                    </div>

                    {/* Category Info */}
                    <h3 className="font-black text-heading text-sm md:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tighter">
                      {category.name}
                    </h3>
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      {category._count?.products || 0} Items
                    </p>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}