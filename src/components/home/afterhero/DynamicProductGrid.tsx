"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import ProductCard from "@/components/home/products/ProductCard";

export default function DynamicProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/products?limit=9");
        setProducts(response.data?.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-heading tracking-tight">Latest Arrivals</h2>
            <p className="text-subheading mt-2">Fresh from our catalog.</p>
          </div>
          <Link href="/products" className="text-primary font-semibold hover:underline text-sm md:text-base">
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted/30 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-12 text-destructive">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
