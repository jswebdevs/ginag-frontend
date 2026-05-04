"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { ArrowRight, Layers, ShoppingCart, Sparkles } from "lucide-react";
import { useCurrency } from "@/context/SettingsContext";


interface FeaturedProductsProps {
  initialProducts?: any[];
}

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (!initialProducts) {
      setLoading(true);
      api.get("/products?limit=3&page=1")
        .then(res => {
          const items = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.data?.products)
            ? res.data.data.products
            : [];
          setProducts(items.slice(0, 3));
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [initialProducts]);

  return (
    <section className="py-20 md:py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-muted/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 md:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted border border-border rounded-full"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
              Popular Designs
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-[0.9] uppercase"
          >
            Popular <span className="text-primary">Designs.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed"
          >
            Handcrafted with love — each charm is made to order, just for you.
          </motion.p>
        </div>

        {/* Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <FeaturedProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-5 bg-muted/10 rounded-[3rem] border border-dashed border-border/50">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/30">
              <Layers size={32} />
            </div>
            <div>
              <p className="text-xl font-black uppercase tracking-widest text-foreground/50">Collections Coming Soon</p>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2 text-sm">
                We are currently crafting new unique designs. Check back shortly.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-foreground text-background rounded-full font-black text-sm uppercase tracking-widest overflow-hidden hover:text-white transition-colors duration-500 relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProductCard({ product, index }: { product: any; index: number }) {
  const { symbol } = useCurrency();
  const imageUrl = product.featuredImage?.originalUrl || product.featuredImage?.thumbUrl;
  const price = Number(product.salePrice || product.basePrice || 0);


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-muted/10 border border-border/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index === 0}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <Layers className="w-12 h-12 md:w-16 md:h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="p-5 md:p-6 space-y-3">
        <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl md:text-2xl font-black text-primary">
            {symbol}{price.toLocaleString()}

          </span>
          <Link href={`/products/${product.slug}`}>
            <button aria-label={`View ${product.name}`} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
              <ShoppingCart className="w-3 h-3" aria-hidden="true" />
              View
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-card border border-border/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
      <div className="aspect-[3/4] bg-muted/40 animate-pulse" />
      <div className="p-5 md:p-6 space-y-3">
        <div className="h-5 w-3/4 bg-muted/40 rounded-full animate-pulse" />
        <div className="flex justify-between items-center">
          <div className="h-7 w-1/4 bg-muted/40 rounded-full animate-pulse" />
          <div className="h-9 w-20 bg-muted/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
