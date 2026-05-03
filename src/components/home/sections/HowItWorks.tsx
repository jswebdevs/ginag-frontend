"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import IconRenderer from "@/components/shared/IconRenderer";
import api from "@/lib/axios";

interface HowItWorksProps {
  data?: any;
  whatsappLink?: string;
}

export default function HowItWorks({ data: initialData, whatsappLink: initialWaLink }: HowItWorksProps) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      setLoading(true);
      api.get("/settings/homepage")
        .then(res => {
          setData(res.data?.data?.howItWorks);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  if (loading && !data) {
    return (
      <section className="py-24 bg-background border-y border-border/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <div className="h-4 w-24 bg-muted/40 rounded-full mx-auto animate-pulse" />
            <div className="h-12 w-64 bg-muted/40 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-muted/10 border border-border/50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const steps: any[] = data.steps?.length > 0 ? data.steps : [];
  const waLink = initialWaLink || data.whatsappLink || "";

  return (
    <section className="py-24 bg-background text-foreground border-y border-border/30 relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black text-primary tracking-[0.5em] uppercase block mb-4"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase"
          >
            {data.title || "How It Works"}
          </motion.h2>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground font-medium mt-4 text-base md:text-lg max-w-xl mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {steps.map((step: any, index: number) => (
            <motion.div
              key={step.number || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative p-6 md:p-8 bg-muted/10 border border-border/50 hover:border-primary/50 rounded-[2rem] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-5xl font-black text-foreground/5 select-none pointer-events-none">
                {step.number || String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-500">
                  <IconRenderer
                    name={step.icon}
                    className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors duration-500"
                  />
                </div>
                <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-2">
                  Step {step.number || String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 uppercase tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        {(waLink || data.ctaLine) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 p-6 md:p-8 bg-muted/20 border border-border/50 rounded-[2rem]"
          >
            <p className="text-foreground font-medium text-center sm:text-left text-sm md:text-base">
              📲 {data.ctaLine || "Order now – We will contact you on WhatsApp for full customization"}
            </p>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                {data.ctaBtnText || "Chat on WhatsApp"}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
