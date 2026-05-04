"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Timer, ShoppingCart, ImageIcon, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { useCurrency } from "@/context/SettingsContext";


export default function FlashSale() {
  const { symbol } = useCurrency();
  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // 1. Fetch Flash Sale Product
  useEffect(() => {
    api.get("/special/flash-sale?limit=1")
      .then((res) => {
        const items = res.data.data || [];
        if (items.length > 0) setProduct(items[0]);
      })
      .catch((err) => console.error("Error fetching flash sale:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Real-time Countdown Logic (Resets at midnight automatically)
  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Helper to determine pricing and discount
  const getPricing = () => {
    if (!product) return { currentPrice: 0, oldPrice: null, discountPct: 0 };

    const defaultVar = product.variations?.find((v: any) => v.isDefault) || product.variations?.[0];
    const currentPrice = defaultVar?.salePrice || defaultVar?.basePrice || product.salePrice || product.basePrice || 0;
    const oldPrice = defaultVar?.salePrice ? defaultVar.basePrice : (product.salePrice ? product.basePrice : null);

    let discountPct = 0;
    if (oldPrice && oldPrice > currentPrice) {
      discountPct = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
    }

    return { currentPrice, oldPrice, discountPct };
  };

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 md:p-12 animate-pulse flex flex-col lg:flex-row items-center gap-8 md:gap-10">
            <div className="flex-1 space-y-6 w-full text-center lg:text-left">
              <div className="h-8 w-32 md:w-40 bg-muted rounded-full mx-auto lg:mx-0"></div>
              <div className="h-10 md:h-12 w-full lg:w-3/4 bg-muted rounded-xl"></div>
              <div className="h-4 w-3/4 lg:w-1/2 bg-muted rounded mx-auto lg:mx-0"></div>
              <div className="flex justify-center lg:justify-start gap-3 md:gap-4 pt-4">
                <div className="h-14 w-14 md:h-16 md:w-16 bg-muted rounded-2xl"></div>
                <div className="h-14 w-14 md:h-16 md:w-16 bg-muted rounded-2xl"></div>
                <div className="h-14 w-14 md:h-16 md:w-16 bg-muted rounded-2xl"></div>
              </div>
            </div>
            <div className="w-full max-w-sm aspect-square md:aspect-auto md:h-96 bg-card rounded-3xl border border-border"></div>
          </div>
        </div>
      </section>
    );
  }

  // Hide the section entirely if no flash sale product is found
  if (!product) return null;

  const { currentPrice, oldPrice, discountPct } = getPricing();
  const imageUrl = product.featuredImage?.originalUrl || product.featuredImage?.thumbUrl;

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row items-center gap-10 shadow-theme-sm relative overflow-hidden">

          {/* Decorative Background Blob */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>

          {/* Left Text & Timer */}
          <div className="flex-1 space-y-5 md:space-y-6 text-center lg:text-left relative z-10 w-full">
            <div className="inline-flex items-center justify-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-xs uppercase tracking-widest font-black">
              <Timer className="w-4 h-4 animate-pulse" />
              Flash Sale Ends Soon!
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-heading leading-tight tracking-tighter uppercase italic line-clamp-2">
              {product.name}
            </h2>

            <p className="text-muted-foreground font-medium text-sm md:text-base max-w-md mx-auto lg:mx-0 line-clamp-3">
              {product.shortDesc || "Limited time offer. Grab this amazing deal before the stock runs out!"}
            </p>

            {/* Real-time Timer Blocks */}
            {mounted && (
              <div className="flex gap-3 md:gap-4 justify-center lg:justify-start pt-2 md:pt-4">
                {[
                  { label: "HOURS", val: String(timeLeft.hours).padStart(2, '0') },
                  { label: "MINS", val: String(timeLeft.minutes).padStart(2, '0') },
                  { label: "SECS", val: String(timeLeft.seconds).padStart(2, '0') }
                ].map((time, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-background border border-border rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-primary shadow-sm">
                      {time.val}
                    </div>
                    <span className="text-xs uppercase font-black tracking-widest text-muted-foreground mt-2">
                      {time.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link
                href={`/products/${product.slug}`}
                title={`View details for ${product.name}`}
                className="flex items-center gap-2 text-primary font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-80 transition-all group"
              >
                View Product Details <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Product Card */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-theme-xl relative group z-10">
            {discountPct > 0 && (
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-black tracking-widest px-3 py-1.5 rounded-full z-20 uppercase shadow-md animate-in zoom-in">
                -{discountPct}% OFF
              </div>
            )}

            {/* Product Image */}
            <Link
              href={`/products/${product.slug}`}
              title={`Shop ${product.name}`}
              className="block aspect-square bg-muted/30 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-3xl absolute group-hover:bg-primary/30 transition-all duration-500"></div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <ImageIcon className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground/30 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              )}
            </Link>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {oldPrice && (
                    <span className="text-xs font-bold text-muted-foreground line-through">
                      {symbol}{Number(oldPrice).toLocaleString()}

                    </span>
                  )}
                  <span className="text-2xl md:text-3xl font-black text-primary leading-none mt-1 tracking-tighter">
                    {symbol}{Number(currentPrice).toLocaleString()}

                  </span>
                </div>
              </div>

              <button
                title={`Add ${product.name} to cart`}
                className="w-full bg-foreground text-background py-3 md:py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}