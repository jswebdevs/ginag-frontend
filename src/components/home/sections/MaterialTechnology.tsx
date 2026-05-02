"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Gem, Component } from "lucide-react";

export default function MaterialTechnology() {
  return (
    <section className="py-24 bg-background text-foreground overflow-hidden relative transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square bg-muted/30 rounded-[3rem] overflow-hidden group border border-border/50"
          >
            {/* Using a placeholder or conceptual visual for material focus */}
            <div className="absolute inset-0 bg-gradient-to-tr from-background/20 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center p-20">
               <div className="relative w-full h-full border-4 border-foreground/5 rounded-full animate-spin-slow flex items-center justify-center">
                  <div className="w-4/5 h-4/5 border-4 border-foreground/10 rounded-full flex items-center justify-center">
                     <div className="w-3/5 h-3/5 bg-primary rounded-full shadow-2xl flex items-center justify-center">
                        <Gem className="w-16 h-16 text-primary-foreground" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="absolute bottom-10 left-10 z-20">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-2">Microscope Focus</p>
               <h4 className="text-2xl font-black uppercase tracking-tighter">Crystalline <br/>Substructure</h4>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-[10px] font-black text-primary tracking-[0.5em] uppercase block mb-6"
              >
                Material Library
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-8"
              >
                The Architecture <br />
                <span className="text-muted-foreground/20">of Refraction</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl"
              >
                Our curated selection of glossy beads and crystal accents aren't just decorative. Each element is chosen for its refractive index and surface durability, ensuring a permanent shine that captures and multiplies light.
              </motion.p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Sparkles, title: "High-Index Crystals", desc: "Premium grade light-trapping polymers for maximum brilliance." },
                { icon: Component, title: "Engineered Hardness", desc: "Scratch-resistant surfaces that maintain clarity through years of use." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-lg shrink-0 border border-border/50">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight text-lg mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
