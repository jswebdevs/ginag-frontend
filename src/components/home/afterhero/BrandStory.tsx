"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BrandStory() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-background overflow-hidden relative">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/20 skew-x-12 translate-x-1/2 rounded-l-full pointer-events-none hidden lg:block" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left: Editorial Image Composition */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Main Large Image */}
                        <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-md md:max-w-lg lg:max-w-none mx-auto rounded-3xl overflow-hidden shadow-theme-xl group">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                            <Image
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                                alt="Brand Lifestyle"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        {/* Floating Accent Card (Hidden on very small screens) */}
                        <div className="hidden sm:flex absolute -bottom-8 -right-8 lg:-right-12 bg-card border border-border p-6 rounded-2xl shadow-theme-lg flex-col gap-3 max-w-[240px] z-20 animate-in slide-in-from-bottom-10 duration-1000">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-bold text-heading leading-tight">
                                "Redefining everyday luxury for the modern era."
                            </p>
                        </div>
                    </div>

                    {/* Right: Typography & Manifesto */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 md:space-y-8">

                        <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                            <span className="w-8 h-px bg-primary hidden md:block" />
                            Our Manifesto
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-heading leading-tight md:leading-[1.1] tracking-tighter uppercase">
                            Quality you can <span className="italic text-primary">feel.</span> <br className="hidden md:block" />
                            Designs you can't forget.
                        </h2>

                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                            We don't just sell products; we curate experiences. Every item in our collection is handpicked to elevate your daily life, combining sustainable craftsmanship with uncompromising aesthetics. You deserve the best, and we are here to deliver it.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <Link
                                href="/about"
                                className="w-full sm:w-auto bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all flex justify-center items-center gap-3 group active:scale-95 shadow-theme-md"
                            >
                                Read Our Story
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/shop"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-heading hover:text-primary transition-colors flex justify-center items-center"
                            >
                                Explore Collection
                            </Link>
                        </div>

                        {/* Trust Metrics */}
                        <div className="pt-8 mt-8 border-t border-border w-full flex items-center justify-center lg:justify-start gap-8 md:gap-12 opacity-80">
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-3xl font-black text-heading tracking-tighter">10k+</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Happy Clients</span>
                            </div>
                            <div className="w-px h-10 bg-border" />
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-3xl font-black text-heading tracking-tighter">100%</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Authentic</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}