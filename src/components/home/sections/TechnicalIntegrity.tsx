"use client";

import { motion } from "framer-motion";
import { Link2, Weight, Box, Shield } from "lucide-react";

const specs = [
  { label: "Hardware Alloy", value: "Aeronautical Grade", icon: Shield },
  { label: "Weight Density", value: "Ultralight Balance", icon: Weight },
  { label: "Connection Type", value: "Reinforced Weave", icon: Link2 },
  { label: "Packaging", value: "Protective Vault", icon: Box }
];

export default function TechnicalIntegrity({ data }: { data?: any }) {
  const content = data || {
    title: "Built to",
    titleHighlight: "Endure.",
    specs: [
      { label: "Hardware Alloy", value: "Aeronautical Grade", icon: "Shield" },
      { label: "Weight Density", value: "Ultralight Balance", icon: "Weight" },
      { label: "Connection Type", value: "Reinforced Weave", icon: "Link2" },
      { label: "Packaging", value: "Protective Vault", icon: "Box" }
    ],
    boxTitle: "Zero Fatigue Engineering",
    boxDesc: "Structural integrity maintained across 10,000+ cycle stress tests."
  };

  const IconMap: Record<string, any> = { Link2, Weight, Box, Shield };

  return (
    <section className="py-24 bg-background text-foreground relative transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
             <motion.h2 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-12"
             >
                {content.title} <br />
                <span className="text-muted-foreground/10">{content.titleHighlight}</span>
             </motion.h2>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {content.specs.map((spec: any, i: number) => {
                  const Icon = IconMap[spec.icon] || Shield;
                  return (
                    <motion.div 
                      key={spec.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-4 border-l-2 border-border/50 pl-6"
                    >
                      <div className="flex items-center gap-3">
                         <Icon className="w-4 h-4 text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</span>
                      </div>
                      <p className="text-xl font-black uppercase tracking-tight">{spec.value}</p>
                    </motion.div>
                  );
                })}
             </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
             <motion.div 
               initial={{ opacity: 0, scale: 1.1 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="relative aspect-video lg:aspect-square bg-muted/30 border border-border/50 rounded-[4rem] overflow-hidden flex items-center justify-center p-12"
             >
                <div className="absolute inset-0 opacity-20">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>
                <div className="relative z-10 w-full text-center">
                   <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-8 flex items-center justify-center animate-pulse">
                      <Shield className="w-10 h-10 text-primary-foreground" />
                   </div>
                   <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4" dangerouslySetInnerHTML={{ __html: content.boxTitle.replace('\n', '<br/>') }} />
                   <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto uppercase tracking-widest leading-relaxed">{content.boxDesc}</p>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
