"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Star, AlertCircle, ImageIcon } from "lucide-react";
import api from "@/lib/axios";

// Updated to perfectly match your backend JSON response
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header logic remains the same... */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-heading">Latest Arrivals</h2>
            <p className="text-subheading mt-2">Fresh out of the oven from our live database.</p>
          </div>
        </div>

        {/* ... Keep Error, Loading, and Empty states as they were ... */}

        {/* SUCCESS STATE (Actual Data) */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // 1. Calculate total stock from all variations combined
              const totalStock = product.variations?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0;
              
              // 2. Determine which price to show
              const currentPrice = Number(product.salePrice || product.basePrice || 0);
              const originalPrice = product.salePrice ? Number(product.basePrice) : null;

              // 3. Get the image URL safely
              const imageUrl = product.featuredImage?.originalUrl;

              return (
                <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-theme-md transition-all flex flex-col">
                  
                  {/* Image Area */}
                  <Link href={`/product/${product.slug || product.id}`} className="aspect-square bg-white relative flex items-center justify-center overflow-hidden block">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    )}
                    
                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-foreground text-background font-bold px-4 py-2 rounded-full text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>
                  
                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs text-muted-foreground ml-1 font-medium">
                        {product.rating ? Number(product.rating).toFixed(1) : "New"}
                      </span>
                    </div>
                    
                    <Link href={`/product/${product.slug || product.id}`} className="font-bold text-heading hover:text-primary transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </Link>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-primary">
                          ${currentPrice.toFixed(2)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        disabled={totalStock === 0}
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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