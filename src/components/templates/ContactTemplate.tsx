"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactTemplateProps {
    data: any;
    settings?: any;
}

export default function ContactTemplate({ data, settings }: ContactTemplateProps) {
    const { title, content, pageConfig } = data;

    const richTextBlocks = content.filter((b: any) => b.type === "rich-text");
    const combinedContent = richTextBlocks.map((b: any) => b.data.content).join("");

    const cfg = pageConfig || {};
    const email = cfg.email || settings?.contactEmail || settings?.supportEmail || "hello@ginag.com";
    const whatsapp = cfg.whatsapp || settings?.contactPhone || settings?.supportPhone || "+880 1700 000000";
    const location = cfg.location || settings?.contactAddress || settings?.address || "Rajshahi, Bangladesh";
    const responseTime = cfg.responseTime || "12–24 hours";

    const whatsappRaw = whatsapp.replace(/\D/g, "");

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all fields.");
            return;
        }
        setSending(true);
        const msg = `Hello! I'm ${form.name} (${form.email}).\n\n${form.message}`;
        const waUrl = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
        toast.success("Opening WhatsApp — send your message there!");
        setForm({ name: "", email: "", message: "" });
        setSending(false);
    };

    const contactCards = [
        {
            icon: Mail,
            label: "Email Us",
            value: email,
            link: `mailto:${email}`,
            color: "bg-primary/10 text-primary",
        },
        {
            icon: MessageSquare,
            label: "WhatsApp",
            value: whatsapp,
            link: `https://wa.me/${whatsappRaw}`,
            color: "bg-green-500/10 text-green-500",
        },
        {
            icon: MapPin,
            label: "Studio",
            value: location,
            link: null,
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            icon: Clock,
            label: "Response Time",
            value: responseTime,
            link: null,
            color: "bg-amber-500/10 text-amber-500",
        },
    ];

    return (
        <div className="bg-background min-h-screen pb-24 pt-20">
            {/* Header */}
            <div className="container mx-auto px-4 max-w-6xl mb-16 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
                >
                    <MessageSquare size={14} /> Get in Touch
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-heading leading-[0.8] mb-6"
                >
                    {title}
                </motion.h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                    Have a question or want a custom design? We are here to help — reach us via WhatsApp for the fastest response.
                </p>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Contact Info */}
                    <div className="space-y-5">
                        {contactCards.map((card, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}>
                                {card.link ? (
                                    <a href={card.link} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-5 bg-card border border-border p-6 rounded-[1.5rem] hover:border-primary/50 hover:shadow-theme-md transition-all group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center shrink-0`}>
                                            <card.icon size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">{card.label}</p>
                                            <p className="text-lg font-black text-heading group-hover:text-primary transition-colors">{card.value}</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-5 bg-card border border-border p-6 rounded-[1.5rem]">
                                        <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center shrink-0`}>
                                            <card.icon size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">{card.label}</p>
                                            <p className="text-lg font-black text-heading">{card.value}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {combinedContent && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                                className="bg-card/50 border border-border rounded-[1.5rem] p-6"
                            >
                                <div className="prose prose-sm dark:prose-invert max-w-none
                                    prose-headings:font-black prose-headings:text-heading
                                    prose-p:text-muted-foreground prose-p:font-medium prose-p:text-sm"
                                    dangerouslySetInnerHTML={{ __html: combinedContent }}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Contact Form */}
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                        className="bg-card border border-border p-8 md:p-12 rounded-[3rem] shadow-theme-xl sticky top-24"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-heading mb-2">Send a Message</h2>
                            <p className="text-sm text-muted-foreground font-medium">We will reply via WhatsApp or email within {responseTime}.</p>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors font-medium text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full bg-background border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors font-medium text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Tell us about your custom order or question..."
                                    required
                                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors font-medium resize-none text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-theme-lg disabled:opacity-60"
                            >
                                <Send size={18} />
                                Send via WhatsApp
                            </button>
                            <p className="text-center text-[11px] text-muted-foreground font-medium">
                                This will open WhatsApp with your message pre-filled.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
