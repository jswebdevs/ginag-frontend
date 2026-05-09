"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, Camera, Clock, AlertTriangle } from "lucide-react";

interface ReturnRefundTemplateProps {
    data: any;
}

export default function ReturnRefundTemplate({ data }: ReturnRefundTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Bold Header */}
            <div className="relative overflow-hidden pt-20 pb-20 border-b border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-green-500/5 pointer-events-none" />
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-8">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Policy Document</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-heading leading-[0.85] mb-6"
                    >
                        {title}
                    </motion.h1>
                    <p className="text-sm text-muted-foreground font-medium">Effective as of: {formattedDate}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="container mx-auto px-4 max-w-5xl py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* No Returns Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="relative bg-card border-2 border-red-500/20 rounded-[2rem] p-8 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16" />
                        <div className="flex items-start gap-5">
                            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 shrink-0">
                                <XCircle size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-heading mb-2">No Returns or Refunds</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                    All products are custom-made specifically for you. Once production begins, we cannot accept returns or issue refunds.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Exceptions Card */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        className="relative bg-card border-2 border-green-500/20 rounded-[2rem] p-8 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16" />
                        <div className="flex items-start gap-5">
                            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 shrink-0">
                                <CheckCircle2 size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-heading mb-2">We Cover Exceptions</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                    If your item is damaged or incorrect, we will replace it. Report within 48 hours with photos.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 48 Hour Notice */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="flex items-center gap-6 bg-amber-500/5 border border-amber-500/20 rounded-[1.5rem] p-6 mb-12"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <Camera size={20} className="text-amber-500" />
                        <Clock size={20} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                        <span className="text-amber-500 font-black">Important:</span> You must contact us within <span className="text-amber-500 font-black">48 hours</span> of receiving your order with photographic evidence for any replacement claims.
                    </p>
                </motion.div>

                {/* Full Content */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="bg-card/50 border border-border rounded-[2rem] p-8 md:p-14 shadow-theme-sm"
                >
                    <div className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                        prose-ul:space-y-3 prose-li:text-muted-foreground prose-li:font-medium"
                        dangerouslySetInnerHTML={{ __html: combinedContent }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
