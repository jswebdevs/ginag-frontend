"use client";

import { motion } from "framer-motion";
import { Handbag, Key, Backpack } from "lucide-react"; // Using available icons or substitutes

export default function AestheticLifestyle() {
  return (
    <section className="py-24 bg-background text-foreground overflow-hidden relative transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-primary tracking-[0.5em] uppercase block mb-6"
          >
            Contextual Utility
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-foreground tracking-tighter uppercase leading-none mb-8"
          >
            Elevating the <br />
            <span className="text-muted-foreground/20">Everyday Carry</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl text-muted-foreground font-medium text-lg"
          >
            A design language that translates across every canvas. From the hardware of your keys to the silhouette of your luxury handbag, our charms provide a distinctive visual anchor.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "The Handbag", desc: "A soft, feminine accent that transforms structure into art." },
             { label: "The Commute", desc: "Durable attachment for backpacks and high-motion transit." },
             { label: "The Archive", desc: "A unique identifier for your primary key clusters." }
           ].map((item, i) => (
             <motion.div
               key={item.label}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               className="group relative overflow-hidden rounded-[3rem] bg-muted/20 border border-border/50 p-12 text-center hover:bg-muted/40 transition-all duration-500"
             >
               <div className="mb-8 relative">
                  <div className="w-20 h-20 border-2 border-primary/20 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                     <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                     </div>
                  </div>
               </div>
               <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{item.label}</h3>
               <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
