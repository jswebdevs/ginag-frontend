"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = document.documentElement.clientHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);

            setScrollProgress(Math.min(scrollPercent * 100, 100));
            // Show only after scrolling down 150px
            setIsVisible(scrollTop > 150);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <div
            // Bulletproof inline styles for animations and fixed positioning.
            // The CSS variable lets the responsive class below override the
            // mobile bottom-offset so the button clears the bottom nav (~80px).
            style={{
                position: "fixed",
                bottom: "var(--totop-bottom, 24px)",
                zIndex: 9998,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.3s ease-in-out"
            }}
            // JIT brackets force Tailwind to compile these exact responsive
            // locations. On phones the button sits above the mobile bottom nav.
            className="max-md:right-[24px] md:left-[24px] md:right-auto max-md:[--totop-bottom:96px] md:[--totop-bottom:24px]"
        >
            <button
                onClick={scrollToTop}
                className="relative flex items-center justify-center w-14 h-14 group outline-none"
            >
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r={radius} fill="transparent" stroke="currentColor" strokeWidth="3" className="text-muted/40" />
                    <circle
                        cx="28" cy="28" r={radius} fill="transparent" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        className="text-primary transition-all duration-150 ease-out"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    />
                </svg>

                <div className="w-11 h-11 bg-card border border-border rounded-full flex items-center justify-center shadow-md group-hover:bg-muted transition-all">
                    <ArrowUp size={20} className="text-foreground group-hover:-translate-y-1 transition-transform" />
                </div>
            </button>
        </div>
    );
}