"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/home/products/ProductCard";

interface FeaturedProductsProps {
  initialProducts?: any[];
}

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (!initialProducts) {
      setLoading(true);
      api
        .get("/products?limit=3&page=1")
        .then((res) => {
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
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 md:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" /> Featured
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
            Our Best <span className="text-primary">Picks</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted/30 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
