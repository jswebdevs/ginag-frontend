"use client";

import { motion } from "framer-motion";
import { Hammer, ShieldCheck, Zap } from "lucide-react";

const steps = [
  {
    icon: Hammer,
    title: "Meticulous Assembly",
    description: "Every bead is hand-selected and woven with precision-grade filament for structural permanence."
  },
  {
    icon: ShieldCheck,
    title: "Tension Validation",
    description: "Multi-point stress testing ensures that every connection point maintains integrity under daily use."
  },
  {
    icon: Zap,
    title: "Hardware Integration",
    description: "Gold-tone alloys are electro-bonded for a finish that resists oxidation and environmental wear."
  }
];

export default function IndustrialProcess() {
  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-primary font-black tracking-[0.3em] uppercase text-xs block mb-4"
          >
            Engineering Workflow
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase mb-12 leading-none"
          >
            The Protocol of <br />
            <span className="text-muted-foreground/20">Handcrafted Precision</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-muted/10 border border-border/50 hover:border-primary/50 transition-all duration-500 rounded-2xl"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                <step.icon className="w-6 h-6 text-primary group-hover:text-background transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
