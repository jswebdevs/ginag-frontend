"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import IconRenderer from "@/components/shared/IconRenderer";

const DEFAULT_STEPS = [
  { icon: "LuShoppingBag",   number: "01", title: "Place Your Order",       description: "Choose your favorite design and place your order on our store." },
  { icon: "LuMessageCircle", number: "02", title: "We Contact You",          description: "We reach out on WhatsApp for customization details." },
  { icon: "LuPalette",       number: "03", title: "Customize Your Design",   description: "Select colors, beads, initials, and your personal style." },
  { icon: "LuPackage",       number: "04", title: "We Create & Deliver",     description: "Your handmade charm is carefully crafted and shipped to you." },
];

interface HowItWorksProps {
  data?: any;
  whatsappLink?: string;
}

export default function HowItWorks({ data, whatsappLink }: HowItWorksProps) {
  const content = data || {
    title: "How It Works",
    subtitle: "Simple steps to your perfect charm",
    ctaLine: "For faster communication, connect with us on WhatsApp anytime",
    ctaBtnText: "Chat on WhatsApp",
    steps: DEFAULT_STEPS,
  };

  const steps = content.steps?.length > 0 ? content.steps : DEFAULT_STEPS;
  const waLink = whatsappLink || content.whatsappLink || "";

  return (
    <section className="py-24 bg-background text-foreground border-y border-border/30 relative overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-primary tracking-[0.5em] uppercase block mb-4"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase"
          >
            🛠️ {content.title}
          </motion.h2>
          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground font-medium mt-4 text-lg"
            >
              {content.subtitle}
            </motion.p>
          )}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step: any, index: number) => (
            <motion.div
              key={step.number || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 bg-muted/10 border border-border/50 hover:border-primary/50 rounded-[2rem] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-6xl font-black text-foreground/5 select-none">
                {step.number || String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <IconRenderer
                    name={step.icon}
                    className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-500"
                  />
                </div>
                <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-2">
                  Step {step.number || String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 uppercase tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA — uses the link from the hero section */}
        {waLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 p-8 bg-muted/20 border border-border/50 rounded-[2rem]"
          >
            <p className="text-foreground font-medium text-center sm:text-left">
              📲 {content.ctaLine}
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              {content.ctaBtnText || "Chat on WhatsApp"}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
