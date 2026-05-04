"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, UserCheck, Database, Share2 } from "lucide-react";

interface PrivacyPolicyTemplateProps {
    data: any;
}

const dataCategories = [
    { icon: UserCheck, label: "Identity Data", desc: "Name & contact info", color: "text-blue-500 bg-blue-500/10" },
    { icon: Database, label: "Order Data", desc: "Purchase history", color: "text-purple-500 bg-purple-500/10" },
    { icon: Share2, label: "No Sharing", desc: "We never sell data", color: "text-green-500 bg-green-500/10" },
    { icon: Lock, label: "Secure Storage", desc: "Encrypted & protected", color: "text-primary bg-primary/10" },
];

export default function PrivacyPolicyTemplate({ data }: PrivacyPolicyTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Shield Hero */}
            <div className="relative bg-gradient-to-br from-primary/8 via-background to-blue-500/5 border-b border-border pt-20 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
                    <ShieldCheck size={500} strokeWidth={0.5} />
                </div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <ShieldCheck size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Your Privacy Matters</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-6"
                    >
                        {title}
                    </motion.h1>
                    <div className="flex flex-wrap gap-4">
                        <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                            <Eye size={14} className="text-primary" /> Updated: {formattedDate}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                            <Lock size={14} className="text-primary" /> GDPR Compliant
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-12 space-y-8">
                {/* Data Category Icons */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {dataCategories.map((cat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + idx * 0.08 }}
                            className="bg-card border border-border rounded-[1.5rem] p-6 text-center group hover:border-primary/40 transition-colors"
                        >
                            <div className={`p-3 rounded-xl ${cat.color} w-fit mx-auto mb-3`}><cat.icon size={20} /></div>
                            <p className="text-xs font-black uppercase tracking-wider text-heading">{cat.label}</p>
                            <p className="text-[11px] text-muted-foreground font-medium mt-1">{cat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Our Promise */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="p-4 rounded-2xl bg-white/20 shrink-0"><Lock size={32} /></div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Our Privacy Promise</h2>
                            <p className="opacity-90 font-medium leading-relaxed max-w-xl">
                                We collect only what we need to deliver your order. Your personal information is never sold, rented, or shared with third parties for marketing purposes.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Full Content */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="bg-card/50 border border-border rounded-[2rem] p-8 md:p-14 shadow-theme-sm"
                >
                    <div className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-primary
                        prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                        prose-ul:space-y-3 prose-li:text-muted-foreground prose-li:font-medium
                        prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: combinedContent }}
                    />
                </motion.div>

                <p className="text-center text-muted-foreground text-sm font-medium">
                    Privacy concerns? <a href="/contact-us" className="text-primary font-bold hover:underline">Contact us</a> and we will respond within 24 hours.
                </p>
            </div>
        </div>
    );
}
