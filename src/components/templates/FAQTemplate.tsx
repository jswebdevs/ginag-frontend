"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

interface FAQTemplateProps {
    data: any;
}

export default function FAQTemplate({ data }: FAQTemplateProps) {
    const { title, content } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    // Simple parser for Q&A if they follow the <strong>Q:</strong> pattern
    // Otherwise fallback to rich text
    const faqPairs = combinedContent.split(/<p><strong>Q:/).filter((s: string) => s.trim().length > 0).map((s: string) => {
        const parts = s.split(/<br>|<strong>A:/);
        const question = parts[0].replace(/<\/?[^>]+(>|$)/g, "").replace(/^Q:/, "").trim();
        const answer = parts.slice(1).join(" ").replace(/<\/?[^>]+(>|$)/g, "").trim();
        return { question, answer };
    });

    return (
        <div className="bg-background min-h-screen pb-24 pt-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20"
                        >
                            <HelpCircle size={14} /> Help Center
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-8"
                        >
                            {title}
                        </motion.h1>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                            Find answers to commonly asked questions about our handmade products, customization, and delivery.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqPairs.length > 0 ? (
                            faqPairs.map((faq: { question: string; answer: string }, idx: number) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} index={idx} />
                            ))
                        ) : (
                            <div className="bg-card border border-border p-8 rounded-[2rem]">
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: combinedContent }}
                                />
                            </div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-10 rounded-[2.5rem] bg-muted/50 border border-border flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
                    >
                        <div className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-theme-lg">
                            <MessageCircle size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-heading mb-1">Still have questions?</h3>
                            <p className="text-muted-foreground font-medium">We're here to help you with your custom orders on WhatsApp.</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-theme-md">
                            Contact Support
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!question || !answer) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group bg-card border transition-all duration-300 rounded-[1.5rem] overflow-hidden ${isOpen ? 'border-primary shadow-theme-lg' : 'border-border hover:border-primary/50'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
                <span className="text-lg md:text-xl font-black uppercase tracking-tight text-heading pr-8">
                    {question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary border-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-6 md:p-8 pt-0 text-muted-foreground font-medium leading-relaxed border-t border-border/50">
                    {answer}
                </div>
            </div>
        </motion.div>
    );
}
