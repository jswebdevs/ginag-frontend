"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { ArrowRight, Layers, ShoppingCart, Sparkles } from "lucide-react";

const FALLBACK_PRODUCTS = [
  { id: "1", name: "Blue Elegant Beaded Charm", price: "$13.99", slug: "#" },
  { id: "2", name: "Colorful Multi-Bead Charm", price: "$11.99", slug: "#" },
  { id: "3", name: "Pink Initial Letter Charm", price: "$14.99", slug: "#" },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?limit=3&featured=true")
      .then(res => {
        const items = res.data?.data?.products || res.data?.products || [];
        setProducts(items.slice(0, 3));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const displayProducts = products.length > 0 ? products : [];

  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-muted/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9] uppercase"
          >
            Popular <span className="text-primary">Designs.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-muted-foreground text-lg font-medium max-w-xl mx-auto leading-relaxed"
          >
            Handcrafted with love — each charm is made to order, just for you.
          </motion.p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[3/4] bg-muted/40 rounded-[2.5rem] animate-pulse border border-border" />
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProducts.map((product, i) => (
              <FeaturedProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FALLBACK_PRODUCTS.map((product, i) => (
              <FallbackCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background rounded-full font-black text-sm uppercase tracking-widest overflow-hidden hover:text-white transition-colors duration-500 relative"
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
  const imageUrl = product.featuredImage?.originalUrl || product.featuredImage?.thumbUrl;
  const price = Number(product.salePrice || product.basePrice || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-muted/10 border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <Layers className="w-16 h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-primary">${price.toFixed(2)}</span>
          <Link href={`/products/${product.slug}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
              <ShoppingCart className="w-3 h-3" />
              View
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FallbackCard({ product, index }: { product: (typeof FALLBACK_PRODUCTS)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-muted/10 border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/5 to-muted/20">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
          <Layers className="w-16 h-16" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-primary">{product.price}</span>
          <Link href="/shop">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
              <ShoppingCart className="w-3 h-3" />
              View
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
