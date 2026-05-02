"use client";

import { motion } from "framer-motion";
import { Gift, Heart, Star, Sparkle } from "lucide-react";

export default function GiftCuration({ data }: { data?: any }) {
  const content = data || {
    title: "A Masterpiece",
    titleHighlight: "of Thoughtful Intent",
    description: "Designed for birthdays, holidays, or those \"just because\" moments. Every charm is delivered in curated, protective packaging ready to be gifted.",
    features: [
      { icon: "Heart", label: "One-of-a-Kind" },
      { icon: "Star", label: "Premium Finish" },
      { icon: "Sparkle", label: "Artisan Box" }
    ]
  };

  const IconMap: Record<string, any> = { Heart, Star, Sparkle, Gift };

  return (
    <section className="py-24 bg-background text-foreground overflow-hidden relative transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="bg-muted/50 border border-border/50 rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-10 rotate-12 shadow-theme-lg"
           >
              <Gift className="w-10 h-10 text-primary-foreground" />
           </motion.div>

           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-10 max-w-3xl"
           >
              {content.title} <br />
              <span className="text-muted-foreground/20 text-3xl md:text-5xl font-bold">{content.titleHighlight}</span>
           </motion.h2>

           <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="max-w-xl text-muted-foreground font-medium text-lg mb-12"
           >
              {content.description}
           </motion.p>

           <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {content.features.map((item: any, i: number) => {
                const Icon = IconMap[item.icon] || Sparkle;
                return (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                     <Icon className="w-5 h-5 text-primary" />
                     <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </motion.div>
                );
              })}
           </div>
        </div>
      </div>
    </section>
  );
}
