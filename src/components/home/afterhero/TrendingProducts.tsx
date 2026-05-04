"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import { useCurrency } from "@/context/SettingsContext";


export default function TrendingProducts() {
  const { symbol } = useCurrency();
  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 4 trending products
    api.get("/special/trending?limit=4")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error("Error fetching trending products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to determine the correct price to show (handles variations & sales)
  const getDisplayPrice = (product: any) => {
    const defaultVar = product.variations?.find((v: any) => v.isDefault) || product.variations?.[0];
    const currentPrice = defaultVar?.salePrice || defaultVar?.basePrice || product.salePrice || product.basePrice || 0;
    const oldPrice = defaultVar?.salePrice ? defaultVar.basePrice : (product.salePrice ? product.basePrice : null);

    return { currentPrice, oldPrice };
  };

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
            <div>
              <div className="h-8 md:h-10 w-48 md:w-64 bg-muted rounded-xl animate-pulse mb-3"></div>
              <div className="h-4 md:h-5 w-56 md:w-80 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-3xl overflow-hidden p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null; // Don't render the section if no trending products exist

  return (
    <section className="py-12 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
              Trending <span className="text-primary">Now</span>
            </h2>
            <p className="text-muted-foreground font-medium mt-2 text-sm md:text-base">
              The products everyone is talking about.
            </p>
          </div>
          <Link
            href="/products?tag=Trending"
            title="View all trending products"
            className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest hover:underline w-fit"
          >
            View All
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const { currentPrice, oldPrice } = getDisplayPrice(product);
            const imageUrl = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;

            return (
              <div key={product.id} className="bg-card border border-border rounded-3xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-xl transition-all duration-300 flex flex-col">

                {/* Image Box */}
                <div className="aspect-square bg-muted/10 relative overflow-hidden p-4">

                  {/* Badges (z-20 so they sit above the link) */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
                    {oldPrice && (
                      <span className="bg-destructive text-destructive-foreground text-xs font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest">
                        Sale
                      </span>
                    )}
                    {product.tags?.includes('New') && (
                      <span className="bg-foreground text-background text-xs font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest">
                        New
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button (z-20 so it intercepts clicks before the Link) */}
                  <button
                    className="absolute top-3 right-3 z-20 w-8 h-8 md:w-10 md:h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    title="Add to Wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your wishlist logic here later
                    }}
                  >
                    <Heart className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  {/* Image Link (z-10 absolute inset to cover the whole box) */}
                  <Link
                    href={`/products/${product.slug}`}
                    title={`View ${product.name}`}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 md:w-16 md:h-16 text-muted-foreground/30" />
                    )}
                  </Link>

                </div>

                {/* Content */}
                <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Dummy Stars (Can be replaced with real reviews later) */}
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current opacity-30" />
                      <span className="text-xs text-muted-foreground font-bold ml-1">(4.0)</span>
                    </div>

                    <Link href={`/products/${product.slug}`} title={product.name} className="font-bold text-sm md:text-base text-heading hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      {oldPrice && (
                        <span className="text-xs text-muted-foreground line-through font-bold">
                          {symbol}{Number(oldPrice).toLocaleString()}

                        </span>
                      )}
                      <span className="font-black text-lg md:text-xl text-primary leading-none mt-0.5">
                        {symbol}{Number(currentPrice).toLocaleString()}

                      </span>
                    </div>

                    <button
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}