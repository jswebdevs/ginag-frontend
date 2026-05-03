"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";

interface GinaGHeroProps {
  heroConfig?: any;
}

export default function GinaGHero({ heroConfig = {} }: GinaGHeroProps) {
  const headline        = heroConfig.headline        || "Handmade Custom Bag Charms – Designed Just for You";
  const subheadline     = heroConfig.subheadline     || "Create your own unique style with personalized, handcrafted charms made after you order.";
  const imageUrl        = heroConfig.imageUrl        || "";
  const whatsappLink    = heroConfig.whatsappLink    || "";
  const shopBtnText     = heroConfig.shopBtnText     || "Shop Now";
  const whatsappBtnText = heroConfig.whatsappBtnText || "Customize via WhatsApp";
  const trustItems: string[] = heroConfig.trustItems || ["Handmade", "Custom Design", "Fast Delivery"];

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background" aria-label="Hero">
      {/* Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-6 translate-x-1/4" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

          {/*
           * Left: Content — NO opacity:0 initial state.
           * LCP candidate (h1) must be visible from the first paint.
           * We animate only the x position (slide-in) with opacity starting at 1.
           */}
          <div className="flex flex-col space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">GinaG Purse Charms</span>
            </div>

            {/* LCP element — rendered immediately, no animation opacity */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
              {headline.includes("–") ? (
                <>
                  {headline.split("–")[0]}
                  <span className="text-primary">–{headline.split("–").slice(1).join("–")}</span>
                </>
              ) : headline}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-md font-medium leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <button
                  aria-label={shopBtnText}
                  className="h-14 px-6 md:px-8 bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-theme-lg group/btn w-full"
                >
                  {shopBtnText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </Link>

              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label={whatsappBtnText} className="w-full sm:w-auto">
                  <button className="h-14 px-6 md:px-8 bg-background border border-border text-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 w-full">
                    <MessageCircle size={16} className="text-green-500 shrink-0" aria-hidden="true" />
                    {whatsappBtnText}
                  </button>
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 md:gap-5 pt-1" role="list" aria-label="Product guarantees">
              {trustItems.map((item) => (
                <div
                  key={item}
                  role="listitem"
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/*
           * Right: Image — NO opacity animation on this container.
           * The hero image is the LCP candidate. Hiding it with opacity:0
           * causes a 1,500ms+ render delay even after the image downloads.
           * Scale animation only (starts at 1 opacity).
           */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-muted/10 rounded-[2rem] md:rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none" aria-hidden="true" />

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="GinaG Handmade Bag Charm"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/5 text-center p-8 space-y-4">
                  <Sparkles className="w-12 h-12 text-primary/20" aria-hidden="true" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                    Add hero image in admin
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-20 p-4 md:p-5 bg-background/85 backdrop-blur-xl rounded-xl md:rounded-2xl border border-border/50">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Made For You</p>
                <p className="text-xs md:text-sm font-bold text-foreground">Each charm crafted after your order</p>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 w-36 h-36 bg-primary/20 rounded-full blur-[70px] animate-pulse pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/10 rounded-full blur-[90px] pointer-events-none" aria-hidden="true" />
          </div>

        </div>
      </div>
    </section>
  );
}
