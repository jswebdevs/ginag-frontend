"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Sparkles
} from "lucide-react";

export default function SingleCategoryAuthorityHero() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/hero/active")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error("Hero Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[85vh] bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const rawHero = (Array.isArray(data) && data.length > 0) ? data[0] : null;
  
  const hero = {
    title: rawHero?.title || "DEFINE YOUR STANDARD",
    subtitle: rawHero?.subtitle || "THE 2024 COLLECTION",
    description: rawHero?.description || "Precision-engineered aesthetics for those who refuse to compromise on quality or style.",
    buttonText: rawHero?.buttonText || "EXPLORE COLLECTION",
    buttonLink: rawHero?.buttonLink || "/shop",
    image: rawHero?.image?.originalUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
    badgeLabel: rawHero?.badgeLabel || "Authentic Gear",
    badgeText: rawHero?.badgeText || "Niche Excellence Certified",
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background">
      {/* 1. Background Depth Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          className="object-cover opacity-10 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 2. Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-md px-4 py-2 rounded-full mb-2"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{hero.subtitle}</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black text-foreground leading-[0.9] tracking-tighter uppercase">
                {hero.title.split(' ').map((word: string, i: number) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-md font-medium leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={hero.buttonLink}>
                <button className="h-16 px-10 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-theme-lg group/btn">
                  {hero.buttonText}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <div className="flex items-center gap-4 px-6 py-4 bg-muted/50 backdrop-blur-md rounded-2xl border border-border/50">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <Image 
                        src={`https://i.pravatar.cc/100?u=${i+10}`} 
                        alt="User" 
                        width={32} 
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 text-amber-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />) }
                  </div>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-tighter text-nowrap">5.0 Brand Authority</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative perspective-1000 hidden lg:block"
          >
            {/* Main Product Display Card */}
            <div className="relative z-10 w-full aspect-square max-w-lg mx-auto bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
              
              <Image
                src={hero.image}
                alt="Featured Product"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Float Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{hero.badgeLabel}</p>
                  <p className="text-sm font-bold text-white">{hero.badgeText}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                  <ShieldCheck size={24} />
                </div>
              </div>
            </div>

            {/* Decorative Orbiting Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-[100px]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
