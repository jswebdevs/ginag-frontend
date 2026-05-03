"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200";

export default function GinaGHero() {
  const [heroConfig, setHeroConfig] = useState<any>({});

  useEffect(() => {
    api.get("/settings/homepage")
      .then(res => { setHeroConfig(res.data?.data?.ginaGHero || {}); })
      .catch(() => {});
  }, []);

  const headline      = heroConfig.headline      || "Handmade Custom Bag Charms – Designed Just for You";
  const subheadline   = heroConfig.subheadline   || "Create your own unique style with personalized, handcrafted charms made after you order.";
  const imageUrl      = heroConfig.imageUrl      || FALLBACK_IMAGE;
  const whatsappLink  = heroConfig.whatsappLink  || "";
  const shopBtnText   = heroConfig.shopBtnText   || "Shop Now";
  const whatsappBtnText = heroConfig.whatsappBtnText || "Customize via WhatsApp";
  const trustItems: string[] = heroConfig.trustItems || ["Handmade", "Custom Design", "Fast Delivery"];

  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-6 translate-x-1/4" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full w-fit"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">GinaG Purse Charms</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
              {headline.includes("–") ? (
                <>
                  {headline.split("–")[0]}
                  <span className="text-primary">–{headline.split("–").slice(1).join("–")}</span>
                </>
              ) : headline}
            </h1>

            <p className="text-lg text-muted-foreground max-w-md font-medium leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="h-14 px-8 bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-theme-lg group/btn w-full">
                  {shopBtnText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>

              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <button className="h-14 px-8 bg-background border border-border text-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 w-full">
                    <MessageCircle size={16} className="text-green-500 shrink-0" />
                    {whatsappBtnText}
                  </button>
                </a>
              )}
            </div>

            {/* Trust Items */}
            <div className="flex flex-wrap gap-5 pt-2">
              {trustItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto bg-muted/10 backdrop-blur-xl rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10" />
              <Image
                src={imageUrl}
                alt="GinaG Handmade Bag Charm"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 z-20 p-5 bg-background/85 backdrop-blur-xl rounded-2xl border border-border/50"
              >
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Made For You</p>
                <p className="text-sm font-bold text-foreground">Each charm crafted after your order</p>
              </motion.div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-[100px]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
