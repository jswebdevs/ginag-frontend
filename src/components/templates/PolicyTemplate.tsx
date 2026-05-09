"use client";

import { motion } from "framer-motion";
import { FileText, Clock, ShieldCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface PolicyTemplateProps {
    data: any;
}

export default function PolicyTemplate({ data }: PolicyTemplateProps) {
    const { settings } = useSettings();
    const storeName = settings?.storeName || "GinaG";
    const { title, content, updatedAt } = data;
    
    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-background min-h-screen pb-24 pt-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-16 border-b border-border pb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-primary mb-6"
                        >
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <FileText size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Legal Document</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-heading leading-tight mb-8"
                        >
                            {title}
                        </motion.h1>

                        <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <span>Last Updated: {formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-primary" />
                                <span>Official {storeName} Policy</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card/50 border border-border rounded-[2.5rem] p-8 md:p-16 shadow-theme-sm backdrop-blur-sm"
                    >
                        <div 
                            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                            prose-strong:text-heading prose-strong:font-black
                            prose-ul:my-6 prose-ul:space-y-4
                            prose-li:text-muted-foreground prose-li:font-medium
                            prose-li:marker:text-primary"
                            dangerouslySetInnerHTML={{ __html: combinedContent }}
                        />
                    </motion.div>

                    {/* Footer Info */}
                    <div className="mt-16 text-center text-muted-foreground text-sm font-medium">
                        <p>If you have any questions regarding our policies, please contact our support team.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
