"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Next-Gen Computing",
    subtitle: "High-performance laptops for creators and gamers.",
    cta: "Explore Laptops",
    href: "/category/laptop",
    color: "primary",
  },
  {
    title: "Smart Living",
    subtitle: "Wearables that keep you connected and healthy.",
    cta: "View Watches",
    href: "/category/smart-watch",
    color: "primary",
  },
];

export default function Hero2() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-background transition-colors duration-500">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
            index === current ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
          }`}
        >
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-5xl md:text-8xl font-black text-heading tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-subheading max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg shadow-theme-md hover:shadow-theme-lg hover:-translate-y-1 transition-all"
              >
                {slide.cta}
              </Link>
            </div>
            <div className="relative hidden md:flex justify-center">
               <div className="w-full h-[400px] bg-card/40 border border-border backdrop-blur-md rounded-3xl shadow-theme-lg flex items-center justify-center text-muted-foreground italic">
                 [Product Image Placeholder]
               </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all rounded-full ${i === current ? "w-10 bg-primary" : "w-2 bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}