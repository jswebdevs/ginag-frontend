"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutTemplateProps {
    data: any;
}

export default function AboutTemplate({ data }: AboutTemplateProps) {
    const { title } = data;

    return (
        <div className="bg-background min-h-screen">
            {/* Editorial Hero */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={data.featuredImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"}
                        alt={title}
                        fill
                        className="object-cover brightness-[0.4]"
                        priority
                    />
                </motion.div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 block"
                    >
                        Our Story
                    </motion.span>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-8"
                    >
                        {title}
                    </motion.h1>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent" />
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-4 sticky top-32">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-heading leading-none"
                            >
                                Crafting <br />
                                <span className="text-primary italic">Excellence</span>
                            </motion.h2>
                            <div className="mt-8 flex gap-4">
                                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-xs font-black uppercase tracking-widest">Est.</div>
                                <div className="flex-1 border-b border-border mb-3" />
                                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-xs font-black uppercase tracking-widest">2024</div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-12">
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="text-2xl md:text-3xl font-medium leading-[1.4] text-foreground"
                            >
                                Every{" "}
                                <span className="font-black text-primary italic">
                                    GG Purse
                                </span>{" "}
                                decor piece is{" "}
                                <span className="font-black underline decoration-primary decoration-4 underline-offset-4">
                                    handcrafted
                                </span>{" "}
                                to help women express who they are —{" "}
                                <span className="italic text-muted-foreground">
                                    without saying a word.
                                </span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                                className="relative pl-8 border-l-2 border-primary"
                            >
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground">
                                    <span className="font-black text-foreground">
                                        GG Purse Decor
                                    </span>{" "}
                                    is more than decorating a purse; it&apos;s about adding{" "}
                                    <span className="font-black text-foreground">
                                        beauty
                                    </span>{" "}
                                    to everyday moments,{" "}
                                    <span className="font-black text-foreground">
                                        confidence
                                    </span>{" "}
                                    to personal style, and a reminder that even the smallest details can make a{" "}
                                    <span className="font-black text-primary italic">
                                        powerful statement.
                                    </span>
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
