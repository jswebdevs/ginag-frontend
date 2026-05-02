"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Plus, Info, ArrowUpRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = Number(product.salePrice || product.basePrice || 0);
  const originalPrice = product.salePrice ? Number(product.basePrice) : null;
  const imageUrl = product.featuredImage?.originalUrl;
  const material = product.material;

  // Calculate Price Range
  const prices = product.variations?.length > 0 
    ? product.variations.map((v: any) => Number(v.salePrice || v.basePrice || 0))
    : [Number(product.salePrice || product.basePrice || 0)];
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasRange = minPrice !== maxPrice;

  const handleAction = (action: string) => {
    toast.success(`${product.name} added to ${action}`, {
      description: "Item successfully updated in your inventory.",
      className: "bg-[#1A1A1A] border-white/10 text-white font-bold uppercase text-[10px] tracking-widest",
    });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-[#1A1A1A] border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 w-full"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10">
            <Layers className="w-20 h-20" />
          </div>
        )}

        {/* Floating Material Badge */}
        {material && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">
              {material}
            </span>
          </div>
        )}

        {/* Hover Quick Actions - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
           <button 
             onClick={() => handleAction('Wishlist')}
             className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors"
           >
             <Heart className="w-4 h-4" />
           </button>
           <button 
             onClick={() => handleAction('Cart')}
             className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors"
           >
             <ShoppingCart className="w-4 h-4" />
           </button>
        </div>

        {/* Quick Action Overlay - Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 to-transparent flex gap-3">
          <Link 
            href={`/products/${product.slug}`}
            className="flex-1 bg-white text-black py-3 rounded-full font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors tracking-widest"
          >
            DISCOVER DETAILS
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
              {product.brand?.name || "Premium Series"}
            </span>
            <div className="flex gap-1">
               {product.tags?.slice(0, 2).map((tag: string) => (
                 <span key={tag} className="text-[8px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                ${minPrice.toLocaleString()} {hasRange && `- $${maxPrice.toLocaleString()}`}
              </span>
            </div>
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-medium">
              Curated Valuation {hasRange && "(Varied)"}
            </span>
          </div>
          
          <div className="text-right">
             <div className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">
               Status
             </div>
             <div className="text-xs font-black text-primary uppercase">
               In Stock
             </div>
          </div>
        </div>
      </div>

      {/* Industrial Accent Lines */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
        <div className="w-8 h-8 border-t border-r border-white/40 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-0 left-0 p-4 pointer-events-none opacity-20">
        <div className="w-8 h-8 border-b border-l border-white/40 rounded-bl-lg" />
      </div>
    </motion.div>
  );
}
