"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import ProductCard from "@/components/home/products/ProductCard";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/special/trending?limit=6")
      .then((res) => setProducts(res.data?.data || []))
      .catch((err) => console.error("Error fetching trending products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] bg-muted/30 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
              Trending <span className="text-primary">Picks</span>
            </h2>
            <p className="text-muted-foreground font-medium mt-2 text-sm md:text-base">
              Customer favorites this season.
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-primary font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-80 transition-all w-fit"
          >
            Browse all <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
