"use client";

import { motion } from "framer-motion";
import { Scale, Clock, Shield, BookOpen } from "lucide-react";

interface TermsOfServiceTemplateProps {
    data: any;
}

const termHighlights = [
    { icon: BookOpen, label: "Custom Products", text: "All items are handmade and custom-ordered specifically for you." },
    { icon: Shield, label: "Accuracy Matters", text: "You are responsible for providing correct customization details." },
    { icon: Clock, label: "No Post-Production Changes", text: "Orders cannot be modified once production has started." },
];

export default function TermsOfServiceTemplate({ data }: TermsOfServiceTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Dark Header */}
            <div className="relative bg-card border-b border-border pt-20 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/3 via-transparent to-primary/5 pointer-events-none" />
                <div className="absolute right-16 bottom-0 opacity-5">
                    <Scale size={320} strokeWidth={0.5} />
                </div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl border border-border bg-background text-foreground"><Scale size={18} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Legal Agreement</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-heading leading-[0.85] mb-6"
                    >
                        {title}
                    </motion.h1>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> Effective: {formattedDate}</span>
                        <span className="flex items-center gap-2"><Shield size={14} className="text-primary" /> By using our site, you agree to these terms</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-12 space-y-8">
                {/* Key Points */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {termHighlights.map((highlight, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                            className="bg-card border border-border rounded-[1.5rem] p-6 hover:border-primary/40 transition-colors group"
                        >
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <highlight.icon size={18} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-heading mb-2">{highlight.label}</h3>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{highlight.text}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Numbered Sections */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="bg-card/50 border border-border rounded-[2rem] overflow-hidden shadow-theme-sm"
                >
                    <div className="border-b border-border px-8 md:px-14 py-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><BookOpen size={16} /></div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Terms Document</span>
                    </div>
                    <div className="p-8 md:p-14">
                        <div className="prose prose-lg dark:prose-invert max-w-none
                            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-b prose-h2:border-border prose-h2:pb-3
                            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                            prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                            prose-ul:space-y-3 prose-li:text-muted-foreground prose-li:font-medium
                            prose-li:marker:text-primary"
                            dangerouslySetInnerHTML={{ __html: combinedContent }}
                        />
                    </div>
                </motion.div>

                <p className="text-center text-muted-foreground text-sm font-medium">
                    Questions about our terms? <a href="/contact-us" className="text-primary font-bold hover:underline">Contact our support team.</a>
                </p>
            </div>
        </div>
    );
}
