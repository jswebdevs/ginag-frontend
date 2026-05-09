"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, User } from "lucide-react";
import api from "@/lib/axios";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 1. Updated Interface to match your exact backend JSON
interface Testimonial {
    id: string;
    name: string;
    designation?: string; // Optional, in case you add it later
    comment: string;      // Changed from 'content' to 'comment'
    rating?: number;
    reviewAvatar?: {      // Changed from 'avatar' to 'reviewAvatar'
        originalUrl?: string;
        thumbUrl?: string;
    };
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/reviews/site/public")
            .then((res) => {
                // 2. Fixed extraction: The array is directly inside res.data.data
                const data = res.data?.data || [];
                setTestimonials(data);
            })
            .catch((err) => console.error("Error fetching testimonials:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-10 w-64 bg-muted rounded-xl animate-pulse mx-auto mb-4"></div>
                        <div className="h-5 w-80 bg-muted rounded animate-pulse mx-auto"></div>
                    </div>
                    <div className="flex gap-6 overflow-hidden pb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full md:w-1/2 lg:w-1/3 shrink-0 bg-card border border-border rounded-3xl p-8 animate-pulse">
                                <div className="flex gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className="w-4 h-4 bg-muted rounded-full"></div>
                                    ))}
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                                    <div>
                                        <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                                        <div className="h-3 w-16 bg-muted rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Hide section completely if no testimonials are available
    if (testimonials.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-heading uppercase tracking-tighter italic">
                        Word on the <span className="text-primary">Street</span>
                    </h2>
                    <p className="text-muted-foreground font-medium mt-4 text-sm md:text-base max-w-2xl mx-auto">
                        Don't just take our word for it. Here is what our amazing community has to say about their experience.
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-16 !overflow-visible"
                    >
                        {testimonials.map((testimonial) => {
                            // 3. Changed 'avatar' to 'reviewAvatar'
                            const avatarUrl = testimonial.reviewAvatar?.thumbUrl || testimonial.reviewAvatar?.originalUrl;
                            const rating = testimonial.rating || 5;

                            return (
                                <SwiperSlide key={testimonial.id}>
                                    <div className="bg-card border border-border rounded-3xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden group/card hover:border-primary/50 hover:shadow-theme-xl transition-all duration-500">

                                        {/* Background Oversized Quote Icon */}
                                        <Quote className="absolute -top-4 -right-4 w-32 h-32 text-muted/20 rotate-12 group-hover/card:text-primary/10 transition-colors duration-500 pointer-events-none" />

                                        {/* Star Rating */}
                                        <div className="flex items-center gap-1 text-amber-500 mb-6 relative z-10">
                                            {[...Array(5)].map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`w-4 h-4 md:w-5 md:h-5 ${index < rating ? "fill-current" : "text-muted opacity-30 fill-transparent"}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Content - 4. Changed 'content' to 'comment' */}
                                        <p className="text-heading font-medium text-base md:text-lg leading-relaxed mb-8 flex-1 relative z-10 italic">
                                            "{testimonial.comment}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-border/50">
                                            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-muted flex shrink-0 border-2 border-background shadow-sm">
                                                {avatarUrl ? (
                                                    <Image
                                                        src={avatarUrl}
                                                        alt={testimonial.name}
                                                        fill
                                                        sizes="3.5rem"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <h4 className="font-black text-heading text-sm md:text-base uppercase tracking-tight">
                                                    {testimonial.name}
                                                </h4>
                                                {testimonial.designation && (
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                                        {testimonial.designation}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

            </div>
        </section>
    );
}