"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutTemplateProps {
    data: any;
}

export default function AboutTemplate({ data }: AboutTemplateProps) {
    const { title, content } = data;
    
    // Find rich-text blocks in content
    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

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
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-heading leading-none">
                                Crafting <br />
                                <span className="text-primary italic">Excellence</span>
                            </h2>
                            <div className="mt-8 flex gap-4">
                                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-xs font-black uppercase tracking-widest">Est.</div>
                                <div className="flex-1 border-b border-border mb-3" />
                                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-xs font-black uppercase tracking-widest">2024</div>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-8">
                            <div 
                                className="prose prose-2xl dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-heading
                                prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
                                prose-strong:text-foreground prose-strong:font-black
                                prose-ul:list-none prose-ul:pl-0
                                prose-li:relative prose-li:pl-8 prose-li:mb-6
                                prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-4 prose-li:before:w-4 prose-li:before:h-[2px] prose-li:before:bg-primary"
                                dangerouslySetInnerHTML={{ __html: combinedContent }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-card border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { label: "Quality", text: "We use only the finest materials sourced globally." },
                            { label: "Artistry", text: "Every piece is a unique expression of craftsmanship." },
                            { label: "Connection", text: "We build lasting relationships with our community." }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="space-y-4"
                            >
                                <span className="text-4xl font-black text-primary/20">{idx + 1}</span>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-heading">{item.label}</h3>
                                <p className="text-muted-foreground font-medium">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
