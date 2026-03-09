"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Zap,
  Loader2,
  ChevronRight
} from "lucide-react";

export default function Hero1() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIXED: Corrected the API string interpolation and calling the actual hero endpoint
    api.get("/special/hero")
      .then((res) => {
        // Based on your controller, we expect an array of products tagged 'Hero'
        // We will treat the first as Main and the second as Trending
        setData(res.data.data);
      })
      .catch((err) => console.error("Hero Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- SKELETON LOADING STATE ---
  if (loading) {
    return (
      <section className="px-4 py-4 md:py-8 max-w-[1440px] mx-auto animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 md:grid-rows-4 lg:grid-rows-2 gap-4 h-auto lg:h-[650px]">
          <div className="col-span-1 md:col-span-4 lg:col-span-7 row-span-2 bg-muted rounded-[2.5rem]" />
          <div className="col-span-1 md:col-span-2 lg:col-span-5 row-span-1 bg-muted rounded-[2.5rem]" />
          <div className="col-span-1 md:col-span-2 lg:col-span-5 row-span-1 bg-muted rounded-[2.5rem]" />
        </div>
      </section>
    );
  }

  // Assigning data from the returned array
  // If only one product is tagged 'Hero', both cards will show the same item
  const mainHero = Array.isArray(data) ? data[0] : null;
  const trendingHero = Array.isArray(data) && data.length > 1 ? data[1] : mainHero;

  // Fallback if no products are tagged
  const hero = {
    main: mainHero || { name: "New Collection", imageUrl: "", slug: "products" },
    trending: trendingHero || { name: "Trending Now", price: "0", imageUrl: "", slug: "products" }
  };

  return (
    <section className="px-4 py-2 max-w-360 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 md:grid-rows-4 lg:grid-rows-2 gap-4 h-auto lg:h-160">

        {/* --- 1. MAIN CAMPAIGN CARD (BIG BOX) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-4 lg:col-span-7 row-span-2 relative overflow-hidden rounded-[2.5rem] bg-zinc-900 group"
        >
          {/* Main Hero Image from API */}
          <img
            src={hero.main.featuredImage?.originalUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"}
            alt={hero.main.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 md:p-12 flex flex-col justify-end items-start">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Curated Picks 2026</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tighter uppercase">
              {hero.main.name.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-primary italic">{hero.main.name.split(' ').pop()}</span>
            </h1>

            <Link
              href={`/products/${hero.main.slug}`}
              className="group/btn relative overflow-hidden bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:pr-10 active:scale-95 shadow-xl shadow-primary/20"
            >
              <span className="relative z-10">START SHOPPING</span>
              <ShoppingBag size={20} className="relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* --- 2. TRENDING ITEM CARD (TOP RIGHT) --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-2 lg:col-span-5 row-span-1 bg-card border border-border rounded-[2.5rem] p-8 relative overflow-hidden group shadow-theme-sm"
        >
          <div className="relative z-20 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Zap size={16} fill="currentColor" className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Trending Now</span>
              </div>
              <h3 className="text-2xl font-black text-heading max-w-[200px] leading-tight group-hover:text-primary transition-colors">
                {hero.trending.name}
              </h3>
              <p className="text-primary font-black text-xl mt-2 tracking-tighter">
                ৳{hero.trending.variations?.[0]?.salePrice || hero.trending.basePrice || "0"}
              </p>
            </div>

            <Link
              href={`/products/${hero.trending.slug}`}
              className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center hover:bg-primary transition-all duration-300 group-hover:scale-110"
            >
              <ArrowUpRight size={24} />
            </Link>
          </div>

          {/* Floating Product Image - Uses actual API image */}
          <img
            src={hero.trending.featuredImage?.originalUrl || ""}
            className="absolute -right-4 -bottom-4 w-48 md:w-56 h-auto object-contain transition-all duration-700 group-hover:-translate-x-6 group-hover:-translate-y-6 group-hover:rotate-6 drop-shadow-2xl z-10"
            alt="Trending"
          />
        </motion.div>

        {/* --- 3. CATEGORY EXPLORER (BOTTOM RIGHT) --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-5 row-span-1 bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-primary/10"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                EXPLORE ALL <br /> CATEGORIES
              </h3>
              <p className="text-white/70 text-sm font-bold mt-4">Find exactly what you are looking for.</p>
            </div>

            <Link
              href="/categories"
              className="flex items-center gap-2 font-black text-[10px] tracking-widest group-hover:gap-4 transition-all bg-black/20 w-fit px-5 py-2.5 rounded-full backdrop-blur-md"
            >
              BROWSE CATALOG <ChevronRight size={16} />
            </Link>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-1000" />
          <div className="absolute bottom-[-10%] left-[10%] w-24 h-24 bg-black/20 rounded-full blur-2xl" />
        </motion.div>

      </div>
    </section>
  );
}