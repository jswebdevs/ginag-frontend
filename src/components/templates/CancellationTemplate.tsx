"use client";

import { motion } from "framer-motion";
import { Timer, CheckCircle2, XCircle, Scissors } from "lucide-react";

interface CancellationTemplateProps {
    data: any;
}

export default function CancellationTemplate({ data }: CancellationTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/8 via-background to-background border-b border-border pt-20 pb-20 overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 pointer-events-none" />
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Timer size={18} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Time-Sensitive Policy</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-4"
                    >
                        {title}
                    </motion.h1>
                    <p className="text-sm text-muted-foreground font-medium">Last updated: {formattedDate}</p>
                </div>
            </div>

            {/* 6-Hour Window Visual */}
            <div className="container mx-auto px-4 max-w-4xl py-12">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="relative bg-primary text-primary-foreground rounded-[2.5rem] p-10 md:p-16 overflow-hidden mb-8 shadow-theme-2xl"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="flex-shrink-0">
                            <div className="text-8xl md:text-[9rem] font-black leading-none opacity-90">6</div>
                            <div className="text-xl font-black uppercase tracking-widest opacity-80 -mt-2">Hours</div>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                                Cancellation Window
                            </h2>
                            <p className="text-base md:text-lg opacity-85 font-medium leading-relaxed max-w-sm">
                                You have <strong>6 hours</strong> from the time you place your order to request a cancellation. After that, production may have already started.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Before / After Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-card border-2 border-green-500/25 rounded-[2rem] p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 size={24} className="text-green-500" />
                            <h3 className="text-base font-black uppercase tracking-tight text-heading">Within 6 Hours</h3>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            Contact us immediately. We will cancel your order and process a full refund with no questions asked.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-card border-2 border-red-500/25 rounded-[2rem] p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <XCircle size={24} className="text-red-500" />
                            <h3 className="text-base font-black uppercase tracking-tight text-heading">After 6 Hours</h3>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            Our artisans may have already begun crafting your piece. Cancellations are not possible once production starts.
                        </p>
                    </motion.div>
                </div>

                {/* Production Start Notice */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 bg-muted/40 border border-border rounded-[1.5rem] p-6 mb-12"
                >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0"><Scissors size={20} /></div>
                    <p className="text-sm font-medium text-muted-foreground">
                        <span className="text-foreground font-black">Note:</span> Each product is handmade to order. Once we start crafting your item, the materials and time invested cannot be recovered, which is why we have a strict 6-hour cancellation window.
                    </p>
                </motion.div>

                {/* Full Content */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="bg-card/50 border border-border rounded-[2rem] p-8 md:p-14 shadow-theme-sm"
                >
                    <div className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                        prose-p:text-muted-foreground prose-p:font-medium
                        prose-ul:space-y-3 prose-li:text-muted-foreground prose-li:font-medium"
                        dangerouslySetInnerHTML={{ __html: combinedContent }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
