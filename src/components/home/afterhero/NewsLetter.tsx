"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function NewsLetter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Simulate API call to your newsletter provider (e.g., Mailchimp, Resend)
        setTimeout(() => {
            setStatus("success");
            setEmail("");

            // Reset back to idle after 5 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 5000);
        }, 1500);
    };

    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4">

                {/* Main Banner Container */}
                <div className="relative w-full max-w-6xl mx-auto bg-primary rounded-3xl overflow-hidden shadow-theme-xl">

                    {/* Abstract Glassmorphic Background Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 blur-3xl rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                    {/* Content Wrapper */}
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-10 lg:gap-16">

                        {/* Left Side: Typography */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left text-primary-foreground">
                            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span className="text-xs font-black uppercase tracking-widest text-white">Join the VIP List</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase mb-4">
                                Unlock <span className="italic">15% Off</span> <br className="hidden md:block" />
                                Your First Order
                            </h2>

                            <p className="text-primary-foreground/80 font-medium text-sm md:text-base max-w-md">
                                Be the first to know about exclusive drops, private sales, and industry-leading guides. No spam, just pure value.
                            </p>
                        </div>

                        {/* Right Side: Interactive Form */}
                        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">

                            <div className="bg-card p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">

                                {/* Form State: Success */}
                                <div
                                    className={`absolute inset-0 bg-card z-20 flex flex-col items-center justify-center text-center p-6 transition-all duration-500 ${status === "success" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                                        }`}
                                >
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm animate-in zoom-in duration-500">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-heading uppercase tracking-tighter">Welcome to the Club!</h3>
                                    <p className="text-muted-foreground text-sm mt-2 font-medium">
                                        Check your inbox. Your exclusive 15% discount code is waiting for you.
                                    </p>
                                </div>

                                {/* Form State: Input */}
                                <form
                                    onSubmit={handleSubmit}
                                    className={`flex flex-col gap-4 transition-all duration-500 ${status === "success" ? "opacity-0 -translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your best email..."
                                            className="w-full pl-12 pr-4 py-4 bg-background border border-border text-foreground rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium placeholder:text-muted-foreground/60"
                                            disabled={status === "loading"}
                                            aria-label="Email Address"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-foreground text-background py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-theme-md"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                Get My 15% Off <Send className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-2">
                                        By subscribing, you agree to our Terms & Privacy Policy.
                                    </p>
                                </form>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}