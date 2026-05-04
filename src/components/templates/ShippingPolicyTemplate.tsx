"use client";

import { motion } from "framer-motion";
import { Package, Truck, MapPin, Clock, Bell } from "lucide-react";

interface ShippingPolicyTemplateProps {
    data: any;
}

const deliveryStages = [
    { icon: Package, label: "Order Placed", color: "bg-primary/10 text-primary" },
    { icon: Clock, label: "Production", color: "bg-amber-500/10 text-amber-500" },
    { icon: Truck, label: "In Transit", color: "bg-blue-500/10 text-blue-500" },
    { icon: MapPin, label: "Delivered", color: "bg-green-500/10 text-green-500" },
];

export default function ShippingPolicyTemplate({ data }: ShippingPolicyTemplateProps) {
    const { title, content, updatedAt } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-blue-500/5 border-b border-border pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                            <Truck size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">Shipping Information</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-heading leading-[0.9] mb-4"
                    >
                        {title}
                    </motion.h1>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                        <Bell size={14} className="text-primary" /> Last updated: {formattedDate}
                    </p>
                </div>
            </div>

            {/* Delivery Journey Timeline */}
            <div className="container mx-auto px-4 max-w-4xl -mt-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-[2rem] p-8 shadow-theme-lg"
                >
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8 text-center">Your Order Journey</h2>
                    <div className="relative flex items-center justify-between">
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-primary/30 via-border to-green-500/30 -translate-y-1/2 hidden md:block" />
                        {deliveryStages.map((stage, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}
                                className="relative flex flex-col items-center gap-3 z-10 flex-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center shadow-md border border-border bg-card`}>
                                    <stage.icon size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">{stage.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="container mx-auto px-4 max-w-4xl mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Production Time", value: "2–5 days", icon: Package, color: "text-primary" },
                        { label: "Local Delivery", value: "3–7 days", icon: Truck, color: "text-blue-500" },
                        { label: "International", value: "7–15 days", icon: MapPin, color: "text-green-500" },
                    ].map((stat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.1 }}
                            className="bg-card border border-border rounded-[1.5rem] p-6 flex items-center gap-4 hover:border-primary/40 transition-colors"
                        >
                            <div className={`p-3 rounded-xl bg-muted ${stat.color}`}><stat.icon size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-black text-heading">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Rich Text Content */}
            <div className="container mx-auto px-4 max-w-4xl mt-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="bg-card/50 border border-border rounded-[2rem] p-8 md:p-14 shadow-theme-sm backdrop-blur-sm"
                >
                    <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                        prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-primary
                        prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                        prose-ul:my-4 prose-ul:space-y-3
                        prose-li:text-muted-foreground prose-li:font-medium
                        prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: combinedContent }}
                    />
                </motion.div>
                <p className="text-center text-muted-foreground text-sm font-medium mt-10">
                    For questions about your shipment, contact us via WhatsApp or email.
                </p>
            </div>
        </div>
    );
}
