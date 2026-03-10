"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, AlertCircle, ImageIcon } from "lucide-react";
import api from "@/lib/axios";

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  basePrice: string;
  salePrice?: string;
  featuredImage?: {
    originalUrl: string;
    thumbUrl: string;
  };
  variations: {
    stock: number;
  }[];
  rating?: number | string;
}

export default function DynamicProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        const data = response.data.data || response.data;
        setProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-heading tracking-tight">Latest Arrivals</h2>
            <p className="text-subheading mt-2">Fresh out of the oven from our live database.</p>
          </div>
          <Link href="/products" className="text-primary font-semibold hover:underline text-sm md:text-base">
            View All Products
          </Link>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center bg-destructive/5 rounded-3xl border border-destructive/20">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-bold text-foreground">Oops! Something went wrong</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        )}

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse flex flex-col h-[400px]">
                <div className="aspect-square bg-muted w-full" />
                <div className="p-4 sm:p-5 flex flex-col gap-3 flex-grow">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <div className="h-6 bg-muted rounded w-1/4" />
                    <div className="w-10 h-10 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 md:py-24 bg-muted/20 rounded-3xl border border-border">
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-heading">No Products Found</h3>
            <p className="text-subheading mt-2">Check back later for new arrivals.</p>
          </div>
        )}

        {/* SUCCESS STATE (Actual Data) */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              // 1. Calculate total stock from all variations combined
              const totalStock = product.variations?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0;

              // 2. Determine which price to show
              const currentPrice = Number(product.salePrice || product.basePrice || 0);
              const originalPrice = product.salePrice ? Number(product.basePrice) : null;

              // 3. Get the image URL safely
              const imageUrl = product.featuredImage?.originalUrl;

              return (
                <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-md transition-all duration-300 flex flex-col">

                  {/* Image Area */}
                  <Link href={`/products/${product.slug || product.id}`} className="aspect-square bg-muted/10 relative flex items-center justify-center overflow-hidden block">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    )}

                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <span className="bg-foreground text-background font-bold px-4 py-2 rounded-full text-xs sm:text-sm uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content Area */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs text-muted-foreground ml-1 font-medium">
                        {product.rating ? Number(product.rating).toFixed(1) : "New"}
                      </span>
                    </div>

                    <Link href={`/products/${product.slug || product.id}`} className="font-bold text-heading hover:text-primary transition-colors line-clamp-2 mb-2 text-sm sm:text-base">
                      {product.name}
                    </Link>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-primary">
                          ৳{currentPrice.toFixed(2)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ৳{originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        disabled={totalStock === 0}
                        title="Cart"
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}