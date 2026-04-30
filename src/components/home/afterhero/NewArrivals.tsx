"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, ImageIcon, ArrowRight } from "lucide-react";
import api from "@/lib/axios";

export default function NewArrivals() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch 8 newest products (adjust the query param based on your backend setup)
        api.get("/products?sort=newest&limit=8")
            .then((res) => {
                const data = res.data?.data || res.data || [];
                setProducts(data);
            })
            .catch((err) => console.error("Error fetching new arrivals:", err))
            .finally(() => setLoading(false));
    }, []);

    const getDisplayPrice = (product: any) => {
        const defaultVar = product.variations?.find((v: any) => v.isDefault) || product.variations?.[0];
        const currentPrice = defaultVar?.salePrice || defaultVar?.basePrice || product.salePrice || product.basePrice || 0;
        const oldPrice = defaultVar?.salePrice ? defaultVar.basePrice : (product.salePrice ? product.basePrice : null);
        return { currentPrice, oldPrice };
    };

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="h-8 md:h-12 w-48 md:w-64 bg-muted rounded-xl animate-pulse mb-3"></div>
                            <div className="h-4 md:h-5 w-56 md:w-80 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex flex-col animate-pulse">
                                <div className="w-full aspect-[4/5] bg-muted rounded-3xl mb-4"></div>
                                <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                                <div className="h-4 w-1/2 bg-muted rounded mb-4"></div>
                                <div className="h-6 w-1/3 bg-muted rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
                            Fresh Out <span className="text-primary">The Oven</span>
                        </h2>
                        <p className="text-muted-foreground font-medium mt-2 text-sm md:text-base">
                            The latest and greatest additions to our collection.
                        </p>
                    </div>
                    <Link
                        href="/products?sort=newest"
                        title="Shop all new arrivals"
                        className="group flex items-center gap-2 text-primary font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-80 transition-all w-fit"
                    >
                        Shop All New
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {products.map((product) => {
                        const { currentPrice, oldPrice } = getDisplayPrice(product);
                        const imageUrl = product.featuredImage?.thumbUrl || product.featuredImage?.originalUrl;

                        return (
                            <div key={product.id} className="group flex flex-col relative">

                                {/* Image Container */}
                                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-muted/20 mb-4 border border-border shadow-sm group-hover:shadow-theme-md transition-all duration-300">

                                    {/* Floating Badges */}
                                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                                        <span className="bg-foreground text-background text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                                            New
                                        </span>
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        className="absolute top-3 right-3 z-20 w-8 h-8 md:w-10 md:h-10 bg-background/90 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                        title="Add to Wishlist"
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <Heart className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>

                                    {/* Image Link */}
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
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 md:w-16 md:h-16 text-muted-foreground/30" />
                                        )}
                                    </Link>

                                    {/* Quick Add to Cart Button (Slides up on hover) */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                                        <button className="w-full bg-background/90 backdrop-blur-md text-foreground font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-4 h-4" /> Quick Add
                                        </button>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="flex flex-col px-1">
                                    <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-xs text-muted-foreground font-bold ml-1">New</span>
                                    </div>

                                    <Link href={`/products/${product.slug}`} title={product.name} className="font-bold text-sm md:text-base text-heading hover:text-primary transition-colors line-clamp-1 mb-1">
                                        {product.name}
                                    </Link>

                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-black text-base md:text-lg text-primary leading-none">
                                            ৳{Number(currentPrice).toLocaleString()}
                                        </span>
                                        {oldPrice && (
                                            <span className="text-xs text-muted-foreground line-through font-bold">
                                                ৳{Number(oldPrice).toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Mobile Add to Cart (Visible only on small screens) */}
                                    <button className="mt-3 w-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors md:hidden flex items-center justify-center gap-2 active:scale-95">
                                        <ShoppingCart className="w-4 h-4" /> Add
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}