"use client";

import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface ExchangePolicyTemplateProps {
    data: any;
}

const qualifiesItems = [
    "Item arrived damaged or broken",
    "You received the wrong product",
    "Significant defect in craftsmanship",
];

const doesntQualifyItems = [
    "Change of mind or preference",
    "Customization color/design preferences",
    "Normal variations in handmade items",
];

export default function ExchangePolicyTemplate({ data }: ExchangePolicyTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="relative border-b border-border pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary"><RefreshCw size={22} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Exchange Terms</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-4"
                    >
                        {title}
                    </motion.h1>
                    <p className="text-sm text-muted-foreground font-medium">Updated: {formattedDate}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-12 space-y-8">
                {/* Condition Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Qualifies */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-card border-2 border-green-500/20 rounded-[2rem] p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500"><CheckCircle2 size={20} /></div>
                            <h2 className="text-base font-black uppercase tracking-tight text-heading">Qualifies for Exchange</h2>
                        </div>
                        <ul className="space-y-4">
                            {qualifiesItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-sm text-muted-foreground font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Doesn't Qualify */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-card border-2 border-red-500/20 rounded-[2rem] p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500"><XCircle size={20} /></div>
                            <h2 className="text-base font-black uppercase tracking-tight text-heading">Does Not Qualify</h2>
                        </div>
                        <ul className="space-y-4">
                            {doesntQualifyItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    <span className="text-sm text-muted-foreground font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Important Note */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="flex items-start gap-4 bg-primary/5 border border-primary/20 rounded-[1.5rem] p-6"
                >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0"><HelpCircle size={20} /></div>
                    <div>
                        <p className="text-sm font-black text-foreground mb-1">How to Request an Exchange</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Contact us within 48 hours of receiving your order. Include your order number and clear photos showing the issue. We will review and respond within 24 hours.
                        </p>
                    </div>
                </motion.div>

                {/* Full Policy Content */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
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
