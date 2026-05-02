"use client";

import { motion } from "framer-motion";
import { Edit3, Palette, Type, CheckCircle2 } from "lucide-react";

const options = [
  { icon: Palette, title: "Tonal Control", desc: "Select from over 50+ curated color palettes." },
  { icon: Type, title: "Initial Imprints", desc: "Embed custom lettering for personal identity." },
  { icon: Edit3, title: "Modular Charms", desc: "Swap and append elements for a dynamic look." }
];

export default function PersonalizationBlueprint() {
  return (
    <section className="py-24 bg-background text-foreground border-y border-border/50 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-primary tracking-[0.5em] uppercase block mb-4"
          >
            Customization Protocol
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase"
          >
            Your Signature, <br className="md:hidden" />
            <span className="text-muted-foreground/20">Our Precision</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 bg-gradient-to-br from-foreground/5 to-transparent border border-border/50 rounded-[2.5rem] overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <opt.icon className="w-32 h-32 text-foreground" />
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-foreground/10 flex items-center justify-center rounded-xl mb-6">
                   <opt.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{opt.title}</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-8">{opt.desc}</p>
                
                <ul className="space-y-3">
                  {["Phase Validated", "Zero Friction"].map((text) => (
                    <li key={text} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                       <CheckCircle2 className="w-3 h-3" />
                       {text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 p-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        >
          <div className="bg-background py-10 px-8 text-center rounded-3xl border border-border/50">
             <p className="text-muted-foreground font-medium mb-6">Have a specific technical requirement or a custom design vision?</p>
             <button className="px-10 py-4 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                INITIATE CUSTOM REQUEST
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
