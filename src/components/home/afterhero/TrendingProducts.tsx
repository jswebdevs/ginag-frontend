"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, ImageIcon } from "lucide-react";
import api from "@/lib/axios";

export default function TrendingProducts() {
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
      <section className="py-16 md:py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-3"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-xl mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-1/4"></div>
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
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-heading uppercase tracking-tighter italic">Trending <span className="text-primary">Now</span></h2>
            <p className="text-muted-foreground font-medium mt-2">The products everyone is talking about.</p>
          </div>
          <Link href="/products?tag=Trending" className="text-primary font-bold text-sm uppercase tracking-widest hover:underline hidden sm:block">
            View All
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const { currentPrice, oldPrice } = getDisplayPrice(product);
            const imageUrl = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;

            return (
              <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-xl transition-all duration-300 flex flex-col">

                {/* Image Box */}
                <Link href={`/products/${product.slug}`} className="aspect-square bg-muted/20 relative flex items-center justify-center p-4 overflow-hidden">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {oldPrice && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">
                        Sale
                      </span>
                    )}
                    {product.tags?.includes('New') && (
                      <span className="bg-foreground text-background text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">
                        New
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    title="Add to Wishlist"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to product page
                      // Add your wishlist logic here later
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Dummy Stars (Can be replaced with real reviews later) */}
                    <div className="flex items-center gap-1 text-yellow-400 mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current opacity-30" />
                      <span className="text-[10px] text-muted-foreground font-bold ml-1">(4.0)</span>
                    </div>

                    <Link href={`/products/${product.slug}`} className="font-bold text-heading hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      {oldPrice && (
                        <span className="text-[10px] text-muted-foreground line-through font-bold">
                          ৳{Number(oldPrice).toLocaleString()}
                        </span>
                      )}
                      <span className="font-black text-lg text-primary leading-none">
                        ৳{Number(currentPrice).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-[18px] h-[18px]" />
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