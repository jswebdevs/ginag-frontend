"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import api from "@/lib/axios";

export default function FAQSection({ data: initialData }: { data?: any }) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!initialData) {
      setLoading(true);
      api.get("/settings/homepage")
        .then(res => {
          setData(res.data?.data?.faq);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  if (loading && !data) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="h-4 w-16 bg-muted/40 rounded-full mx-auto animate-pulse" />
            <div className="h-12 w-96 bg-muted/40 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted/10 border border-border/50 rounded-2xl animate-pulse relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const faqs = data.faqs?.length > 0 ? data.faqs : [];

  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">FAQ</span>
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase mb-4"
          >
            ❓ {data.title || "Frequently Asked Questions"}
          </motion.h2>

          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground font-medium text-lg max-w-xl mx-auto"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/50 bg-muted/10 hover:border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="w-full flex items-center justify-between p-6 text-left gap-4 cursor-pointer"
              >
                <span className="font-bold text-foreground text-base leading-snug">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className={`w-5 h-5 transition-colors ${openIndex === i ? "text-primary" : "text-muted-foreground"}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-muted-foreground font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
