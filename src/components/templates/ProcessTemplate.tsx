"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ProcessTemplateProps {
    data: any;
}

export default function ProcessTemplate({ data }: ProcessTemplateProps) {
    const { title, content } = data;
    
    // Extract steps from rich text content if possible, or just render the content
    // For now, we'll parse the content or assume a specific structure
    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    // Split content into steps if they follow the "1️⃣", "2️⃣" pattern from pages.json
    const steps = combinedContent.split(/<p>[0-9]️⃣/).filter(s => s.trim().length > 0).map(s => {
        // Clean up HTML tags and get just the text
        const clean = s.replace(/<\/?[^>]+(>|$)/g, "").trim();
        return clean;
    });

    return (
        <div className="bg-background min-h-screen pb-24 pt-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20"
                    >
                        <CheckCircle2 size={14} /> Workflow Optimized
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9]"
                    >
                        {title}
                    </motion.h1>
                    <p className="mt-6 text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        A seamless journey from inspiration to your doorstep. Here is how we craft your vision into reality.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-4">
                    {steps.length > 0 ? (
                        steps.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-card border border-border p-8 md:p-12 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all hover:shadow-theme-xl"
                            >
                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-muted flex items-center justify-center text-3xl font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-heading mb-2">
                                            {step.split(" ").slice(0, 2).join(" ")}
                                        </h3>
                                        <p className="text-lg text-muted-foreground font-medium">
                                            {step.split(" ").slice(2).join(" ")}
                                        </p>
                                    </div>
                                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                                
                                {/* Background Accent */}
                                <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/[0.03] pointer-events-none group-hover:text-primary/[0.05] transition-colors">
                                    0{idx + 1}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-card border border-border p-8 md:p-12 rounded-[2rem]">
                            <div 
                                className="prose prose-xl dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: combinedContent }}
                            />
                        </div>
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary p-12 md:p-16 rounded-[3rem] text-primary-foreground shadow-theme-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Ready to begin?</h2>
                            <p className="text-xl opacity-90 font-medium mb-10 max-w-xl mx-auto">
                                Join our community of happy customers and get your own unique handcrafted piece today.
                            </p>
                            <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Start Your Order
                            </button>
                        </div>
                        
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
