"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ArrowRight, ShoppingCart, Headphones } from "lucide-react";

export default function FlashSale() {
  // Simple hydration-safe countdown placeholder
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10">
          
          {/* Left Text & Timer */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-bold">
              <Timer className="w-4 h-4 animate-pulse" />
              Flash Sale Ends Soon!
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-heading leading-tight">
              Premium Wireless <br /> Noise-Cancelling Pro
            </h2>
            <p className="text-subheading max-w-md mx-auto lg:mx-0">
              Experience pure sound with 40 hours of battery life. Grab it before the stock runs out.
            </p>
            
            {/* Timer Blocks */}
            {mounted && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {[ { label: "HOURS", val: "12" }, { label: "MINS", val: "45" }, { label: "SECS", val: "30" }].map((time, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-sm">
                      {time.val}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2">{time.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Card */}
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-theme-lg relative group">
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
              -40% OFF
            </div>
            {/* Placeholder for Product Image */}
            <div className="aspect-square bg-muted/30 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
              <div className="w-32 h-32 bg-primary/20 rounded-full blur-2xl absolute group-hover:bg-primary/30 transition-all duration-500"></div>
              <Headphones className="w-24 h-24 text-muted-foreground relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-heading">Sony WH-1000XM5</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-primary">$249.00</span>
                <span className="text-sm font-medium text-muted-foreground line-through">$399.00</span>
              </div>
              <button className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}