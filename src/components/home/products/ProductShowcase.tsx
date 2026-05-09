"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductShowcase() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-muted/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted border border-border rounded-full"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
              Premium Collections
            </span>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85] uppercase">
              Curated <span className="text-primary">Artifacts.</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Precision-engineered objects for the modern collector. Each piece is a testament to technical excellence and industrial purity.
            </p>
          </div>
        </div>

        {/* Slider Section */}
        <div className="relative group">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="aspect-[4/5] bg-muted/50 rounded-[3rem] animate-pulse border border-border" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/50 rounded-[3rem] border border-border">
              <AlertCircle className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-foreground uppercase tracking-tighter">System Disruption</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/50 rounded-[3rem] border border-border">
              <Search className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <h3 className="text-2xl font-bold text-foreground uppercase tracking-tighter">No Artifacts Available</h3>
              <p className="text-muted-foreground mt-2">The inventory is currently being replenished.</p>
            </div>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={32}
                slidesPerView={1}
                navigation={{
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                }}
                className="product-swiper !pb-16"
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation */}
              <button className="swiper-button-prev-custom absolute left-[-20px] top-[45%] z-20 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden xl:flex">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="swiper-button-next-custom absolute right-[-20px] top-[45%] z-20 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden xl:flex">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
          <Link
            href="/shop"
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-foreground text-background rounded-full font-black text-sm uppercase tracking-widest overflow-hidden hover:text-white transition-colors duration-500"
          >
            <span className="relative z-10 flex items-center gap-3">
              Explore Full Archive
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>
      </div>

    </section>
  );
}
